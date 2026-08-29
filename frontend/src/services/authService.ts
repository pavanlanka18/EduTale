const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private tokenKey = 'edutale_token';
  private userKey = 'edutale_user';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    const data = localStorage.getItem(this.userKey);
    return data ? JSON.parse(data) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setSession(token: string, user: User) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  async register(email: string, password: string, fullName?: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }

    return await res.json();
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
      throw new Error(err.detail || 'Invalid email or password');
    }

    const data = await res.json();
    const token = data.access_token;

    // Fetch user details with token
    const userRes = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let user: User;
    if (userRes.ok) {
      user = await userRes.json();
    } else {
      user = {
        id: 'user-demo',
        email,
        full_name: email.split('@')[0],
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    this.setSession(token, user);
    return { token, user };
  }

  async googleLogin(email: string, fullName?: string, googleId?: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, google_id: googleId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Google login failed' }));
      throw new Error(err.detail || 'Google authentication failed');
    }

    const data = await res.json();
    const token = data.access_token;

    const userRes = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let user: User;
    if (userRes.ok) {
      user = await userRes.json();
    } else {
      user = {
        id: 'user-google-demo',
        email,
        full_name: fullName || email.split('@')[0],
        is_active: true,
        created_at: new Date().toISOString(),
      };
    }

    this.setSession(token, user);
    return { token, user };
  }
}

export const authService = new AuthService();

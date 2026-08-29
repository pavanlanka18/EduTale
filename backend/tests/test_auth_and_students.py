import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.database import init_db

@pytest.fixture(autouse=True)
async def prepare_database():
    await init_db()

@pytest.mark.anyio
async def test_auth_registration_login_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Register user with unique email
        email = f"teststudent_{id(client)}@edutale.com"
        reg_payload = {
            "email": email,
            "password": "securepassword123",
            "full_name": "Test Student"
        }
        reg_resp = await client.post("/api/v1/auth/register", json=reg_payload)
        assert reg_resp.status_code == 201
        data = reg_resp.json()
        assert data["email"] == email
        assert "id" in data

        # Login user
        login_payload = {
            "email": email,
            "password": "securepassword123"
        }
        login_resp = await client.post("/api/v1/auth/login", json=login_payload)
        assert login_resp.status_code == 200
        token_data = login_resp.json()
        assert "access_token" in token_data
        token = token_data["access_token"]

        # Get me profile with token
        me_resp = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["email"] == email

@pytest.mark.anyio
async def test_student_profile_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # First register & login user
        email = f"student_user_{id(client)}@edutale.com"
        reg_resp = await client.post("/api/v1/auth/register", json={
            "email": email,
            "password": "password123",
            "full_name": "Student Parent"
        })
        assert reg_resp.status_code == 201

        login_resp = await client.post("/api/v1/auth/login", json={
            "email": email,
            "password": "password123"
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]

        student_payload = {
            "name": "Jordan",
            "age": 11,
            "grade": 6,
            "class_name": "6B",
            "gender": "female",
            "interests": ["robotics", "art"],
            "learning_style": "kinesthetic"
        }
        resp = await client.post(
            "/api/v1/students",
            json=student_payload,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Jordan"
        assert data["class_name"] == "6B"
        assert data["gender"] == "female"
        assert data["interests"] == ["robotics", "art"]
        student_id = data["student_id"]

        # Get student
        get_resp = await client.get(f"/api/v1/students/{student_id}")
        assert get_resp.status_code == 200
        get_data = get_resp.json()
        assert get_data["class_name"] == "6B"
        assert get_data["gender"] == "female"

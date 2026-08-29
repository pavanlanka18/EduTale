class EduTaleException(Exception):
    """Base exception for EduTale application."""
    def __init__(self, message: str, detail: str = None):
        self.message = message
        self.detail = detail or message
        super().__init__(self.message)

class LessonNotFound(EduTaleException):
    """Raised when a requested lesson is not found."""
    def __init__(self, lesson_id: str):
        super().__init__(
            message=f"Lesson with ID '{lesson_id}' was not found.",
            detail=f"No lesson record associated with '{lesson_id}' in storage."
        )

class StudentNotFound(EduTaleException):
    """Raised when a requested student profile is not found."""
    def __init__(self, student_id: str):
        super().__init__(
            message=f"Student profile with ID '{student_id}' was not found.",
            detail=f"No student record associated with '{student_id}' in storage."
        )

class InvalidContentType(EduTaleException):
    """Raised when an unsupported content type is submitted."""
    def __init__(self, content_type: str):
        super().__init__(
            message=f"Content type '{content_type}' is invalid.",
            detail="Supported content types are 'text', 'pdf', or 'image'."
        )

class ProcessingError(EduTaleException):
    """Raised when AI pipeline processing fails."""
    def __init__(self, detail: str):
        super().__init__(
            message="An error occurred during lesson processing.",
            detail=detail
        )

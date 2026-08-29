from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx

from app.core.database import get_db
from app.core.config import settings
from app.models.user import User, UserRole, AuthProvider
from app.schemas.user import (
    UserSignupRequest,
    UserLoginRequest,
    GoogleAuthRequest,
    TokenResponse,
    UserResponse
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_current_user
)

router = APIRouter()

@router.post("/auth/signup", response_model=TokenResponse)
def signup_email(req: UserSignupRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    user = User(
        email=req.email.lower().strip(),
        name=req.name or req.email.split("@")[0].title(),
        password_hash=hash_password(req.password),
        auth_provider=AuthProvider.EMAIL,
        role=UserRole.ANALYST,  # Default safe role
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.post("/auth/login", response_model=TokenResponse)
def login_email(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive."
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.post("/auth/google", response_model=TokenResponse)
def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Verifies Google OIDC ID token server-side via Google's tokeninfo API.
    """
    if not req.id_token:
        raise HTTPException(status_code=400, detail="Google ID token is required.")

    # Validate Google ID Token via Google's OAuth2 API
    google_verify_url = f"https://oauth2.googleapis.com/tokeninfo?id_token={req.id_token}"
    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.get(google_verify_url)
            if res.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid or expired Google ID token.")
            payload = res.json()
    except HTTPException as h_err:
        raise h_err
    except Exception as err:
        raise HTTPException(status_code=500, detail=f"Google token verification failed: {str(err)}")

    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Google ID token does not contain email.")

    name = payload.get("name") or email.split("@")[0].title()
    picture = payload.get("picture")

    # Find or create user
    user = db.query(User).filter(User.email == email.lower().strip()).first()
    if not user:
        user = User(
            email=email.lower().strip(),
            name=name,
            avatar_url=picture,
            auth_provider=AuthProvider.GOOGLE,
            role=UserRole.ANALYST, # Default safe role
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update name/avatar if provided
        if picture and not user.avatar_url:
            user.avatar_url = picture
            db.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(
        access_token=token,
        user=UserResponse.model_validate(user)
    )


@router.get("/auth/me", response_model=UserResponse)
def get_authenticated_user_profile(user: User = Depends(require_current_user)):
    return UserResponse.model_validate(user)

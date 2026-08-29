import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db
from app.models.user import User, UserRole, AuthProvider
from app.core.security import hash_password, verify_password, create_access_token

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_db():
    app.dependency_overrides[get_db] = override_get_db
    User.__table__.create(bind=engine, checkfirst=True)
    yield
    User.__table__.drop(bind=engine, checkfirst=True)

client = TestClient(app)

def test_password_hashing():
    pwd = "secret_password_123"
    hashed = hash_password(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrong_password", hashed) is False

def test_user_signup_and_default_role():
    res = client.post("/api/auth/signup", json={
        "email": "test_analyst@pune.gov.in",
        "password": "password123",
        "name": "Pune Analyst Test"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test_analyst@pune.gov.in"
    assert data["user"]["role"] == "analyst"  # Safe default role enforced

def test_duplicate_email_signup_fails():
    client.post("/api/auth/signup", json={
        "email": "duplicate@pune.gov.in",
        "password": "password123"
    })
    res = client.post("/api/auth/signup", json={
        "email": "duplicate@pune.gov.in",
        "password": "password456"
    })
    assert res.status_code == 400
    assert "already exists" in res.json()["detail"]

def test_user_login_success_and_invalid_password():
    client.post("/api/auth/signup", json={
        "email": "login_test@pune.gov.in",
        "password": "correct_password"
    })

    # Wrong password
    bad_res = client.post("/api/auth/login", json={
        "email": "login_test@pune.gov.in",
        "password": "wrong_password"
    })
    assert bad_res.status_code == 401

    # Correct password
    good_res = client.post("/api/auth/login", json={
        "email": "login_test@pune.gov.in",
        "password": "correct_password"
    })
    assert good_res.status_code == 200
    assert "access_token" in good_res.json()

def test_authenticated_me_endpoint():
    signup_res = client.post("/api/auth/signup", json={
        "email": "me_test@pune.gov.in",
        "password": "password123"
    })
    token = signup_res.json()["access_token"]

    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "me_test@pune.gov.in"

def test_unauthenticated_me_endpoint_fails():
    res = client.get("/api/auth/me")
    assert res.status_code == 401

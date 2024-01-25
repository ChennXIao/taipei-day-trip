import pytest
import json
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_api_user_route(client):
    user_data = {
        'name': 'test',
        'email': 'testv3@test.com',
        'password': 'test'
    }

    response = client.post('/api/user', json=user_data)
    assert response.status_code == 200
    assert json.loads(response.data) == {"ok": True}

    # Test case where email is already registered
    response_duplicate = client.post('/api/user', json=user_data)
    assert response_duplicate.status_code == 400
    assert json.loads(response_duplicate.data) == {"error": True, "message": "信箱已被註冊"}

def test_api_user_auth_route(client):
    valid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywibmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3R2M0B0ZXN0LmNvbSIsInBhc3N3b3JkIjoidGVzdCIsImV4cCI6MTcwNDI5MDA5Nn0.i9n1nn3DhqYVXApbmTFMiV9wie3zWz2VQh96OQN2RVI"

    headers = {'Authorization': 'Bearer ' + valid_token}
    response = client.get('/api/user/auth', headers=headers)

    assert response.status_code == 200
    expected_data = {
        "data": {
            "id": 7,
            "name": 'test',
            "email": 'testv3@test.com'
        }
    }
    assert json.loads(response.data) == expected_data

def test_api_user_auth_route(client):
    user_data = {
        "email": 'testv3@test.com',
        "password": 'test',
    }
    invalid_user_data = {
        "email": 'aaa@test.com',
        "password": 'test',
    }

    response = client.put('/api/user/auth', json=user_data)

    assert response.status_code == 200
    assert 'token' in json.loads(response.data)

    response_for_invalid = client.put('/api/user/auth', json=invalid_user_data)

    assert response_for_invalid.status_code == 400
    assert json.loads(response_for_invalid.data) == {"error": True, "message": "信箱信箱或密碼錯誤"}

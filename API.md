## User Authentication & User CRUD Operations API

### Authentication
This API uses token-based authentication (JWT). To access protected endpoints, you need to obtain a token by providing valid credentials (email and password) to the authentication endpoint.

#### Authentication Endpoint
- **URL**: _/auth/login_
- **Method**: _POST_
- **Description**: Generates a JWT token for authentication.
- **Request Body**:
  <details>
      {
        "email": "example_user",
        "password": "password123"
      }
  </details>
- **Response**:
  <details>
      {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
  </details>

### User CRUD Operations

#### Get All Users
- **URL**: _/users_
- **Method**: _GET_
- **Description**: Retrieves a list of all users.
- **Headers Params**: 
  <details> 
      {
        "Authorization": "Bearer {accessToken}"
      }
  </details>
- **Response**:
  <details>
      [
        {
          "id": 1,
          "name": "user1",
          "email": "user1@example.com",
          "role": "ADMIN"
        },
        {
          "id": 2,
          "name": "user2",
          "email": "user2@example.com",
          "role": "USER"
        },
        // ... other users
      ]
  </details>

#### Get User by ID
- **URL**: _/users/{id}_
- **Method**: _GET_
- **Description**: Retrieves a user by their ID.
- **Headers Params**: 
  <details>
      {
        "Authorization": "Bearer {accessToken}"
      }
  </details>
- **Response**:
  <details>
      {
        "id": 1,
        "name": "user1",
        "email": "user1@example.com",
        "role": "USER"
      }
  </details>

#### Create User
- **URL**: _/users_
- **Method**: _POST_
- **Description**: Creates a new user.
- **Headers Params**: 
  <details>
      {
        "Authorization": "Bearer {accessToken}"
      }
  </details>
- **Request Body**: 
  <details>
      {
        "name": "user1",
        "email": "user1@example.com",
        "password": "newpassword123",
        "role": "USER"
      }
  </details>
- **Response**:
  <details>
      {
        "id": 1,
        "username": "user1",
        "email": "user1@example.com",
        "role": "USER"
      }
  </details>


#### Update User
- **URL**: _/users/{id}_
- **Method**: _PATCH_
- **Description**: Updates an existing user's information.
- **Headers Params**: 
  <details>
      {
        "Authorization": "Bearer {accessToken}"
      }
  </details>
- **Request Body**: 
  <details>
      {
        "name": "user1",
        "email": "user1@example.com",
        "password": "newpassword123",
        "role": "USER"
      }
  </details>
- **Response**:
  <details>
      {
        "id": 1,
        "username": "user1",
        "email": "user1@example.com",
        "role": "USER"
      }
  </details>


#### Delete User
- **URL**: _/users/{id}_
- **Method**: _DELETE_
- **Description**: Deletes a user by their ID.
- **Headers Params**: 
  <details>
      {
        "Authorization": "Bearer {accessToken}"
      }
  </details>
- **Response**: HTTP 200
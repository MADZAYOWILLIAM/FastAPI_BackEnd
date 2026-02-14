# Backend Integration Guide

This document explains how the FastAPI backend is integrated with the vanilla JavaScript frontend.

## 🔗 API Integration Overview

The JavaScript frontend now communicates directly with your FastAPI backend at `http://localhost:8000`.

### Base URL
```
http://localhost:8000
```

### CORS Configuration
The backend has CORS enabled for all origins (in production, restrict this):
```python
allow_origins=["*"]
```

## 📡 API Endpoints

### Authentication
- **POST** `/login` - User login
  - Request: `{ username: string, password: string }`
  - Response: `{ access_token: string, token_type: string }`

- **POST** `/register` - User registration
  - Request: `{ name: string, email: string, password: string }`
  - Response: `{ access_token: string, token_type: string, message: string }`

### Users (/user)
- **GET** `/user` - Get all users
- **GET** `/user/{id}` - Get user by ID
- **POST** `/user` - Create new user
- **PUT** `/user/{id}` - Update user
- **DELETE** `/user/{id}` - Delete user

### Programs (/programs)
- **GET** `/programs` - Get all programs
- **GET** `/programs/{id}` - Get program by ID
- **POST** `/programs` - Create program *(requires auth)*
- **PUT** `/programs/{id}` - Update program
- **DELETE** `/programs/{id}` - Delete program

**Program Schema:**
```javascript
{
  id: number,
  name: string,
  description: string,
  start_date: string,
  end_date: string
}
```

### Services (/services)
- **GET** `/services` - Get all services
- **GET** `/services/{id}` - Get service by ID
- **POST** `/services` - Create service *(requires auth)*
- **PUT** `/services/{id}` - Update service  
- **DELETE** `/services/{id}` - Delete service

**Service Schema:**
```javascript
{
  id: number,
  name: string,
  description: string,
  image: string,
  price: number
}
```

### Events (/event)
- **GET** `/event` - Get all events *(requires auth)*
- **GET** `/event/{id}` - Get event by ID
- **POST** `/event` - Create event
- **PUT** `/event/{id}` - Update event
- **DELETE** `/event/{id}` - Delete event

**Event Schema:**
```javascript
{
  id: number,
  name: string,
  description: string,
  location: string,
  date: string
}
```

### Blog (/blog)
- **GET** `/blog` - Get all blog posts *(requires auth)*
- **GET** `/blog/{id}` - Get blog post by ID
- **POST** `/blog` - Create blog post *(requires auth)*
- **PUT** `/blog/{id}` - Update blog post
- **DELETE** `/blog/{id}` - Delete blog post

**Blog Schema:**
```javascript
{
  id: number,
  title: string,
  body: string,
  owner: { id: number, name: string, email: string }
}
```

## 🔐 Authentication

### Token Storage
Authentication tokens are stored in `localStorage`:
```javascript
localStorage.getItem('authToken')  // JWT token
localStorage.getItem('currentUser') // User info
```

### Authorization Header
The API automatically adds the bearer token to all requests:
```
Authorization: Bearer {token}
```

### Authentication Methods

**Login:**
```javascript
const result = await API.auth.login(email, password);
if (result.success) {
  API.setToken(result.data.access_token);
  Auth.setCurrentUser({ email });
  // Redirect to dashboard
}
```

**Register:**
```javascript
const result = await API.auth.register(name, email, password);
if (result.success) {
  // User is auto-logged in
  // Token already stored
}
```

**Logout:**
```javascript
Auth.logout(); // Clears token and redirects to home
```

## 💾 Data Caching

The `Data` module caches API responses for 5 minutes to improve performance:

```javascript
// First call fetches from API
const programs = await Data.loadPrograms();

// Subsequent calls use cache (within 5 minutes)
const cachedPrograms = await Data.loadPrograms();

// Force refresh
const freshPrograms = await Data.loadPrograms(true);
```

## 🎯 Usage Examples

### Load and Display Programs
```javascript
const result = await Data.loadPrograms();
if (result.success) {
  const programs = result.data;
  programs.forEach(program => {
    console.log(program.name, program.description);
  });
}
```

### Create a Program (Admin)
```javascript
const newProgram = {
  name: 'Advanced Leadership',
  description: 'Expert-level leadership training',
  start_date: '2026-03-01',
  end_date: '2026-05-31'
};

const result = await API.programs.create(newProgram);
if (result.success) {
  Toast.success('Program created successfully');
  Data.clearCache(); // Clear cache to force refresh
}
```

### Enroll in Program
```javascript
// After user logs in
const enrollment = {
  program_id: 1,
  user_id: currentUser.id,
  date_enrolled: new Date().toISOString().split('T')[0],
  status: 'active'
};

const result = await API.post('/enrollments', enrollment);
```

### Book a Service
```javascript
const booking = {
  service_id: 1,
  user_id: currentUser.id,
  date: '2026-02-28',
  notes: 'Please schedule on afternoon'
};

// Service booking (no specific endpoint yet, use generic)
const result = await API.post('/bookings', booking);
```

## 🚨 Error Handling

All API calls return a standardized response:

```javascript
{
  success: boolean,
  data: any,           // Response data (null if failed)
  error: string,       // Error message (null if successful)
  status: number       // HTTP status code (null if failed)
}
```

### Handling Errors
```javascript
const result = await API.programs.getAll();

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  if (result.status === 401) {
    // Auto-redirected to login
  } else if (result.status === 404) {
    Toast.error('Not found');
  } else {
    Toast.error(result.error);
  }
}
```

## 📝 Database Models (Reference)

### User Model
```python
class User(Base):
    id: int (primary key)
    name: str
    email: str (unique)
    password: str (hashed)
    blogs: List[Blog] (relationship)
```

### Program Model
```python
class Program(Base):
    id: int (primary key)
    name: str
    description: str
    start_date: str
    end_date: str
    user_id: int (foreign key)
```

### Service Model
```python
class Service(Base):
    id: int (primary key)
    name: str
    description: str
    image: str (URL)
    price: float
```

### Event Model
```python
class Event(Base):
    id: int (primary key)
    name: str
    description: str
    location: str
    date: str
    user_id: int (foreign key)
```

### Blog Model
```python
class Blog(Base):
    id: int (primary key)
    title: str
    body: str
    user_id: int (foreign key)
    owner: User (relationship)
```

## 🔄 Data Flow

### Example: Loading Programs on Homepage

1. **Initialization**
   ```javascript
   // home.js
   HomePage.init() → Data.loadPrograms()
   ```

2. **API Call**
   ```javascript
   // api.js
   API.programs.getAll()
   // GET http://localhost:8000/programs
   ```

3. **Response Processing**
   ```javascript
   // data.js
   cache.programs = response.data
   cache.lastUpdated.programs = Date.now()
   ```

4. **Rendering**
   ```javascript
   // home.js
   renderPrograms(data)
   // Generates HTML from program objects
   ```

5. **Display**
   ```
   User sees dynamic program cards
   ```

## 🛠️ Troubleshooting

### 401 Unauthorized
- Token expired or invalid
- Solution: Log out and log back in

### 404 Not Found
- Resource doesn't exist
- Check the ID in the request

### 500 Server Error
- Backend error
- Check backend logs for details

### CORS Error
- Blocked request from client
- Verify backend CORS configuration

### Network Error
- Backend not running
- Start backend: `uvicorn blog.main:app --reload`
- Verify URL: http://localhost:8000

## 🚀 Running the Stack

**Terminal 1 - Backend:**
```bash
cd /home/william/AI/BootCamp_Python
source blog-env/bin/activate
uvicorn blog.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
# Open frontend/client/pages/index.html in browser
# Or use live server plugin in VS Code
```

## 📚 Quick Reference

### Common API Calls

```javascript
// Get all programs
await API.programs.getAll();

// Get specific program
await API.programs.getById(1);

// Create program (requires auth)
await API.programs.create({ name, description, start_date, end_date });

// Update program
await API.programs.update(1, { name, description });

// Delete program
await API.programs.delete(1);

// Get services
await API.services.getAll();

// Get events (requires auth)
await API.events.getAll();

// Get blog posts (requires auth)
await API.blog.getAll();
```

### Authentication

```javascript
// Login
await API.auth.login(email, password);

// Register
await API.auth.register(name, email, password);

// Check if logged in
Auth.isLoggedIn();

// Get current user
Auth.getCurrentUser();

// Logout
Auth.logout();
```

---

**Backend Location:** `/home/william/AI/BootCamp_Python/blog/`  
**Frontend Location:** `/home/william/AI/BootCamp_Python/frontend/client/`


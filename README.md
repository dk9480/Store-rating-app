# 🏪 Store Rating Application

A full-stack web application that allows users to rate stores, with role-based access control for administrators, store owners, and regular users.

## 🚀 Features

### 👥 User Roles & Capabilities

#### 👑 **Administrator**
- Dashboard with platform statistics
- Create and manage users & stores
- View all ratings and user activities
- Advanced filtering and sorting

#### 🏬 **Store Owner** 
- Monitor store ratings and customer feedback
- View average rating calculations
- See detailed customer rating history

#### 👤 **Regular User**
- Browse and search stores
- Submit ratings (1-5 stars)
- Modify previous ratings
- User profile management

## 🛠️ Tech Stack

### **Frontend**
- React.js 18
- React Router DOM
- Axios for API calls
- Context API for state management
- Responsive CSS

### **Backend**
- Express.js
- MySQL Database
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled

### **Validation**
- Name: 20-60 characters
- Password: 8-16 chars with uppercase & special character
- Email: Standard validation
- Address: Max 400 characters

## 📸 Application Screenshots

## 📸 Application Screenshots

### Register Page
![Register Page] <img width="1709" height="908" alt="image" src="https://github.com/user-attachments/assets/c1d6abe4-cb0b-48b5-81e6-04ce82523f01" />
*User registration with form validation*

### Login Page
![Login Page] <img width="1602" height="810" alt="image" src="https://github.com/user-attachments/assets/0ca34a46-5664-40ae-90c2-e1d000848a96" />
*Secure login with role-based redirection*

### Admin Dashboard
![Admin Dashboard] <img width="1918" height="792" alt="image" src="https://github.com/user-attachments/assets/1ce2ccdb-c0d4-4678-a5b1-38c67066db85" />
*Platform overview with statistics and quick actions*

### Store Management
![Store Management] <img width="1845" height="907" alt="image" src="https://github.com/user-attachments/assets/b76f1cdd-6bfd-4159-971f-17da3ea08fc6" />
*Browse, search, and rate stores with real-time updates*

### Store Owner Dashboard
![Store Owner Dashboard] <img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/b3792421-21ab-4888-aa29-69a35dc7ea8d" />
*Monitor ratings and customer feedback*

### User Management
![User Management] <img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/128e8471-3cba-4c12-adda-2502dfc8d3e5" />
*Admin panel for user management and role assignment*

## 🗄️ Database Schema

```sql
Users (id, name, email, password, address, role)
Stores (id, name, email, address, owner_id)
Ratings (id, user_id, store_id, rating, created_at)
```

## 🚀 Installation & Setup
   - Prerequisites
   - Node.js (v14 or higher)
   - MySQL Server
   - npm 

### Backend Setup 
    cd backend
    npm install
    cp .env.example .env
    # Configure your database in .env file
    npm run dev


### Frontend Setup
      cd frontend
      npm install
      npm start

### Database Setup
      CREATE DATABASE ratings_app;
      # Run the schema from database/schema.sql

### 🔐 Default Admin Login
      Email: admin@storeapp.com
      Password: password

## 🎯 API Endpoints
### Authentication
      POST /api/register - User registration
      POST /api/login - User login
      GET /api/profile - Get user profile
      PUT /api/update-password - Update password

### Stores
      GET /api/stores - Get all stores
      GET /api/stores-with-ratings - Get stores with user ratings
      POST /api/stores/:id/rate - Submit rating

### Admin
      GET /api/admin/stats - Platform statistics
      POST /api/admin/users - Create users
      POST /api/admin/stores - Create stores


### 🏗️ Project Structure
```
store-rating-app/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   └── app.js          # Express app
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── styles/      # CSS files
│   └── public/         # Static files
└── README.md
```

### 🔒 Security Features
   - JWT-based authentication
   - Password hashing with bcrypt
   - Role-based access control
   - Input validation and sanitization
   - CORS configuration
   - SQL injection prevention

### 📱 Responsive Design
   - Mobile-first approach
   - Cross-browser compatible
   - Accessible UI components
   - Loading states and error handling

### 🧪 Testing
   The application includes:
   - Form validation testing
   - API endpoint testing
   - Role-based access testing
   - Database operation testing

### 👨‍💻 Developer
Developed as a full-stack intern coding challenge demonstrating modern web development practices.



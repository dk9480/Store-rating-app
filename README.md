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

### Login Page
![Login Page](screenshots/login.png)
*Secure login with role-based redirection*

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Platform overview with statistics and quick actions*

### Store Management
![Store Management](screenshots/stores.png)
*Browse, search, and rate stores with real-time updates*

### Store Owner Dashboard
![Store Owner Dashboard](screenshots/store-owner.png)
*Monitor ratings and customer feedback*

### User Management
![User Management](screenshots/users.png)
*Admin panel for user management and role assignment*

## 🗄️ Database Schema

```sql
Users (id, name, email, password, address, role)
Stores (id, name, email, address, owner_id)
Ratings (id, user_id, store_id, rating, created_at)

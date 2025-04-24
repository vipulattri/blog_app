# Vipul's Blog - MERN Stack Application

A full-featured blogging application built with the MERN stack (MongoDB, Express, React, Node.js) using Next.js. The app includes an admin panel for blog management and a public-facing user interface to read blog posts.

## Features

- **User Authentication**
  - Admin login with predefined credentials (Username: Vipul, Password: 123456)
  - JWT-based authentication
  - Protected admin routes

- **Admin Panel**
  - Dashboard to manage blog posts
  - Create, read, update, and delete blog posts
  - Proper date formatting for blog posts

- **User Interface**
  - Modern, responsive design using TailwindCSS and ShadCN UI
  - Animated homepage using GSAP
  - List of all blog posts
  - Individual blog post pages

- **API**
  - RESTful API endpoints for blog management
  - Authentication middleware

## Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - React 19
  - TailwindCSS
  - ShadCN UI Components
  - GSAP for animations
  - Axios for API requests

- **Backend**
  - Next.js API Routes
  - MongoDB/Mongoose for database
  - JWT for authentication
  - bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd blogging_app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/blog_app
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

To access the admin panel, navigate to [http://localhost:3000/login](http://localhost:3000/login) and use the following credentials:
- Username: Vipul
- Password: 123456

## Deployment

This application can be deployed on platforms like Vercel, Netlify, or any hosting service that supports Next.js applications. Make sure to set up the environment variables in your deployment platform.

## License

This project is licensed under the MIT License.

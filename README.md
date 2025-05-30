# NestJS E-Commerce API

A comprehensive e-commerce backend API built with NestJS, featuring user authentication, order management, payment processing with Stripe, and email notifications.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration with email verification
  - JWT-based authentication with access & refresh tokens
  - Password hashing with bcrypt
  - Redis-based verification code storage

- **Order Management**
  - Create orders with multiple products
  - Stripe payment integration
  - Real-time inventory management
  - Order status tracking

- **Email Notifications**
  - Verification emails with custom templates
  - Welcome emails after registration
  - Order confirmation emails

- **Database Management**
  - PostgreSQL with Prisma ORM
  - Database migrations and seeding
  - Relational data modeling

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Payment**: Stripe
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with Handlebars templates
- **Validation**: Zod schemas
- **Password Hashing**: bcrypt

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)
- PostgreSQL (v12 or higher)
- Redis server
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NestJS-E-Commerce-Test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"

# Email Configuration (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Environment
NODE_ENV="development"
```

### 4. Database Setup

#### Start PostgreSQL and create a database:

```bash
# Create a new database (replace with your preferred name)
createdb ecommerce_db

# Update DATABASE_URL in .env with your database credentials
```

#### Run Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with sample products
npm run seed-products
```

### 5. Redis Setup

#### Install and start Redis:

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Windows:**
- Download and install Redis from the official website
- Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

### 6. Email Configuration

For Gmail, you need to:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password
3. Use the App Password in `EMAIL_PASS` environment variable

### 7. Stripe Configuration

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe dashboard
3. Set up webhook endpoints for payment processing
4. Add webhook secret to environment variables

## 🚀 Running the Application

### Development Mode

```bash
# Start the application in development mode with hot reload
npm run start:dev
```

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

### Debug Mode

```bash
# Start with debugging enabled
npm run start:debug
```

The server will start on `http://localhost:4000` (or the port specified in your `.env` file).

## 📚 API Documentation

For detailed API documentation including all routes, request/response examples, and authentication flows, please refer to:

**[docs/flow.md](docs/flow.md)**

This documentation covers:
- User authentication flow (register, verify, login, logout)
- Order management (create, checkout, get orders)
- Payment processing with Stripe
- Error handling and security features
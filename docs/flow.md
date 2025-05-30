# User Authentication Flow Documentation

This documentation explains the user authentication system for the NestJS E-Commerce application, covering the complete flow from registration to login and token management.

## Overview

The authentication system uses JWT tokens for access control and Redis for temporary storage of verification codes. Email verification is required before users can access protected resources.

## Authentication Endpoints

### 1. User Registration
**Route:** `POST http://localhost:4000/auth/register`

**Purpose:** Initiates user registration process by storing user data temporarily and sending verification email.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
}
```

**Validation Rules:**
- Email must be valid format
- Password must be at least 8 characters with uppercase, lowercase, number, and special character
- Name is required (1-50 characters)

**Process Flow:**
1. Validates request data using `registerUserDto` schema
2. Checks if user already exists with the email via `AuthRepository.findUserByEmail()`
3. Hashes password using `hashPassword()`
4. Generates 6-digit verification code
5. Stores user data temporarily in Redis with 2-hour expiration via `RedisService`
6. Sends verification email using `EmailService.sendVerificationEmail()`

**Response:**
```json
{
    "message": "Verification email sent successfully"
}
```

### 2. Email Verification
**Route:** `POST http://localhost:4000/auth/verify`

**Purpose:** Completes user registration by verifying email and creating user account in database.

**Request Body:**
```json
{
    "email": "user@example.com",
    "code": "123456"
}
```

**Process Flow:**
1. Validates request using `verifyUserDto` schema
2. Retrieves stored user data from Redis using email as key
3. Validates verification code and expiration time
4. Creates user in database via `AuthRepository.createUser()` with `isVerified: true`
5. Sends welcome email using `EmailService.sendWelcomeEmail()`
6. Generates JWT access token (2 hours) and refresh token (7 days)
7. Sets refresh token as HTTP-only cookie

**Response:**
```json
{
    "message": "Account verified successfully",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe"
    },
    "accessToken": "jwt_token_here"
}
```

### 3. User Login
**Route:** `POST http://localhost:4000/auth/login`

**Purpose:** Authenticates existing verified users and provides access tokens.

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePass123!"
}
```

**Process Flow:**
1. Validates request using `loginUserDto` schema
2. Finds user by email via `AuthRepository.findUserByEmail()`
3. Checks if user is verified (`isVerified: true`)
4. Compares password with stored hash using `comparePassword()`
5. Generates new JWT access token (2 hours) and refresh token (7 days)
6. Sets refresh token as HTTP-only cookie

**Response:**
```json
{
    "message": "Login successful",
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe"
    },
    "accessToken": "jwt_token_here"
}
```

### 4. Token Refresh
**Route:** `POST http://localhost:4000/auth/refresh-token`

**Purpose:** Generates new access token using refresh token stored in cookies.

**Request:** No body required (uses refresh token from HTTP-only cookie)

**Process Flow:**
1. Extracts refresh token from `refreshToken` cookie
2. Verifies refresh token using `JWT_REFRESH_SECRET`
3. Finds user by decoded user ID via `AuthRepository.findUserById()`
4. Generates new access token (2 hours) and refresh token (7 days)
5. Updates refresh token cookie

**Response:**
```json
{
    "accessToken": "new_jwt_token_here"
}
```

### 5. User Logout
**Route:** `POST http://localhost:4000/auth/logout`

**Purpose:** Logs out user by clearing refresh token cookie.

**Request:** No body required

**Process Flow:**
1. Clears the `refreshToken` HTTP-only cookie

**Response:**
```json
{
    "message": "Logged out successfully"
}
```

## Security Features

### JWT Token Structure
- **Access Token:** Short-lived (2 hours), contains `userId` and `email`
- **Refresh Token:** Long-lived (7 days), stored as HTTP-only cookie
- **Secrets:** Separate secrets for access and refresh tokens

### Password Security
- Passwords hashed using bcrypt with salt rounds (10)
- Password validation requires complexity rules

### Email Templates
The system uses Handlebars templates for emails:
- `verification.hbs` - Email verification
- `welcome.hbs` - Welcome email after verification

### Middleware Protection
- `AuthMiddleware` protects routes requiring authentication
- `validateRequest()` validates request bodies using Zod schemas

## Database Schema
Users are stored in PostgreSQL via Prisma with the following structure:
```prisma
model User {
    id         String   @id @default(uuid())
    email      String   @unique
    password   String
    name       String
    isVerified Boolean  @default(false)
    createdAt  DateTime @default(now())
    updatedAt  DateTime @updatedAt
}
```

## Error Handling
All endpoints include comprehensive error handling with appropriate HTTP status codes:
- **400** - Validation errors, business logic errors
- **401** - Authentication failures
- **404** - User not found
- **500** - Unexpected server errors

# Order Management Flow Documentation

This documentation explains the order management system for the NestJS E-Commerce application, covering the complete flow from order creation to checkout and order tracking.

## Overview

The order management system handles product orders, payment processing, and order status tracking. It uses a two-step process: order creation followed by checkout with payment method selection.

## Order Endpoints

### 1. Create Order
**Route:** `POST http://localhost:4000/orders/create`

**Purpose:** Creates a new order for authenticated users with selected products and payment method.

**Request Body:**
```json
{
    "items": [
        {
            "productId": "cmb9vt90b00015a6dokrdbxus",
            "quantity": 2
        },
        {
            "productId": "cmb9vt91900035a6d13iig9q4",
            "quantity": 1
        }
    ],
    "paymentMethod": "credit_card"
}
```

**Payment Methods:**
- `credit_card` - Credit/Debit card payment
- `paypal` - PayPal payment
- `bank_transfer` - Bank transfer payment

**Validation Rules:**
- Items array must not be empty
- Product IDs must be valid UUIDs
- Quantity must be positive integer
- Payment method must be one of the supported methods

**Process Flow:**
1. Validates request data using `createOrderDto` schema
2. Verifies all products exist via `ProductRepository.findProductsByIds()`
3. Checks product availability and stock levels
4. Calculates total amount including taxes
5. Creates order record with PENDING status via `OrderRepository.createOrder()`
6. Reserves inventory for ordered items
7. Returns order details for checkout

**Response:**
```json
{
    "message": "Order created successfully",
    "order": {
        "id": "cmbaszlvs00005a49vkxcjkcn",
        "orderNumber": "ORD-20241201-001",
        "status": "PENDING",
        "totalAmount": 99.99,
        "paymentMethod": "credit_card",
        "items": [...],
        "createdAt": "2024-12-01T10:00:00Z"
    }
}
```

### 2. Checkout Order
**Route:** `POST http://localhost:4000/orders/checkout`

**Purpose:** Creates a Stripe checkout session for payment processing.

**Request Body:**
```json
{
    "orderId": "cmbaszlvs00005a49vkxcjkcn"
}
```

**Process Flow:**
1. Validates order ID and finds order via `OrderRepository.findOrderById()`
2. Verifies order exists and belongs to authenticated user
3. Creates Stripe checkout session with order items
4. Configures success and cancel URLs for payment flow
5. Returns Stripe session details for frontend redirection

**Example Response:**
```json
{
    "sessionId": "cs_test_a1234567890abcdef1234567890abcdef12345678",
    "url": "https://checkout.stripe.com/pay/cs_test_a1234567890abcdef1234567890abcdef12345678#fidkdWxOYHwnPyd1blpxYHZxWjA0VDVgSHxAaGp8PG1hV0RqZ2RNNWI3TEQ9fGRKc2NAQ0BdSDVhNzBNZn1vfHZdXGRpNWI1MmtyVVZkXyd3YHdAKSdpZHU9YWBfJz9gcWB8dXx3",
    "successUrl": "http://localhost:4000/orders/success?session_id={CHECKOUT_SESSION_ID}",
    "cancelUrl": "http://localhost:4000/cancel"
}
```

**Payment Processing Flow:**
1. User is redirected to Stripe checkout page using the returned URL
2. After successful payment, Stripe redirects to success URL
3. Stripe webhook (`checkout.session.completed`) is triggered
4. Order status is updated to 'paid' via `OrderRepository.updateOrderStatus()`
5. Product stock is reduced via `OrderRepository.updateProductStock()`
6. Confirmation email is sent to user via `EmailService.sendConfirmationemail()`

**Webhook Event Handling:**
The system handles Stripe webhooks to process successful payments:
- Updates order status from 'pending' to 'paid'
- Deducts ordered quantities from product stock
- Sends order confirmation email to customer
- Logs payment completion for audit trail

**Error Scenarios:**
- `404` - Order not found
- `400` - Invalid order ID format
- `500` - Stripe API errors, webhook processing failures


### 3. Get User Orders
**Route:** `POST http://localhost:4000/orders/get-orders`

**Purpose:** Retrieves all orders for the authenticated user with detailed order information.

**Request:** No body required (uses JWT token from Authorization header)

**Authentication:** Requires valid JWT access token in Authorization header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Process Flow:**
1. Extracts user ID from JWT token via `AuthMiddleware`
2. Validates user exists and is verified via `AuthRepository.findUserById()`
3. Retrieves all orders for the user via `OrderRepository.findOrdersByUserId()`
4. Returns orders with order items and product details

**Example Response:**
```json
[
    {
        "id": "cmbaszlvs00005a49vkxcjkcn",
        "userId": "cm123abc456def789",
        "totalPrice": 1749.97,
        "createdAt": "2024-12-01T10:30:00.000Z",
        "updatedAt": "2024-12-01T10:35:00.000Z",
        "status": "paid",
        "paymentMethod": "credit_card",
        "orderItems": [
            {
                "id": "orderitem_123",
                "orderId": "cmbaszlvs00005a49vkxcjkcn",
                "productId": "cmb9vt90b00015a6dokrdbxus",
                "quantity": 2,
                "price": 999.99,
                "product": {
                    "id": "cmb9vt90b00015a6dokrdbxus",
                    "name": "Smartphone X",
                    "description": "Latest generation smartphone with advanced features",
                    "price": 999.99,
                    "stock": 48,
                    "createdAt": "2024-11-30T08:00:00.000Z",
                    "updatedAt": "2024-12-01T10:35:00.000Z"
                }
            },
            {
                "id": "orderitem_124",
                "orderId": "cmbaszlvs00005a49vkxcjkcn",
                "productId": "cmb9vt91900035a6d13iig9q4",
                "quantity": 1,
                "price": 249.99,
                "product": {
                    "id": "cmb9vt91900035a6d13iig9q4",
                    "name": "Wireless Headphones",
                    "description": "Noise-cancelling wireless headphones with premium sound quality",
                    "price": 249.99,
                    "stock": 99,
                    "createdAt": "2024-11-30T08:00:00.000Z",
                    "updatedAt": "2024-12-01T10:35:00.000Z"
                }
            }
        ]
    },
    {
        "id": "order_456def789abc123",
        "userId": "cm123abc456def789",
        "totalPrice": 599.99,
        "createdAt": "2024-11-28T14:20:00.000Z",
        "updatedAt": "2024-11-28T14:25:00.000Z",
        "status": "paid",
        "paymentMethod": "paypal",
        "orderItems": [
            {
                "id": "orderitem_125",
                "orderId": "order_456def789abc123",
                "productId": "tablet_ultra_id",
                "quantity": 1,
                "price": 599.99,
                "product": {
                    "id": "tablet_ultra_id",
                    "name": "Tablet Ultra",
                    "description": "Lightweight tablet with stunning display",
                    "price": 599.99,
                    "stock": 39,
                    "createdAt": "2024-11-27T08:00:00.000Z",
                    "updatedAt": "2024-11-28T14:25:00.000Z"
                }
            }
        ]
    }
]
```

**Response Fields:**
- `id` - Unique order identifier
- `userId` - ID of the user who placed the order
- `totalPrice` - Total amount for the order
- `status` - Order status (pending, paid, cancelled)
- `paymentMethod` - Payment method used (credit_card, paypal, bank_transfer)
- `createdAt` - Order creation timestamp
- `updatedAt` - Last modification timestamp
- `orderItems` - Array of ordered items with:
  - `quantity` - Number of items ordered
  - `price` - Price at time of order
  - `product` - Complete product details including current stock

**Error Scenarios:**
- `401` - No authorization token provided or invalid token
- `403` - User is not verified
- `404` - User not found
- `400` - No orders found for this user
- `500` - Database connection errors

**Order Status Values:**
- `pending` - Order created but payment not completed
- `paid` - Payment successful and order confirmed
- `cancelled` - Order was cancelled

**Notes:**
- Orders are returned in chronological order (newest first by default)
- Product details include current stock levels (may differ from time of order)
- Price in orderItems reflects the price at time of purchase
- All monetary values are in USD
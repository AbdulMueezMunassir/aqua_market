# 🐠 Aqua Market — Premium Aquarium Marketplace

A full-stack e-commerce platform for buying and selling premium aquarium fish, plants, invertebrates, and equipment. Built with **Next.js 14, MongoDB, TypeScript, React, and Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Demo Accounts](#-demo-accounts)
* [Project Structure](#-project-structure)
* [API Endpoints](#-api-endpoints)
* [Key Features Explained](#-key-features-explained)
* [Screenshots](#-screenshots)
* [Roadmap](#-roadmap)
* [Contributing](#-contributing)
* [License](#-license)

---

## 🌊 Overview

**Aqua Market** is a full-stack e-commerce application designed for aquarium enthusiasts. It provides a complete shopping experience for customers and a comprehensive administration panel for store owners.

The platform allows users to browse aquarium products, manage carts and wishlists, place orders, submit reviews, and track their order status.

### What Makes It Special

* 🎨 **Premium Glassmorphism UI** — Modern and elegant interface with backdrop blur effects
* 🔐 **Role-Based Access Control** — Admin, Staff, and Customer roles
* 🛒 **Full E-commerce Flow** — Browse → Cart → Checkout → Payment → Order Tracking
* 📊 **Admin Dashboard** — Revenue, orders, customers, products, and stock analytics
* 🐟 **Product Management** — Complete CRUD functionality for aquarium products
* ⭐ **Review System** — Customer ratings and reviews with automatic rating recalculation
* 💳 **Mock Payment Integration** — Safe payment simulation for development and testing
* 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile devices

---

## ✨ Features

### 🛍️ Customer Features

| Feature             | Description                                                                            |
| ------------------- | -------------------------------------------------------------------------------------- |
| **Browse Shop**     | Filter by category, search by name, and sort by price or rating                        |
| **Product Details** | View specifications, images, temperature, pH, temperament, diet, and other information |
| **Shopping Cart**   | User-isolated cart with quantity controls                                              |
| **Wishlist**        | Save favorite products for later                                                       |
| **Checkout**        | Delivery form with shipping address                                                    |
| **Mock Payment**    | Simulated payment flow with no real money charged                                      |
| **Order History**   | View previous orders and order statuses                                                |
| **Reviews**         | Rate and review purchased products from 1–5 stars                                      |
| **User Profile**    | View and update personal information                                                   |

### 🛠️ Admin Features

| Feature                | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| **Dashboard**          | Revenue, orders, customers, and low-stock statistics    |
| **Revenue Chart**      | 12-month revenue visualization based on database data   |
| **Product Management** | Add, edit, and delete aquarium products                 |
| **Order Management**   | View orders and update order/payment statuses           |
| **Customer Analytics** | View active customers, top products, and recent orders  |
| **Status Updates**     | Update order and payment status through the admin panel |

### 🔐 Security Features

* ✅ JWT-based authentication
* ✅ 7-day JWT expiration
* ✅ Bcrypt password hashing
* ✅ Role-Based Access Control
* ✅ Frontend and backend authorization checks
* ✅ Protected admin API routes
* ✅ `403 Forbidden` responses for unauthorized admin requests
* ✅ Unique database indexes for preventing duplicate reviews
* ✅ Server-side input validation

---

## 🧰 Tech Stack

### Frontend

* **Next.js 14** — App Router and Server Components
* **React 18** — Components, Hooks, and Context API
* **TypeScript** — Type-safe development
* **Tailwind CSS** — Utility-first styling
* **Zustand** — State management for cart and wishlist
* **Heroicons** — SVG icon library

### Backend

* **Next.js API Routes** — RESTful backend endpoints
* **MongoDB** — NoSQL database
* **Mongoose** — MongoDB ODM and schema validation
* **JWT** — Authentication
* **Bcrypt.js** — Password hashing

### Payment

The project includes a mock payment flow and is structured for future payment gateway integration.

* **Stripe** — Ready for integration
* **PayHere** — Sri Lankan payment gateway integration support
* **Mock Payment** — Available for safe development/testing

### Development Tools

* **ESLint** — Code quality and linting
* **Prettier** — Code formatting
* **Git & GitHub** — Version control

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js 18+**
* **MongoDB 6+** or MongoDB Atlas
* **Git**
* **VS Code** (recommended)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/aqua-market.git
cd aqua-market
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create environment variables

Create a `.env.local` file in the project root.

Windows:

```powershell
copy .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

#### 4. Configure MongoDB

You can either run MongoDB locally or use MongoDB Atlas.

Local MongoDB example:

```text
mongodb://localhost:27017/aqua_market
```

MongoDB Atlas example:

```text
mongodb+srv://<username>:<password>@cluster.mongodb.net/aqua_market
```

#### 5. Seed the database

If the project includes the seed scripts:

```bash
npm run seed
```

Then seed products:

```bash
npm run seed:products
```

#### 6. Start the development server

```bash
npm run dev
```

#### 7. Open the application

Visit:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

Create `.env.local` in the project root.

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/aqua_market

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# PayHere - Optional
PAYHERE_MERCHANT_ID=your_merchant_id
PAYHERE_SECRET=your_secret_key
PAYHERE_SANDBOX=true
PAYHERE_RETURN_URL=http://localhost:3000/order-success
PAYHERE_CANCEL_URL=http://localhost:3000/checkout
PAYHERE_NOTIFY_URL=http://localhost:3000/api/payment/notify

# Stripe - Optional
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

> ⚠️ **Security:** Never commit `.env.local`, API keys, database credentials, JWT secrets, or payment secrets to GitHub.

Make sure `.env.local` is included in `.gitignore`.

---

## 👥 Demo Accounts

After running the seed scripts, the following demo accounts can be used if they are configured by the seed data:

| Role         | Email                     | Password      |
| ------------ | ------------------------- | ------------- |
| **Admin**    | `admin@aquamarket.com`    | `admin123`    |
| **Staff**    | `staff@aquamarket.com`    | `staff123`    |
| **Customer** | `customer@aquamarket.com` | `customer123` |

Users can also register through:

```text
/auth/register
```

> ⚠️ These are development/demo credentials only. Do not use them in a production environment.

---

## 📁 Project Structure

```text
aqua-market/
├── app/
│   ├── actions/
│   │   └── reviews.ts
│   │
│   ├── admin/
│   │   ├── fish/
│   │   │   ├── add/
│   │   │   └── edit/[id]/
│   │   ├── orders/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── fish/
│   │   │   └── orders/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   └── register/
│   │   ├── orders/
│   │   ├── products/
│   │   └── user/
│   │
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── cart/
│   ├── checkout/
│   ├── mock-payment/
│   ├── order-success/
│   ├── orders/
│   ├── product/[id]/
│   ├── profile/
│   ├── shop/
│   ├── wishlist/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── common/
│   │   ├── TopNavBar.tsx
│   │   ├── BottomNavBar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── LayoutShell.tsx
│   │
│   ├── dashboard/
│   │   ├── SideNavBar.tsx
│   │   └── AnalyticsChart.tsx
│   │
│   ├── marketplace/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   │
│   └── product/
│       └── ReviewSection.tsx
│
├── context/
│   └── AuthContext.tsx
│
├── lib/
│   ├── mongodb.ts
│   ├── payhere.ts
│   ├── socket.ts
│   └── stripe.config.ts
│
├── models/
│   ├── User.ts
│   ├── Product.ts
│   ├── Order.ts
│   └── Review.ts
│
├── scripts/
│   ├── seed.js
│   └── seed-products.js
│
├── store/
│   ├── cartStore.ts
│   └── wishlistStore.ts
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                  | Auth |
| ------ | -------------------- | ---------------------------- | ---- |
| `POST` | `/api/auth/register` | Create a new account         | ❌    |
| `POST` | `/api/auth/login`    | Login and authenticate       | ❌    |
| `POST` | `/api/auth/logout`   | Clear authentication session | ✅    |
| `GET`  | `/api/auth/me`       | Get current user             | ✅    |

### Products

| Method   | Endpoint               | Description          | Auth     |
| -------- | ---------------------- | -------------------- | -------- |
| `GET`    | `/api/products`        | List products        | ❌        |
| `GET`    | `/api/products/[id]`   | Get a single product | ❌        |
| `POST`   | `/api/admin/fish`      | Create product       | 🔒 Admin |
| `PUT`    | `/api/admin/fish`      | Update product       | 🔒 Admin |
| `DELETE` | `/api/admin/fish?id=X` | Delete product       | 🔒 Admin |

### Orders

| Method   | Endpoint                 | Description         | Auth     |
| -------- | ------------------------ | ------------------- | -------- |
| `POST`   | `/api/orders`            | Create an order     | ✅        |
| `GET`    | `/api/orders`            | Get user's orders   | ✅        |
| `GET`    | `/api/admin/orders`      | Get all orders      | 🔒 Admin |
| `PUT`    | `/api/admin/orders`      | Update order status | 🔒 Admin |
| `DELETE` | `/api/admin/orders?id=X` | Delete order        | 🔒 Admin |

### Admin

| Method | Endpoint               | Description             | Auth     |
| ------ | ---------------------- | ----------------------- | -------- |
| `GET`  | `/api/admin/analytics` | Get dashboard analytics | 🔒 Admin |

### Reviews

The review functionality uses Next.js Server Actions.

| Action                                                  | Description              | Auth |
| ------------------------------------------------------- | ------------------------ | ---- |
| `getReviewsAction(productId)`                           | Fetch product reviews    | ❌    |
| `createReviewAction(token, productId, rating, comment)` | Create a review          | ✅    |
| `deleteReviewAction(token, reviewId)`                   | Delete user's own review | ✅    |

---

## 🔍 Key Features Explained

### 🔐 Role-Based Access Control

Aqua Market uses a two-layer authorization model.

#### Frontend

The `ProtectedRoute` component checks the authenticated user's role before rendering protected pages.

#### Backend

Admin API routes independently verify the JWT and user's role.

For example:

```text
User → JWT Verification → Role Verification → API Access
```

Unauthorized users receive:

```http
403 Forbidden
```

This prevents frontend-only authorization from being the application's sole security mechanism.

---

### 🛒 User-Isolated Cart

Each authenticated user's cart is stored using a unique user-specific key.

Example:

```text
aqua-market-cart-{userId}
```

This ensures:

* User A cannot access User B's cart
* Cart data remains isolated between users
* Guest cart data can persist before login
* The application can switch between user-specific carts

---

### 💳 Mock Payment Flow

Aqua Market provides a mock payment system for safe development and testing.

The flow is:

```text
Checkout
   ↓
Create Order
   ↓
Order Status: Pending
Payment Status: Pending
   ↓
Mock Payment Page
   ↓
Simulate Payment
   ↓
Clear Cart
   ↓
Order Success
```

No real money is charged during the mock payment process.

> **Note:** Stock is decremented when the order is created rather than after successful payment in the current implementation.

---

### ⭐ Review System

The review system provides:

* 1–5 star ratings
* Written customer reviews
* One review per user per product
* Automatic product rating recalculation
* Automatic review count updates
* Review deletion
* Server-side review operations

A unique database index helps prevent duplicate reviews for the same user and product.

---

### 📊 Admin Analytics

The admin dashboard uses MongoDB aggregation pipelines to generate business metrics.

Example revenue aggregation:

```javascript
Order.aggregate([
  {
    $group: {
      _id: null,
      total: {
        $sum: "$total"
      }
    }
  }
]);
```

Example top-product aggregation:

```javascript
Order.aggregate([
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$items.name",
      sales: {
        $sum: "$items.quantity"
      },
      revenue: {
        $sum: {
          $multiply: [
            "$items.price",
            "$items.quantity"
          ]
        }
      }
    }
  },
  {
    $sort: {
      revenue: -1
    }
  },
  {
    $limit: 5
  }
]);
```

---

## 📸 Screenshots

### 🛍️ Customer Experience

The customer-facing application includes:

* 🏠 **Home Page** — Hero section and featured products
* 🛒 **Shop** — Product grid with filtering, search, and sorting
* 🐟 **Product Details** — Product information and reviews
* 🛍️ **Cart** — Cart management and order summary
* 💳 **Checkout** — Delivery and payment information
* 📦 **Order History** — Previous orders and status tracking
* ❤️ **Wishlist** — Saved products
* 👤 **Profile** — User account management

### 🛠️ Admin Experience

The administration panel includes:

* 📊 **Dashboard** — Business statistics and analytics
* 🐟 **Product Management** — Complete product CRUD
* 📦 **Order Management** — Order and payment status management
* 📈 **Analytics** — Revenue and product performance
* 👥 **Customer Information** — Customer-related statistics

> 📌 Screenshots will be added after deployment.

---

## 🗺️ Roadmap

### ✅ Completed

* [x] JWT authentication
* [x] Role-based access control
* [x] Product catalog
* [x] Product filtering
* [x] Product search
* [x] Shopping cart
* [x] User-isolated cart
* [x] Wishlist
* [x] Checkout
* [x] Mock payment flow
* [x] Order creation
* [x] Order history
* [x] Admin dashboard
* [x] Revenue analytics
* [x] Admin order management
* [x] Product CRUD
* [x] Customer review system
* [x] Responsive UI

### 🚧 In Progress

* [ ] Order tracking timeline
* [ ] Additional admin management features
* [ ] Production deployment optimization

### 🔮 Planned

* [ ] Stripe payment integration
* [ ] PayHere payment integration
* [ ] Email order notifications
* [ ] Shipping/status email notifications
* [ ] Product image upload
* [ ] Bulk admin operations
* [ ] CSV order export
* [ ] MongoDB Atlas production deployment
* [ ] Vercel deployment
* [ ] Progressive Web App (PWA) support
* [ ] Product recommendation system
* [ ] Wishlist sharing

---

## 🤝 Contributing

This is primarily a personal portfolio project, but contributions and suggestions are welcome.

### 1. Fork the repository

```bash
git clone https://github.com/YOUR_USERNAME/aqua-market.git
```

### 2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Commit your changes

```bash
git add .
git commit -m "Add amazing feature"
```

### 4. Push the branch

```bash
git push origin feature/amazing-feature
```

### 5. Open a Pull Request

Describe the changes and improvements included in your pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026 Abdul Mueez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```

---

## 👨‍💻 Author

**Abdul Mueez**

Computer Science & Technology
Full-Stack Developer

### Technologies & Interests

`Next.js` · `React` · `TypeScript` · `Node.js` · `MongoDB` · `PostgreSQL` · `AWS` · `Docker`

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

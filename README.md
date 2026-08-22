# Printify Pakistan

Perfect Omer bhai 👍
Below is your FINAL Pakistan-Optimized Lovable Mega Prompt — clean, structured, production-focused, and aligned with Lovable’s prompting style (clear system goal, modules, constraints, architecture, no ambiguity).

You can paste this directly into Lovable.

🚀 MEGA PROMPT – Build Production-Ready Photo Printing Platform (Pakistan Market MVP)

Build a production-ready, cloud-based, mobile-first web application for a Pakistan-based custom photo printing business.

The system must be fully functional, scalable, secure, and optimized for Pakistani ecommerce behavior (high Cash on Delivery usage, mobile traffic, low bandwidth users).

The application must include:

Customer Web Application (Responsive, mobile-first)

Admin Panel (Super Admin)

Print Shop Dashboard

Role-based authentication

Full order workflow system

Payment-ready checkout structure

Cloud image storage

Analytics dashboard

Deployment-ready configuration

Do not generate placeholder logic. All modules must be interconnected and functional.

1️⃣ SYSTEM ARCHITECTURE

Generate a modern full-stack architecture:

Frontend:

Next.js (React)

Mobile-first responsive UI

Clean SaaS-style dashboard layout

Backend:

Node.js with API routes

RESTful API structure

Database:

PostgreSQL (normalized relational schema)

Storage:

S3-compatible cloud object storage for images

Authentication:

JWT-based authentication

Role-based middleware

2️⃣ USER ROLES & PERMISSIONS

Implement strict role isolation:

Customer

Admin (Super Admin)

Print Shop User

Each role must have separate dashboard and restricted access based on permissions.

3️⃣ CUSTOMER WEB APPLICATION (Mobile-First)

Optimize for:

70%+ mobile users

3G/4G speed

Compressed images

Lazy loading

Authentication

Email + password login

Mobile number field (Pakistan format validation)

Secure password hashing

Session handling

Forgot password flow

Dashboard

Display:

Printing categories

Featured products

Order tracking summary

WhatsApp support button (visible globally)

Categories:

Photo Books

Mugs

T-Shirts

Gift Items

Product Detail Page

Each product must include:

Product images

Size-based pricing table

Delivery time estimate (e.g., 3–5 days)

Theme selection

Image upload

Add to cart

Theme System

3–5 predefined themes per category

Theme preview image

User selects one theme

Fixed layout only (no drag & drop designer)

Image Upload System

Upload from device (desktop/mobile)

Auto compress images before storage

Show upload progress

Store securely in cloud storage

Validate file types

Limit file size

Basic Image Editing

Implement lightweight editor with:

Crop

Rotate

Zoom

Brightness adjustment

Keep it fast and minimal.

Cart System

Add/remove items

Update quantity

Session-based storage

Show subtotal

Show delivery estimate

Checkout (Pakistan Optimized)

Payment options:

Cash on Delivery (default selected)

Online Payment (structure ready for):

JazzCash

Easypaisa

Stripe

On order placement:

Create order record

Status = “Pending Confirmation”

Trigger email notification

Generate WhatsApp confirmation template

My Account Section

Customer can:

View order history

Track status

View payment status

Update profile

Save delivery address

4️⃣ ORDER WORKFLOW SYSTEM

Implement the following statuses:

Pending Confirmation

Confirmed

Assigned to Print Shop

In Design

Awaiting Customer Approval

Approved

Printed

Shipped

Delivered

Cancelled

Rejected

Role permissions:

Customer: View only

Admin: Full control

Print Shop: Limited update permissions

Maintain order status history table.

5️⃣ ADMIN PANEL (Super Admin Dashboard)

Create professional SaaS-style dashboard.

Admin Capabilities

User Management

View customers

Activate / Deactivate users

View:

IP address

Device info

Order history

Print Shop User Management

Add / Edit / Delete print shop users

Assign permissions

Track completed vs rejected jobs

Category & Product Management

Add / Edit / Delete categories

Manage subcategories

Add / Edit / Delete products

Define pricing table

Define delivery time

Upload themes

Order Management

Admin can:

View all orders

Filter by status

Confirm COD orders

Assign to print shop

Upload design preview image

Update tracking number

Mark shipped

Cancel suspicious orders

Reporting Dashboard

Include visual charts:

Total revenue

Monthly revenue

Orders by category

COD vs Online payment ratio

Orders by city

Pending vs completed orders

Use bar and line charts.

6️⃣ PRINT SHOP DASHBOARD

Each print shop user must have:

Dashboard showing:

Pending jobs count

Completed jobs count

Status chart

Capabilities:

View assigned orders

Accept or reject order

Update status to:

In Design

Awaiting Approval

Printed

Upload final design preview

View job history

Generate simple performance report

Rejected orders return automatically to Admin.

7️⃣ DATABASE DESIGN

Create normalized tables:

Users

Roles

Categories

Products

Themes

Orders

Order Items

Order Status History

Payments

Cart

Print Assignments

Activity Logs

Use proper foreign keys and indexing.

8️⃣ PERFORMANCE OPTIMIZATION

Must include:

Image compression

Lazy loading

API response optimization

CDN-ready static files

Database indexing

Caching where appropriate

Ensure smooth performance on low-speed networks.

9️⃣ SECURITY REQUIREMENTS

JWT authentication

Role-based access middleware

Input validation

File upload validation

SQL injection protection

XSS protection

HTTPS-ready configuration

🔟 UI/UX REQUIREMENTS

Design must:

Be clean and modern

Be trust-building

Show COD clearly

Show delivery time clearly

Highlight WhatsApp support

Use dashboard layout for admin & print shop

Use reusable components

1️⃣1️⃣ MVP LIMITATIONS

Do NOT implement:

Mobile applications

Drag-and-drop designer tool

Facebook/Instagram API upload

Multi-language

Multi-currency

Warehouse ERP

Keep MVP lean but fully operational.

FINAL BUILD INSTRUCTION

Generate a complete, fully functional, production-ready MVP web application with:

Authentication

Role-based dashboards

Order workflow system

Admin management

Print shop management

Reporting analytics

COD + online payment structure

Cloud storage integration

Mobile-first UI

Deployment-ready configuration

All modules must be interconnected and working logically.

Do not leave unfinished placeholders.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ca43eaf6-1590-4146-b91e-edd4ba848211).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

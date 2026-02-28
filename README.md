# visa-bot

Enterprise-grade Visa Management System built with Node.js, Express, TypeScript, and MongoDB.
Designed with scalable architecture, role-based authorization, secure authentication, and cloud-based document storage.

This file contains all the important commands for setting up, running, and deploying **Visa Bot**.

---

## 1. Clone Project

```bash
git clone https://github.com/mdismailahammedroman/Visa-bot.git
cd Visa-bot

```





## Overview

Visa Bot is a backend API service that manages:

User authentication & authorization

OTP verification flows

Country & visa service management

Visa applications with document uploads

Role-based administrative controls

Secure password management

Cloud file storage via AWS S3

The system is designed with modular architecture and enterprise security practices.

Architecture Principles

Modular feature-based structure

Role-Based Access Control (RBAC)

Middleware-driven request validation

Centralized error handling

Zod schema validation

Secure JWT authentication

Cloud-based file storage

Scalable service-oriented design

⚙️Technology Stack

Layer	Technology
Runtime	Node.js
Framework	Express.js
Language	TypeScript
Database	MongoDB (Mongoose)
Validation	Zod
Authentication	JWT
File Storage	AWS S3
Architecture	Modular MVC Pattern
Core Modules

Authentication

Credential login

Forgot password with OTP

OTP verification

Password reset

Change password

Secure logout

User Management

User registration

Profile management

Role assignment

Account status control

Self account deletion

Country Management

Create country

Update country

Retrieve countries

Access control for administrative roles

Visa Services

Create visa services per country

Search visa services

Retrieve services by country

Update services

Visa Applications

Apply for visa service

Upload required documents

Payment endpoint

Administrative access to applications

User Settings

Retrieve personal settings

Update preferences

Role-Based Access Control

Supported roles:

ADMIN

MAIN_MANAGER

MANAGER

USER

Authorization is enforced via middleware and JWT verification.

Installation
Clone Repository
git clone https://github.com/mdismailahammedroman/Visa-bot.git
cd Visa-bot
Install Dependencies
npm install
Configure Environment Variables

Running the Application
Development Mode
npm run dev
Production Mode
npm run build
npm start
API Structure (High-Level)
Auth
POST   /auth/login
POST   /auth/forgot-password
POST   /auth/verify-otp
POST   /auth/reset-password
POST   /auth/change-password
POST   /auth/logout
Users
POST    /users/register
PATCH   /users/update-user
GET     /users/me
GET     /users/all-users
PATCH   /users/status/:userId
PATCH   /users/role/:userId
DELETE  /users/delete-account
Countries
POST   /countries
GET    /countries
GET    /countries/:id
PATCH  /countries/:id
Visa Services
POST   /countries/:countryId/visa-services
GET    /countries/:countryId/visa-services
GET    /visa-services
GET    /visa-services/:id
GET    /visa-services/search
PATCH  /visa-services/:id
Visa Applications
POST   /visa/apply/:visaServiceId
GET    /visa/apply
POST   /visa/:id/pay
File Upload Handling

The system supports secure multi-file upload to AWS S3 for:

Passport Copy

Passport Photo

Previous Visa Copy

Bank Statement

Upload middleware ensures:

Controlled file types

Size limits

Cloud storage integration

Security Features

JWT access control

Role-based route protection

Zod schema validation

Secure password hashing

OTP verification flow

Protected file uploads

Token-based logout mechanism

Project Structure
src/
 ├── app/
 │    ├── modules/
 │    │    ├── auth/
 │    │    ├── user/
 │    │    ├── country/
 │    │    ├── visaService/
 │    │    ├── visaApplication/
 │    │    ├── otp/
 │    │    └── userSettings/
 │    ├── middlewares/
 │    ├── helpers/
 │
 ├── app.ts
 └── server.ts
Deployment Recommendations

Use Docker for containerization

Deploy on AWS EC2 / Render / Railway

Configure NGINX as reverse proxy

Enable HTTPS with SSL

Use MongoDB Atlas for production database

Enable logging & monitoring

Production Best Practices

Use environment-based configuration

Enable rate limiting

Implement centralized logging (Winston / Pino)

Add Swagger documentation

Integrate CI/CD pipeline

Use refresh token rotation

Implement request throttling

Author

Md Ismail Ahammed Roman
Backend Developer

GitHub: https://github.com/mdismailahammedroman
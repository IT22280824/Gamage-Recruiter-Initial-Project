# 🎨 Media Gallery Management System - MediaNest - 

A full-stack MERN web application that enables users to manage media galleries, contact messages, and perform secure authentication using Gmail OTP and Google OAuth 2.0. 

---

## 📌 Project Overview

This Media Gallery Web App allows users (admin & normal) to:

- Upload, preview, tag, and manage images
- Generate ZIP files for selected media
- Submit, view, and manage contact messages
- Register/login using Gmail OTP verification or Google OAuth 2.0
- Perform admin operations (user management, contact moderation)

---

## 🌐 Live Demo

- **Frontend (Vercel)**: [https://gamage-recruiter-initial-project-pp.vercel.app/register]
- **Backend (Render)**: [https://gamage-recruiter-initial-project.onrender.com/]

---

## 🧰 Tech Stack

| Area       | Technologies |
|------------|--------------|
| Frontend   | React, Bootstrap |
| Backend    | Node.js, Express.js |
| Database   | MongoDB Atlas |
| Auth       | Google OAuth 2.0, JWT, Nodemailer (OTP) |
| Storage    | Cloudinary|
| Libraries  | Multer, Archiver, React Dropzone |

---

## 🖼 Core Features

### 🔐 Authentication
- Google OAuth 2.0 login
- Manual email/password registration with Gmail OTP verification
- Forgot password via Gmail OTP
- Protected routes via middleware

### 🖼 Media Gallery
- Drag & drop image uploads (JPG/PNG, max 5MB)
- File preview, title, description, and tags
- Search/filter gallery by tags/titles
- Fullscreen image view with slider
- CRUD operations (edit/delete images and metadata)
- Multi-image ZIP download (Archiver + frontend)

### 💬 Contact Form
- Users can submit, edit, and delete messages
- Admins can view/delete all messages

### 👥 Admin User Management
- View all users
- Edit role, deactivate (soft-delete) accounts

### AI Tools and References Used

| Tool / Site                  | Purpose |
|-----------------------------|---------|
| ChatGPT (OpenAI)            | Architecture decisions, deployment guidance, CORS issues, OTP flow |
| Stack Overflow              | Debugging JWT, Multer, Archiver issues |
| Vercel Docs                 | Frontend deployment (CRA) |
| Render Docs                 | Backend deployment with Node.js |
| Cloudinary Docs             | Image hosting |
| Archiver (npm)              | ZIP generation |
| React Dropzone              | Drag-and-drop image upload UI |
| Nodemailer Docs             | Gmail SMTP & OTP integration |


# 🧭 InventoHub

A full-stack **Inventory Management Platform** built with **Node.js**, **Express**, **React**, and **MongoDB**.
Easily manage products, categories, and track inventory with a modern, user-friendly interface.


## 🚀 Features

* 🔐 **JWT Authentication** — Secure login & registration with role-based access (Admin/User)
* 📦 **Product Management** — Add, view, update, and delete products with category linking
* 🏷️ **Category Management** — Organize products using custom categories
* 🔍 **Search & Filter** — Find products by name, description, or category
* 📊 **Pagination** — Efficient pagination for large product lists
* 🎨 **Modern UI** — Responsive, clean interface built with React + Vite
* 📝 **Structured Logging** — Integrated Winston logging (console + file)


## ⚙️ Prerequisites

Ensure the following are installed before setup:

* **Node.js** (v18 or higher)
* **npm** (v9 or higher)

Verify installation:

```bash
node --version
npm --version
```

## 🧩 Quick Start Guide

### 1️⃣ Extract the Project

1. Clone the repository
2. Open the folder named **`InventoHub`**.

### 2️⃣ Configure Environment Variables

Inside the root folder (`InventoHub`), create a file named **`.env`** and add:

```env
PORT=5000
MONGO_URI=mongodb+srv://Parkavi:PsZwjnTqv0riojRV@cluster0.uoorwrr.mongodb.net/?appName=Cluster0
JWT_SECRET=4f6ad4f54bd587b501e0d593b7ee6eb6e2ef0768f673c960b0c17c0595013712355ede0a0578284868914c0afcbf6bd76acb048ab6faaa455bb61d024f661c44
```

### 3️⃣ Install Backend Dependencies

```bash
cd InventoHub
npm install
```

Start the backend server:

```bash
npm run dev
```


### 4️⃣ Install Frontend Dependencies

```bash
cd InventoHub and then cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```


### 5️⃣ Open the Application

Once both servers are running, open your browser and go to:

👉 **http://localhost:5173**

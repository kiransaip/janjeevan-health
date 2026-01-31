# JanJeevan Project Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database running
- Two terminal windows

## Initial Setup (First Time Only)

### 1. Database Setup

Create a PostgreSQL database and configure your `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/janjeevan_db"
JWT_SECRET="your-secret-key-here"
PORT=4000
```

### 2. Server Setup

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

The seed command will create demo users:
- **Patient**: `patient@demo.com` / `password123`
- **ASHA Worker**: `asha@demo.com` / `password123`
- **Doctor**: `doctor@demo.com` / `password123`
- **Pharmacist**: `pharma@demo.com` / `password123`

### 3. Client Setup

```bash
cd client
npm install
```

## Running the Project

### Terminal 1: Start Server
```bash
cd server
npm run dev
```
Server runs on `http://localhost:4000`

### Terminal 2: Start Client
```bash
cd client
npm run dev
```
Client runs on `http://localhost:3000`

## Testing Login

1. Go to `http://localhost:3000`
2. Click "Login"
3. Use any of the demo credentials above
4. You should be redirected to the appropriate dashboard based on your role

## Troubleshooting

### "Invalid credentials" error
- Make sure you ran `npm run seed` in the server directory
- Verify the server is running on port 4000
- Check server console for errors

### Database connection errors
- Verify PostgreSQL is running
- Check your `DATABASE_URL` in `server/.env`
- Run `npx prisma migrate dev` again

### Module not found errors
- Delete `client/.next` folder
- Restart the client dev server

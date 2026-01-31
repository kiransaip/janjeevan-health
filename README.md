# JanJeevan Project

## Getting Started

This project consists of a Client (Next.js) and a Server (Express/Node.js).

### Prerequisites

- Node.js installed
- PostgreSQL database (ensure your `.env` in `server/` is configured)

### Running the Project

You need to run the client and server in separate terminals.

#### 1. Server

Navigate to the `server` directory and install dependencies (if not already done):
```bash
cd server
npm install
```

Start the development server:
```bash
npm run dev
```
The server will start on the configured port (default is usually 8080 or 3000).

#### 2. Client

Navigate to the `client` directory and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```
The client will be valid available at `http://localhost:3000`.

### Building for Production

**Server:**
```bash
cd server
npm run build
npm start
```

**Client:**
```bash
cd client
npm run build
npm start
```

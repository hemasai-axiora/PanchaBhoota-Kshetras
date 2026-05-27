# ॐ PanchaBhoota Kshetras — Spiritual Element Temples Web Application

PanchaBhoota Kshetras is a production-grade, highly polished full-stack spiritual web application that explains the five ancient sacred Shiva temples representing the five elemental building blocks of creation: **Earth (Prithvi), Water (Apas), Fire (Tejas), Air (Vayu), and Space (Akasha)**.

This repository features an elegant, modern, spiritual interface built with **Angular 18** and **Tailwind CSS**, coupled with a robust, secure **Node/Express/MongoDB** REST API backend, completely containerized and ready for cloud deployment.

---

## 🌟 Visual Theme & Design Systems
- **Divine Aesthetics**: Harmony of deep slate/midnight indigo (`#0A0A16`) for spiritual nights, sacred gold (`#D4AF37`) for wisdom, and dynamic saffron (`#FF9933`) gradients for transformation.
- **Fluid UI Elements**: Parallax hero masks, responsive multi-photo carousels, contemplative full-screen image lightboxes, element-colored badges, loading skeletons, and interactive Google Maps frames.
- **Yogic Chakra Alignment**: Features visual diagrams detailing how elements map directly to human throat, heart, solar plexus, sacral, and root chakras.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular 18 (Standalone Components, `provideHttpClient` with fetch API, component binding routing)
- **Styling**: Tailwind CSS (v3.4+) & PostCSS
- **State**: RxJS reactive streams (BehaviorSubjects for dynamic Dark/Light modes and session monitoring)

### Backend
- **Framework**: Node.js & Express.js (REST architecture)
- **Security**: Helmet headers, CORS policies, bcryptjs password hashes, JWT authorization tokens, and active request rate limiters.
- **Database**: MongoDB & Mongoose schemas (strict validators and complete seed data structures)

### DevOps & Orchestration
- **Containerization**: Multi-stage production-optimized `Dockerfiles` for Frontend (Node builder + Nginx static server) and Backend (Node builder + clean alpine execution context).
- **Composition**: Single-command orchestrator `docker-compose.yml` linking all databases, APIs, and Nginx.

---

## 🛕 The 5 Sacred Temples (Seeded Data)
1. **Ekambareswarar Temple** (Earth element — *Prithvi*) — Kanchipuram, Tamil Nadu
2. **Jambukeswarar Temple** (Water element — *Appu*) — Thiruvanaikaval, Tamil Nadu
3. **Arunachaleswarar Temple** (Fire element — *Agni*) — Tiruvannamalai, Tamil Nadu
4. **Sri Kalahasti Temple** (Air element — *Vayu*) — Srikalahasti, Andhra Pradesh
5. **Chidambaram Nataraja Temple** (Space element — *Akasha*) — Chidambaram, Tamil Nadu

---

## 🚀 Native Installation & Quick Start

### Prerequisites
- Node.js (v18.x or v20.x)
- MongoDB community server installed and running on your local machine (`127.0.0.1:27017`)

---

### Step 1: Run and Seed the Backend REST Service
Open your terminal and navigate to the `backend/` folder:
```bash
cd backend
```

1. **Install Node Packages**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Verify or edit the `.env` file containing:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/panchabhoota
   JWT_SECRET=super_secret_spiritual_key_108
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```
3. **Seed the Sacred Database**:
   Populates all 5 temples with descriptions, powers, festivals, high-quality images, coordinates, along with a default admin credentials:
   ```bash
   npm run seed
   ```
   > **Default Admin Account**:
   > - **Email**: `admin@panchabhoota.org`
   > - **Password**: `Shiva@108`

4. **Start the API Server in Dev Mode**:
   ```bash
   npm run dev
   ```
   *The server opens at `http://localhost:5000`.*

---

### Step 2: Run the Angular 18 Frontend App
Open a secondary terminal and navigate to the `frontend/` folder:
```bash
cd frontend
```

1. **Install Node Packages**:
   ```bash
   npm install
   ```
2. **Build and Start Dev Web Server**:
   ```bash
   npm start
   ```
   *Your browser will launch the portal at `http://localhost:4200`.*

---

## 🐳 Docker Compose Deployment (Single Command)
Ensure you have Docker Desktop and docker-compose installed.

Run the entire stack (Database, Node API, Nginx Web Server) using one command in the project root:
```bash
docker-compose up --build
```

### Port Mappings:
- **Angular Frontend (Nginx)**: `http://localhost:80` (or simply `http://localhost`)
- **Express Backend API**: `http://localhost:5000/api`
- **MongoDB**: Exposed locally on `127.0.0.1:27017`
- **Volume persistence**: Database remains safe across restarts via the `mongo-data` volume mount.

---

## ☁️ AWS Production Deployment Ready

### Strategy A: AWS Elastic Beanstalk (Docker Platform)
Elastic Beanstalk offers an incredibly simple way to host our multi-container application.

1. **Create a `dockerrun.aws.json`** file in the project root referencing the Docker compose file.
2. **Setup AWS RDS / DocumentDB**:
   - Create a MongoDB-compatible database (DocumentDB) or a MongoDB cluster on MongoDB Atlas.
   - Note the production connection string.
3. **Deploying via EB CLI**:
   - Install the EB CLI tool.
   - Initialize environment: `eb init -p docker panchabhoota-app`
   - Setup Environment Variables in the AWS management console:
     - `MONGODB_URI` (Point to your production Atlas/DocumentDB string)
     - `JWT_SECRET` (A strong cryptographical secret)
     - `NODE_ENV=production`
   - Deploy stack: `eb create panchabhoota-env`

---

### Strategy B: AWS ECS (Elastic Container Service) with Fargate
Recommended for enterprise-grade deployments requiring high availability and autoscale.

1. **Push Images to ECR (Elastic Container Registry)**:
   Create ECR repositories for `pb_backend` and `pb_frontend`, then build and push:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build & Push Backend
   docker build -t pb_backend ./backend
   docker tag pb_backend:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/pb_backend:latest
   docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/pb_backend:latest
   
   # Build & Push Frontend
   docker build -t pb_frontend ./frontend
   docker tag pb_frontend:latest <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/pb_frontend:latest
   docker push <your-account-id>.dkr.ecr.us-east-1.amazonaws.com/pb_frontend:latest
   ```

2. **Define ECS Task Definitions**:
   - Define a task definition incorporating the `pb_backend` container (port 5000) and `pb_frontend` container (port 80).
   - Configure AWS Secrets Manager to inject the database connection string and JWT Secrets safely.
3. **Create ECS Fargate Cluster & Service**:
   - Launch under public/private subnets.
   - Configure an **Application Load Balancer (ALB)** to listen on HTTP/HTTPS and route requests to target groups (port 80 for Nginx frontend and `/api/*` context paths to port 5000 for backend Node).

---

## 🔒 Security Practices Built-in
- **Helmet Security**: Injected headers guard against Cross-Site Scripting (XSS), clickjacking, and mime-type sniffing.
- **Express Rate Limiting**: Restricts brute-force attacks by limiting authentication endpoints to 15 actions per 15 minutes.
- **Secure CORS Policies**: Blocks unverified scripts from running API actions in production, white-listing only host domains.
- **Bcrypt Hash**: Admin password is salted and cryptographically hashed (10 salt rounds) prior to entering MongoDB.

# 🐳 Docker Guide - Stripe Connect Platform

## 📋 Prerequisites

- **Docker Desktop** installed
  - Windows/Mac: https://www.docker.com/products/docker-desktop
  - Linux: https://docs.docker.com/engine/install/
- Stripe API keys (test mode)

## 🚀 Quick Start

### 1. Initial Setup

```bash
# Create configuration files
copy .env.example .env
copy backend\.env.example backend\.env

# On Linux/Mac use:
# cp .env.example .env
# cp backend/.env.example backend/.env
```

### 2. Configure Stripe Keys

Edit the `.env` file in the project root:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Build and Start

```bash
docker-compose up --build -d
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 📝 Essential Docker Compose Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start containers in background |
| `docker-compose up --build -d` | Build and start |
| `docker-compose down` | Stop and remove containers |
| `docker-compose restart` | Restart containers |
| `docker-compose logs -f` | View logs in real-time |
| `docker-compose ps` | View container status |
| `docker-compose down -v --rmi all` | Complete cleanup |

## 🐧 Additional Commands

### Initial Setup

```bash
# Create .env file
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env with your Stripe keys
nano .env

# Build and start
docker-compose up --build -d
```

### Make Commands

```bash
make setup    # Initial setup
make dev      # Development with logs
make up       # Start in background
make down     # Stop containers
make logs     # View logs
make clean    # Clean everything
make rebuild  # Rebuild
```

### Direct Docker Compose Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# View specific logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart
docker-compose restart

# Status
docker-compose ps

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 🏗️ Docker Structure

### Configuration Files

```
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
├── .env                        # Environment variables
├── backend/
│   ├── Dockerfile             # Production build
│   ├── Dockerfile.dev         # Development build
│   └── .dockerignore
└── frontend/
    ├── Dockerfile             # Production build (multi-stage)
    ├── Dockerfile.dev         # Development build
    └── .dockerignore
```

### Containers

| Container | Port | Description |
|-----------|------|-------------|
| `stripe-backend` | 3001 | NestJS API |
| `stripe-frontend` | 3000 | Next.js App |

### Volumes

Volumes are mounted for hot-reload in development:

```yaml
backend:
  volumes:
    - ./backend:/app
    - /app/node_modules

frontend:
  volumes:
    - ./frontend:/app
    - /app/node_modules
    - /app/.next
```

## 🔧 Development

### Hot Reload

Both containers support hot reload in development:
- ✅ Code changes are detected automatically
- ✅ No need to restart containers

### Access Container Shell

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

### Install New Dependency

```bash
# Backend
docker-compose exec backend npm install package-name

# Frontend
docker-compose exec frontend npm install package-name

# Or rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 🚀 Production

### Production Build

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### Production vs Development Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Build | Hot reload | Optimized |
| Size | Larger | Smaller (multi-stage) |
| Node Modules | Inside container | Build time only |
| Source Maps | Yes | No |
| Performance | Debug | Maximum |

## 🧹 Cleanup and Maintenance

### Clean Everything

```bash
# Windows
docker-clean.bat

# Linux/Mac
make clean
# or
docker-compose down -v --rmi all
```

### Clean Docker Cache

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete system cleanup
docker system prune -a --volumes
```

### Rebuild from Scratch

```bash
# Windows
docker-clean.bat
docker-setup.bat

# Linux/Mac
make clean
make setup
make dev
```

## 📊 Monitoring

### View Logs in Real-Time

```bash
# All containers
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend

# Last 50 lines
docker-compose logs --tail=50
```

### Container Status

```bash
docker-compose ps
```

### Resource Usage

```bash
docker stats
```

## 🐛 Troubleshooting

### Container doesn't start

```bash
# View error logs
docker-compose logs backend
docker-compose logs frontend

# Check status
docker-compose ps

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use error

```bash
# See who's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Stop process or change port in .env
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

### Changes don't appear

```bash
# Restart containers
docker-compose restart

# Or rebuild
docker-compose down
docker-compose up --build -d
```

### Error "Cannot connect to backend"

```bash
# Check if backend is running
docker-compose ps

# View backend logs
docker-compose logs backend

# Check environment variables
docker-compose exec frontend env | grep API_URL
```

### Clean and Restart

```bash
# Remove everything and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Additional Resources

### Docker Desktop

- Graphical interface to manage containers
- View logs, resources, volumes
- Restart containers
- Access terminal

### VS Code Extension

Install Docker extension for VS Code:
- View containers in real-time
- Integrated logs
- Attach to container
- Execute commands

### Useful Docker Commands

```bash
# View all images
docker images

# Remove specific image
docker rmi image-name

# View all containers (including stopped)
docker ps -a

# Remove specific container
docker rm container-name

# Inspect container
docker inspect container-name

# Copy file to/from container
docker cp container:/path/to/file /local/path
docker cp /local/path container:/path/to/file
```

## 🔐 Security

### Don't commit sensitive files

```bash
# .env is in .gitignore
# Never commit:
- .env
- backend/.env
- frontend/.env.local
```

### Use secrets in production

For production, use Docker secrets or secure environment variables:

```bash
# Example with Docker secrets
docker secret create stripe_key stripe_key.txt
```

## 🌍 Deploy

### Docker Hub

```bash
# Build and push
docker build -t your-username/stripe-backend:latest ./backend
docker push your-username/stripe-backend:latest

docker build -t your-username/stripe-frontend:latest ./frontend
docker push your-username/stripe-frontend:latest
```

### Cloud Providers

- **AWS**: ECS, Fargate, App Runner
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **Heroku**: Container Registry
- **DigitalOcean**: App Platform, Droplets

## ✅ Production Checklist

- [ ] Use docker-compose.prod.yml
- [ ] Configure secure environment variables
- [ ] Enable HTTPS
- [ ] Configure custom domain
- [ ] Implement health checks
- [ ] Configure data backup
- [ ] Implement centralized logging
- [ ] Configure monitoring
- [ ] Implement CI/CD
- [ ] Document deploy process

---

**Happy Dockerizing! 🐳**

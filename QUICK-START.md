# ⚡ Quick Start - Stripe Connect Platform

## 🚀 3 Commands to Start

### 1. Create configuration file

```bash
# Create .env in root
copy .env.example .env

# Create .env in backend
copy backend\.env.example backend\.env
```

Edit the `.env` files with your Stripe keys:
```env
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

🔑 **Get them at**: https://dashboard.stripe.com/test/apikeys

### 2. Build and start

```bash
docker-compose up --build -d
```

### 3. Access

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

---

## 📋 Essential Docker Commands

### Start containers
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### View logs
```bash
# All containers
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Restart
```bash
docker-compose restart
```

### View status
```bash
docker-compose ps
```

### Rebuild everything
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Clean everything
```bash
docker-compose down -v --rmi all
```

---

## 🛠️ Development

### Hot Reload
Containers already have hot reload configured. Edit the code and changes are applied automatically!

### Install new dependency

**Backend:**
```bash
# Option 1: Inside container
docker-compose exec backend npm install package-name

# Option 2: Rebuild
docker-compose down
docker-compose build backend
docker-compose up -d
```

**Frontend:**
```bash
# Option 1: Inside container
docker-compose exec frontend npm install package-name

# Option 2: Rebuild
docker-compose down
docker-compose build frontend
docker-compose up -d
```

### Access container shell
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh
```

---

## 🐛 Troubleshooting

### View error logs
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Container doesn't start
```bash
# See what happened
docker-compose ps
docker-compose logs

# Rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use
Edit `.env` and change ports:
```env
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

### Changes don't appear
```bash
docker-compose restart
```

### Clean and restart
```bash
docker-compose down -v --rmi all
docker-compose up --build -d
```

---

## 🧪 Test if it's working

```bash
# Test backend
curl http://localhost:3001

# Test frontend
curl http://localhost:3000
```

---

## 🎯 Next Steps

1. ✅ Access http://localhost:3000
2. ✅ Create a Connect account
3. ✅ Complete onboarding
4. ✅ Test payments

---

## 📚 More Information

- **Complete documentation**: [README.md](README.md)
- **Detailed Docker guide**: [DOCKER.md](DOCKER.md)
- **Project structure**: [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

---

**Happy Coding! 🚀**

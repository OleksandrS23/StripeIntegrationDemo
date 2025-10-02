# 🐳 Quick Docker Commands Reference

## ⚡ Initial Setup

```bash
# 1. Create configuration files
copy .env.example .env
copy backend\.env.example backend\.env

# Linux/Mac:
# cp .env.example .env
# cp backend/.env.example backend/.env

# 2. Edit .env with your Stripe keys

# 3. Build and start
docker-compose up --build -d
```

---

## 🎮 Basic Control

### Start containers
```bash
docker-compose up -d
```

### Stop containers
```bash
docker-compose down
```

### Restart containers
```bash
docker-compose restart
```

### View status
```bash
docker-compose ps
```

---

## 📋 Logs and Monitoring

### View logs from all containers
```bash
docker-compose logs -f
```

### View backend logs
```bash
docker-compose logs -f backend
```

### View frontend logs
```bash
docker-compose logs -f frontend
```

### View last 50 lines
```bash
docker-compose logs --tail=50
```

### View logs without follow
```bash
docker-compose logs
```

---

## 🔄 Rebuild and Update

### Rebuild everything
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Rebuild only one service
```bash
docker-compose build backend
docker-compose up -d backend
```

### Force recreation
```bash
docker-compose up -d --force-recreate
```

---

## 🧹 Cleanup

### Stop and remove containers
```bash
docker-compose down
```

### Remove containers and volumes
```bash
docker-compose down -v
```

### Complete cleanup (containers + volumes + images)
```bash
docker-compose down -v --rmi all
```

### Clean build cache
```bash
docker builder prune -a
```

---

## 🔧 Development

### Access backend shell
```bash
docker-compose exec backend sh
```

### Access frontend shell
```bash
docker-compose exec frontend sh
```

### Install dependency in backend
```bash
docker-compose exec backend npm install package-name
```

### Install dependency in frontend
```bash
docker-compose exec frontend npm install package-name
```

### Execute custom command
```bash
docker-compose exec backend npm run command
```

---

## 📊 Information

### View resource usage
```bash
docker stats
```

### View volumes
```bash
docker volume ls
```

### View networks
```bash
docker network ls
```

### Inspect container
```bash
docker inspect stripe-backend
docker inspect stripe-frontend
```

---

## 🚀 Production

### Start in production mode
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Stop production
```bash
docker-compose -f docker-compose.prod.yml down
```

### View production logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🆘 Troubleshooting

### View build errors
```bash
docker-compose build
```

### View error details
```bash
docker-compose up
# (without -d to see direct output)
```

### Remove everything and rebuild
```bash
docker-compose down -v --rmi all
docker system prune -a
docker-compose up --build -d
```

### Container doesn't start
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# View last errors
docker-compose logs --tail=100 backend

# Inspect
docker inspect stripe-backend
```

### Port already in use
```bash
# See what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Or change port in .env
```

---

## 💡 Useful Tips

### Environment variables
```bash
# View variables in a container
docker-compose exec backend env

# Reload after changing .env
docker-compose down
docker-compose up -d
```

### Copy files
```bash
# From container to local
docker cp stripe-backend:/app/file.txt ./

# From local to container
docker cp ./file.txt stripe-backend:/app/
```

### Image sizes
```bash
docker images
```

### Clean disk space
```bash
# View usage
docker system df

# Clean everything unused
docker system prune -a --volumes
```

---

## 📚 Useful Links

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Most used commands daily:**

```bash
docker-compose up -d              # Start
docker-compose down               # Stop
docker-compose logs -f            # View logs
docker-compose restart            # Restart
docker-compose ps                 # Status
docker-compose exec backend sh   # Backend shell
```

---

**Happy Dockerizing! 🐳**


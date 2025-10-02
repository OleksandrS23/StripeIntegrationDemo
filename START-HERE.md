# 🚀 Start Here - Stripe Connect Platform

## ⚡ Quick Start (3 commands!)

```bash
# 1. Create configuration files
copy .env.example .env
copy backend\.env.example backend\.env

# 2. Edit .env with your Stripe keys

# 3. Build and start
docker-compose up --build -d
```

**Done! Access:** http://localhost:3000

---

## 📚 Which documentation to read?

Choose based on your goal:

### 🎯 I want to start NOW (5 minutes)
👉 **[QUICK-START.md](QUICK-START.md)**
- 3 simple commands
- No complications
- Works in minutes

### 🐳 I want to understand Docker (15 minutes)
👉 **[DOCKER.md](DOCKER.md)**
- Complete Docker guide
- All commands
- Troubleshooting
- Production deploy

### 📖 I want to see everything about the project (30 minutes)
👉 **[README.md](README.md)**
- Complete overview
- Features
- API endpoints
- Usage guides

### 🔧 I want to do manual setup (without Docker)
👉 **[SETUP.md](SETUP.md)**
- Node.js installation
- Step-by-step setup
- Manual troubleshooting

### 📁 I want to understand the structure
👉 **[PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)**
- Folder organization
- Architecture
- Technologies used

---

## 🎬 Step-by-Step Tutorial

### Step 1: Get Stripe Keys
1. Access: https://dashboard.stripe.com/test/apikeys
2. Copy:
   - Secret key (sk_test_...)
   - Publishable key (pk_test_...)

### Step 2: Create config files
```bash
copy .env.example .env
copy backend\.env.example backend\.env
```

### Step 3: Configure
Edit the `.env` file (created automatically):
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### Step 4: Build and Start
```bash
docker-compose up --build -d
```

### Step 5: Use it!
Open: http://localhost:3000

---

## 🎓 Complete Test Flow

### 1. Create Connect Account (2 min)
- Go to "Create Account"
- Email: `seller@test.com`
- Country: United States
- Type: Express
- Copy the generated Account ID

### 2. Complete Onboarding (3 min)
- Go to "Onboarding"
- Paste the Account ID
- Follow Stripe's process
- Use test data

### 3. Create Payment (2 min)
Choose a type:
- **Payment Intent**: For custom integration
- **Checkout Session**: Hosted page
- **Payment Link**: For social media

---

## 🛠️ Essential Commands

```bash
docker-compose up -d                # ▶️  Start
docker-compose down                 # ⏸️  Stop
docker-compose restart              # 🔄 Restart
docker-compose logs -f              # 📋 View logs
docker-compose down -v --rmi all    # 🧹 Clean everything
docker-compose ps                   # 📊 View status
```

---

## 🎯 Quick Tests

### Test Card
```
Number: 4242 4242 4242 4242
Date: Any future date
CVC: 123
```

### Personal Data
```
Name: Any name
Email: test@example.com
Phone: +1234567890
```

---

## 🆘 Common Problems

### Docker is not installed
**Solution:** Install Docker Desktop
https://www.docker.com/products/docker-desktop

### Containers don't start
```bash
docker-compose logs            # View the error
docker-compose down -v         # Clean
docker-compose up --build -d   # Rebuild
```

### Changes don't appear
```bash
docker-compose restart
```

### Port already in use
Edit `.env`:
```env
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

---

## 📊 Simple Architecture

```
┌─────────────────────────────────────────┐
│           Browser                       │
│     http://localhost:3000               │
└─────────────┬───────────────────────────┘
              │
              │ HTTP
              │
┌─────────────▼───────────────────────────┐
│      Frontend Container                 │
│         Next.js                          │
│         Port 3000                        │
└─────────────┬───────────────────────────┘
              │
              │ API Calls
              │
┌─────────────▼───────────────────────────┐
│      Backend Container                  │
│         NestJS                           │
│         Port 3001                        │
└─────────────┬───────────────────────────┘
              │
              │ Stripe API
              │
┌─────────────▼───────────────────────────┐
│           Stripe                         │
│     (Payment Processing)                │
└─────────────────────────────────────────┘
```

---

## ✅ Setup Checklist

- [ ] Docker Desktop installed
- [ ] Stripe keys obtained
- [ ] Created `.env` files
- [ ] Edited `.env` with Stripe keys
- [ ] Executed `docker-compose up --build -d`
- [ ] Accessed http://localhost:3000
- [ ] Created first Connect account
- [ ] Completed onboarding
- [ ] Tested payment

---

## 🎉 Ready to Start!

You have everything you need. Start with:

```bash
# Create configs
copy .env.example .env
copy backend\.env.example backend\.env

# Edit .env with your keys

# Start
docker-compose up --build -d
```

**Questions?** See:
- 📖 [README.md](README.md) - Complete documentation
- 🐳 [DOCKER.md](DOCKER.md) - Detailed Docker guide
- ⚡ [QUICK-START.md](QUICK-START.md) - Quick start
- 🎮 [DOCKER-COMMANDS.md](DOCKER-COMMANDS.md) - Command reference

---

**Good luck and happy coding! 🚀**

*Remember: You're in test mode. No real payments will be processed.*

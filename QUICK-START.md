# ⚡ Quick Start - Stripe Connect Integration Demo

## 🚀 3 Steps to Start (5 minutes)

### Step 1: Get Your Stripe Keys 🔑

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Secret Key** (sk*test*...)
3. Copy your **Publishable Key** (pk*test*...)

### Step 2: Configure Environment

```bash
# Create configuration files
copy .env.example .env
copy backend\.env.example backend\.env
```

Edit the `.env` file with your Stripe keys:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Step 3: Start the Application

```bash
docker-compose up --build -d
```

### 🎉 Done! Access Your Application

- **🎨 Frontend Dashboard**: http://localhost:3000
- **🔌 Backend API**: http://localhost:3001

**Next**: Create your first Connect account and test payments!

---

## 📋 Essential Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart all services
docker-compose restart

# View service status
docker-compose ps
```

### Monitoring & Debugging

```bash
# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f backend
docker-compose logs -f frontend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Maintenance

```bash
# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d

# Complete cleanup
docker-compose down -v --rmi all

# Update dependencies
docker-compose exec backend npm install
docker-compose exec frontend npm install
```

---

## 🎯 Test Your Setup (2 minutes)

### Quick Health Check

```bash
# Test backend API
curl http://localhost:3001

# Test frontend
curl http://localhost:3000
```

### Complete Test Flow

1. **Open Dashboard**: http://localhost:3000
2. **Create Connect Account**:
   - Email: `seller@test.com`
   - Country: United States
   - Type: Express
   - Copy the Account ID
3. **Complete Onboarding**:
   - Paste Account ID
   - Click "Generate Verification Link"
   - Complete Stripe verification
4. **Test Payment**:
   - Try "Embedded Checkout" (recommended)
   - Use test card: `4242 4242 4242 4242`

---

## 🆕 New Features to Try

### 🚀 Embedded Checkout

- **URL**: `/payments/embedded`
- **Feature**: Checkout without redirects
- **Best for**: Integrated user experience

### 🎬 Payment Demo

- **URL**: `/payments/demo`
- **Feature**: Preview customer experience
- **Best for**: Understanding payment flow

### 🇵🇹 Local Payment Methods

- **Currency**: EUR
- **Methods**: MB Way, Multibanco
- **Test**: Create EUR payment and see local options

---

## 🐛 Common Issues & Solutions

### ❌ "Stripe API key not configured"

```bash
# Check your .env files
cat .env
cat backend/.env

# Restart containers
docker-compose restart
```

### ❌ Container won't start

```bash
# Check status and logs
docker-compose ps
docker-compose logs

# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### ❌ Port already in use

Edit `.env` file:

```env
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

### ❌ Changes not appearing

```bash
# Hot reload should work automatically
# If not, restart:
docker-compose restart
```

---

## 🎓 Learning Path

1. ✅ **Start Here** - You're done with setup!
2. ✅ **Explore Dashboard** - http://localhost:3000
3. ✅ **Create Connect Account** - Test account creation
4. ✅ **Try All Payment Methods**:
   - Payment Intent (custom)
   - Checkout Session (redirect)
   - Embedded Checkout (integrated) 🆕
   - Payment Link (shareable)
   - Demo Mode (preview) 🆕
5. ✅ **Test Different Countries** - Try BR, PT, GB currencies
6. ✅ **Read Documentation** - [README.md](README.md) for complete guide

---

## 📚 Documentation Links

- 📖 **[README.md](README.md)** - Complete project documentation
- 🏗️ **[PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)** - Architecture overview
- 🔧 **[SETUP.md](SETUP.md)** - Manual setup (without Docker)
- 🎬 **[START-HERE.md](START-HERE.md)** - Beginner-friendly guide
- 🐳 **[DOCKER.md](DOCKER.md)** - Detailed Docker guide

---

## 🎉 You're Ready!

Your Stripe Connect platform is running with:

- ✅ Interactive dashboard
- ✅ Multiple payment methods
- ✅ Connect account management
- ✅ Real-time testing capabilities
- ✅ Modern UI with hot reload

**Start exploring at**: http://localhost:3000

**Happy Coding! 🚀**

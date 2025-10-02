# 🔧 Manual Setup Guide - Stripe Connect Integration Demo

## 📋 Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package manager (comes with Node.js)
- **Stripe account** - [Create at stripe.com](https://stripe.com)
- **Git** (optional) - For cloning the repository

## 🔑 Step 1: Get Stripe API Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in left sidebar)
3. Copy these keys:
   - **Secret Key** (sk*test*...) - for backend
   - **Publishable Key** (pk*test*...) - for frontend

## ⚡ Step 2: Backend Setup (NestJS)

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Create environment configuration
copy .env.example .env
# On Linux/Mac: cp .env.example .env

# Edit .env file with your Stripe keys
# STRIPE_SECRET_KEY=sk_test_your_secret_key_here
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
# APP_URL=http://localhost:3000
# PORT=3001

# Start development server with hot reload
npm run start:dev
```

✅ **Backend API running at**: http://localhost:3001

## 🎨 Step 3: Frontend Setup (Next.js)

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install all dependencies
npm install

# Create environment configuration
# Create .env.local file with:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Start development server with hot reload
npm run dev
```

✅ **Frontend Application running at**: http://localhost:3000

## 🎯 Step 4: Test Your Setup

### Quick Health Check

```bash
# Test backend (should return API info)
curl http://localhost:3001

# Test frontend (should return HTML)
curl http://localhost:3000
```

### Complete Test Flow (5 minutes)

1. **Open Dashboard**: http://localhost:3000

2. **Create Connect Account**:

   - Fill in email: `seller@test.com`
   - Select country: United States
   - Choose type: Express (recommended)
   - Click "Create Connect Account"
   - **Important**: Copy the generated Account ID

3. **Complete Onboarding**:

   - Paste the Account ID in onboarding section
   - Click "Generate Verification Link"
   - Click "Open Onboarding Link"
   - Complete Stripe's verification with test data

4. **Test Payment Methods**:
   - **🆕 Embedded Checkout**: No redirects, integrated experience
   - **Checkout Session**: Stripe-hosted page
   - **Payment Intent**: Custom integration
   - **Payment Link**: Shareable links
   - **🆕 Demo Mode**: Preview customer experience

## 🧪 Stripe Test Data

### Test Card Numbers

- **Success**: `4242 4242 4242 4242`
- **Requires 3D Secure**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9987`

### Card Details

- **Expiration**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any postal code (e.g., 12345)

### Personal Information

- **Name**: Any name
- **Email**: Any valid email format
- **Phone**: Any phone number
- **Address**: Any address (use realistic format for country)

## ❗ Common Issues & Solutions

### ❌ "Stripe API key not configured"

**Problem**: Backend can't find Stripe keys

```bash
# Check backend .env file exists and has correct keys
cat backend/.env

# Keys should start with sk_test_ and pk_test_
# Restart backend after changing .env
cd backend
npm run start:dev
```

### ❌ "Cannot connect to backend"

**Problem**: Frontend can't reach backend API

```bash
# Check if backend is running on port 3001
curl http://localhost:3001

# Check frontend .env.local has correct API URL
cat frontend/.env.local
# Should contain: NEXT_PUBLIC_API_URL=http://localhost:3001

# Restart frontend
cd frontend
npm run dev
```

### ❌ "Module not found" or dependency errors

**Problem**: Dependencies not installed correctly

```bash
# Clean and reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Clean and reinstall frontend dependencies
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

### ❌ CORS errors in browser console

**Problem**: Cross-origin request blocked

```bash
# Verify NEXT_PUBLIC_API_URL in frontend/.env.local
# Should be: http://localhost:3001 (not https)

# Check both services are running:
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
```

### ❌ Port already in use

**Problem**: Another service using the same port

```bash
# For backend (port 3001)
lsof -ti:3001 | xargs kill -9

# For frontend (port 3000)
lsof -ti:3000 | xargs kill -9

# Or change ports in .env files
```

### ❌ Embedded Checkout not loading

**Problem**: Stripe.js not loaded or keys incorrect

```bash
# Check browser console for errors
# Verify NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in frontend/.env.local
# Key should start with pk_test_

# Check Stripe.js is loaded (should see in Network tab)
```

## 🎯 Available Features

### Connect Account Management

- ✅ Create accounts (Express, Standard, Custom)
- ✅ Onboarding with verification links
- ✅ Account status monitoring
- ✅ Balance checking
- ✅ Multi-country support (US, BR, PT, GB, DE, CA)

### Payment Methods

- ✅ **Payment Intent** - Custom integration with Stripe Elements
- ✅ **Checkout Session** - Stripe-hosted payment page
- ✅ **🆕 Embedded Checkout** - Integrated checkout without redirects
- ✅ **Payment Link** - Shareable payment links
- ✅ **🆕 Demo Mode** - Interactive payment flow preview

### Local Payment Methods

- 🇵🇹 **Portugal**: MB Way, Multibanco
- 🇧🇷 **Brazil**: PIX
- 🇺🇸 **US**: ACH
- 🇬🇧 **UK**: BACS
- 🇩🇪 **Germany**: SEPA

## 📚 Documentation & Resources

### Project Documentation

- 📖 **[README.md](README.md)** - Complete project overview
- 🏗️ **[PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)** - Architecture details
- ⚡ **[QUICK-START.md](QUICK-START.md)** - Docker quick start
- 🎬 **[START-HERE.md](START-HERE.md)** - Beginner guide

### Stripe Resources

- 📘 **[Stripe Connect Docs](https://stripe.com/docs/connect)** - Official documentation
- 🧪 **[Testing Guide](https://stripe.com/docs/testing)** - Test cards and data
- 🆘 **[Stripe Support](https://support.stripe.com)** - Get help

## 🎓 Learning Path

1. ✅ **Setup Complete** - Both services running
2. ✅ **Explore Dashboard** - http://localhost:3000
3. ✅ **Create Connect Account** - Test account creation
4. ✅ **Complete Onboarding** - Verify with test data
5. ✅ **Try Payment Methods**:
   - Start with Embedded Checkout (newest feature)
   - Test different currencies and countries
   - Try Payment Links for sharing
   - Use Demo mode to understand customer experience
6. ✅ **Test Edge Cases** - Declined cards, authentication required
7. ✅ **Read Documentation** - Understand the architecture

## 🎉 You're All Set!

Your manual Stripe Connect setup is complete with:

- ✅ **Backend API** running on http://localhost:3001
- ✅ **Frontend Dashboard** running on http://localhost:3000
- ✅ **Hot Reload** enabled for development
- ✅ **All Payment Methods** ready to test
- ✅ **Connect Account Management** fully functional

### 🚨 Important Reminders

- **Test Mode Only** - No real money will be processed
- **Keep API Keys Secret** - Never commit .env files
- **Use Test Data** - For onboarding and payments
- **Monitor Console** - Check for errors during development

### 🚀 For Production

When ready to go live:

1. Complete Stripe account verification
2. Replace test keys with live keys
3. Set up webhooks for real-time events
4. Implement proper error handling and logging
5. Add monitoring and alerting

---

**Happy Coding! 🚀**

_Manual setup complete - start building amazing payment experiences!_

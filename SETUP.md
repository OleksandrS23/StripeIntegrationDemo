# 🚀 Quick Installation Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Stripe account (https://dashboard.stripe.com)
- Git (optional)

## ⚡ Quick Installation

### 1. Backend (NestJS)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create configuration file
copy .env.example .env
# Or on Linux/Mac:
# cp .env.example .env

# Edit .env and add your Stripe keys
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Start the server
npm run start:dev
```

✅ Backend running at: **http://localhost:3001**

### 2. Frontend (Next.js)

```bash
# In a new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Create configuration file
# Create .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Start the server
npm run dev
```

✅ Frontend running at: **http://localhost:3000**

## 🔑 Getting Stripe Keys

1. Access https://dashboard.stripe.com/test/apikeys
2. Copy the **Secret Key** (sk_test_...)
3. Copy the **Publishable Key** (pk_test_...)
4. For webhooks, access https://dashboard.stripe.com/test/webhooks

## 🎯 Testing the Application

### Complete Test Flow:

1. **Open browser**: http://localhost:3000

2. **Create Connect Account**:
   - Click "➕ Create Account"
   - Fill in: `seller@test.com`
   - Country: United States (or other)
   - Type: Express
   - Click "Create Connect Account"
   - ✅ Note the generated `Account ID`

3. **Complete Onboarding**:
   - Click "📝 Onboarding"
   - Paste the `Account ID`
   - Click "Generate Link"
   - Follow Stripe's verification process
   - Use test data: https://stripe.com/docs/testing

4. **Create Payment**:
   - Choose a method:
     - **Payment Intent**: Custom integration
     - **Checkout Session**: Hosted page
     - **Payment Link**: For social media
   - Fill in the details
   - Use the `Account ID` from the created account

## 🧪 Stripe Test Data

### Test Cards:
- **Success**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995
- **Expiration**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any postal code

### Personal Data:
- **Name**: Any name
- **Email**: Any valid email
- **Phone**: Any number

## ❗ Common Issues

### Error: "Stripe API key not configured"
```bash
# Check if .env is in backend/ folder
# Check if key starts with sk_test_
cat backend/.env
```

### Error: "Cannot connect to backend"
```bash
# Check if backend is running
# Should show: "🚀 Backend running on http://localhost:3001"
cd backend
npm run start:dev
```

### Error: "Module not found"
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json .next
npm install
```

### CORS Error
```bash
# Check if NEXT_PUBLIC_API_URL is correct
# Should be: http://localhost:3001
cat frontend/.env.local
```

## 📦 Folder Structure

```
stripe-connect-platform/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── stripe/
│   │   │   ├── controllers/    # API endpoints
│   │   │   ├── services/       # Business logic
│   │   │   └── dto/            # Data validation
│   │   └── main.ts
│   ├── .env               # Settings (DO NOT commit!)
│   └── package.json
│
└── frontend/             # Next.js App
    ├── app/
    │   ├── connect/      # Account pages
    │   └── payments/     # Payment pages
    ├── components/       # Reusable components
    ├── lib/             # Utilities and API
    ├── .env.local       # Settings (DO NOT commit!)
    └── package.json
```

## 🎓 Next Steps

1. ✅ Explore the interface
2. ✅ Test different payment types
3. ✅ Create multiple seller accounts
4. ✅ Test with different countries and currencies
5. ✅ Read the documentation: https://stripe.com/docs/connect

## 🆘 Need Help?

- Stripe Connect Documentation: https://stripe.com/docs/connect
- Stripe Support: https://support.stripe.com
- Project Issues: [GitHub Issues]

## 🎉 Done!

Your Stripe Connect platform is configured and ready to use!

**Remember**: You're in test mode. No real transactions will be processed.

For production use:
1. Complete verification of your Stripe account
2. Replace test keys with production keys
3. Configure webhooks in production
4. Implement robust error handling
5. Add logging and monitoring

---

**Happy Coding! 🚀**

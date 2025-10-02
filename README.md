# 🚀 Stripe Connect Integration Demo

Complete platform for managing seller accounts and payments using Stripe Connect. This demo showcases all major Stripe Connect features with a modern, interactive interface.

## 📋 Project Structure

```
StripeIntegrationDemo/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── stripe/
│   │   │   ├── controllers/
│   │   │   │   ├── connect-account.controller.ts  # Connect account management
│   │   │   │   ├── payment.controller.ts          # Payment Intents and transfers
│   │   │   │   └── checkout.controller.ts         # Checkout Sessions and Payment Links
│   │   │   ├── services/
│   │   │   │   └── stripe.service.ts              # Stripe integration logic
│   │   │   ├── dto/                               # Data Transfer Objects
│   │   │   └── stripe.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── frontend/                # Next.js App
    ├── app/
    │   ├── connect/
    │   │   ├── create-account/         # Create Connect account
    │   │   ├── onboarding/             # Onboarding process
    │   │   └── accounts/               # Account list
    │   ├── payments/
    │   │   ├── payment-intent/         # Custom payment with Stripe Elements
    │   │   ├── checkout/               # Checkout Session (redirect)
    │   │   ├── embedded/               # 🆕 Embedded Checkout (no redirect)
    │   │   ├── payment-link/           # Payment Link for sharing
    │   │   └── demo/                   # 🆕 Complete payment flow demo
    │   ├── page.tsx                    # Interactive dashboard
    │   └── layout.tsx
    ├── components/                      # Reusable UI components
    ├── lib/
    │   └── api.ts                      # API client
    └── package.json
```

## 🎯 Features

### Connect Accounts

- ✅ Create seller accounts (Express, Standard, Custom)
- ✅ Complete onboarding process with Stripe verification
- ✅ List and manage account details
- ✅ Balance verification and status checking
- ✅ Multiple country support (US, BR, PT, GB, DE, CA)

### Payment Methods

- ✅ **Payment Intent**: Custom payments with full control and Stripe Elements
- ✅ **Checkout Session**: Stripe-hosted payment page (redirect)
- ✅ **🆕 Embedded Checkout**: Integrated checkout without redirects
- ✅ **Payment Link**: Shareable links for social media/email
- ✅ **🆕 Payment Demo**: Interactive preview of customer experience

### Payment Features

- ✅ Multiple currency support (USD, BRL, EUR, GBP)
- ✅ Configurable platform fees and commissions
- ✅ Local payment methods:
  - 🇵🇹 **Portugal**: MB Way, Multibanco, Card
  - 🇧🇷 **Brazil**: PIX, Card
  - 🇺🇸 **US**: Card, ACH
  - 🇬🇧 **UK**: Card, BACS
  - 🇩🇪 **Germany**: Card, SEPA
- ✅ Real-time payment status updates
- ✅ Transfer management between accounts

## 🔑 How to Get Stripe Test API Keys

Before running the application, you need to obtain your Stripe API keys. Follow these steps:

### Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click **"Start now"** or **"Sign up"**
3. Fill in your information:
   - Email address
   - Full name
   - Country (this affects available features)
   - Password
4. Verify your email address

### Step 2: Access the Dashboard

1. Log in to [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. You'll see the main dashboard with overview metrics
3. **Important**: Make sure you're in **Test Mode** (toggle in the left sidebar)
   - Look for "Test mode" indicator
   - Test mode allows you to simulate payments without real money

### Step 3: Get Your API Keys

1. In the left sidebar, click **"Developers"**
2. Click **"API keys"**
3. You'll see two types of keys:

#### Publishable Key (pk*test*...)

- **Safe to expose** in frontend code
- Used by Stripe.js and Stripe Elements
- Example: `pk_test_51Abc123...`
- Copy this key - you'll need it for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### Secret Key (sk*test*...)

- **Keep this secret** - never expose in frontend
- Used for server-side API calls
- Example: `sk_test_51Abc123...`
- Copy this key - you'll need it for `STRIPE_SECRET_KEY`

### Step 4: Optional - Webhook Secret (for production)

1. In the left sidebar, click **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Enter your endpoint URL (e.g., `https://yourdomain.com/stripe/webhook`)
4. Select events you want to listen to
5. Copy the **Signing secret** (whsec\_...) for `STRIPE_WEBHOOK_SECRET`

### Step 5: Test Your Keys

You can verify your keys work by making a test API call:

```bash
curl https://api.stripe.com/v1/customers \
  -u sk_test_YOUR_SECRET_KEY: \
  -d email="test@example.com"
```

### 🚨 Important Security Notes

- **Never commit API keys to version control**
- **Use test keys (sk*test*/pk*test*) for development**
- **Use live keys (sk*live*/pk*live*) only in production**
- **Rotate keys if they're ever compromised**
- **Store keys in environment variables, not in code**

### 📝 Key Summary

After completing these steps, you should have:

| Key Type        | Environment Variable                 | Example Value         | Usage                |
| --------------- | ------------------------------------ | --------------------- | -------------------- |
| Secret Key      | `STRIPE_SECRET_KEY`                  | `sk_test_51Abc123...` | Backend API calls    |
| Publishable Key | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51Abc123...` | Frontend Stripe.js   |
| Webhook Secret  | `STRIPE_WEBHOOK_SECRET`              | `whsec_abc123...`     | Webhook verification |

---

## 🚀 How to Run

### Option 1: Docker (Recommended) 🐳

**Prerequisites:**

- Docker Desktop installed
- Stripe account (test mode)

```bash
# 1. Create configuration files
copy .env.example .env
copy backend\.env.example backend\.env

# 2. Edit .env with your Stripe keys
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# 3. Build and start
docker-compose up --build -d

# Done! Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

**Useful commands:**

```bash
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
docker-compose ps             # Status
```

📖 **Quick guide**: [QUICK-START.md](QUICK-START.md)
📖 **Complete documentation**: [DOCKER.md](DOCKER.md)

### Option 2: Manual (Node.js)

**Prerequisites:**

- Node.js 18+ installed
- Stripe account (test mode)
- Stripe API keys

#### 1. Configure Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your Stripe keys

# Start development server
npm run start:dev
```

Backend will be running at `http://localhost:3001`

#### 2. Configure Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create a .env.local file and add:
# NEXT_PUBLIC_API_URL=http://localhost:3001
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# Start development server
npm run dev
```

Frontend will be running at `http://localhost:3000`

## 📖 Usage Guide

### 1. Create Connect Account

1. Access the home page at `http://localhost:3000`
2. Fill in the "Create Connect Account" form:
   - **Email**: Seller's email address
   - **Country**: Choose from supported countries (US, BR, PT, GB, DE, CA)
   - **Type**: Express (recommended), Standard, or Custom
3. Click "Create Connect Account"
4. **Important**: Copy the generated Account ID - you'll need it for payments

### 2. Complete Onboarding

1. In the "Onboarding" section on the home page
2. Paste the Account ID from step 1
3. Click "Generate Verification Link"
4. Click "Open Onboarding Link" to complete Stripe's verification process
5. Use Stripe's test data for verification (see test data section below)

### 3. Create Payments

Choose from multiple payment methods:

#### 🆕 Embedded Checkout (Recommended)

- **Best for**: Integrated user experience
- **Access**: `/payments/embedded` or click "View Embedded" on home page
- **Features**: No redirects, stays on your site, professional UI
- **Supports**: All payment methods including Multibanco for EUR

#### Payment Intent (Custom Integration)

- **Best for**: Full control over payment flow
- **Access**: `/payments/payment-intent`
- **Features**: Custom UI with Stripe Elements, advanced customization
- **Use case**: When you need complete control over the payment experience

#### Checkout Session (Hosted Page)

- **Best for**: Quick implementation
- **Access**: `/payments/checkout`
- **Features**: Stripe-hosted page, automatic mobile optimization
- **Use case**: When you want Stripe to handle the entire payment UI

#### Payment Link (For Sharing)

- **Best for**: Social media, email, messaging
- **Access**: `/payments/payment-link`
- **Features**: Shareable URL, works anywhere
- **Use case**: WhatsApp, Instagram, email campaigns

#### 🆕 Payment Demo (Preview Experience)

- **Best for**: Testing and demonstrations
- **Access**: `/payments/demo`
- **Features**: Shows customer experience with mockup preview
- **Use case**: Understanding the complete payment flow

## 🔧 Environment Configuration

### Backend (.env)

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
APP_URL=http://localhost:3000
PORT=3001
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

## 🌍 Supported Countries and Currencies

| Country           | Code | Currency | Local Methods            |
| ----------------- | ---- | -------- | ------------------------ |
| 🇺🇸 United States  | US   | USD      | Card                     |
| 🇧🇷 Brazil         | BR   | BRL      | Card, PIX                |
| 🇵🇹 Portugal       | PT   | EUR      | Card, MB Way, Multibanco |
| 🇬🇧 United Kingdom | GB   | GBP      | Card                     |
| 🇩🇪 Germany        | DE   | EUR      | Card, SEPA               |

## 📚 API Endpoints

### Connect Accounts

- `POST /stripe/connect/accounts` - Create Connect account
- `GET /stripe/connect/accounts` - List all accounts
- `GET /stripe/connect/accounts/:id` - Get account details
- `POST /stripe/connect/account-links` - Create onboarding link
- `GET /stripe/connect/accounts/:id/balance` - Get account balance

### Payment Intents

- `POST /stripe/payments/payment-intents` - Create Payment Intent
- `POST /stripe/payments/payment-intents/:id/confirm` - Confirm payment
- `POST /stripe/payments/payment-intents/:id/cancel` - Cancel payment
- `GET /stripe/payments/payment-intents/:id` - Get Payment Intent details
- `POST /stripe/payments/payment-intents/mbway` - Create MB Way Payment Intent
- `GET /stripe/payments/payment-methods/available` - Get available payment methods

### Checkout & Links

- `POST /stripe/checkout/sessions` - Create Checkout Session (standard or embedded)
- `POST /stripe/checkout/payment-links` - Create Payment Link
- `POST /stripe/checkout/payment-links/with-fee` - Create Payment Link with platform fee
- `POST /stripe/checkout/payment-intents-elements` - Create Payment Intent for Stripe Elements

### Transfers

- `POST /stripe/payments/transfers` - Create transfer to Connect account

## 💡 Tips & Best Practices

1. **Test Mode**: Always use test keys (sk*test*...) during development
2. **Onboarding**: Accounts must complete onboarding before receiving payments
3. **Platform Fees**: Configure `application_fee_amount` to retain your commission
4. **Webhooks**: Configure webhooks to receive real-time event notifications
5. **Security**: Never expose secret keys in frontend code
6. **Testing**: Use Stripe's test card numbers for comprehensive testing
7. **Local Payments**: Enable local payment methods for better conversion rates
8. **Mobile**: All payment methods are mobile-optimized automatically

## 🧪 Test Data

### Test Card Numbers

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`
- **Insufficient funds**: `4000 0000 0000 9995`
- **Expired card**: `4000 0000 0000 0069`

### Test Details

- **Expiration**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any postal code (e.g., 12345)

### Personal Information (for onboarding)

- **Name**: Any name
- **Email**: Any valid email format
- **Phone**: Any phone number format
- **Address**: Any address (use real format for country)

## 🆘 Troubleshooting

### Error "Stripe API key not configured"

**Solution:**

- Verify `.env` files exist in both root and backend directories
- Check that keys start with `sk_test_` and `pk_test_`
- Restart Docker containers after changing environment variables

### Account doesn't accept payments

**Solution:**

- Complete the onboarding process through the verification link
- Check that `charges_enabled` is `true` in account details
- Verify account status is not restricted

### CORS Error

**Solution:**

- Ensure backend is running on port 3001
- Verify `NEXT_PUBLIC_API_URL=http://localhost:3001` in frontend
- Check Docker containers are both running: `docker-compose ps`

### Embedded Checkout not loading

**Solution:**

- Verify Stripe.js is loaded (check browser console)
- Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Check that the client secret is valid and not expired

### Payment methods not showing

**Solution:**

- Verify the currency is supported in the seller's country
- Check that the Connect account supports the payment method
- Ensure the account has completed onboarding for that region

## 📝 License

This project is provided as an educational example.

## 🔗 Useful Links

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe API Reference](https://stripe.com/docs/api)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Developed with ❤️ using Stripe Connect

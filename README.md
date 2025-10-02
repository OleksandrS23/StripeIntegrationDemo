# 🚀 Stripe Connect Platform

Complete platform for managing seller accounts and payments using Stripe Connect.

## 📋 Project Structure

```
stripe-connect-platform/
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
    │   │   ├── payment-intent/         # Custom payment
    │   │   ├── checkout/               # Checkout Session
    │   │   └── payment-link/           # Payment Link
    │   ├── page.tsx                    # Home page
    │   └── layout.tsx
    ├── components/                      # Reusable components
    ├── lib/
    │   └── api.ts                      # API client
    └── package.json
```

## 🎯 Features

### Connect Accounts
- ✅ Create seller accounts (Express, Standard, Custom)
- ✅ Complete onboarding process
- ✅ List and account details
- ✅ Balance verification
- ✅ Multiple country support

### Payments
- ✅ **Payment Intent**: Custom payments with full control
- ✅ **Checkout Session**: Stripe-hosted page
- ✅ **Payment Link**: Shareable link for social media
- ✅ Multiple currency support (USD, BRL, EUR, GBP)
- ✅ Configurable platform fees
- ✅ Local payment methods (MB Way, Multibanco, PIX, etc.)

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
1. Access `/connect/create-account`
2. Fill in email, country, and account type
3. Click "Create Connect Account"
4. Note the generated Account ID

### 2. Complete Onboarding
1. Access `/connect/onboarding`
2. Paste the Account ID
3. Click to generate onboarding link
4. Complete the verification process

### 3. Create Payment
Choose one of the methods:

#### Payment Intent (Custom Integration)
1. Access `/payments/payment-intent`
2. Fill in payment details
3. Use the returned client_secret to integrate with Stripe Elements

#### Checkout Session (Hosted Page)
1. Access `/payments/checkout`
2. Fill in details
3. Share the generated link with the customer

#### Payment Link (For Social Media)
1. Access `/payments/payment-link`
2. Create the link
3. Share via WhatsApp, Instagram, etc.

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

| Country | Code | Currency | Local Methods |
|---------|------|----------|---------------|
| 🇺🇸 United States | US | USD | Card |
| 🇧🇷 Brazil | BR | BRL | Card, PIX |
| 🇵🇹 Portugal | PT | EUR | Card, MB Way, Multibanco |
| 🇬🇧 United Kingdom | GB | GBP | Card |
| 🇩🇪 Germany | DE | EUR | Card, SEPA |

## 📚 API Endpoints

### Connect Accounts
- `POST /stripe/connect/accounts` - Create account
- `GET /stripe/connect/accounts` - List accounts
- `GET /stripe/connect/accounts/:id` - Account details
- `POST /stripe/connect/account-links` - Create onboarding link
- `GET /stripe/connect/accounts/:id/balance` - View balance

### Payments
- `POST /stripe/payments/payment-intents` - Create Payment Intent
- `POST /stripe/payments/payment-intents/:id/confirm` - Confirm payment
- `GET /stripe/payments/payment-intents/:id` - Payment Intent details
- `POST /stripe/payments/transfers` - Create transfer

### Checkout
- `POST /stripe/checkout/sessions` - Create Checkout Session
- `POST /stripe/checkout/payment-links` - Create Payment Link
- `POST /stripe/checkout/payment-intents-elements` - Payment Intent for Elements

## 💡 Tips

1. **Test Mode**: Always use test keys (sk_test_...) during development
2. **Onboarding**: Accounts must complete onboarding before receiving payments
3. **Fees**: Configure application_fee_amount to retain your commission
4. **Webhooks**: Configure webhooks to receive event notifications

## 🆘 Troubleshooting

### Error "Stripe API key not configured"
- Verify environment variables are configured correctly
- Make sure you're using real Stripe keys

### Account doesn't accept payments
- Complete the onboarding process
- Verify that charges_enabled is true

### CORS Error
- Check if backend is running
- Confirm that NEXT_PUBLIC_API_URL points to the correct backend

## 📝 License

This project is provided as an educational example.

## 🔗 Useful Links

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [Stripe API Reference](https://stripe.com/docs/api)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

Developed with ❤️ using Stripe Connect

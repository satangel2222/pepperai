# PepperAI - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Services (15 minutes)

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Copy your project URL and anon key
4. Go to SQL Editor → New Query
5. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Click "Run"
7. Verify tables created in Table Editor

#### Stripe Setup
1. Go to [stripe.com](https://stripe.com)
2. Create account (or sign in)
3. Go to Developers → API keys
4. Copy Publishable key and Secret key
5. Go to Developers → Webhooks → Add endpoint
6. URL: `https://your-domain.vercel.app/api/webhooks/stripe` (use localhost for testing)
7. Events: Select `checkout.session.completed`
8. Copy webhook signing secret

### Step 2: Configure Environment (2 minutes)

Update `.env.local`:

```env
# fal.ai (already set)
FAL_KEY=c03c9a8c-1885-4438-9559-dcb8af729625:91a5b95ec717fe0a0cbaeaea463a7de3

# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe (from Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx...
STRIPE_SECRET_KEY=sk_test_xxx...
STRIPE_WEBHOOK_SECRET=whsec_xxx...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run & Deploy (5 minutes)

#### Local Testing
```bash
npm run dev
```
Visit http://localhost:3000

#### Deploy to Vercel
```bash
vercel
```
Or push to GitHub and import in Vercel dashboard.

**Don't forget**: Add all environment variables in Vercel project settings!

## ✅ Verification Checklist

- [ ] Supabase tables created
- [ ] Can sign up for new account
- [ ] Receive 5 free credits
- [ ] Can generate text-to-image
- [ ] Credits deducted correctly
- [ ] Generation appears in history
- [ ] Stripe checkout works
- [ ] Credits added after payment

## 🆘 Troubleshooting

**Build fails**: Make sure all environment variables are set
**Auth not working**: Check Supabase URL and keys
**Payment fails**: Verify Stripe keys and webhook secret
**Images not generating**: Check fal.ai API key

## 📚 Documentation

- Full walkthrough: `walkthrough.md`
- Implementation plan: `implementation_plan.md`
- Task breakdown: `task.md`
- README: `README.md`

---

**Need help?** Check the walkthrough.md for detailed documentation.

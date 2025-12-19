# PepperAI - AI Art Generation SaaS

A complete AI art generation platform with text-to-image, image-to-image, image-to-video generation, and custom LoRA training. **25% cheaper than MirrorRim!**

## Features

- 🎨 **Text to Image**: Generate high-quality images from text prompts (Standard, 4K, 8K)
- 🖼️ **Image to Image**: Transform existing images with AI
- 🎬 **Image to Video**: Bring images to life with AI-powered video generation
- 🧠 **LoRA Training**: Train custom LoRA models with your own images
- 💳 **Credit System**: Flexible credit-based pricing
- 🔐 **Authentication**: Secure user authentication with Supabase
- 💰 **Payments**: Stripe integration for credit purchases

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **AI**: fal.ai APIs
- **Payments**: Stripe
- **Hosting**: Vercel

## Setup Instructions

### 1. Clone and Install

```bash
cd d:/pepperai
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Run the database migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
   - Run the migration

### 3. Set Up Stripe

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your publishable and secret keys from the dashboard
3. Set up a webhook endpoint pointing to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Copy the webhook secret

### 4. Configure Environment Variables

Update `.env.local` with your actual values:

```env
# fal.ai API Key
FAL_KEY=your_fal_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Follow the prompts to deploy your application.

### 3. Configure Environment Variables in Vercel

Go to your Vercel project settings and add all environment variables from `.env.local`.

### 4. Update Stripe Webhook

Update your Stripe webhook URL to point to your production domain:
```
https://your-domain.vercel.app/api/webhooks/stripe
```

## Pricing

All prices are **25% cheaper than MirrorRim**:

- **$18.75** for 28 Credits
- **$37.50** for 60 Credits
- **$75.00** for 133 Credits
- **$225.00** for 429 Credits

### Credit Costs

- **Text to Image**: 0.25 - 1.5 credits (depending on resolution)
- **Image to Image**: 0.5 credits
- **Image to Video**: 0.5 - 4.0 credits (depending on resolution and duration)
- **LoRA Training**: 8.0 credits

## Project Structure

```
pepperai/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── artroom/           # ArtRoom page
│   ├── lora-trainer/      # LoRA trainer page
│   ├── pricing/           # Pricing page
│   ├── profile/           # User profile page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── artroom/          # ArtRoom components
│   ├── lora/             # LoRA components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
└── supabase/            # Database migrations
```

## License

MIT

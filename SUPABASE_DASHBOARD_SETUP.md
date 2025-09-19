# Supabase Dashboard Environment Variables Setup

## 🌐 What is Supabase Dashboard?

**Supabase Dashboard** is the web interface where you manage your Supabase project.

- **URL**: https://supabase.com/dashboard
- **Purpose**: Manage your database, storage, functions, and settings
- **Access**: Login with your Supabase account

## 🔧 Environment Variables Setup

### Step 1: Login to Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Login with your account
3. Select your project

### Step 2: Navigate to Edge Functions
1. In the left sidebar, click **"Edge Functions"**
2. You'll see a list of your deployed functions

### Step 3: Set Environment Variables
1. Click on **"Settings"** or **"Environment Variables"**
2. Add the following variables:

```
WEATHER_API_KEY=your_openweathermap_api_key_here
NEWS_API_KEY=your_newsapi_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Save Changes
1. Click **"Save"** or **"Update"**
2. Variables are now available to your Edge Functions

## 🚀 Edge Functions Deployment

### Method 1: Using Supabase CLI (Recommended)
```bash
# 1. Install Supabase CLI
brew install supabase/tap/supabase

# 2. Login to Supabase
supabase login

# 3. Link to your project
supabase link --project-ref your-project-ref

# 4. Deploy functions
supabase functions deploy
```

### Method 2: Using Supabase Dashboard (Limited)
- **Can't deploy from Dashboard directly**
- **Can only view and manage deployed functions**
- **Must use CLI for deployment**

## 📋 Complete Setup Process

### 1. Prepare Edge Functions Project
```bash
cd AuroraNotesEdgeFunctions
# Your functions are already created
```

### 2. Set Environment Variables in Dashboard
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Add environment variables:
   - `WEATHER_API_KEY`
   - `NEWS_API_KEY`
   - `OPENAI_API_KEY`

### 3. Deploy Functions
```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy get-weather
supabase functions deploy translate-text
supabase functions deploy get-news
```

### 4. Test Functions
```bash
# Test weather function
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/get-weather' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"lat": 40.7128, "lon": -74.0060}'
```

## 🔍 How to Find Your Project Reference

### Method 1: From Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project
3. Look at the URL: `https://supabase.com/dashboard/project/your-project-ref`
4. Copy the `your-project-ref` part

### Method 2: From Project Settings
1. Go to Settings → General
2. Find "Reference ID"
3. Copy the reference ID

## 🎯 Summary

**Environment Variables Setup:**
- ✅ **Location**: Supabase Dashboard → Edge Functions → Settings
- ✅ **Purpose**: Store API keys securely
- ✅ **Access**: Available to all Edge Functions

**Edge Functions Deployment:**
- ✅ **Method**: Supabase CLI (command line)
- ✅ **Command**: `supabase functions deploy`
- ✅ **Result**: Functions deployed to Supabase cloud

**Not in Dashboard:**
- ❌ **Can't deploy from web interface**
- ❌ **Must use CLI for deployment**
- ✅ **Can view and manage after deployment**

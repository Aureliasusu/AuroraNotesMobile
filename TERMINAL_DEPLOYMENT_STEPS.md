# Terminal Deployment Steps

## 🖥️ Deploy Edge Functions from Your Computer Terminal

### Step 1: Open Terminal
- **Mac**: Press `Cmd + Space`, type "Terminal"
- **Windows**: Press `Win + R`, type "cmd"
- **Linux**: Press `Ctrl + Alt + T`

### Step 2: Navigate to Edge Functions Project
```bash
# Go to your Edge Functions project directory
cd /Users/aureliasusu/AuroraNotesEdgeFunctions
```

### Step 3: Install Supabase CLI (if not installed)
```bash
# Install Supabase CLI
brew install supabase/tap/supabase
```

### Step 4: Login to Supabase
```bash
# Login to your Supabase account
supabase login
```
- This will open a browser window
- Login with your Supabase account
- Return to terminal when done

### Step 5: Link to Your Project
```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref
```
- Replace `your-project-ref` with your actual project reference
- You can find this in Supabase Dashboard URL

### Step 6: Deploy Functions
```bash
# Deploy all Edge Functions
supabase functions deploy
```

### Step 7: Verify Deployment
```bash
# Check deployed functions
supabase functions list
```

## 🔍 How to Find Your Project Reference

### Method 1: From Supabase Dashboard URL
1. Go to https://supabase.com/dashboard
2. Select your project
3. Look at the URL: `https://supabase.com/dashboard/project/your-project-ref`
4. Copy the `your-project-ref` part

### Method 2: From Project Settings
1. In Supabase Dashboard, go to Settings → General
2. Find "Reference ID"
3. Copy the reference ID

## 📱 What Happens After Deployment?

### 1. Functions are Deployed to Supabase Cloud
- Your functions run on Supabase servers
- They're accessible via HTTPS URLs
- They can be called from your mobile app

### 2. Function URLs
```
https://your-project-ref.supabase.co/functions/v1/get-weather
https://your-project-ref.supabase.co/functions/v1/translate-text
https://your-project-ref.supabase.co/functions/v1/get-news
```

### 3. Mobile App Calls These URLs
- Your mobile app calls these URLs
- Functions execute on Supabase servers
- Results are returned to your mobile app

## 🎯 Summary

**Deployment Process:**
1. ✅ **Terminal**: Run commands in your computer terminal
2. ✅ **Supabase CLI**: Use command line tool
3. ✅ **Cloud**: Functions deployed to Supabase cloud
4. ✅ **Mobile**: App calls cloud functions

**Not in Browser:**
- ❌ **Can't deploy from Supabase Dashboard**
- ❌ **Must use terminal/command line**
- ✅ **Can view and manage after deployment**

# AuroraNotes Mobile - Deployment Guide

## 🚀 Quick Start

### 1. Deploy Edge Functions
```bash
# Navigate to Edge Functions project
cd ../AuroraNotesEdgeFunctions

# Login to Supabase
supabase login

# Link to your project (replace with your project reference)
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy
```

### 2. Set Environment Variables
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Edge Functions** → **Settings**
4. Add these environment variables:
   ```
   WEATHER_API_KEY=your_openweathermap_api_key
   NEWS_API_KEY=your_newsapi_key
   OPENAI_API_KEY=your_openai_api_key
   ```

### 3. Configure Supabase Storage
1. In Supabase Dashboard, go to **Storage**
2. Click **"New Bucket"**
3. Name: `note-attachments`
4. Public: `true`
5. File size limit: `50MB`

### 4. Install Mobile Dependencies
```bash
# Back to mobile project
cd ../AuroraNotesMobile

# Install dependencies
npm install react-native-image-picker react-native-document-picker @react-native-async-storage/async-storage
```

### 5. Configure Permissions

#### iOS (ios/AuroraNotesMobile/Info.plist)
```xml
<key>NSCameraUsageDescription</key>
<string>AuroraNotes needs access to your camera to take photos for notes</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>AuroraNotes needs access to your photo library to select images for notes</string>
<key>NSDocumentPickerUsageDescription</key>
<string>AuroraNotes needs access to your documents to attach files to notes</string>
```

#### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.INTERNET" />
```

## 🔑 Get API Keys

### Weather API (OpenWeatherMap)
1. Go to https://openweathermap.org/api
2. Click "Sign Up"
3. Verify email
4. Get API key

### News API (NewsAPI)
1. Go to https://newsapi.org/
2. Click "Get API Key"
3. Verify email
4. Get API key

### OpenAI API (Optional)
1. Go to https://platform.openai.com/
2. Create account
3. Add payment method
4. Get API key

## ✅ Test Your Setup

### Test Edge Functions
```bash
# Test weather function
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/get-weather' \
  -H 'Authorization: Bearer your-anon-key' \
  -H 'Content-Type: application/json' \
  -d '{"lat": 40.7128, "lon": -74.0060}'
```

### Test Mobile App
```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 🎯 What You Get

After deployment, your app will have:
- ✅ AI note analysis
- ✅ File upload to Supabase Storage
- ✅ Weather information
- ✅ News search
- ✅ Text translation
- ✅ Complete note management

## 🆘 Troubleshooting

### Edge Functions not working?
- Check environment variables in Supabase Dashboard
- Verify API keys are correct
- Check function logs in Supabase Dashboard

### File upload not working?
- Verify Storage bucket is created
- Check bucket permissions
- Verify mobile permissions are configured

### API calls failing?
- Check network connection
- Verify API keys are valid
- Check function logs for errors

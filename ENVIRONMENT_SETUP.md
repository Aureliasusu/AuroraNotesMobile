# Environment Variables Setup

## 1. Create .env file in project root

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://xnxvcofyvhifecmxeruk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InnueHZjb2Z5dmhpZmVjbXhlcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDA2ODQsImV4cCI6MjA3MjI3NjY4NH0.GSwPnbroXL1Z1fSCh-ObDl5CZZe4ZIp9eOXPA_svL5Y

# Third-party API Keys (for direct calls)
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_news_api_key_here
MYMEMORY_API_KEY=your_mymemory_api_key_here

# OpenAI API Key (for Edge Functions)
OPENAI_API_KEY=your_openai_api_key_here
```

## 2. Supabase Dashboard Environment Variables

For Edge Functions, configure these in Supabase Dashboard:

1. Go to Supabase Dashboard
2. Select your project
3. Go to Settings → Edge Functions
4. Add these environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_URL`: https://xnxvcofyvhifecmxeruk.supabase.co
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 3. API Keys Setup

### OpenWeatherMap API
1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Get your API key
4. Add to `.env` file

### NewsAPI
1. Go to https://newsapi.org/
2. Sign up for free account
3. Get your API key
4. Add to `.env` file

### MyMemory Translation API
1. Go to https://mymemory.translated.net/
2. Sign up for free account
3. Get your API key
4. Add to `.env` file

### OpenAI API
1. Go to https://platform.openai.com/
2. Sign up for account
3. Get your API key
4. Add to both `.env` and Supabase Dashboard

## 4. Install react-native-dotenv

```bash
npm install react-native-dotenv
```

## 5. Configure babel.config.js

Add to babel.config.js:
```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
    }],
  ],
};
```

## 6. Usage in code

```typescript
import { SUPABASE_URL, OPENWEATHER_API_KEY } from '@env';

// Use environment variables
const apiUrl = `${SUPABASE_URL}/functions/v1/weather`;
```

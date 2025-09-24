# Environment Variables Setup

## 1. Create .env file in project root

Create a `.env` file in the root directory with the following variables:

```bash
# Supabase configuration
SUPABASE_URL=https://xnxvcofyvhifecmxeruk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InnueHZjb2Z5dmhpZmVjbXhlcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDA2ODQsImV4cCI6MjA3MjI3NjY4NH0.GSwPnbroXL1Z1fSCh-ObDl5CZZe4ZIp9eOXPA_svL5Y

# Third-party API keys (for direct calls)
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEWS_API_KEY=your_news_api_key_here
MYMEMORY_API_KEY=your_mymemory_api_key_here

# OpenAI API key (for edge functions)
OPENAI_API_KEY=your_openai_api_key_here
```

## 2. Supabase Dashboard Environment Variables

For edge functions, configure these in Supabase dashboard:

1. Go to Supabase dashboard
2. Select your project
3. Go to Settings → Edge Functions
4. Add these environment variables:
   - `OPENAI_API_KEY` for OpenAI key
   - `SUPABASE_URL` https://xnxvcofyvhifecmxeruk.supabase.co
   - `SUPABASE_ANON_KEY` for Supabase anonymous key

## 3. API Keys Setup

### OpenWeatherMap
1. Go to https://openweathermap.org/api
2. Sign Up for account
3. Get your API key
4. Add to `.env` file

### NewsAPI
1. Go to https://newsapi.org/
2. Sign Up for account
3. Get your API key
4. Add to `.env` file

### MyMemory Translation
1. Go to https://mymemory.translated.net/
2. Sign Up for account
3. Get your API key
4. Add to `.env` file

### OpenAI
1. Go to https://platform.openai.com/
2. Sign Up for account
3. Get your API key
4. Add to both `.env` and Supabase dashboard

## 4. Install react-native-dotenv

```bash
npm install react-native-dotenv
```

## 5. Configure babel.config.js

Add to babel.config.js:
```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
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
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'

// Use environment variables
const apiUrl = `${SUPABASE_URL}/functions/v1/weather`
```
# 第三方 API 服务详解

## 🌐 各种服务的实现方式

### 1. 翻译服务 - 使用免费 API
```typescript
// 使用 MyMemory 免费翻译 API
export class TranslationService {
  private static readonly API_URL = 'https://api.mymemory.translated.net/get';

  static async translateText(text: string, targetLang: string = 'en'): Promise<string> {
    const response = await fetch(
      `${this.API_URL}?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`
    );
    const data = await response.json();
    return data.responseData?.translatedText || text;
  }
}
```

### 2. 天气服务 - 使用 OpenWeatherMap API
```typescript
// 需要注册获取免费 API Key
export class WeatherService {
  private static readonly API_URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly API_KEY = process.env.WEATHER_API_KEY;

  static async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );
    return await response.json();
  }
}
```

### 3. 新闻服务 - 使用 NewsAPI
```typescript
// 需要注册获取免费 API Key
export class NewsService {
  private static readonly API_URL = 'https://newsapi.org/v2';
  private static readonly API_KEY = process.env.NEWS_API_KEY;

  static async getNews(query: string, language: string = 'en'): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/everything?q=${encodeURIComponent(query)}&language=${language}&apiKey=${this.API_KEY}`
    );
    return await response.json();
  }
}
```

### 4. AI 分析服务 - 使用 OpenAI API
```typescript
// 需要付费 OpenAI API Key
export class OpenAIService {
  private static readonly API_URL = 'https://api.openai.com/v1';
  private static readonly API_KEY = process.env.OPENAI_API_KEY;

  static async generateSummary(text: string): Promise<string> {
    const response = await fetch(`${this.API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Unable to generate summary';
  }
}
```

## 🔑 API Key 获取方式

### 1. 翻译服务 (免费)
- **MyMemory API**: 无需注册，直接使用
- **限制**: 每天 1000 次请求
- **备用**: Google Translate API (需要注册)

### 2. 天气服务 (免费)
- **OpenWeatherMap**: https://openweathermap.org/api
- **注册**: 免费账户
- **限制**: 每天 1000 次请求
- **备用**: WeatherAPI, AccuWeather

### 3. 新闻服务 (免费)
- **NewsAPI**: https://newsapi.org/
- **注册**: 免费账户
- **限制**: 每天 1000 次请求
- **备用**: Guardian API, NYTimes API

### 4. AI 服务 (付费)
- **OpenAI**: https://platform.openai.com/
- **注册**: 需要信用卡
- **价格**: $0.002/1K tokens
- **备用**: Anthropic Claude, Google Gemini

## 💰 成本对比

| 服务 | 免费额度 | 付费价格 | 推荐度 |
|------|----------|----------|--------|
| 翻译 | 1000次/天 | 免费 | ⭐⭐⭐⭐⭐ |
| 天气 | 1000次/天 | 免费 | ⭐⭐⭐⭐⭐ |
| 新闻 | 1000次/天 | 免费 | ⭐⭐⭐⭐⭐ |
| AI分析 | 无 | $0.002/1K tokens | ⭐⭐⭐ |

## 🚀 实现建议

### 1. 优先使用免费服务
```typescript
// 翻译 - 使用免费 API
const translated = await TranslationService.translateText('Hello', 'es');

// 天气 - 使用免费 API
const weather = await WeatherService.getCurrentWeather(40.7128, -74.0060);

// 新闻 - 使用免费 API
const news = await NewsService.getNews('technology');
```

### 2. AI 服务按需使用
```typescript
// 只在用户明确请求时使用付费 AI 服务
const handleAIAnalysis = async () => {
  if (userWantsAIAnalysis) {
    const summary = await OpenAIService.generateSummary(content);
    // 使用 AI 分析结果
  } else {
    // 使用简单的本地分析
    const summary = generateSimpleSummary(content);
  }
};
```

### 3. 降级策略
```typescript
// 如果付费服务失败，降级到免费服务
const getSummary = async (text: string) => {
  try {
    // 尝试使用 OpenAI
    return await OpenAIService.generateSummary(text);
  } catch (error) {
    // 降级到简单分析
    return generateSimpleSummary(text);
  }
};
```

## 📱 移动端集成

### 1. 环境变量配置
```bash
# .env
WEATHER_API_KEY=your_weather_api_key
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_api_key  # 可选
```

### 2. 服务调用
```typescript
// 在移动端组件中
const { translateText, getCurrentWeather, getNews } = useThirdPartyAPIs();

// 翻译文本
const translated = await translateText('Hello world', 'es');

// 获取天气
const weather = await getCurrentWeather(latitude, longitude);

// 获取新闻
const news = await getNews('technology');
```

## 🎯 总结

**不是所有服务都使用 OpenAI！**
- **翻译**: 免费 API (MyMemory)
- **天气**: 免费 API (OpenWeatherMap)
- **新闻**: 免费 API (NewsAPI)
- **AI分析**: 付费 API (OpenAI) - 可选

**建议**: 先实现免费服务，AI 功能作为高级特性！

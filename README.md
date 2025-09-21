# Aurora Notes Mobile 📱

> AI-Powered Cross-Platform Note-Taking App with Advanced Features

[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 What is Aurora Notes Mobile?

Aurora Notes Mobile is a **modern, AI-powered note-taking application** built with React Native that runs on both iOS and Android. It's designed to be your intelligent digital companion for capturing, organizing, and enhancing your thoughts and ideas.

### 🌟 Key Highlights

- **🤖 AI-Powered**: Smart note analysis, summarization, and tag suggestions
- **📁 File Management**: Upload images, documents, and multimedia attachments
- **🌐 Real-time Sync**: Cloud synchronization across all your devices
- **🔍 Advanced Search**: Find notes instantly with intelligent search
- **🎨 Beautiful UI**: Modern, intuitive interface designed for productivity
- **🔒 Secure**: End-to-end encryption and secure cloud storage

## ✨ Features

### Core Functionality
- **📝 Rich Text Editor**: Create and edit notes with formatting options
- **🏷️ Smart Tagging**: AI-powered tag suggestions based on content
- **📌 Pin Notes**: Keep important notes easily accessible
- **🔍 Search & Filter**: Find notes by content, tags, or date
- **☁️ Cloud Sync**: Automatic synchronization with Supabase backend

### AI Features
- **📊 Content Analysis**: Get insights about your note content
- **📋 Auto-Summarization**: Generate summaries of long notes
- **🏷️ Smart Tags**: AI suggests relevant tags for better organization
- **🔗 Similar Notes**: Discover related content automatically

### File Management
- **📷 Image Upload**: Take photos or select from gallery
- **📄 Document Support**: Upload PDFs, Word docs, and more
- **☁️ Cloud Storage**: Secure file storage with Supabase Storage
- **🔗 Link Integration**: Embed file links directly in notes

### Third-Party Integrations
- **🌤️ Weather Data**: Add current weather to your notes
- **🌍 Translation**: Translate text between multiple languages
- **📰 News Integration**: Search and reference relevant news articles

## 🏗️ Technical Architecture

### Frontend (Mobile App)
- **React Native 0.81** - Cross-platform mobile development
- **TypeScript** - Type-safe development
- **React Navigation** - Screen navigation
- **Zustand** - State management
- **React Native Vector Icons** - Icon library

### Backend Services
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Edge Functions for AI processing
  - Cloud Storage for files

### AI & External APIs
- **OpenAI GPT** - Content analysis and summarization
- **OpenWeatherMap** - Weather data
- **MyMemory** - Translation services
- **NewsAPI** - News articles

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aureliasusu/AuroraNotesMobile.git
   cd AuroraNotesMobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your API keys
   # SUPABASE_URL=your_supabase_url
   # SUPABASE_ANON_KEY=your_supabase_anon_key
   # OPENAI_API_KEY=your_openai_api_key
   ```

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 📱 Screenshots

*Screenshots coming soon - showcasing the beautiful UI and user experience*

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   └── ui/             # Basic UI elements (Button, Input, etc.)
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   └── notes/          # Note-related screens
├── hooks/              # Custom React hooks
├── services/           # API and external service integrations
├── store/              # State management (Zustand)
├── types/              # TypeScript type definitions
└── lib/                # Utility libraries and configurations
```

### Key Technologies
- **React Native**: Cross-platform mobile framework
- **TypeScript**: Static type checking
- **Supabase**: Backend services and database
- **React Navigation**: Screen navigation
- **Zustand**: Lightweight state management
- **React Native Image Picker**: File selection
- **React Native Document Picker**: Document handling

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up database tables (profiles, notes)
3. Configure Row Level Security policies
4. Deploy Edge Functions for AI features
5. Set up Storage buckets for file uploads

### API Keys Required
- **Supabase**: Project URL and anonymous key
- **OpenAI**: For AI-powered features
- **OpenWeatherMap**: For weather integration
- **NewsAPI**: For news features
- **MyMemory**: For translation services

## 📊 Performance

- **Fast Loading**: Optimized bundle size and lazy loading
- **Smooth Animations**: 60fps animations and transitions
- **Efficient Sync**: Real-time updates without performance impact
- **Memory Management**: Optimized for mobile devices

## 🔒 Security

- **End-to-End Encryption**: All data encrypted in transit and at rest
- **Row Level Security**: Database-level access control
- **Secure API Keys**: Server-side key management
- **User Authentication**: Secure login and session management

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for the amazing framework
- Supabase team for the excellent backend services
- OpenAI for AI capabilities
- All contributors and testers

## 📞 Contact

- **Developer**: [@aureliasusu](https://github.com/aureliasusu)
- **Project Link**: [https://github.com/aureliasusu/AuroraNotesMobile](https://github.com/aureliasusu/AuroraNotesMobile)
- **Issues**: [GitHub Issues](https://github.com/aureliasusu/AuroraNotesMobile/issues)

---

**Built with ❤️ using React Native and modern web technologies**

*Last updated: September 2024*
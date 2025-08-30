# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `expo start`
- **Run on iOS**: `npm run ios` or `expo start --ios`
- **Run on Android**: `npm run android` or `expo start --android`
- **Run on Web**: `npm run web` or `expo start --web`

## Project Architecture

This is a React Native mobile application built with Expo that provides route searching functionality for Kansai region bus/train routes. The app is written in TypeScript and targets iOS, Android, and web platforms.

### Key Dependencies
- **Expo ~53.0.22**: React Native development framework
- **React 19.0.0 / React Native 0.79.6**: Core framework with latest architecture
- **Zustand 5.0.8**: Lightweight state management library
- **TypeScript 5.8.3**: Type safety with strict mode enabled

### Project Structure
```
src/
├── components/
│   ├── header.tsx - Shared app header component
│   ├── tab-navigation.tsx - Tab navigation component
│   └── route-card.tsx - Individual route result display card
├── screens/
│   ├── route-search/
│   │   ├── route-search.view.tsx - Search form interface
│   │   └── use-route-search.view-model.ts - Search screen logic
│   └── route-results/
│       ├── route-results.view.tsx - Search results display
│       └── use-route-results.view-model.ts - Results screen logic
├── domain/
│   ├── entities/ - Domain entities (business objects)
│   └── value-objects/ - Domain value objects
├── types/
│   └── RouteData.ts - Route data interface definitions
AppViewModel.ts - Global app state management with Zustand
```

### Architecture Patterns
The app follows a **Clean Architecture** approach with clear separation of concerns:

1. **View Layer**: React Native components in `screens/` directories
2. **ViewModel Layer**: Custom hooks (`use-*.view-model.ts`) handle screen-specific logic
3. **Domain Layer**: Business entities and value objects in `domain/`
4. **State Management**: Global state via Zustand (`AppViewModel.ts`), local state via React hooks

### Component Architecture
1. **Screens**:
   - **RouteSearchScreen**: Japanese text inputs for departure (出発) and arrival (到着) locations with time selection and swap functionality
   - **RouteResultsScreen**: Route cards display with time navigation and advertisement placeholders

2. **Shared Components**:
   - **Header**: Application header with title
   - **TabNavigation**: Tab switching between route search and results
   - **RouteCard**: Route information display with time, duration, price, transfers, and color-coded transit line badges

3. **Main App** (`App.tsx`): Root component handling global navigation state and screen switching

### State Management
- **Global State**: Zustand store in `AppViewModel.ts` manages tab navigation state
- **Screen State**: Individual view-model hooks manage screen-specific state
- **Component State**: React's useState for local component state

### Type System
- **RouteData Interface**: Defines structure for route information including time, duration, price, transfers, and transit lines
- **Strict TypeScript**: Enabled in `tsconfig.json` for enhanced type safety
- **Expo TypeScript Base**: Extends Expo's TypeScript configuration

### Styling & Design
- React Native StyleSheet with platform-specific adaptations
- Japanese UI text throughout the application
- Material Design-inspired color scheme
- Platform-specific shadows (iOS) and elevation (Android)
- Responsive flexbox layouts

### Platform Configuration
- **iOS**: Full support with iPad compatibility enabled
- **Android**: Adaptive icon support with edge-to-edge display
- **Web**: Basic web support with custom favicon
- **New Architecture**: Expo's new architecture enabled for performance
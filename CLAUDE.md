# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `expo start`
- **Run on iOS**: `npm run ios` or `expo start --ios`
- **Run on Android**: `npm run android` or `expo start --android`
- **Run on Web**: `npm run web` or `expo start --web`

**Note**: There are no lint, test, or build commands configured in package.json. The project relies on Expo's built-in TypeScript checking and Metro bundler for development.

## Project Architecture

This is a React Native mobile application built with Expo that provides route searching functionality for Kansai region bus/train routes. The app is written in TypeScript and targets iOS, Android, and web platforms.

### Key Dependencies
- **Expo ~53.0.22**: React Native development framework with new architecture enabled
- **React 19.0.0 / React Native 0.79.5**: Core framework with latest architecture
- **Zustand 5.0.8**: Lightweight state management library
- **TypeScript 5.8.3**: Type safety with strict mode enabled
- **NativeWind 4.1.23**: Tailwind CSS for React Native styling
- **TailwindCSS 3.4.17**: Utility-first CSS framework

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
├── data/
│   ├── bus-duration.json - Travel time data by route and schedule
│   ├── bus-schedule.ts - Schedule management utilities
│   ├── bus-stop.json - Bus stop location data
│   ├── price-list.json - Fare information by route
│   └── time-schedule.json - Departure times by route
├── domain/
│   ├── entities/
│   │   └── route-result.entity.ts - Route result domain entity
│   └── value-objects/
│       └── bus-stop-kind.value-object.ts - Bus stop type definitions
├── store/
│   └── route-store.ts - Location selection state management
├── types/
│   └── RouteData.ts - Route data interface definitions
AppViewModel.ts - Global app state management with Zustand
```

### Architecture Patterns
The app follows a **Clean Architecture** approach with clear separation of concerns:

1. **View Layer**: React Native components in `screens/` directories with Japanese UI
2. **ViewModel Layer**: Custom hooks (`use-*.view-model.ts`) with complex business logic for route calculation
3. **Data Layer**: JSON-based data sources with dynamic schedule type determination
4. **Domain Layer**: Business entities and value objects in `domain/` following DDD principles
5. **State Management**: Multiple Zustand stores for different concerns (navigation, location selection)

### Component Architecture
1. **Screens**:
   - **RouteSearchScreen**: Japanese text inputs for departure (出発) and arrival (到着) locations with time selection and swap functionality
   - **RouteResultsScreen**: Route cards display with time navigation and advertisement placeholders

2. **Shared Components**:
   - **Header**: Application header with title
   - **TabNavigation**: Tab switching between route search and results
   - **RouteCard**: Route information display with time, duration, price, and congestion estimates
   - **ScrollableListModal**: Modal component for location selection with scrollable lists

3. **Main App** (`App.tsx`): Root component handling global navigation state and screen switching

### State Management
- **Global State**: 
  - `AppViewModel.ts`: Tab navigation state using Zustand
  - `src/store/route-store.ts`: Location selection state (departure/arrival)
- **Screen State**: Complex business logic in view-model hooks with JSON data integration
- **Component State**: React's useState for local UI state and modal management

### Type System
- **RouteData Interface**: Defines structure for route information including time, duration, price, transfers, and transit lines
- **Strict TypeScript**: Enabled in `tsconfig.json` for enhanced type safety
- **Expo TypeScript Base**: Extends Expo's TypeScript configuration

### Styling & Design
- **NativeWind**: Tailwind CSS classes for React Native components
- **Configuration**: Tailwind config in `tailwind.config.js` with NativeWind preset
- **Global Styles**: Base Tailwind directives in `global.css`
- **Metro Integration**: NativeWind Metro plugin configured for CSS processing
- **Japanese UI**: All interface text in Japanese (出発/到着 for departure/arrival)
- Platform-specific shadows (iOS) and elevation (Android) via Tailwind classes
- Responsive flexbox layouts using Tailwind utilities

### Platform Configuration
- **iOS**: Full support with iPad compatibility enabled
- **Android**: Adaptive icon support with edge-to-edge display
- **Web**: Basic web support with custom favicon
- **New Architecture**: Expo's new architecture enabled for performance

### Data Architecture
- **JSON Data Sources**: Route information loaded from JSON files in `src/data/`:
  - `bus-duration.json`: Travel time data by route and schedule type
  - `price-list.json`: Fare information by route and schedule type  
  - `time-schedule.json`: Departure times by route and schedule type
  - `bus-stop.json`: Bus stop location data
- **Schedule Types**: Dynamic schedule determination based on weekday/weekend and school periods
- **Real-time Logic**: Smart departure time calculation based on current time

### State Management Architecture
- **AppViewModel.ts**: Global tab navigation state using Zustand
- **RouteStore**: Departure/arrival location state in `src/store/route-store.ts`
- **Screen ViewModels**: Complex business logic in individual view-model hooks
- **State Flow**: Search form → JSON data lookup → Real-time calculation → Results display

## Build & Styling Configuration

### NativeWind Setup
- **Babel**: JSX import source configured for NativeWind in `babel.config.js`
- **Metro**: NativeWind Metro plugin processes `global.css` 
- **Content Paths**: Tailwind correctly configured to scan `./App.tsx`, `./src/**/*.{js,jsx,ts,tsx}`, and `./AppViewModel.ts`

### TypeScript Configuration
- Extends Expo's base TypeScript config
- Strict mode enabled for enhanced type safety
- No additional build or lint scripts configured
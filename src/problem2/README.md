# Currency Swap Application

A modern, responsive currency swap application built with Vue 3, TypeScript, and Tailwind CSS.

> Live demo [here](https://currency-swap-7jc56dhvh-sagsaggs-projects.vercel.app/)

## Features

- **Real-time Token Data**: Fetches token list from Switcheo's GitHub repository
- **Live Price Updates**: Gets current prices from the Switcheo API
- **Exchange Rate Calculation**: Automatically calculates exchange rates between tokens
- **Form Validation**: Comprehensive validation with user-friendly error messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Robust error boundaries and user feedback
- **Animations**: Smooth transitions and animations for enhanced user experience

## Tech Stack

- **Vue 3** with Composition API and `<script setup>` syntax
- **TypeScript** with strict typing
- **Tailwind CSS** for styling
- **Shadcn/vue** for UI components
- **VueUse** for composables and utilities
- **Axios** for API calls
- **Vite** for build tooling
- **Vitest** for testing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd src/problem2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Usage

1. **Select From Token**: Choose the token you want to swap from
2. **Enter Amount**: Input the amount you want to swap
3. **Select To Token**: Choose the token you want to receive
4. **Review Exchange Rate**: The app automatically calculates and displays the exchange rate
5. **Submit Swap**: Click the swap button to execute the transaction

## API Integration

- **Token Icons**: `https://github.com/Switcheo/token-icons/tree/main/tokens`
- **Price Data**: `https://interview.switcheo.com/prices.json`

## Architecture

The application follows Vue 3 best practices with:
- Composables for state management and business logic
- Strict TypeScript typing throughout
- Component-based architecture with single responsibility
- Comprehensive error handling and validation
- Responsive design with Tailwind CSS
- Modern UI components from Shadcn/vue

## Testing

Run tests with:
```bash
npm run test:unit
```
# Onstage

**Onstage** is a beautiful, plug-and-play onboarding modal for React applications. It provides a polished, step-by-step wizard experience with zero configuration required.

## Features

- 🎨 **Beautiful UI:** Polished design with smooth animations and responsive layout.
- 🔌 **Plug & Play:** Just pass your steps and it works.
- 📱 **Responsive:** Perfect on mobile and desktop.
- 🌑 **Dark Mode Ready:** Seamlessly adapts to your theme.
- 🧩 **Headless-ish:** Built on Radix UI for accessibility.

## Installation

```bash
npm install onstage
# or
pnpm add onstage
# or
yarn add onstage
```

## Usage

1. **Import the styles** in your root file (e.g., `main.tsx`, `App.tsx`):

```tsx
import "onstage/styles.css";
```

2. **Wrap your app (or component) with the Provider and place the Modal:**

```tsx
import { OnboardingProvider, OnboardingModal, type OnboardingStep } from "onstage";

const steps: OnboardingStep[] = [
  {
    title: "Welcome to KeyFinz",
    description: "Your journey to financial freedom starts here.",
    image: "/assets/welcome.png", // Or object: { mobile: '...', desktop: '...' }
  },
  {
    title: "Track Expenses",
    description: "Easily log your daily spending.",
    image: "/assets/track.png",
  },
];

function App() {
  const handleFinish = () => {
    console.log("Onboarding completed!");
    // Save to DB or localStorage
  };

  return (
    <OnboardingProvider 
      steps={steps} 
      defaultOpen={true} 
      onFinish={handleFinish}
    >
      <YourAppContent />
      <OnboardingModal />
    </OnboardingProvider>
  );
}
```

## API

### `OnboardingProvider`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `OnboardingStep[]` | **Required** | Array of steps to display. |
| `defaultOpen` | `boolean` | `false` | Whether the modal is open initially. |
| `onFinish` | `() => void` | `undefined` | Callback when user clicks "Get Started". |
| `onSkip` | `() => void` | `undefined` | Callback when user clicks "Skip". |

### `OnboardingStep` Interface

```typescript
interface OnboardingStep {
  title: string;
  description: string;
  image: string | { mobile: string; desktop: string };
}
```

## Customization

The styles are built with Tailwind CSS. You can override them using standard CSS or by importing the `styles.css` file and overriding the CSS variables:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... see styles.css for all variables */
}
```

## License

MIT

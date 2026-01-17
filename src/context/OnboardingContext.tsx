import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export interface OnboardingStep {
  title: string;
  description: string;
  image: string | { mobile: string; tablet?: string; desktop: string };
}

interface OnboardingContextValue {
  isOpen: boolean;
  currentStepIndex: number;
  steps: OnboardingStep[];
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  finishOnboarding: () => void;
  resetOnboarding: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

interface OnboardingProviderProps {
  children: ReactNode;
  steps: OnboardingStep[];
  defaultOpen?: boolean;
  onFinish?: () => void;
  onSkip?: () => void;
}

export function OnboardingProvider({
  children,
  steps,
  defaultOpen = false,
  onFinish,
  onSkip,
}: OnboardingProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const finishOnboarding = useCallback(() => {
    setIsOpen(false);
    onFinish?.();
  }, [onFinish]);

  const skipOnboarding = useCallback(() => {
    setIsOpen(false);
    onSkip?.();
  }, [onSkip]);

  const resetOnboarding = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      currentStepIndex,
      steps,
      nextStep,
      prevStep,
      skipOnboarding,
      finishOnboarding,
      resetOnboarding,
      setIsOpen,
    }),
    [
      isOpen,
      currentStepIndex,
      steps,
      nextStep,
      prevStep,
      skipOnboarding,
      finishOnboarding,
      resetOnboarding,
      setIsOpen,
    ]
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
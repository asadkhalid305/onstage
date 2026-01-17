import { CSSProperties, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useOnboarding } from "../context/OnboardingContext";
import { cn } from "../lib/utils";

// --- Types ---

export type OnboardingTheme = 
  | "light" 
  | "dark" 
  | "minimal" 
  | "glass" 
  | "midnight" 
  | "ocean" 
  | "sunset";

export interface OnboardingModalProps {
  /**
   * The aesthetic theme of the modal.
   */
  theme?: OnboardingTheme;
  
  /**
   * Controls the background gradient style.
   */
  gradient?: "animated" | "static" | "none";

  /**
   * Pass a custom Tailwind class for the gradient background.
   */
  customGradientClass?: string;

  /**
   * Inline styles to apply to the modal content.
   */
  style?: CSSProperties;

  /**
   * Additional class names for the modal container.
   */
  className?: string;

  /**
   * Target specific internal elements for styling.
   */
  classNames?: {
    overlay?: string;
    content?: string;
    imageContainer?: string;
    image?: string;
    header?: string;
    title?: string;
    description?: string;
    footer?: string;
    stepIndicators?: string;
    nextButton?: string;
    prevButton?: string;
    skipButton?: string;
    finishButton?: string;
  };

  /**
   * Target specific internal elements with inline styles.
   */
  styles?: {
    overlay?: CSSProperties;
    content?: CSSProperties;
    imageContainer?: CSSProperties;
    image?: CSSProperties;
    header?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    footer?: CSSProperties;
    stepIndicators?: CSSProperties;
    nextButton?: CSSProperties;
    prevButton?: CSSProperties;
    skipButton?: CSSProperties;
    finishButton?: CSSProperties;
  };
}

// --- Theme Configurations ---

type ThemeConfig = {
  mode: "light" | "dark"; 
  gradient: "animated" | "static" | "none";
  className?: string; 
  style?: CSSProperties; 
  classNames?: OnboardingModalProps['classNames']; 
};

const THEMES: Record<OnboardingTheme, ThemeConfig> = {
  light: {
    mode: "light",
    gradient: "animated",
  },
  dark: {
    mode: "dark",
    gradient: "animated",
  },
  minimal: {
    mode: "light",
    gradient: "none",
    className: "border-2 border-black shadow-none rounded-none sm:rounded-none",
    style: {
      "--radius": "0px",
      "--primary": "0 0% 0%", 
      "--primary-foreground": "0 0% 100%",
    } as CSSProperties,
    classNames: {
      nextButton: "rounded-none border-2 border-black hover:bg-black hover:text-white transition-none",
      prevButton: "rounded-none border-2 border-black hover:bg-black hover:text-white transition-none",
      skipButton: "hover:bg-transparent underline decoration-black underline-offset-4",
      stepIndicators: "rounded-none",
      imageContainer: "border-b-2 border-black",
      content: "rounded-none"
    }
  },
  glass: {
    mode: "dark",
    gradient: "animated",
    className: "bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl",
    style: {
      "--primary": "0 0% 100%",
      "--primary-foreground": "0 0% 0%",
      "--muted-foreground": "0 0% 80%",
    } as CSSProperties,
    classNames: {
      overlay: "bg-black/60 backdrop-blur-sm",
      nextButton: "bg-white/90 text-black hover:bg-white",
      prevButton: "border-white/20 hover:bg-white/10 text-white",
      skipButton: "text-white/60 hover:text-white",
      title: "text-white drop-shadow-md",
      description: "text-white/90 drop-shadow-sm"
    }
  },
  midnight: {
    mode: "dark",
    gradient: "animated",
    style: {
      "--background": "222 47% 11%", 
      "--foreground": "210 40% 98%",
      "--primary": "263 70% 50%", 
      "--primary-foreground": "210 40% 98%",
    } as CSSProperties,
    className: "border-indigo-500/30"
  },
  ocean: {
    mode: "light",
    gradient: "animated",
    style: {
      "--primary": "199 89% 48%", 
      "--primary-foreground": "0 0% 100%",
    } as CSSProperties,
    className: "border-cyan-200"
  },
  sunset: {
    mode: "light",
    gradient: "animated",
    style: {
      "--primary": "24 90% 60%", 
      "--primary-foreground": "0 0% 100%",
    } as CSSProperties,
    className: "border-orange-200"
  }
};

export function OnboardingModal({
  theme = "light",
  gradient, 
  customGradientClass,
  style,
  className,
  classNames = {},
  styles = {},
}: OnboardingModalProps) {
  const {
    isOpen,
    currentStepIndex,
    steps,
    nextStep,
    prevStep,
    skipOnboarding,
    finishOnboarding,
    setIsOpen,
  } = useOnboarding();

  if (!steps || steps.length === 0) return null;
  const currentStep = steps[currentStepIndex] || steps[0];
  
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // --- Theme Merging Logic ---
  const activeTheme = THEMES[theme] || THEMES.light;
  const finalGradient = gradient || activeTheme.gradient;
  const isDarkMode = activeTheme.mode === "dark";
  const mergedRootStyle = { ...activeTheme.style, ...style };

  const mergedClassNames = useMemo(() => {
    const themeClasses = activeTheme.classNames || {};
    return {
      overlay: cn(themeClasses.overlay, classNames.overlay),
      content: cn(themeClasses.content, classNames.content),
      imageContainer: cn(themeClasses.imageContainer, classNames.imageContainer),
      image: cn(themeClasses.image, classNames.image),
      header: cn(themeClasses.header, classNames.header),
      title: cn(themeClasses.title, classNames.title),
      description: cn(themeClasses.description, classNames.description),
      footer: cn(themeClasses.footer, classNames.footer),
      stepIndicators: cn(themeClasses.stepIndicators, classNames.stepIndicators),
      nextButton: cn(themeClasses.nextButton, classNames.nextButton),
      prevButton: cn(themeClasses.prevButton, classNames.prevButton),
      skipButton: cn(themeClasses.skipButton, classNames.skipButton),
      finishButton: cn(themeClasses.finishButton, classNames.finishButton),
    };
  }, [activeTheme, classNames]);

  if (!isOpen) return null;

  const showGradient = finalGradient !== "none";
  const defaultGradientClass = finalGradient === "animated" 
    ? "bg-gradient-to-br from-primary/30 via-background to-primary/30 animate-gradient-flow"
    : "bg-gradient-to-br from-primary/20 to-background"; 

  const finalGradientClass = customGradientClass || defaultGradientClass;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        style={{ ...mergedRootStyle, ...styles.content }}
        className={cn(
          isDarkMode && "dark",
          // Strict: [&>button]:hidden to hide any automatic close buttons
          "max-w-[95vw] sm:max-w-[1000px] p-0 overflow-hidden gap-0 z-[50001] [&>button]:hidden rounded-xl sm:rounded-lg",
          "bg-background text-foreground",
          activeTheme.className,
          className,
          mergedClassNames.content
        )}
        // Strict: Click outside and ESC disabled
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Step Image Area */}
        <div 
          className={cn(
            "w-full relative flex items-center justify-center overflow-hidden bg-background transition-all duration-300",
            "aspect-[4/5] sm:aspect-[4/3] lg:aspect-[16/9]",
            mergedClassNames.imageContainer
          )}
          style={styles.imageContainer}
        >
             {showGradient && (
               <div className={cn("absolute inset-0 z-0", finalGradientClass)} />
             )}
             
             {showGradient && finalGradient === "animated" && (
               <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.15),transparent_50%)] animate-pulse" />
             )}

             {typeof currentStep.image === 'string' ? (
               <img 
                 src={currentStep.image} 
                 alt={currentStep.title}
                 className={cn("object-contain w-full h-full relative z-10 drop-shadow-2xl", mergedClassNames.image)}
                 style={styles.image}
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
             ) : (
               <picture className={cn("w-full h-full relative z-10 flex items-center justify-center", mergedClassNames.image)} style={styles.image}>
                 <source media="(min-width: 1024px)" srcSet={currentStep.image.desktop} />
                 <source media="(min-width: 640px)" srcSet={currentStep.image.tablet || currentStep.image.desktop} />
                 <img 
                   src={currentStep.image.mobile} 
                   alt={currentStep.title}
                   className="object-contain w-full h-full drop-shadow-2xl"
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                   }}
                 />
               </picture>
             )}
        </div>

        <div className={cn("p-5 sm:p-8", isDarkMode && "dark text-foreground")}>
          <div className="min-h-[100px] sm:min-h-[140px] flex flex-col justify-center">
            <DialogHeader className={cn("mb-0", mergedClassNames.header)} style={styles.header}>
              <DialogTitle 
                className={cn("text-2xl sm:text-3xl text-center mb-3 sm:mb-4", mergedClassNames.title)}
                style={styles.title}
              >
                {currentStep.title}
              </DialogTitle>
              <DialogDescription 
                className={cn("text-center text-base sm:text-lg max-w-[95%] sm:max-w-[80%] mx-auto", mergedClassNames.description)}
                style={styles.description}
              >
                {currentStep.description.split("**").map((part, index) => (
                  index % 2 === 1 ? (
                    <span key={index} className="text-primary font-bold">{part}</span>
                  ) : (
                    <span key={index}>{part}</span>
                  )
                ))}
              </DialogDescription>
            </DialogHeader>
          </div>

          <DialogFooter 
            className={cn("relative flex flex-col gap-4 sm:block mt-4 sm:mt-6", mergedClassNames.footer)}
            style={styles.footer}
          >
            <div 
              className={cn("w-full flex justify-center sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-auto", mergedClassNames.stepIndicators)}
              style={styles.stepIndicators}
            >
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-colors duration-300 mx-1",
                    index === currentStepIndex
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            
             <div className="flex w-full justify-between items-center relative z-10 box-border">
               <Button
                  variant="ghost"
                  size="lg"
                  onClick={skipOnboarding}
                  className={cn("text-muted-foreground hover:text-foreground text-sm sm:text-base px-2 sm:px-4", mergedClassNames.skipButton)}
                  style={styles.skipButton}
                >
                  Skip
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={cn(
                      isFirstStep && "invisible", 
                      "text-sm sm:text-base px-3 sm:px-6",
                      mergedClassNames.prevButton
                    )}
                    style={styles.prevButton}
                  >
                    Back
                  </Button>
                  
                  {isLastStep ? (
                    <Button 
                      onClick={finishOnboarding} 
                      size="lg" 
                      className={cn("bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base px-4 sm:px-8", mergedClassNames.finishButton)}
                      style={styles.finishButton}
                    >
                      Get Started
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextStep} 
                      size="lg" 
                      className={cn("text-sm sm:text-base px-4 sm:px-8", mergedClassNames.nextButton)}
                      style={styles.nextButton}
                    >
                      Next
                    </Button>
                  )}
                </div>
             </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
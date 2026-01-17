import { CSSProperties } from "react";
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

export interface OnboardingModalProps {
  /**
   * Forces the modal to render in a specific theme.
   * If not set, it follows the system/parent preference.
   */
  theme?: "light" | "dark";
  
  /**
   * Controls the background gradient style.
   * @default "animated"
   */
  gradient?: "animated" | "static" | "none";

  /**
   * Pass a custom Tailwind class for the gradient background.
   * Overrides the `gradient` prop if set.
   * Example: "bg-gradient-to-r from-pink-500 to-violet-500"
   */
  customGradientClass?: string;

  /**
   * Inline styles to apply to the modal content.
   * Useful for overriding CSS variables without a global stylesheet.
   * Example: { '--primary': '262 80% 50%', '--radius': '1rem' }
   */
  style?: CSSProperties;

  /**
   * Additional class names for the modal container.
   */
  className?: string;
}

export function OnboardingModal({
  theme,
  gradient = "animated",
  customGradientClass,
  style,
  className,
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

  // Safety check if steps are empty or index is out of bounds
  if (!steps || steps.length === 0) return null;
  const currentStep = steps[currentStepIndex] || steps[0];
  
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  if (!isOpen) return null;

  // Resolve Gradient Logic
  const showGradient = gradient !== "none";
  const defaultGradientClass = gradient === "animated" 
    ? "bg-gradient-to-br from-primary/30 via-background to-primary/30 animate-gradient-flow"
    : "bg-gradient-to-br from-primary/20 to-background"; // Static fallback

  const finalGradientClass = customGradientClass || defaultGradientClass;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        style={style} // Apply inline styles (variables) here
        className={cn(
          // Theme Class (forces dark mode if prop is set)
          theme === "dark" && "dark",
          // Base Styles
          "max-w-[95vw] sm:max-w-[1000px] p-0 overflow-hidden gap-0 z-[50001] [&>button]:hidden rounded-xl sm:rounded-lg",
          "bg-background text-foreground", // Ensure tokens apply
          className
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Step Image Area */}
        <div className="w-full h-[600px] relative flex items-center justify-center overflow-hidden bg-background transition-all duration-300">
             
             {/* Gradient Layer */}
             {showGradient && (
               <div className={cn("absolute inset-0 z-0", finalGradientClass)} />
             )}
             
             {/* Secondary subtle glow (only if gradient is on) */}
             {showGradient && gradient === "animated" && (
               <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.15),transparent_50%)] animate-pulse" />
             )}

             {/* Main Image Layer */}
             {typeof currentStep.image === 'string' ? (
               <img 
                 src={currentStep.image} 
                 alt={currentStep.title}
                 className="object-contain w-full h-full relative z-10 drop-shadow-2xl"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
             ) : (
               <picture className="w-full h-full relative z-10 flex items-center justify-center">
                 <source media="(min-width: 640px)" srcSet={currentStep.image.desktop} />
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

        {/* Content Area */}
        <div className={cn("p-5 sm:p-8", theme === "dark" && "dark text-foreground")}>
          <div className="min-h-[100px] sm:min-h-[140px] flex flex-col justify-center">
            <DialogHeader className="mb-0">
              <DialogTitle className="text-2xl sm:text-3xl text-center mb-3 sm:mb-4">
                {currentStep.title}
              </DialogTitle>
              <DialogDescription className="text-center text-base sm:text-lg max-w-[95%] sm:max-w-[80%] mx-auto">
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

          <DialogFooter className="relative flex flex-col gap-4 sm:block mt-4 sm:mt-6">
            {/* Stepper */}
            <div className="w-full flex justify-center sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-auto">
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
            
             {/* Buttons */}
             <div className="flex w-full justify-between items-center relative z-10 box-border">
               <Button
                  variant="ghost"
                  size="lg"
                  onClick={skipOnboarding}
                  className="text-muted-foreground hover:text-foreground text-sm sm:text-base px-2 sm:px-4"
                >
                  Skip
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={prevStep}
                    disabled={isFirstStep}
                    className={cn(isFirstStep && "invisible", "text-sm sm:text-base px-3 sm:px-6")}
                  >
                    Back
                  </Button>
                  
                  {isLastStep ? (
                    <Button onClick={finishOnboarding} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base px-4 sm:px-8">
                      Get Started
                    </Button>
                  ) : (
                    <Button onClick={nextStep} size="lg" className="text-sm sm:text-base px-4 sm:px-8">
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
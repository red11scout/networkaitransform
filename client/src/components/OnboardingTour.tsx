import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import '../styles/driver-custom.css';
import { Button } from './ui/button';
import { HelpCircle } from 'lucide-react';

const TOUR_COMPLETED_KEY = 'blueally-tour-completed';

export function OnboardingTour() {
  const [showTourButton, setShowTourButton] = useState(true);

  useEffect(() => {
    // Check if user has completed the tour
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    
    // Auto-start tour for first-time users after a short delay
    if (!tourCompleted) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startTour = () => {
    const driverObj = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      steps: [
        {
          element: 'header',
          popover: {
            title: 'Welcome to BlueAlly AI Transformation Dashboard',
            description: 'This dashboard provides comprehensive financial analysis for 14 AI use cases. Let\'s take a quick tour to help you get started.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[role="tablist"]',
          popover: {
            title: '5 Core Sections',
            description: 'Navigate through Overview, Analysis, Planning, Scenarios, and Insights. Each section contains related information organized logically.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-state="active"]',
          popover: {
            title: 'Overview Section',
            description: 'Start here for executive summary and problem-solution mapping. Perfect for stakeholder presentations and quick insights.',
            side: 'bottom',
            align: 'start'
          }
        },
        {
          element: '.grid.grid-cols-2.md\\:grid-cols-3',
          popover: {
            title: 'Key Metrics',
            description: '$15.70M annual value, 4.5% ROI across 14 use cases. These metrics are calculated in real-time using HyperFormula for 100% accuracy.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          popover: {
            title: 'Analysis Section',
            description: 'Click "Analysis" to explore use cases, financial projections, and cost breakdowns. Use filters to narrow down specific horizons or value ranges.'
          }
        },
        {
          popover: {
            title: 'Planning Tools',
            description: 'The Planning section includes implementation roadmap, priority matrix (drag-and-drop!), and sensitivity analysis for strategic planning.'
          }
        },
        {
          popover: {
            title: 'Scenario Builder',
            description: 'Create custom scenarios by adjusting assumptions, save them to your account, and compare multiple scenarios side-by-side. Sign in to unlock this feature.'
          }
        },
        {
          popover: {
            title: 'Insights & Help',
            description: 'View detailed calculations, methodology, and usage tips in the Insights section. All calculations are transparent and deterministic.'
          }
        },
        {
          element: 'button[aria-label="Toggle theme"]',
          popover: {
            title: 'Dark Mode',
            description: 'Toggle between light and dark themes for comfortable viewing in any environment.',
            side: 'left',
            align: 'center'
          }
        },
        {
          popover: {
            title: 'You\'re All Set!',
            description: 'Explore the dashboard at your own pace. Click the help icon (?) in the header anytime to restart this tour. Happy analyzing!'
          }
        }
      ],
      onDestroyStarted: () => {
        // Mark tour as completed
        localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
        driverObj.destroy();
      }
    });

    driverObj.drive();
  };

  if (!showTourButton) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startTour}
      className="rounded-full"
      title="Take a tour"
      aria-label="Take a tour"
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
}

export function resetTour() {
  localStorage.removeItem(TOUR_COMPLETED_KEY);
}

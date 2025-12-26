# BlueAlly AI Transformation Dashboard - TODO

## Export & Reporting
- [ ] Implement Excel export for scenarios and financial data
- [ ] Implement PDF export for executive reports
- [ ] Add customizable report templates
- [ ] Create branded export with BlueAlly logos

## Scenario Templates
- [ ] Create Conservative scenario template
- [ ] Create Aggressive scenario template
- [ ] Create Realistic scenario template
- [ ] Add template selection UI in scenario builder

## Team Collaboration
- [ ] Add scenario sharing functionality
- [ ] Implement commenting system on scenarios
- [ ] Add team member permissions (view/edit)
- [ ] Create activity feed for scenario changes

## Branding Improvements
- [x] Remove Branding Settings tab
- [x] Apply BlueAlly circular logo to header
- [x] Apply BlueAlly full logo to appropriate sections
- [x] Ensure consistent brand colors throughout
- [x] Remove "made with manus" footer

## Application Consolidation & Redesign
- [ ] Analyze current 13 tabs and identify redundancies
- [ ] Design new 5-6 section information architecture
- [ ] Consolidate Executive, Problems, and Use Cases into Overview section
- [ ] Nest Financial, Costs, and Roadmap into Analysis section
- [ ] Combine Priority Matrix, Scenarios, and Sensitivity into Planning section
- [ ] Create nested navigation with expandable sections
- [ ] Remove duplicate content across tabs

## HyperFormula Integration
- [ ] Migrate all financial calculations to HyperFormula
- [ ] Migrate ROI calculations to HyperFormula
- [ ] Migrate sensitivity analysis to HyperFormula
- [ ] Migrate cost breakdown calculations to HyperFormula
- [ ] Add calculation verification tests
- [ ] Ensure 100% deterministic calculations

## Navigation & User Experience
- [ ] Add onboarding tour for first-time users
- [ ] Implement contextual tooltips on key metrics
- [ ] Add help icons with explanations
- [ ] Create quick navigation sidebar
- [ ] Add breadcrumb navigation
- [ ] Implement search functionality
- [ ] Add keyboard shortcuts guide

## UI/UX Improvements
- [ ] Simplify navigation structure
- [ ] Add collapsible sections for nested content
- [ ] Implement progressive disclosure patterns
- [ ] Add loading states and skeleton screens
- [ ] Improve mobile navigation with bottom tabs
- [ ] Add quick action floating button on mobile
- [ ] Implement smooth scroll and anchor links

## Testing & Validation
- [ ] Test all export functionality
- [ ] Validate all HyperFormula calculations
- [ ] Test collaboration features
- [ ] Verify mobile responsiveness
- [ ] Test onboarding flow
- [ ] Validate scenario templates


## Dashboard Polish & Refinements
- [x] Remove decimals from all numbers (currency, percentages, metrics)
- [x] Remove hover backgrounds on chart bars and slices
- [x] Add readable labels directly on chart bars
- [x] Change application title to "Verizon AI Transformation"
- [x] Update footer year to 2026
- [x] Fix BlueAlly logo positioning in header
- [x] Verify scenario saving works correctly with user authentication
- [x] Test and optimize mobile experience without impacting desktop


## Critical Bug Fixes
- [x] Remove grey hover box from all bar charts completely
- [x] Fix ROI display in header (should show 448% not 4%)
- [x] Move BlueAlly logo to far left of header with better positioning
- [x] Fix onboarding guide transparency for better readability
- [x] Fix Comparison tab instructions (remove reference to non-existent Use Case Explorer)
- [x] Ensure use case selection works in Comparison tab


## Data Consistency & Uniformity
- [x] Audit all financial metrics (ROI, Payback Period, NPV, Annual Value) across all screens
- [x] Identify inconsistencies in data sources between components
- [x] Create single unified source of truth for all financial calculations
- [x] Update header metrics to use unified source
- [x] Update Executive Overview to use unified source
- [x] Update Financial Projections to use unified source
- [x] Update Cost Breakdown to use unified source (already using costBreakdownData)
- [x] Update all other components displaying financial data
- [x] Verify all non-scenario data shows identical values across all screens


## UI Cleanup
- [x] Remove onboarding tour component (question mark button and guided navigation)
- [x] Remove OnboardingTour component from Home.tsx
- [x] Remove question mark button from header
- [x] Clean up unused OnboardingTour component file


## Payback Period Explanation Tooltip
- [x] Create PaybackTooltip component with calculation methodology explanation
- [x] Add tooltip to Executive Summary payback period
- [x] Add tooltip to Financial Projections payback period
- [x] Add tooltip to Cost Analysis payback period displays
- [x] Test tooltip functionality across all screens


## UI Enhancements
- [x] Add color to use case comparison bar chart
- [x] Create KPI breakdown dialog component
- [x] Make "42 KPI Improvements" clickable in Problem Solution section
- [x] Connect KPI card to breakdown dialog
- [x] Test both features

## KPI Count Correction
- [x] Update Problem Solution section KPI count from 42 to 14
- [x] Update KPI dialog title from 42 to 14
- [x] Update KPI dialog description to reflect accurate count


## Scenario Builder Financial Metrics Fix
- [x] Investigate ScenarioBuilder calculation logic (found: backend uses different base data and formulas)
- [x] Fix Annual Value to show $15.7M (updated BASE_USE_CASES to match frontend)
- [x] Fix NPV calculation (updated base data, now shows $42.4M with proper discounting)
- [x] Fix ROI to show correct percentage (fixed formula and display, now shows 359%)
- [x] Fix Payback Period (updated with correct investment and cash flows, now shows 2 months)
- [x] Ensure ScenarioBuilder uses unified calculation sources (aligned backend with frontend data)
- [x] Remove ROI division by 100 in ScenarioBuilder display


## Scenario Builder Metric Explanations
- [x] Create MetricExplanationTooltip component with info icon
- [x] Add tooltip to Annual Value card explaining calculation methodology
- [x] Add tooltip to NPV card explaining discount rate and time value of money
- [x] Add tooltip to ROI card explaining difference from dashboard 448% (scenario uses NPV-based calculation)
- [x] Add tooltip to Payback Period card explaining monthly cash flow calculation


## Scenario Comparison View
- [ ] Create ScenarioComparison component with side-by-side layout
- [ ] Add scenario selection dropdowns (compare 2-3 scenarios)
- [ ] Display metric differences with visual diff highlighting
- [ ] Add delta indicators (+/- values and percentages)
- [ ] Create comparison charts for key metrics
- [ ] Implement "Export Comparison" button

## PowerPoint Export
- [ ] Create export utility for generating PowerPoint presentations
- [ ] Design executive summary slide with key metrics
- [ ] Add financial projections slide with charts
- [ ] Include use case breakdown slides
- [ ] Add scenario comparison slide (if scenarios exist)
- [ ] Implement "Export to PowerPoint" button in header and scenario builder

## Implementation Roadmap Generator
- [ ] Create RoadmapView component with Gantt chart
- [ ] Calculate timeline based on selected use cases and time-to-value
- [ ] Implement dependency mapping between use cases
- [ ] Add resource allocation visualization
- [ ] Create milestone markers for key deliverables
- [ ] Add interactive timeline controls (zoom, filter by horizon)

## Executive Presentation
- [x] Gather all dashboard data for presentation content
- [x] Structure presentation outline with executive summary, financial analysis, use cases, roadmap
- [x] Create slide content with BlueAlly branding (colors, fonts, charts)
- [x] Generate presentation using slides tool with Alabaster template
- [x] Ensure all charts are native editable objects with linked data tables
- [x] Apply BlueAlly color palette and typography consistently

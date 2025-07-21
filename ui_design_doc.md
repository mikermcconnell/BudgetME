# Personal Budgeting Web App - UI Design Document

## Layout Structure

### Primary Layout Framework
- **Full-screen tab-based interface** with clean horizontal tab navigation at the top
- **Single-focus content area** below tabs that fills entire viewport
- **No split views or side panels** - each tab contains complete, self-contained experience
- **Persistent header** with app logo, user avatar, and settings access
- **Notification badges** on relevant tabs (Expenses, Budget) to indicate pending actions

### Tab Organization
1. **Dashboard** - Financial overview and key metrics
2. **Expenses** - Transaction management and categorization  
3. **Income** - Income tracking and management
4. **Budget** - Budget setup and monitoring
5. **Reports** - Data visualization and export tools

## Core Components

### Dashboard Tab
- **Hero metric card** prominently displaying current month's net income/expense
- **Quick status cards** in grid layout showing budget progress, recent uploads, spending alerts
- **Recent activity feed** with last 5-10 transactions
- **Upload prompt card** when statements are due

### Expenses Tab
- **Upload zone** at top with drag-drop functionality and file status
- **Transaction table** with inline editing, sorting, and filtering controls
- **Category management panel** that slides up from bottom when needed
- **Bulk action toolbar** for multiple transaction operations

### Income Tab
- **Add income button** prominently placed
- **Income summary cards** showing recurring vs one-time income
- **Simple list view** of income entries with edit/delete actions

### Budget Tab
- **Category budget cards** in grid layout with progress bars and spending indicators
- **Total budget summary** at top with month-to-month comparison
- **Quick budget setup wizard** for new users

### Reports Tab
- **Chart selection controls** at top (time period, chart type, categories)
- **Large visualization area** with interactive charts
- **Export controls** and data summary below charts

## Interaction Patterns

### Navigation Flow
- **Single-click tab switching** with smooth fade transitions
- **Contextual actions** appear within each tab's content area
- **Modal overlays** for complex forms (budget setup, transaction editing)
- **Bottom-sheet slide-ups** for quick actions (category assignment, notes)

### File Upload Process
- **Drag-and-drop visual feedback** with animated upload zone
- **Progress indicators** during file processing
- **Success/error states** with clear next-step guidance
- **Preview tables** before final transaction import

### Data Interaction
- **Hover states** on all interactive elements
- **Inline editing** for transaction details (click to edit)
- **Bulk selection** with checkboxes for multiple transactions
- **Quick filters** via dropdown and search bars

## Visual Design Elements & Color Scheme

### Color Palette (Mint-Inspired)
- **Primary Blue**: #0F73EE (navigation, primary actions)
- **Success Green**: #00C896 (positive balances, on-budget indicators)
- **Warning Orange**: #FF8C42 (approaching budget limits)
- **Alert Red**: #FF5A5A (over-budget, errors)
- **Neutral Gray**: #6B7280 (secondary text, borders)
- **Background**: #F9FAFB (main background)
- **Card White**: #FFFFFF (card backgrounds)

### Visual Elements
- **Rounded corners** (8px radius) on all cards and buttons
- **Subtle shadows** for card elevation and depth
- **Progress bars** with gradient fills and smooth animations
- **Icon system** using Heroicons or similar modern icon set
- **Card-based layout** with consistent 16px padding and 12px gaps

## Mobile, Web App, Desktop Considerations

### Desktop Primary (1200px+)
- **Optimized tab widths** with generous spacing
- **Grid layouts** utilizing full width (3-4 columns for cards)
- **Larger touch targets** while maintaining visual hierarchy
- **Keyboard shortcuts** for power users (tab navigation, quick actions)

### Tablet Adaptation (768px-1199px)
- **Responsive grid collapse** to 2-column layouts
- **Touch-optimized interactions** with larger buttons
- **Maintained tab structure** with adjusted spacing

### Mobile Considerations (320px-767px)
- **Tab navigation transforms** to bottom tab bar
- **Single-column layouts** for all content
- **Simplified data tables** with swipe actions
- **Collapsible sections** for better content organization
- **Mobile-first interactions** like swipe-to-delete

## Typography

### Font Stack
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Monospace**: 'SF Mono', Monaco, 'Cascadia Code', monospace (for currency amounts)

### Type Scale
- **Heading 1**: 32px, Semi-bold (main page titles)
- **Heading 2**: 24px, Semi-bold (section headers)
- **Heading 3**: 18px, Medium (card titles)
- **Body**: 16px, Regular (primary content)
- **Small**: 14px, Regular (secondary info, labels)
- **Caption**: 12px, Medium (metadata, timestamps)

### Currency Display
- **Large amounts**: 24px, Medium, monospace
- **Standard amounts**: 16px, Medium, monospace
- **Small amounts**: 14px, Regular, monospace

## Accessibility

### WCAG Compliance
- **Color contrast** minimum 4.5:1 for normal text, 3:1 for large text
- **Focus indicators** visible on all interactive elements
- **Alt text** for all meaningful images and icons
- **Semantic HTML** structure with proper heading hierarchy

### Keyboard Navigation
- **Tab order** follows logical content flow
- **Skip links** for main content areas
- **Keyboard shortcuts** documented and accessible
- **Modal trap focus** during overlay interactions

### Screen Reader Support
- **ARIA labels** for complex UI elements (charts, progress bars)
- **Live regions** for dynamic content updates (upload status, alerts)
- **Descriptive link text** and button labels
- **Table headers** properly associated with data cells

### Additional Considerations
- **Reduced motion** support via CSS prefers-reduced-motion
- **High contrast mode** compatibility
- **Zoom support** up to 200% without horizontal scrolling
- **Clear error messages** with specific guidance for resolution
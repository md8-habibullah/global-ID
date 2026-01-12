# Floating Contact Button Documentation

## Overview

The Floating Contact Button is a sleek, cyber-themed contact interface that appears as a fixed button in the bottom-right corner of your website. It provides quick access to all your contact information with a modern, tech-inspired design.

## Features

### 🎯 **Smart Positioning**
- Fixed position: `bottom: 24px, right: 24px`
- Responsive design that adapts to different screen sizes
- Never blocks important content

### 🎨 **Cyber-Tech Design**
- Matches your existing green accent theme (`#10b981` light, `#34d399` dark)
- Animated pulsing ring effect when closed
- Terminal-style typography with monospace fonts
- Smooth animations powered by Framer Motion

### 📱 **Contact Methods**
- **Email**: `hello@habibullah.dev` - Direct mailto link + copy to clipboard
- **WhatsApp**: `+880 1521-205602` - Opens WhatsApp chat + copy number
- **LinkedIn**: `md-habibullahs` - Opens LinkedIn profile
- **GitHub**: `md8-habibullah` - Opens GitHub profile
- **Facebook**: `md8.habibullah` - Opens Facebook profile

### ⚡ **User Experience**
- **Click to Open**: Reveals contact panel with all contact methods
- **Click to Close**: Tap button again or click outside to close
- **Copy Feature**: One-click copy for email and phone number
- **Direct Links**: Single click opens the respective platform
- **Toast Notifications**: Success feedback when copying information

## How It Works

### 1. **Button State**
- **Closed**: Shows "CONTACT" button with pulsing animation
- **Open**: Button stays highlighted, contact panel appears above it

### 2. **Contact Panel**
- **Header**: "CONTACT INFO" title with close button
- **Contact List**: Each contact method has:
  - Colored icon matching the platform
  - Platform name and handle/number
  - Copy button (for copyable items)
  - External link icon on hover
- **Footer**: "Ready to connect with you" status message

### 3. **Interactions**
- **Direct Click**: Opens the platform/app directly
- **Copy Click**: Copies information to clipboard with toast notification
- **Visual Feedback**: Hover effects, animations, and success states

## Technical Implementation

### Components Used
- `framer-motion` for smooth animations
- `lucide-react` for consistent icons
- `sonner` for toast notifications
- Custom CSS for cyber-themed styling

### Animation Details
- Entrance animation with spring physics
- Staggered list item animations
- Pulsing active indicator
- Smooth hover transitions

### Responsive Behavior
- Panel width: `320px` with `max-width: calc(100vw - 3rem)`
- Adapts to mobile screens gracefully
- Touch-friendly button sizes

## Customization

### Colors
The component automatically inherits your theme colors:
- Primary: `var(--primary)` 
- Background: `var(--background)`
- Text: `var(--foreground)`
- Muted text: `var(--muted-foreground)`

### Contact Information
To update contact details, edit the `contactList` array in `floating-contact.tsx`:

```typescript
const contactList = [
  {
    id: 1,
    label: "Email",
    value: "your@email.com",
    href: "mailto:your@email.com",
    icon: Mail,
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    hoverBg: "hover:bg-red-500/20",
    copyable: true,
  },
  // Add more contacts...
];
```

### Styling
Custom CSS classes in `globals.css`:
- `.floating-contact-enter` - Entrance animation
- `.floating-contact-pulse` - Pulsing effect
- `.cyber-indicator` - Active indicator glow

## Accessibility

- **Keyboard Navigation**: Focusable elements with proper tab order
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **High Contrast**: Works with system theme preferences
- **Touch Targets**: Minimum 44px touch targets for mobile

## Performance

- **Lazy Loading**: Component only renders when needed
- **Optimized Animations**: Hardware-accelerated transforms
- **Small Bundle**: Minimal dependencies and efficient code

## Browser Support

- Modern browsers supporting CSS Grid and Flexbox
- JavaScript ES6+ features
- CSS backdrop-filter support for blur effects

## Installation & Usage

The component is already integrated into your main page. It will automatically appear on page load with a subtle entrance animation.

### File Location
- Component: `components/floating-contact.tsx`
- Styles: `app/globals.css` (custom floating contact styles)
- Implementation: `app/page.tsx`

### Dependencies
All required dependencies are already installed in your `package.json`.

---

**🚀 Ready to connect!** Your floating CONTACT button is now live and ready to help visitors reach out to you through their preferred communication method.
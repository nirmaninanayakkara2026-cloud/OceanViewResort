# Tailwind CSS Conversion Guide

## ✅ Completed

- Tailwind CSS installed and configured
- `index.css` updated with Tailwind directives and utility classes
- All old CSS files removed
- Header and Footer components converted to Tailwind
- App.jsx updated

## 📋 CSS to Tailwind Class Mappings

### Common Conversions

| Old CSS        | Tailwind Classes                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `.page-header` | `bg-gradient-to-r from-primary to-primary-light text-white py-16 px-8 text-center`                     |
| `.container`   | `max-w-[1400px] mx-auto px-8`                                                                          |
| `.btn-primary` | `px-8 py-4 bg-accent text-primary rounded-full font-semibold hover:bg-yellow-300 hover:-translate-y-1` |
| `.card`        | `bg-white rounded-2xl shadow-lg p-6`                                                                   |
| `.form-input`  | `p-4 border-2 border-gray-200 rounded-lg focus:border-primary-light focus:outline-none`                |

### Layout Classes

- `display: flex` → `flex`
- `flex-direction: column` → `flex-col`
- `justify-content: center` → `justify-center`
- `align-items: center` → `items-center`
- `gap: 1rem` → `gap-4`
- `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`

### Spacing

- `padding: 2rem` → `p-8`
- `margin-bottom: 1rem` → `mb-4`
- `padding: 1rem 2rem` → `py-4 px-8`

### Colors (from tailwind.config.js)

- `#0a4b78` → `bg-primary` or `text-primary`
- `#1a7eb8` → `bg-primary-light` or `text-primary-light`
- `#ffd700` → `bg-accent` or `text-accent`

### Typography

- `font-size: 2.5rem` → `text-5xl`
- `font-weight: 600` → `font-semibold`
- `font-weight: 700` → `font-bold`
- `text-align: center` → `text-center`

### Effects

- `box-shadow: 0 5px 20px rgba(0,0,0,0.1)` → `shadow-lg`
- `border-radius: 15px` → `rounded-2xl`
- `transition: all 0.3s ease` → `transition-all duration-300`
- `transform: translateY(-5px)` → `hover:-translate-y-2`

## 🔄 Next Steps for Each Page

Each page component now needs its className attributes updated. Follow this pattern:

### Example: Converting a Section

**Before:**

```jsx
<div className="search-section">
  <h2 className="section-title">Find Rooms</h2>
  <button className="search-btn primary">Search</button>
</div>
```

**After:**

```jsx
<div className="bg-white p-8 rounded-2xl shadow-lg -mt-12 relative z-10">
  <h2 className="text-4xl text-center text-primary mb-8">Find Rooms</h2>
  <button className="px-8 py-4 bg-gradient-to-r from-primary-light to-primary text-white rounded-full font-semibold hover:-translate-y-1 hover:shadow-lg">
    Search
  </button>
</div>
```

## 📝 Quick Reference for Remaining Pages

All pages have had their CSS imports removed. Update the JSX className attributes using the patterns above.

### Utility Classes Available in index.css:

- `.btn` - Base button styles
- `.btn-primary` - Primary button (gold/accent color)
- `.btn-secondary` - Secondary button (outlined)
- `.page-header` - Page header section
- `.container-custom` - Main container
- `.form-input`, `.form-select`, `.form-textarea` - Form elements
- `.card` - Card container
- `.card-hover` - Card with hover effect

## 🚀 To Test

Run the development server:

```bash
npm run dev
```

The application will use Tailwind CSS for all styling!

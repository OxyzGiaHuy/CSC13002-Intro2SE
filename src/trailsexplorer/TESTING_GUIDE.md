# Testing Guide - Trails Explorer Updates

## 🎨 Visual Color Changes Verification

### Home Page & Navigation
- [ ] Header logo text "Trails Explorer" appears in sage-green colors
- [ ] Navigation buttons use sage-green hover states
- [ ] Links and CTAs display in sage-green (#4E9F3D)

### Profile Page
- [ ] Hero gradient background transitions from sage-green to forest-green
- [ ] "Edit Profile" button uses sage-green to forest-green gradient
- [ ] Profile stats cards have sage-green accents
- [ ] Trip history cards have light sage-green backgrounds (#F1F5E8)
- [ ] Timeline dots are sage-green colored
- [ ] Saved plans section uses sage-green theme

### Dashboard (Admin)
- [ ] Stat cards show sage-green themed icons
- [ ] Active navigation item has forest-green background
- [ ] "Recent Activity" section uses sage-green accents
- [ ] Popular Trails card headers have sage-green text
- [ ] Chart lines are green-themed (not blue)
- [ ] Footer gradient is sage-green to forest-green

### All Pages
- [ ] Background colors transitioned from light blue to light green
- [ ] Button hover states use sage-green shadows
- [ ] Form focus states ring in sage-green (#4E9F3D)
- [ ] Icons and badges maintain visibility with new colors

## 👥 User Data Initialization

### New User Registration
1. Register a new account with:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: any password
2. After email verification, login
3. Open Profile page and verify:
   - [ ] Name appears correctly
   - [ ] Avatar is auto-generated based on email
   - [ ] "Total KM: 0"
   - [ ] "Avg Altitude: 0"
   - [ ] "Avg Time: 0"
   - [ ] Trip History is empty
   - [ ] No groups listed initially
   - [ ] Bio, Phone, Home City are empty fields

### Admin User Data
1. Login with admin account:
   - Email: admin@trailsexplorer.com
   - Password: password123
2. Navigate to Dashboard:
   - [ ] Stats load from database (if backend running)
   - [ ] "Active Trekkers" shows number from DB
   - [ ] "Total Trails" shows number from DB
   - [ ] "Active Groups" shows number from DB
   - [ ] Chart displays user growth data
   - [ ] Recent activities populate (if available)
3. Navigate to Profile:
   - [ ] Admin profile data loads from database
   - [ ] Name, Bio, Phone auto-fill from DB
   - [ ] All fields use sage-green theme

## 🔄 Backend Integration

### Required Endpoints (if backend is running)
```
GET /api/admin/stats - Dashboard statistics
GET /api/admin/growth - User growth data for charts
GET /api/admin/activities - Recent activity logs
GET /api/user/profile - User profile data (for admin)
```

### Fallback Behavior
- If backend unavailable, Dashboard shows mock data
- New user registration still works (creates default values)
- Profile displays initial user state
- No errors in browser console

## 📋 Logout Data Cleanup Verification

1. Login to account and populate some data:
   - Add favorites (if available)
   - Add items to cart (if available)
   - Create/save plans
2. Open DevTools → Application → LocalStorage
3. Note keys present:
   - `token`
   - `user`
   - `market_cart` (if populated)
   - `favorites` (if populated)
   - `savedPlans` (if populated)
   - `lang` (should remain)
4. Click Logout button
5. Verify in LocalStorage:
   - [ ] `token` - REMOVED
   - [ ] `user` - REMOVED
   - [ ] `market_cart` - REMOVED
   - [ ] `favorites` - REMOVED
   - [ ] `savedPlans` - REMOVED
   - [ ] `lang` - STILL PRESENT ✓
6. Verify UI state:
   - [ ] View resets to 'home'
   - [ ] Login page displays
   - [ ] No cached user data visible

## 🎨 Color Palette Reference

### Primary Colors
| Element | Color | Hex | RGB |
|---------|-------|-----|-----|
| Primary | Sage Green | #4E9F3D | 78, 159, 61 |
| Primary Dark | Forest Green | #1A5D1A | 26, 93, 26 |
| Secondary | Light Green | #66BB6A | 102, 187, 106 |
| Background | Sage 50 | #F1F5E8 | 241, 245, 232 |
| Light Bg | Sage 100 | #E8F0E0 | 232, 240, 224 |

### Status Colors (Unchanged)
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)
- Info: Sage Green (#4E9F3D)

## 🐛 Known Issues / Notes

### Expected Backend Connections
The app expects a backend API on `localhost:5000`. If unavailable:
- Admin stats show mock data
- Admin growth chart shows mock data
- No errors prevent app from running
- User data still initializes properly

### Browser Compatibility
- All modern browsers supported (Chrome, Firefox, Safari, Edge)
- CSS variables fully supported
- Gradient colors render correctly
- No fallbacks needed for green gradients

## ✅ Checklist for Approval

- [ ] All colors changed from cyan/blue to sage-green
- [ ] Animations update with new color scheme
- [ ] New users initialize with default/mock data
- [ ] Admin users load data from database
- [ ] Logout clears all user data except language preference
- [ ] No TypeScript errors in build
- [ ] Dev server runs without errors
- [ ] All pages render with sage-green theme
- [ ] Responsive design maintained across devices

---

**Build Status**: ✓ SUCCESSFUL
**Date**: January 12, 2026
**Modules**: 2568 transformed
**Build Time**: 3.10s

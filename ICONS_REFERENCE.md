# ICONS REFERENCE - SINGLE SOURCE OF TRUTH

## 24 FIXED REGULAR ICONS (Never Change These!)

These are the **EXACT 24 icons** that should ALWAYS be displayed in the icon selection:

```typescript
const fixed24RegularIconIds = [
  'star', 'heart', 'shield', 'zap', 'leaf', 'coffee', 'camera', 'music', 
  'gamepad-2', 'palette', 'code', 'briefcase', 'lightbulb', 'rocket', 
  'sun', 'moon', 'cloud', 'flame', 'droplets', 'mountain', 
  'tree', 'flower', 'building', 'handshake', 'phone'
];
```

**ORDER MATTERS** - Icons are displayed in this exact order.

## 17 FIXED ENCLOSING SHAPES (For Circle Layouts)

These are the **EXACT 17 shapes** for circle layout enclosures:

```typescript
const fixed17EnclosingShapeIds = [
  'circle', 'square', 'triangle', 'diamond', 'hexagon', 'pentagon', 
  'star', 'heart', 'shield', 'sun', 'moon', 'zap', 'leaf', 'flame', 
  'droplets', 'check-circle', 'lightbulb'
];
```

## IMPLEMENTATION LOCATION

**Primary Definition:** `/lib/suggestionEngine.ts`
- Function: `getInitialSuggestions()`
- Returns: `Suggestions` interface with fixed icons

**Usage:** `/components/editor/Step3_Design.tsx`
- Uses icons directly from `suggestions.suggestedIcons`
- NO additional filtering or modification

## RULES

1. **NEVER modify the icon lists above**
2. **ALWAYS use the suggestionEngine as Single Source of Truth**  
3. **NO filtering in components** - use icons as-provided
4. **Icons must appear in the specified order**
5. **Count must always be exactly 24 regular + 17 enclosing**

## WHY THIS MATTERS

- Consistent user experience across sessions
- Predictable icon selection
- No random variations
- Professional, stable interface

**Last Updated:** September 2024
**Status:** ✅ IMPLEMENTED AND LOCKED
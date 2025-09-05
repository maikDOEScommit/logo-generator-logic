# Component Integration Examples

## 1. Suggestion Trigger (handleNextStep function)

```typescript
// In a component for Step 2 (Branding)
import { getInitialSuggestions } from '@/lib/suggestionEngine';
import { useLogoStore } from '@/lib/state';

const Step2_Branding = () => {
  const { setFont, setColorPalette, setText } = useLogoStore();
  const [industry, setIndustry] = useState('tech');
  const [selectedPersonalities, setSelectedPersonalities] = useState(['modern', 'innovative']);
  
  const handleNextStep = () => {
    // Generate suggestions based on industry and keywords
    const suggestions = getInitialSuggestions(industry, selectedPersonalities);
    
    // Update the global state with the suggestions
    setFont(suggestions.fontInfo, suggestions.fontWeight);
    setColorPalette(suggestions.colorPalette);
    setText('MeinLogo'); // or get from user input
    
    // Navigate to next step
    onNext();
  };

  return (
    <div>
      {/* Your branding selection UI */}
      <button onClick={handleNextStep}>
        Generate Logo Suggestions
      </button>
    </div>
  );
};
```

## 2. Editor Component (Step3_Design.tsx)

```typescript
// In Step3_Design.tsx - Font and weight selection
import { fontCategories } from '@/lib/data';
import { useLogoStore } from '@/lib/state';

const Step3_Design = () => {
  const { fontInfo, fontWeight, setFont, setFontWeight } = useLogoStore();

  return (
    <div>
      {/* Font Category Selection */}
      <section>
        <h3>Choose Font Category</h3>
        {fontCategories.map(category => (
          <div key={category.name}>
            <h4>{category.name}</h4>
            {category.fonts.map(font => (
              <button 
                key={font.name}
                onClick={() => setFont(font)}
                className={fontInfo.name === font.name ? 'selected' : ''}
              >
                <span style={{ fontFamily: font.cssName }}>
                  {font.name}
                </span>
              </button>
            ))}
          </div>
        ))}
      </section>

      {/* Font Weight Selection */}
      <section>
        <h3>Choose Font Weight</h3>
        {fontInfo.editorWeights.map(weight => (
          <button
            key={weight}
            onClick={() => setFontWeight(weight)}
            className={fontWeight === weight ? 'selected' : ''}
          >
            <span 
              style={{ 
                fontFamily: fontInfo.cssName, 
                fontWeight: weight 
              }}
            >
              {weight} - Sample Text
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};
```

## 3. Preview Component (LogoCanvas.tsx)

```typescript
// In LogoCanvas.tsx - Logo preview with dynamic styles
import { useLogoStore } from '@/lib/state';

const LogoCanvas = () => {
  const { text, fontInfo, fontWeight, colorPalette } = useLogoStore();

  return (
    <div className="logo-canvas">
      {/* Main Logo Display */}
      <div
        className="logo-text"
        style={{
          fontFamily: fontInfo.cssName,
          fontWeight: fontWeight,
          color: colorPalette.colors[0], // Hauptfarbe
          backgroundColor: colorPalette.colors[3], // Neutral
          fontSize: '4rem',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        {text}
      </div>

      {/* Color Palette Preview */}
      <div className="color-palette">
        {colorPalette.colors.map((color, index) => (
          <div
            key={index}
            className="color-swatch"
            style={{ backgroundColor: color }}
            title={['Haupt', 'Neben', 'Akzent', 'Neutral'][index]}
          />
        ))}
      </div>

      {/* Font Info Display */}
      <div className="font-info">
        <p>Font: {fontInfo.name}</p>
        <p>Weight: {fontWeight}</p>
        <p>Variable: {fontInfo.isVariable ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};
```

## 4. Complete Usage Example

```typescript
// Complete example showing all three files working together
import { getInitialSuggestions } from '@/lib/suggestionEngine';
import { useLogoStore } from '@/lib/state';
import { fontCategories, colorPalettes } from '@/lib/data';

const LogoGenerator = () => {
  const { 
    text, 
    fontInfo, 
    fontWeight, 
    colorPalette,
    setText, 
    setFont, 
    setFontWeight, 
    setColorPalette 
  } = useLogoStore();

  // Generate initial suggestions
  const handleGenerateLogo = () => {
    const suggestions = getInitialSuggestions('tech', ['modern', 'innovative']);
    setFont(suggestions.fontInfo, suggestions.fontWeight);
    setColorPalette(suggestions.colorPalette);
  };

  // Manual font selection
  const handleFontSelect = (selectedFont) => {
    setFont(selectedFont); // fontWeight will auto-reset to editorWeights[0]
  };

  return (
    <div>
      {/* Controls */}
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter logo text"
      />
      
      <button onClick={handleGenerateLogo}>
        Generate Smart Suggestions
      </button>

      {/* Live Preview */}
      <div 
        style={{
          fontFamily: fontInfo.cssName,
          fontWeight: fontWeight,
          color: colorPalette.colors[0]
        }}
      >
        {text}
      </div>
    </div>
  );
};
```
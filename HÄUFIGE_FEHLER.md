# ⚠️ HÄUFIGE FEHLER DIE NIEMALS WIEDER PASSIEREN DÜRFEN

## 🚨 KRITISCHER FEHLER: Expression expected / Expected ',', got '< (jsx tag start)'

### PROBLEM:
Beim Bearbeiten von React-Komponenten entsteht oft ein Syntax-Fehler um die `return (` Anweisung:

```
Error: Expression expected
 2103 |   };
 2104 |
 2105 |   return (
 2106 |     <>
       ^
Error: Expected ',', got '< (jsx tag start)'
```

### URSACHE:
- **Fehlende schließende Klammern/Tags** in Funktionen vor der return-Anweisung
- **Unvollständige JSX-Strukturen**
- **Falsch geschlossene div/span Tags**
- **Vergessene schließende `}` oder `)`**

### LÖSUNG:
1. **IMMER** vor größeren Änderungen: `npm run build` ausführen um sicherzustellen dass alles kompiliert
2. **NIEMALS** mehrere große Änderungen auf einmal machen
3. **Bei Syntax-Fehlern**: Sofort `git restore` der Datei und schrittweise neu beginnen
4. **Schließende Tags zählen**: Für jedes `<div>` muss ein `</div>` da sein
5. **JSX Fragment prüfen**: `<>` braucht `</>`

### PRÄVENTIONS-REGEL:
- **VOR jeder Änderung**: `git status` und `npm run build`
- **NACH jeder Änderung**: `npm run build` um Fehler sofort zu erkennen
- **Bei Fehlern**: SOFORT `git restore` und neu anfangen

### TYPISCHE FEHLERQUELLEN:
```jsx
// FALSCH - fehlendes schließendes div
<div>
  <span>content</span>
// </div> <- FEHLT!

// FALSCH - unvollständige Funktion
const myFunction = () => {
  return something
// }; <- FEHLT!

// FALSCH - falsche JSX Struktur
{condition && (
  <div>content</div>
// )} <- FEHLT!
```

### ✅ IMMER FOLGENDE SCHRITTE:
1. `git status` - prüfen dass alles sauber ist
2. `npm run build` - prüfen dass es kompiliert
3. Kleine Änderung machen
4. `npm run build` - sofort testen
5. Bei Fehler: `git restore` und neu anfangen

**DIESE REGEL NIEMALS BRECHEN!**
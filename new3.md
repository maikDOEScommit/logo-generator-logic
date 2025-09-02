Ueberarbeite die typewriter cursor animation und orientiere dich hieran, aber übernimm es nicht stupide: du sollst keine font-family oder font-size ändern und die Farbe des Cursors dem Text anpassen und ihn schmaler machen. Ausserdem soll er blinken, also opacity ändern. Das hier ist nur eine vorlage zur Orientierung, vor allem was die Animation angeht. Ausserdem musst du die komplette box etwas grösser machen, weil aktuell unten einige Buchstaben abgeschnitten werden. Hier die vorläge zur orientierung:

Typewriter-cursor animation {
opacity: 0.844475;
}
element.style {
}

<style>
.Typewriter__cursor {
    -webkit-animation: Typewriter-cursor 1s infinite;
    animation: Typewriter-cursor 1s infinite;
    margin-left: 1px;
}
* {
    margin: 0;
    margin-block-end: 0;
    margin-block-start: 0;
    margin-inline-end: 0;
    margin-inline-start: 0;
}
*, :after, :before {
    box-sizing: border-box;
}
.wp-block-ponyo-richard {
    align-items: center;
    background: var(--backgroundColor);
    display: flex
;
    flex-direction: column;
    padding: 5rem 2rem;
    text-align: center;
    width: 100%;
}
style attribute {
    --siteHeaderHeight: 141px;
}
body {
    font-family: roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
}
body {
    line-height: 1.5;
    margin: 0;
    -webkit-font-smoothing: antialiased;
}
.scheme__light, :root {
    --logoColor: #1d63ed;
    --backgroundSecondary: #f4f4f6;
    --cardBackgroundColor: #fff;
    --borderColor: #393f49;
    --shadowColor: rgba(0, 8, 77, .08);
    --shadowColorActive: rgba(0, 8, 77, .5);
    --shadowColorHover: rgba(0, 8, 77, .25);
    --eyebrowColor: #fff;
    --headlineColor: #000;
    --subheadColor: #17191e;
    --copyColor: #505968;
    --copyColor2: #505968;
    --linkColor: #1d63ed;
    --inlineCodeBackgroundColor: #f4f4f6;
    --inlineCodeBorderColor: #e1e2e6;
    --headlineHighlightedColor: #1d63ed;
    --entryTitleColor: blue800;
    --listItemColor: #1d63ed;
    --imageHeight: 7.5rem;
    --imageMaxWidth: 15rem;
    --imageMinWidth: 12.5rem;
    --arrow-button-icon: url(data:image/svg+xml;utf8,<svg width="24" height="25" xmlns="http://www.w3.org/2000/svg"><path id="arrow_right_alt" d="M13.3 17.775C13.1 17.575 13.0042 17.3334 13.0125 17.05C13.0208 16.7667 13.125 16.525 13.325 16.325L16.15 13.5H5C4.71667 13.5 4.47917 13.4042 4.2875 13.2125C4.09583 13.0209 4 12.7834 4 12.5C4 12.2167 4.09583 11.9792 4.2875 11.7875C4.47917 11.5959 4.71667 11.5 5 11.5H16.15L13.3 8.65005C13.1 8.45005 13 8.21255 13 7.93755C13 7.66255 13.1 7.42505 13.3 7.22505C13.5 7.02505 13.7375 6.92505 14.0125 6.92505C14.2875 6.92505 14.525 7.02505 14.725 7.22505L19.3 11.8C19.4 11.9 19.4708 12.0084 19.5125 12.125C19.5542 12.2417 19.575 12.3667 19.575 12.5C19.575 12.6334 19.5542 12.7584 19.5125 12.875C19.4708 12.9917 19.4 13.1 19.3 13.2L14.7 17.8C14.5167 17.9834 14.2875 18.075 14.0125 18.075C13.7375 18.075 13.5 17.975 13.3 17.775Z" fill="white"/></svg>);
    --search-icon: url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C9.84871 16 11.551 15.3729 12.9056 14.3199L18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L14.3199 12.9056C15.3729 11.551 16 9.84871 16 8C16 3.58172 12.4183 0 8 0ZM2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z" fill="black"/></svg>);
    --chevron-right-solid-icon: url(data:image/svg+xml;utf8,<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="var%28--iconColor, black%29"/></svg>);
    --buttonTextDecoration: "none";
    --buttonPrimaryBorder: transparent;
    --buttonPrimaryBorderWidth: 1.5px;
    --buttonPrimaryBackground: #1d63ed;
    --buttonPrimaryText: #fff;
    --buttonPrimaryShadow: transparent;
    --buttonPrimaryHoverBorder: #0c49c2;
    --buttonPrimaryHoverBackground: #0c49c2;
    --buttonPrimaryHoverText: #fff;
    --buttonPrimaryHoverShadow: transparent;
    --buttonPrimaryActiveBorder: transparent;
    --buttonPrimaryActiveBackground: #1d63ed;
    --buttonPrimaryActiveText: #fff;
    --buttonPrimaryActiveShadow: #c0e0fa;
    --buttonPrimaryDisabledBorder: transparent;
    --buttonPrimaryDisabledBackground: #e1e2e6;
    --buttonPrimaryDisabledText: #677285;
    --buttonSecondaryBorder: #c4c8d1;
    --buttonSecondaryBorderWidth: 1.5px;
    --buttonSecondaryBackground: #fff;
    --buttonSecondaryText: #000;
    --buttonSecondaryShadow: transparent;
    --buttonSecondaryHoverBorder: #c4c8d1;
    --buttonSecondaryHoverBackground: #f4f4f6;
    --buttonSecondaryHoverText: #000;
    --buttonSecondaryHoverShadow: transparent;
Show all properties (137 more)
}
*, :after, :before {
    box-sizing: border-box;
}
*, :after, :before {
    box-sizing: border-box;
}
<style>
0% {
    opacity: 0;
}
<style>
50% {
    opacity: 1;
}
<style>
100% {
    opacity: 0;
}

Wird eine reguläre farbpalette ausgewählt, soll sich die logik der generation aktuell nicht ändern. Aber wir ändern das system wenn der user nicht eine reguläre Farbpalette sondern eine Grundfarbe (plus weiß oder schwarz) wählt wie folgend:

Wird eine grundfarbe gewählt ohne zusätzlich schwarz oder weiss, dann soll jedes einzelne generierte Logo in 4 versionen angezeigt werden:
..auf weissem hintergrund brandname und icon in der grundfarbe
..auf schwarzem Hintergrund brandname und icon in der grundfarbe
..auf weissem Hintergrund und der brand name soll einen linaer-gradient in den Tönen der Grundfarbe von hell zu dunkel sein, der icon auch
.. auf schwarzem hintergrund und der brand name soll einen linaer-gradient in den Tönen der Grundfarbe von hell zu dunkel sein und das icon auch

Wird eine Grundfarbe plus weis gewählt, sollen immer folgende Variationen erstellt werden:
..Auf weissem Hintergrund brandname und logo in der grundfarbe
..Auf weißem Hintergrund brandname ODER Logo in einem linear-gradient der grundfarbe
..Auf schwarzem Hintergrund brandname weiss und icon in der grundfarbe
..Auf schwarzem hintergrund brandname in der grundfarbe und icon weiss
... Auf schwarzem Hintergrund brandname als linear-gradient left to right in den farben des grundtones, icon weiss
... Auf schwarzem Hintergrund brandname weiss und icon in linear-gradients der grundfarbe.

Wird zur Grundfarbe schwarz gewählt, sollen die diese Regeln gelten:

..auf weißem Hintergrund brandname in der grundfarbe und icon schwarz
..auf weißem Hintergrund brandname in schwarz und das icon in der grundfarbe
.. auf weißem hintergrund brandname in einem linear-gradient der Grundfarbe und icon schwarz
...auf weißem Hintergrund brandname in schwarz und das icon mit einem linear-gradient der grundfarbe
... Auf schwarzem Hintergrund brandname in der grundfarbe und icon in der grundfarbe
... Auf schwarzem Hintergrund brandname und icon in linear-gradients der grundfarbe

Werden also Grundfarbe plus weiß oder schwarz gewählt sollen für jede generation diese 6 und nicht unsere alten 4 versionen generiert werden. Baue das alles auch in unsere single source of truth ein

# Promotool (Stellantis) on the CXO design system

The Promotool front end from `Stellantis-legacy`, recreated on the CXO design system (theme "wallStreet", font preset "editorial"). It is still a static HTML, CSS and vanilla JS app with no build step, and the page scripts, routes and workflows are unchanged.

## Run it

Serve the folder with any static server and open `index.html`:

```
python3 -m http.server 8000
```

Demo sign-in is checked in the browser (`js/login.js`, no backend):

| User | Password | Lands on |
| --- | --- | --- |
| Marcus Weber | user123 | Experiments |
| kristen | admin123 | Experiment status |

## How the design system is applied

- `cxo/tokens.css`: the CXO tokens (C, T, SPACE, TEXT, SIZE, Z, MOTION) as CSS custom properties. Colours, radii, shadows, spacing and type come from here.
- `cxo/fonts.css`, `cxo/fonts/`: the CXO font presets.
- `css/base.css`: the app shell (CXO SidebarShell and NavItem, PageShell spacing) and shared controls.
- `css/cxo-app.css`: shared CXO patterns across pages (page headers, OpsTabs, OpsModal dialogs, tables, buttons, the navy context bar) and the responsive rules.
- `js/cxo-shell.js`: sidebar collapse (kept in `localStorage` under `promotool-nav`) and the drawer used below 900px.
- Each page CSS file keeps its own layout, with the old colours and fonts mapped to tokens and a CXO section at the end.

Every page loads, in this order: `cxo/fonts.css`, `cxo/tokens.css`, `css/base.css`, the page CSS, `css/user-menu.css`, `css/cxo-app.css`.

# Quality & Safety

A static workplace dashboard for quality and safety apps, workbooks, and reference links.

## Project layout

- `index.html` — dashboard tiles and links
- `landing.css` — dashboard layout and tile styling
- `styles/platform.css` — shared dark theme, brand colors, and base styles
- `equipment-check/` — cumulative BB, DTV, and SAT equipment audit form
- `tyre-pressure-check/` — tyre pressure assessment tool
- `workbooks/assets/` — workbook tile artwork
- `links/assets/` — resource icons and the Audit Guidance tile image
- `.github/workflows/pages.yml` — GitHub Pages deployment

Each interactive app keeps its HTML, CSS, JavaScript, and assets in its own folder. Shared theme CSS should load before page-specific styles.

## Maintaining the dashboard

Edit `index.html` to add or update dashboard entries:

- Add interactive tools and useful guide tiles in **Apps**.
- Add workbook tiles in **Workbooks**.
- Add compact external resources in **Links**. Their display order is their order in the HTML.
- External resources open in a new tab. Keep `target="_blank"` paired with `rel="noopener noreferrer"`.
- Store tile artwork under `links/assets/` or `workbooks/assets/`, and check whether an image is already used before removing it.

## Maintaining the Equipment Check

The ordered item definitions and field types live near the top of `equipment-check/js/app.js`:

- `BB_ITEMS` contains the base checklist.
- `DTV_ITEMS` contains additions to BB.
- `SAT_ITEMS` contains additions to DTV.
- `CHECKLIST_TEMPLATES` combines them, so SAT includes BB and DTV.

Use the existing field helpers (`conditionField`, `quantityField`, `manufacturerDateField`, `serialNumberField`, and `commentsField`) when adding items. Custom dropdowns can define their options directly. Each item needs a unique, stable `id`; saved drafts use those IDs to restore answers, so changing an existing ID can disconnect its saved answer. Keep an item’s display order by placing it in the correct array.

Checklist fields are required unless they are comments. For condition-based items, **Not Fit for Use** and **Not Witnessed** hide and clear the other fields. PDF export validates required fields, builds a print-ready report, and opens the browser print dialog; select **Save as PDF** to save a copy.

## Data and security notes

These are static, browser-based apps; there is no project server or central database. Equipment Check drafts are stored in the current browser's local storage and stay on that device/browser until cleared. PDF creation uses the browser's print feature. The app code does not upload form contents.

Dashboard links expose their destination URLs to anyone who can view the page. Access to SharePoint, Microsoft Forms, and other linked services is controlled by those services, not by this dashboard. Confirm sharing permissions are appropriate before adding a work link. Do not put passwords, access tokens, or private employee data in source files or URLs.

## Other app behavior

Tyre Pressure Check compares measured readings with the door-panel recommendation. Enter both values in the same unit (PSI or bar); the app reports the percentage below recommendation. PASS is 10% or lower, ADVISORY is over 10% and below 25%, and FAIL is 25% or higher.

## Deployment

The GitHub Actions Pages workflow deploys on pushes to `main` and can also be run manually. Enable **GitHub Actions** as the deployment source in the repository's Pages settings.

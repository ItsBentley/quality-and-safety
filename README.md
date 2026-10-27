# Quality & Safety

A home page for workplace quality and safety apps, plus tiles that link to Excel workbooks.

## Project layout

- `index.html` — the app and workbook landing page
- `landing.css` — landing page layout and styles
- `styles/platform.css` — shared theme colors and base styles
- `<app-name>/` — each app's own page and assets, kept separate from other apps

The shared theme is loaded before page-specific stylesheets. Keep each app's HTML, CSS, JavaScript, and assets together in its own folder. Add app and workbook tiles to the matching section in `index.html`; workbook tiles can link to files or approved work locations such as SharePoint or OneDrive.

The GitHub Actions Pages workflow deploys the site when changes are pushed to `main`. Enable **GitHub Actions** as the deployment source in the repository's Pages settings.

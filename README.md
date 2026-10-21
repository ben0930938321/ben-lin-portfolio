# Ben Lin — Architecture & Digital Design

A bespoke course portfolio for Ben Lin 林家佑, presenting two projects from 2026. Four distinct pages cover selected work, the graduation project, the airport facade study, and a profile.

## Run locally

From this folder run `python -m http.server 8000`, then open http://localhost:8000. A local server is required because JavaScript loads JSON with fetch.

## Structure and content updates

- `index.html`, `port.html`, `airport.html`, `about.html`: page shells and navigation.
- `styles.css`: responsive layout and typography.
- `app.js`: loads content and renders the selected page.
- `content/site.json`: editable biography, project descriptions, roles, image paths and captions.
- `assets/`: project images supplied by the author.

To update a project, edit its text in `content/site.json`. To replace an image, put the new file in `assets/` and update its `src` or `cover` path. Keep JSON commas and quotation marks valid. No HTML editing or AI assistance is required. Preview, commit and push the changes to update the deployed site.

Content workflow: `site.json → JavaScript → page content`. HTML supplies structure; CSS supplies presentation.

## Design and tools

Custom composition using an off-white background, restrained typography, thin rules and generous spacing. The supplied architectural images informed the layout; no portfolio template was used. Built with HTML, CSS and vanilla JavaScript, with Codex assistance. Rhino is the author's stated design tool.

## Deployment

Public deployment is pending. Deploy this folder as the site root on GitHub Pages or Vercel, then record the verified public URL here before submission.

## Attribution

Port City Vertical Park System is an individual graduation design by Ben Lin. Kaohsiung Airport Facade is a team project; Ben Lin contributed model making and photography.

## Add airport photographs

Put new JPG, PNG, WebP, GIF or AVIF files in `../pic/02/`. Use meaningful filenames: their names become captions. The existing cover and three original secondary photos remain in place. Run `python manage.py` (or double-click the preview launcher) to synchronize and preview. The airport page checks for additional photos every four seconds. Secondary photos form one horizontal row with touch scrolling, a scrollbar, keyboard navigation and arrow buttons.

Before public deployment, run `python manage.py --sync`, then commit and deploy the updated `content/airport-photos.json` and `assets/airport-added/` files. A public static website cannot read a local D: drive. Removing a source photo removes it from the generated list on the next synchronization; previously copied asset files are retained.

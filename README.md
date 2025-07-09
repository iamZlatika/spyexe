# Facebook Ad Spy CLI

A CLI tool for automated Facebook feed scanning and ad (Promoted post) collection, designed for team leads and analysts. The tool runs locally, automates browser actions, and uploads results to Google Drive.

## Features

- **Profile Management:** Launches Facebook sessions using exported cookies for multiple profiles.
- **Automated Browsing:** Uses Playwright to open Facebook in mobile mode, scroll the feed, and search for Promoted posts.
- **Ad Detection:** Finds and extracts Promoted posts, saving images and links.
- **Cloud Storage:** Uploads results (screenshots, links) to Google Drive via API.
- **Logging:** Logs process details to both file and console (Winston or Pino).
- **Batch Processing:** Supports processing multiple profiles from a folder.
- **(Optional) Scheduler:** Can be run periodically using node-cron.

## Technology Stack

- **Node.js + TypeScript**
- **Playwright** (browser automation)
- **Google Drive API** (cloud storage)
- **Winston/Pino** (logging)
- **Commander.js/Yargs** (CLI)
- **node-cron** (optional scheduling)

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Prepare Facebook cookies:**
   - Export cookies from your browser (JSON format).
   - Place them in the `profiles/` folder, each as a separate JSON file with the following structure:
     ```json
     {
       "name": "profileName",
       "cookies": [ ... ],
       "facebookUrl": "https://m.facebook.com"
     }
     ```
4. **Set up Google Drive API:**
   - Create a Google Cloud project, enable Drive API, and create a service account.
   - Download the credentials JSON and place it in the project root (e.g., `gdrive-creds.json`).
   - Share your target Google Drive folder with the service account email.

5. **Run the tool:**
   ```bash
   npx ts-node scan.ts
   ```

## Output
- Screenshots and extracted data are saved locally and uploaded to Google Drive.
- Logs are written to both the console and a log file.

## Roadmap
- [ ] Ad content extraction and keyword search
- [ ] Improved error handling and reporting
- [ ] Configurable CLI options
- [ ] Scheduler integration (node-cron)

## License
MIT 
# Facebook Ad Monitoring Tool

This tool automatically scans Facebook feeds, detects ad posts, captures screenshots, analyzes content using AI, and saves results to Google Drive.

## Environment Variables

### Vision Browser API Configuration

The following environment variables are required for connecting to Vision Browser:

- `VISION_X_TOKEN` - Authentication token for Vision Browser API
- `VISION_API_URL` - Base URL for Vision Browser API (default: 'https://v1.empr.cloud/api/v1')
- `VISION_PROFILE_ID` - ID of the Vision Browser profile to use (default: 'default')

### Google API Configuration

The following environment variables are required for Google Drive integration:

- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_REDIRECT_URI` - Redirect URI for OAuth flow
- `GOOGLE_FOLDER_ID` - ID of the Google Drive folder to save screenshots to

## Setup

1. Create a `.env` file in the project root with the required environment variables
2. Install dependencies: `npm install`
3. Run the application: `npx ts-node scan.ts`

## How It Works

1. The tool connects to Vision Browser using the provided profile ID
2. It logs into Facebook using cookies from Vision Browser
3. It scrolls through the Facebook feed looking for ad posts
4. When an ad is found, it takes a screenshot and analyzes it with AI
5. The screenshot and analysis results are saved to Google Drive
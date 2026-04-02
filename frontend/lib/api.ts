const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiBaseUrl) {
  throw new Error('Missing API base URL. Set EXPO_PUBLIC_API_URL before starting the app.');
}

export const API_BASE_URL = apiBaseUrl.replace(/\/$/, '');

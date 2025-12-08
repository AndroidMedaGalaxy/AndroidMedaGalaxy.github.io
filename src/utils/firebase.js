// src/utils/firebase.js
// Firebase Analytics Setup - FREE FOREVER!

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';

// Firebase config from environment variables (set in Vercel)
// These are safe to expose in client-side code (they're not secret, just identifiers)
// But we keep them in env vars for easier management
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let analytics = null;
let analyticsEnabled = false;

try {
  const app = initializeApp(firebaseConfig);

  // Check if analytics is supported (some browsers block it)
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      analyticsEnabled = true;
      console.log('✅ Firebase Analytics initialized');
    } else {
      console.warn('⚠️ Firebase Analytics not supported in this browser');
    }
  }).catch(error => {
    console.warn('⚠️ Firebase Analytics error:', error);
  });
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.log('💡 Make sure to update firebaseConfig in src/utils/firebase.js');
}

/**
 * Log a custom event to Firebase Analytics
 * @param {string} eventName - Name of the event (e.g., 'chat_query')
 * @param {object} eventParams - Parameters for the event
 */
export function trackEvent(eventName, eventParams = {}) {
  if (!analyticsEnabled || !analytics) {
    console.log('[Analytics - Disabled]', eventName, eventParams);
    return;
  }

  try {
    logEvent(analytics, eventName, eventParams);
    console.log('[Firebase Analytics]', eventName, eventParams);
  } catch (error) {
    console.error('[Firebase Analytics Error]', error);
  }
}

/**
 * Track a chat query
 * @param {string} query - The user's query
 * @param {string} status - Query status (success, failed, etc.)
 * @param {number} responseLength - Length of the response
 */
export function trackChatQuery(query, status, responseLength = 0) {
  trackEvent('chat_query', {
    query_status: status,
    query_length: query.length,
    query_word_count: query.split(/\s+/).length,
    response_length: responseLength,
    // Don't log full query text for privacy, just first 50 chars
    query_preview: query.substring(0, 50)
  });
}

/**
 * Track a failed query (out of scope or no context)
 * @param {string} query - The failed query
 * @param {string} reason - Why it failed
 */
export function trackFailedQuery(query, reason) {
  trackEvent('chat_query_failed', {
    failure_reason: reason,
    query_length: query.length,
    query_word_count: query.split(/\s+/).length,
    query_preview: query.substring(0, 50)
  });
}

/**
 * Track page view
 * @param {string} pageName - Name of the page
 */
export function trackPageView(pageName) {
  trackEvent('page_view', {
    page_name: pageName,
    page_title: document.title
  });
}

/**
 * Track CV download
 */
export function trackCVDownload() {
  trackEvent('cv_download', {
    file_name: 'Rituraj_Sambherao_CV.pdf'
  });
}

/**
 * Track when user clicks on a project or article
 * @param {string} type - 'project' or 'article'
 * @param {string} title - Title of the project/article
 */
export function trackContentClick(type, title) {
  trackEvent(`${type}_click`, {
    content_type: type,
    content_title: title
  });
}

export { analytics, analyticsEnabled };


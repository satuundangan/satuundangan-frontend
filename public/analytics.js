// Google Analytics 4 (GA4) Implementation
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Replace 'G-XXXXXXXXXX' with your real Measurement ID
const GA_MEASUREMENT_ID = 'G-WES1MWSK76'; 
gtag('config', GA_MEASUREMENT_ID);

// Helper for custom events
window.trackEvent = (eventName, params = {}) => {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
};

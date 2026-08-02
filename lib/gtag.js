export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-PPC44GCE20";

// Function to initialize Google Analytics
export const initGA = () => {
  if (typeof window !== "undefined" && GA_TRACKING_ID) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());

    // Set up configuration for tracking both main domain and subdomains
    gtag("config", GA_TRACKING_ID, {
      cookie_domain: "auto",
      cookie_flags: "SameSite=None; Secure",
    });
  }
};

// Log the pageview with the given URL
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url, // Log the pageview with the correct URL
      cookie_domain: "auto",
    });
  }
};

// Log specific events happening
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      cookie_domain: "auto",
    });
  }
};

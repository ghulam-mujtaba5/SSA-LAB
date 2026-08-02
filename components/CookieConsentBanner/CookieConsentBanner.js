import React, { useState, useEffect } from "react";
import commonStyles from "./CookieConsentBannerCommon.module.css";
import lightStyles from "./CookieConsentBannerLight.module.css";
import darkStyles from "./CookieConsentBannerDark.module.css";
import { useTheme } from "../../context/ThemeContext";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  const { theme = "light" } = useTheme() || {};

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) setVisible(true);
      } catch (e) {
        setVisible(true); // fallback: show banner if localStorage fails
      }
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem("cookie_consent", "true");
    } catch (e) {}
    setVisible(false);
  };

  const declineCookies = () => {
    try {
      localStorage.setItem("cookie_consent", "declined");
    } catch (e) {}
    setVisible(false);
  };

  const frameStyles = theme === "dark" ? darkStyles : lightStyles;

  if (!visible) return null;

  return (
    <div
      className={`${commonStyles.banner} ${frameStyles.banner}`}
      role="region"
      aria-label="Cookie consent notice"
    >
      <div className={commonStyles.contentGroup}>
        <div className={commonStyles.iconWrapper} aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        </div>
        <p className={`${commonStyles.text} ${frameStyles.text}`}>
          We use cookies to enhance your experience, analyze site usage, and support our marketing.{" "}
          <a
            href="/privacy-policy"
            className={`${commonStyles.link} ${frameStyles.link}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
      <div className={`${commonStyles.actions} ${frameStyles.actions}`}>
        <button
          className={`${commonStyles.button} ${frameStyles.button}`}
          onClick={acceptCookies}
          type="button"
        >
          Accept
        </button>
        <button
          className={`${commonStyles.buttonSecondary} ${frameStyles.buttonSecondary}`}
          onClick={declineCookies}
          type="button"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;


import Document, { Html, Head, Main, NextScript } from "next/document";

// Inline script to prevent flash of wrong theme
// This runs synchronously before React hydration
const themeScript = `
(function() {
  try {
    var savedMode = localStorage.getItem('themeMode');
    var mode = savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto' ? savedMode : 'auto';
    var theme = mode;
    if (mode === 'auto') {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    // Set initial background immediately to prevent white flash
    document.documentElement.style.backgroundColor = theme === 'dark' ? '#090d16' : '#ffffff';
  } catch (e) {}
})();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" suppressHydrationWarning>
        <Head>
        {/* ── Verification tokens ───────────────────────────── */}
          {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
            <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
          )}
          {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
            <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
          )}

          {/* ── App identity ──────────────────────────────────── */}
          <meta name="application-name" content="SSA Lab" />
          <meta httpEquiv="x-ua-compatible" content="IE=edge" />

          {/* ── DNS prefetch & preconnects ────────────────────── */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://scholar.google.com" />
          <link rel="dns-prefetch" href="https://orcid.org" />
          <link rel="dns-prefetch" href="https://doi.org" />
          <link rel="dns-prefetch" href="https://ieeexplore.ieee.org" />
          <link rel="dns-prefetch" href="https://www.sciencedirect.com" />

          {/* ── LLM / AI Search Discoverability ──────────────── */}
          <link rel="llms" href="https://www.ssa-lab.tech/llms.txt" />
          <link rel="llms-full" href="https://www.ssa-lab.tech/llms-full.txt" />
          <link rel="alternate" type="text/markdown" href="https://www.ssa-lab.tech/llms.txt" title="LLM Summary Context" />
          <link rel="alternate" type="text/markdown" href="https://www.ssa-lab.tech/llms-full.txt" title="LLM Full Context" />

          {/* ── Google Fonts ─────────────────────────────────── */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Open+Sans:wght@400;600;700&family=Poppins:wght@500;600;700&display=swap"
          />

          {/* ── Security headers ──────────────────────────────── */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta name="referrer" content="strict-origin-when-cross-origin" />

          {/* ── Theme colors ──────────────────────────────────── */}
          <meta name="theme-color" content="#173b51" />
          <meta name="theme-color" content="#23272F" media="(prefers-color-scheme: dark)" />
          <meta name="theme-color" content="#EAF6FF" media="(prefers-color-scheme: light)" />

          {/* ── RSS & OpenSearch autodiscovery ────────────────── */}
          <link
            rel="alternate"
            type="application/rss+xml"
            title="SSA Research Lab — RSS Feed"
            href="/feed.xml"
          />
          <link
            rel="search"
            type="application/opensearchdescription+xml"
            title="SSA Research Lab"
            href="/opensearch.xml"
          />

          {/* ── Apple / iOS meta ──────────────────────────────── */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="SSA Lab" />
          <link rel="apple-touch-icon" href="/academic/ssa-research-group-logo.png" />
          <link rel="manifest" href="/manifest.json" />

          {/* ── Windows tiles ─────────────────────────────────── */}
          <meta name="msapplication-TileColor" content="#173b51" />
          <meta name="msapplication-TileImage" content="/academic/ssa-research-group-logo.png" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* ── Mobile ────────────────────────────────────────── */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
        </Head>
        <body>
          {/* Theme script runs before React to prevent flash */}
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

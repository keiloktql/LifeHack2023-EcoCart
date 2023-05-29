/* eslint-disable no-unused-vars */
// General
export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
};

export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "DEV";
export const PORT = process.env.NEXT_PUBLIC_PORT || 3001;
export const PROD_HOST = "https://ecocart.web.app";
export const BASE_URLS = {
  PROD: PROD_HOST,
  DEV: `http://localhost:${PORT}`
};
export const BASE_URL = BASE_URLS[ENVIRONMENT];

export const PROTECTED_ROUTES = ["/dashboard"];

// Enums and its meta info
export const BTN_META = {
  PRIMARY: {
    className: "bg-primary-600 text-white"
  },
  PRIMARY_EMPTY: {
    className: "hover:underline"
  },
  EMPTY: {
    className: "override-empty-btn text-black"
  }
};

export const FOOTER_NAV_LINKS_META = {
  PRODUCT: {
    heading: "Product",
    links: [
      {
        text: "Overview",
        href: "/overview"
      },
      {
        text: "Features",
        href: "/features"
      },
      {
        text: "Solutions",
        href: "/solutions"
      },
      {
        text: "Pricing",
        href: "/pricing"
      },
      {
        text: "Releases",
        href: "/releases"
      }
    ]
  },
  COMPANY: {
    heading: "Company",
    links: [
      {
        text: "About us",
        href: "/about-us"
      },
      {
        text: "Careers",
        href: "/careers"
      },
      {
        text: "Press",
        href: "/press"
      },
      {
        text: "News",
        href: "/news"
      },
      {
        text: "Media kit",
        href: "/media-kit"
      },
      {
        text: "Contact",
        href: "/contact"
      }
    ]
  },
  RESOURCES: {
    heading: "Resources",
    links: [
      {
        text: "Blog",
        href: "/blog"
      },
      {
        text: "Newsletter",
        href: "/newsletter"
      },
      {
        text: "Events",
        href: "/events"
      },
      {
        text: "Help centre",
        href: "/help"
      },
      {
        text: "Tutorials",
        href: "/tutorials"
      },
      {
        text: "Support",
        href: "/support"
      }
    ]
  },
  LEGAL: {
    heading: "Legal",
    links: [
      {
        text: "Terms",
        href: "/terms"
      },
      {
        text: "Privacy",
        href: "/privacy"
      },
      {
        text: "Cookies",
        href: "/cookies"
      },
      {
        text: "Settings",
        href: "/settings"
      }
    ]
  }
};

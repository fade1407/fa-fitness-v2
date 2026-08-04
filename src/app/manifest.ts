import type { MetadataRoute } from "next";

const APP_ICON = "/icons/fa-fitness-v2-icon-1024.png";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FA FITNESS",
    short_name: "FA Fitness",
    description: "مساعدك الرياضي الشخصي.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0d100e",
    theme_color: "#b7f34d",
    lang: "ar",
    dir: "rtl",
    icons: [
      { src: APP_ICON, sizes: "1024x1024", type: "image/png", purpose: "any" },
      { src: APP_ICON, sizes: "1024x1024", type: "image/png", purpose: "maskable" },
    ],
  };
}

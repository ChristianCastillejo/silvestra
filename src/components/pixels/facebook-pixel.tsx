"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initFacebookPixel, trackPageView } from "@/lib/pixels/facebook-pixel";

const FacebookPixel = () => {
  const pathname = usePathname();
  const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "";

  useEffect(() => {
    if (FACEBOOK_PIXEL_ID) {
      initFacebookPixel(FACEBOOK_PIXEL_ID);
      trackPageView();
    }
  }, [FACEBOOK_PIXEL_ID]);

  // Track page views on route changes
  useEffect(() => {
    trackPageView();
  }, [pathname]); // Runs every time the route changes

  return null;
};

export default FacebookPixel;

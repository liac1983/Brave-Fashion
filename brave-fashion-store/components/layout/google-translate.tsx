"use client";

import Script from "next/script";
import { Globe } from "lucide-react";

export default function GoogleTranslate() {
  return (
    <div className="relative flex items-center">
      <Globe
        size={14}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-2 z-10 text-neutral-400"
      />
      <div id="google_translate_element" />
      <Script
        id="google-translate-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'pt',
                includedLanguages: 'en,es,fr,de,it,nl',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </div>
  );
}

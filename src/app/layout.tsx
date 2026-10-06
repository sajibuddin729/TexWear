import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TEX WEAR — Life Style | Premium Fashion & Lifestyle Bangladesh",
  description: "Buy premium Panjabi, ethnic wear, casual & formal shirts, ladies kameez, saree, and accessories online at TEX WEAR Life Style.",
  icons: {
    icon: "/final_logo6.png",
    shortcut: "/final_logo6.png",
    apple: "/final_logo6.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // 1. Intercept setAttribute to stop extensions from adding bis_skin_checked
                try {
                  const origSetAttr = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, val) {
                    if (name === 'bis_skin_checked') return;
                    return origSetAttr.apply(this, arguments);
                  };

                  Object.defineProperty(HTMLDivElement.prototype, 'bis_skin_checked', {
                    set: function() {},
                    get: function() { return undefined; },
                    configurable: true,
                  });
                } catch (e) {}

                // 2. Remove any attributes if already present
                function cleanNodes() {
                  try {
                    const els = document.querySelectorAll('[bis_skin_checked]');
                    for (let i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                    }
                  } catch (e) {}
                }
                cleanNodes();

                // 3. Keep removing if extension adds it asynchronously
                try {
                  const observer = new MutationObserver(function(mutations) {
                    for (let i = 0; i < mutations.length; i++) {
                      const m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked') {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  if (document.documentElement) {
                    observer.observe(document.documentElement, {
                      attributes: true,
                      attributeFilter: ['bis_skin_checked'],
                      subtree: true,
                    });
                  }
                } catch (e) {}

                // 4. Silence console.error for extension hydration warnings
                const origError = console.error;
                console.error = function() {
                  for (let i = 0; i < arguments.length; i++) {
                    const arg = arguments[i];
                    const str = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                    if (str && (str.indexOf('bis_skin_checked') !== -1 || str.indexOf('chrome-extension://') !== -1)) {
                      return;
                    }
                  }
                  return origError.apply(console, arguments);
                };
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

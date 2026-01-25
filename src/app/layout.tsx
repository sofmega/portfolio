// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
           forcedTheme="light"
        >
          {children}

          {/* ✅ Custom dot + ring cursor (desktop only) */}
          <CustomCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}

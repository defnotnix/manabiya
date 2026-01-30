import { ColorSchemeScript } from "@mantine/core";
import { LayoutApp } from "../layouts/app";

export const metadata = {
  title: "built to build.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&family=Stack+Sans+Notch:wght@200..700&family=Stack+Sans+Text:wght@200..700&family=Unbounded:wght@200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LayoutApp>{children}</LayoutApp>
      </body>
    </html>
  );
}

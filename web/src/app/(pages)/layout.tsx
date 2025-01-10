export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //const { isEnabled } = await draftMode();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <InitTheme /> */}
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: 'घर जाने बाटो - Ghar Jane Bato',
  description: 'नेपाली श्रमिकको लागि बस बुकिङ सेवा',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ne">
      <head>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f8f6f1;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

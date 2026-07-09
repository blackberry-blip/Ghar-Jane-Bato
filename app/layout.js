export const metadata = {
  title: 'घर जाने बाटो - Ghar Jane Bato',
  description: 'नेपाली श्रमिकको लागि बस बुकिङ सेवा',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ne">
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        margin: 0, 
        padding: 0,
        backgroundColor: '#f5f5f5'
      }}>
        {children}
      </body>
    </html>
  )
}

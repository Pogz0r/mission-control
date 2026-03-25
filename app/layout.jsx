import './globals.css'

export const metadata = {
  title: 'Mission Control',
  description: 'Mission Control dashboard for task flow, Discord references, and agent queues.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

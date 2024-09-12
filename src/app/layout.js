import '@/styles/globals.css'

export const metadata = {
  title: 'WEB SITE',
  description: 'ウェブサイトです。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
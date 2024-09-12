import '@/styles/globals.css'
import Script from 'next/script';
import Head from 'next/head';

export const metadata = {
  title: 'Sweetqueen Tokyo - キャスト一覧',
  description: '池袋 メンエス「SWEET QUEEN」の在籍一覧のご案内です。',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="池袋 メンエス「SWEET QUEEN」の在籍一覧のご案内です。" />
        <meta name="keywords" content="在籍一覧,池袋メンズエステ,メンエス東京,メンエス池袋," />
        <link rel="stylesheet" href="//m-a-s-u-o.sakura.ne.jp/master/public/theme/sweetqueen-tokyo.com/css/cast.css" />
        <link rel="stylesheet" href="//m-a-s-u-o.sakura.ne.jp/master/public/css/common.css" />
        <link rel="icon" href="https://sweetqueen-tokyo.com/upload/back_image/34.ico" />
        <title>在籍一覧｜池袋 メンエス｜SWEET QUEEN</title>
        <Script src="https://www.googletagmanager.com/gtm.js?id=GTM-WX7CGHP4" strategy="lazyOnload" />
    </Head>
      <body style={{ background: 'url("https://sweetqueen-tokyo.com/upload/back_image/29.jpg") fixed no-repeat center top' }}>
        {/* ヘッダー */}
        <header id="header" className="upside">
          <div className="inner clearfix">
            <h1 className="logo">
              <a href="/"><img src="https://sweetqueen-tokyo.com/upload/back_image/12.png" alt="SWEET QUEEN" /></a>
            </h1>
            <div className="header_info">
              <span className="shop">池袋 メンエス[SWEET QUEEN]</span>
              <span className="time">12:00-翌5:00 (電話受付 翌3:30)</span>
              <span className="tel">TEL: 080-3605-6747</span>
            </div>
          </div>
          <nav id="gnav" className="upside">
            <ul className="clearfix">
              <li className="gli current_top"><a href="/">トップページ</a></li>
              <li className="gli current_concept"><a href="/concept">コンセプト</a></li>
              <li className="gli current_schedule"><a href="/schedule/">出勤情報</a></li>
              <li className="gli current_system"><a href="/system/">料金システム</a></li>
              <li className="gli current_cast"><a href="/cast/">在籍一覧</a></li>
              <li className="gli current_recruit"><a href="/recruitment/">求人情報</a></li>
              <li className="gli current_access"><a href="/access/">アクセス</a></li>
            </ul>
          </nav>
        </header>

        {/* ページのコンテンツ部分 */}
        <main className="container mx-auto py-8">
          {children}
        </main>

        {/* フッター */}
        <footer id="footer">
          <div className="inner">
            <nav className="clearfix">
              <ul className="clearfix">
                <li><a href="/">トップページ</a></li>
                <li><a href="/concept">コンセプト</a></li>
                <li><a href="/schedule/">出勤情報</a></li>
                <li><a href="/system/">料金システム</a></li>
                <li><a href="/cast/">在籍一覧</a></li>
                <li><a href="https://kanto.qzin.jp/sweetqueen/?v=official" target="_blank" rel="nofollow">求人情報</a></li>
                <li><a href="/access/">アクセス</a></li>
                <li><a href="/link/">リンク</a></li>
              </ul>
            </nav>
            <p>© 2024 SWEET QUEEN. ALL RIGHTS RESERVED.</p>
            <p>当店「SWEET QUEEN」は池袋 メンエス店です。</p>
          </div>
        </footer>

        <Script src="//m-a-s-u-o.sakura.ne.jp/master/public/js/plugin.js" strategy="lazyOnload" />
        <Script src="//m-a-s-u-o.sakura.ne.jp/master/public/js/common.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}

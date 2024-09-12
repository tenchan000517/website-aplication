import styles from './system.module.css';

export const metadata = {
  title: '料金システム｜池袋 メンエス｜SWEET QUEEN',
  description: '池袋 メンエス「SWEET QUEEN」の料金システムのご案内です。',
};

export default function SystemPage() {
  return (
    <div id="wrap" className={styles.wrap}>
      <p id="header-open">12:00-翌5:00(電話受付 翌3:30)</p>

      <h2 className={styles.pagetitle}>SYSTEM<span>料金システム</span></h2>

      <nav className={styles.topCrumb} aria-label="breadcrumb">
        <ol className={styles.breadcrumb} itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item">
              <span itemProp="name">SWEET QUEEN</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">料金システム</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <ul className={styles.systemlist}>
        <li>
          <h3>コース料金</h3>
          <div>
            <img 
              src="https://sweetqueen-tokyo.com/upload/system/7.jpg?1714653365" 
              alt="コース料金" 
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

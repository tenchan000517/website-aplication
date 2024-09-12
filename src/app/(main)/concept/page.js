import styles from './concept.module.css';

export const metadata = {
  title: 'コンセプト｜池袋 メンエス｜SWEET QUEEN',
  description: '池袋 メンエス「SWEET QUEEN」のコンセプトのご案内です。',
};

export default function ConceptPage() {
  return (
    <div id="wrap" className={styles.wrap}>
      <p id="header-open">12:00-翌5:00(電話受付 翌3:30)</p>

      <h2 className={styles.pagetitle}>CONCEPT<span>コンセプト</span></h2>

      <nav className={styles.topCrumb} aria-label="breadcrumb">
        <ol className={styles.breadcrumb} itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item">
              <span itemProp="name">SWEET QUEEN</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">コンセプト</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <article className={styles.article}>
        <section>
          <h3 className={styles.sectionTitle}>当店のコンセプト</h3>
          <p className={styles.conceptText}>
            <span style={{fontFamily: '"Times New Roman", YuMincho, "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif', fontSize: '16px'}}>
              オプションALL 0円で愛嬌たっぷりの可愛さが詰まったメンズエステ！！
            </span>
            <br />
            <span style={{fontFamily: '"Times New Roman", YuMincho, "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif', fontSize: '16px'}}>
              初めて彼女のお家に遊びに行った時のドキドキ・ワクワクな非日常的な空間♪
            </span>
            <br />
            <span style={{fontFamily: '"Times New Roman", YuMincho, "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif', fontSize: '16px'}}>
              二人だけの甘い時間をお過ごしください。
            </span>
          </p>
          <div className={styles.imageContainer}>
            <img 
              src="https://sweetqueen-tokyo.com/upload/contents2/11.jpg" 
              alt="当店のコンセプト"
              className={styles.conceptImage}
            />
          </div>
        </section>
      </article>
    </div>
  );
}
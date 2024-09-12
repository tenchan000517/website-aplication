import React from 'react';
import styles from './LeftMenu.module.css';

const LeftMenu = () => {
  return (
    <section className={styles.shopData}>
      <div className={styles.shopDataHead}>
        <p className={styles.shopDetailUpdatedAt}>
          <span className={styles.updatedAtTxt}>2024/09/07(土) 00:20更新</span>
        </p>
        <p className={styles.leadTxt}>セキュリティ対策バッチリの環境で安心して働けます！</p>
        <div className={styles.shopName}>SWEET QUEEN</div>
        <div className={styles.shopInfo}>
          <p className={styles.shopPlace}>エリア：池袋</p>
          <p className={styles.shopGenre}>職種：メンズエステ（一般エステ）</p>
        </div>
      </div>
      <figure className={styles.benefitBtn}>
        <img
          alt="バニラだけの応募特典あり"
          src="https://kanto.qzin.jp/assets/img//user/pc/shop/pay1/img-benefit-btn.svg"
        />
      </figure>
      <div className={styles.shopDataBody}>
        <div className={styles.contactBtn}>
          <ul className={styles.contactBtnList}>
            <li className={styles.contactBtnItem}>
              <a className={styles.snsIcon} href="javascript:void(0);">SNS</a>
            </li>
            <li className={styles.contactBtnItem}>
              <a className={styles.telIcon} href="javascript:void(0);">電話</a>
            </li>
            <li className={styles.contactBtnItem}>
              <a className={styles.contactIcon} href="javascript:void(0);">応募・質問</a>
            </li>
            <li className={`${styles.contactBtnItem} ${styles.add}`}>
              <a className={styles.keepIcon} href="javascript:void(0);">このお店をキープする</a>
              <p className={styles.keepPopup}>キープリストに追加しました！</p>
              <p className={styles.keepPopupLimit}>キープリストがいっぱいです</p>
            </li>
          </ul>
        </div>
        <nav className={styles.innerLinkNavi}>
          <ul className={styles.innerLinkList}>
            <li className={styles.innerLinkItem}><a href="#top">お店TOP</a></li>
            <li className={styles.innerLinkItem}><a href="#wanted">急募インフォメーション</a></li>
            <li className={styles.innerLinkItem}><a href="#benefit">バニラだけ♥の応募特典</a></li>
            <li className={styles.innerLinkItem}><a href="#shop-info">お店情報</a></li>
            <li className={styles.innerLinkItem}><a href="#manager-blog">店長ブログ</a></li>
            <li className={styles.innerLinkItem}><a href="#treatment">待遇について</a></li>
            <li className={styles.innerLinkItem}><a href="#vaninterview">バニんたびゅー</a></li>
            <li className={styles.innerLinkItem}><a href="#qa">QAコンテンツ</a></li>
            <li className={styles.innerLinkItem}><a href="#application">応募・お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default LeftMenu;

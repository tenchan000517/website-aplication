// C:\website-next\src\app\recruitment\RightMenu.js
import React from 'react';
import styles from './RightMenu.module.css';

const RightMenu = () => {
  return (
    <div className={styles.rightColumn}>
      <div className={styles.btnWrap}>
        <a className={styles.toFormLink}>掲載内容に誤りがございましたらお知らせください</a>
      </div>

      <section className={styles.managerBlog} id="manager-blog">
        <h3 className={styles.managerBlogHead}>
          <img
            src="/assets/img/user/pc/shop/pay1/ttl-managerblog-c.png"
            width="130"
            height="26"
            alt="店長ブログ"
          />
        </h3>
        <div className={styles.managerBlogBody}>
          <ul className={styles.list}>
            {/* ブログアイテム */}
            <li className={styles.item}>
              <a className={styles.anchor} href="javascript:void(0);">
                <div className={styles.imgWrap}>
                  <img
                    src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/manager_blog/117713755/20240907002034.jpg"
                    alt="堂々のランキング1位獲得のアイキャッチ画像"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className={styles.colRight}>
                  <div className={styles.update}>2024年09月07日(土)00:19</div>
                  <p className={styles.title}>堂々のランキング1位獲得</p>
                  <div className={styles.text}>
                    <p>当店では圧倒的なマーケティング力と他店様との差別化を行うことに…</p>
                  </div>
                </div>
              </a>
            </li>
            {/* 他のブログアイテムも同様に追加 */}
          </ul>
          <a href="javascript:void(0);" className={styles.readMore}>
            店長ブログをもっと見る
          </a>
        </div>
      </section>

      <section className={styles.touchWidget} id="touchwidget">
        <h3>
          <img
            alt="面接HowTo動画"
            src="https://kanto.qzin.jp/assets/img/user/pc/shop/touchwidget/title.png"
          />
        </h3>
        <div className={styles.touchWidgetBody}>
          <div className={styles.iframeArea}>
            <iframe
              className={styles.movie}
              id="ifarme_touchwidget"
              src="https://kanto.qzin.jp/sweetqueen/video_iframe_shop_muted/"
              width="280"
              height="325"
              title="HowTo動画"
            ></iframe>
          </div>
          <div>
            <div className={styles.frameArea}>
              <div className={styles.frameInText}>
                <span>
                  <img
                    src="https://kanto.qzin.jp/assets/img/user/pc/shop/touchwidget/icon.svg"
                    alt=""
                  />
                </span>
                <span>音声も聞きたい場合はスピーカーマーク を押してね♪</span>
              </div>
            </div>
            <div className={styles.textArea}>
              <p>
                「さわれるHowTo動画」とは、映像をクリックして選択肢を選びながら見ることができる動画です！
              </p>
              <p>
                この動画ではまだ面接に行ったことがない方でも面接の流れやチェックポイントなどが分かるように、面接から体験入店までの流れを楽しくわかりやすくご紹介しています！
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RightMenu;

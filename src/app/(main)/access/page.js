import React from 'react';
import styles from './access.module.css'; // CSSモジュールのインポート

const AccessPage = () => {
  return (
    <div className={styles.accessContainer}>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WLBXHZW3"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      {/* Access List */}
      <div className={styles.wrap}>
        <h2 className={styles.pagetitle}>
          ACCESS<span>アクセス</span>
        </h2>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <ol>
            <li>
              <a href="/">SWEET QUEEN</a>
            </li>
            <li>アクセス</li>
          </ol>
        </nav>

        {/* Access Points */}
        <ul className={styles.accessList}>
          <li>
            <div className={styles.data}>
              <h3>
                【Aルーム】デイリーヤマザキ 池袋２丁目店
                <span>〒171-0014 東京都豊島区池袋２丁目２２−１ 添田ビル 1階</span>
              </h3>
              <img
                src="https://sweetqueen-tokyo.com/upload/access/3.jpg"
                alt="【Aルーム】デイリーヤマザキ 池袋２丁目店"
              />
            </div>
            <div className={styles.map}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d721.3454237357187!2d139.70515436175225!3d35.732821563775175!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d5921cce6cb%3A0xa06c32c8d349b5f9!2z5pel5pys44CB44CSMTcxLTAwMTQg5p2x5Lqs6YO96LGK5bO25Yy65rGg6KKL77yS5LiB55uu77yS77yS4oiS77yR"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </li>

          <li>
            <div className={styles.data}>
              <h3>
                【Bルーム】ファミリーマート立教通り店
                <span>〒171-0021 東京都豊島区西池袋３丁目２９−７</span>
              </h3>
              <img
                src="https://sweetqueen-tokyo.com/upload/access/2.jpg"
                alt="【Bルーム】ファミリーマート立教通り店"
              />
            </div>
            <div className={styles.map}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d680.8729409438444!2d139.70621113341974!3d35.73124228514214!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d5953b303af%3A0xa4c50c97a051b96d!2z44OV44Kh44Of44Oq44O844Oe44O844OIIOeri-aVmemAmuOCiuW6lw!5e0!3m2!1sja!2sjp!4v1713774894204!5m2!1sja!2sjp"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccessPage;

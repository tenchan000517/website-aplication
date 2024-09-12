import React from 'react';
import styles from './recruitmentMain.module.css';  // 修正後

const MainContent = () => {
    return (
        <div className={styles.lMainColumn} id="top">
            <div className={styles.fSpecialContents} id="special">
                <div className={styles.specialContentsHead}>
                    <div className={styles.modTab}>
                        <ul className={styles.tabHeadList}></ul>
                    </div>
                </div>
                <div className={styles.specialContentsBody}>
                    <ul className={styles.tabBodyList}>
                        <li className={styles.tabBodyItem}>
                            <div className={styles.fShopBnr}>
                                <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/240523114038main.jpeg?width=700&height=300&type=resize&quality=95" alt="SWEET QUEENの求人画像" />
                            </div>
                            <section className={styles.fShopIntro}>
                                <h3 className={styles.shopIntroHead}>
                                    <img src="/assets/img/user/pc/shop/pay1/ttl-shop-intro-c.png" width="259" height="21" alt="当店で働く3つのメリット" />
                                </h3>
                                <div className={styles.shopIntroBody}>
                                    <div>
                                        <ul className={styles.swiperWrapper}>
                                            <li className={styles.swiperSlide}>
                                                <p className={styles.pImgWrap}>
                                                    <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/240523114038sub1.jpeg?width=400&height=300&type=resize&quality=100" alt="SWEET QUEENで働くメリット1" />
                                                </p>
                                                <p className={styles.shopIntroTxt}>全額日払いで60～75％バック！指名料・オプションは100％バック！待機保証もございます♪</p>
                                            </li>
                                            <li className={styles.swiperSlide}>
                                                <p className={styles.pImgWrap}>
                                                    <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/240523114038sub2.jpeg?width=400&height=300&type=resize&quality=100" alt="SWEET QUEENで働くメリット2" />
                                                </p>
                                                <p className={styles.shopIntroTxt}>安心のオートロックドアでTV付きのモニター完備、綺麗で可愛いお部屋でお仕事できますよ♪</p>
                                            </li>
                                            <li className={styles.swiperSlide}>
                                                <p className={styles.pImgWrap}>
                                                    <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/240523114038sub3.jpeg?width=400&height=300&type=resize&quality=100" alt="SWEET QUEENで働くメリット3" />
                                                </p>
                                                <p className={styles.shopIntroTxt}>無料の研修制度あり、講師による研修があるので業界未経験の方もご安心ください♪</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </li>
                    </ul>
                </div>
            </div>

            <section className={styles.fSalary} id="salary">
                <h3 className={styles.salaryHead}>
                    <img alt="給与情報" width="700" height="30" src="https://kanto.qzin.jp/assets/img/user/pc/shop/pay1/salary/ttl-shop-salary.png?1725415337" />
                </h3>
                <div className={styles.salaryBody}>
                    <div className={styles.salaryInner}>
                        <div className={styles.salaryPrice}>
                            <p className={styles.priceHead}>
                                <span className={styles.priceTime}>9</span><span className={styles.priceTimeText}>時間勤務で</span>
                            </p>
                            <p className={styles.priceData}>
                                <span className={styles.priceType}>日給</span><span className={styles.priceNum}>70,000</span><span className={styles.priceYen}>円</span><span className={styles.priceOver}>以上</span>
                            </p>
                        </div>
                        <p className={styles.salaryTxt}>
                            ・高級マンションで完全個室<br />
                            ・安心オートロックドアでTV付きのモニター完備 <br />
                            ・エレベーター共に防犯カメラ完備<br />
                            ・Wi-Fi完備<br />
                            ・宿泊可能<br />
                            ・昇給制度<br />
                            ・お友達紹介<br />
                            ・衣装無料貸与<br />
                            ・無料研修
                        </p>
                        <p className={styles.salaryNote}>※出勤状況により金額は変わる場合もございます。詳しくはお店にお問合せください。</p>
                        <dl className={styles.salaryDl}>
                            <dt className={styles.salaryDt}><span className={styles.topSpace}>1日の接客数</span></dt>
                            <dd className={styles.salaryDd}><span className={styles.topSpace}><span className={styles.salaryEm}>3〜4</span>人</span></dd>
                            <dt className={styles.salaryDt}><span className={styles.topSpace}>1回の平均接客時間</span></dt>
                            <dd className={styles.salaryDd}><span className={styles.topSpace}><span className={styles.salaryEm}>90</span>分</span></dd>
                        </dl>
                    </div>
                </div>
            </section>

            <div className={styles.fCastFeature}>
                <h3 className={styles.castFeatureHead}>
                    <img src="/assets/img/user/pc/shop/pay1/ttl-cast-feature-c.png" width="259" height="21" alt="キャストの特集" />
                </h3>
                <div className={styles.castFeatureBody}>
                    <ul className={styles.swiperWrapper}>
                        <li className={styles.swiperSlide}>
                            <p className={styles.pImgWrap}>
                                <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/cast1.jpeg?width=400&height=300&type=resize&quality=100" alt="キャスト1" />
                            </p>
                            <p>キャスト名1</p>
                        </li>
                        <li className={styles.swiperSlide}>
                            <p className={styles.pImgWrap}>
                                <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/cast2.jpeg?width=400&height=300&type=resize&quality=100" alt="キャスト2" />
                            </p>
                            <p>キャスト名2</p>
                        </li>
                        <li className={styles.swiperSlide}>
                            <p className={styles.pImgWrap}>
                                <img src="https://d1ywb8dvwodsnl.cloudfront.net/files.qzin.jp/img/shop/sweetqueen/gimg/cast3.jpeg?width=400&height=300&type=resize&quality=100" alt="キャスト3" />
                            </p>
                            <p>キャスト名3</p>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.fSystem}>
                <h3 className={styles.systemHead}>
                    <img src="/assets/img/user/pc/shop/pay1/ttl-system-c.png" width="259" height="21" alt="システム" />
                </h3>
                <div className={styles.systemBody}>
                    <ul className={styles.systemList}>
                        <li className={styles.systemItem}>
                            <span>入会金:</span> 10,000円
                        </li>
                        <li className={styles.systemItem}>
                            <span>延長料金:</span> 5,000円 / 30分
                        </li>
                        <li className={styles.systemItem}>
                            <span>指名料:</span> 2,000円
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.fAccess}>
                <h3 className={styles.accessHead}>
                    <img src="/assets/img/user/pc/shop/pay1/ttl-access-c.png" width="259" height="21" alt="アクセス" />
                </h3>
                <div className={styles.accessBody}>
                    <p>所在地: 東京都渋谷区〇〇町1-2-3</p>
                    <p>最寄駅: 渋谷駅 徒歩5分</p>
                    <p>営業時間: 10:00〜22:00</p>
                </div>
            </div>

            <div className={styles.fCampaign}>
                <h3 className={styles.campaignHead}>
                    <img src="/assets/img/user/pc/shop/pay1/ttl-campaign-c.png" width="259" height="21" alt="キャンペーン情報" />
                </h3>
                <div className={styles.campaignBody}>
                    <ul className={styles.campaignList}>
                        <li className={styles.campaignItem}>
                            <p>初回ご利用 50% OFF</p>
                        </li>
                        <li className={styles.campaignItem}>
                            <p>友達紹介キャンペーン: 紹介で10,000円割引</p>
                        </li>
                        <li className={styles.campaignItem}>
                            <p>月末セール: 30% OFF (特定のコース限定)</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MainContent;

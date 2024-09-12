"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@/styles/globals.css'

export default function TopPage() {
  const [castList, setCastList] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function fetchData() {
      try {
        const castRes = await fetch('/cast.json');
        const castData = await castRes.json();
        setCastList(castData.filter((cast) => cast.id));

        const bannerRes = await fetch('/banners.json');
        const bannerData = await bannerRes.json();
        setBanners(bannerData);
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    }
    fetchData();
  }, []);

  if (!isClient) {
    return null; // または適切なローディング表示
  }

  const bannerSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const pickupSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div id="wrap" className="upside">
      <p id="header-open">12:00-翌5:00(電話受付 翌3:30)</p>

      <nav className="top_crumb" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li><span>SWEET QUEEN</span></li>
        </ol>
      </nav>

      <div id="main_con" className="upside" role="toolbar">
        <section className="block1">
        <section id="event">
          <Slider {...bannerSettings}>
            {banners.map((banner) => (
              <div key={banner.id}>
                <a href={banner.link}>
                  <img src={banner.imageUrl} alt={banner.alt} style={{width: '100%', height: 'auto'}} />
                </a>
              </div>
            ))}
          </Slider>
        </section>

          <section id="todayssche">
            <h2 className="subtitle">SCHEDULE<span>出勤情報</span></h2>
            <ul id="todayssche-list">
              {castList.slice(0, 7).map((cast) => (
                <li key={cast.id}>
                  <Link href={`/profile?id=${cast.id}`}>
                    <div className="ph">
                      <img
                        src={cast.thumbnail}
                        alt={cast.name}
                        className="photo-has-2"
                        data-p1={cast.thumbnail}
                        data-p2={cast.images ? cast.images[0] : ""}
                      />
                    </div>
                    <article>
                      <h3>{cast.name} ({cast.age})</h3>
                      <p className="body">{`T${cast.height} B${cast.bust}(${cast.cup}) W${cast.waist} H${cast.hip}`}</p>
                    </article>
                    <p className="time">12:00-20:00</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="subcont">
            <h2 className="subtitle">PICK UP<span>ピックアップ</span></h2>
            <Slider {...pickupSettings}>
              {castList.slice(0, 6).map((cast) => (
                <div key={cast.id}>
                  <Link href={`/profile?id=${cast.id}`}>
                    <div className="ph ajph">
                      <img
                        src={cast.thumbnail}
                        alt={cast.name}
                        className="photo-has-2"
                        data-p1={cast.thumbnail}
                        data-p2={cast.images ? cast.images[0] : ""}
                      />
                    </div>
                    <article className="ajarticle">
                      <h3 className="ajh3">{cast.name} ({cast.age})</h3>
                      <p className="body">{`T${cast.height} B${cast.bust}(${cast.cup}) W${cast.waist} H${cast.hip}`}</p>
                    </article>
                  </Link>
                </div>
              ))}
            </Slider>
          </section>
        </section>

        <section className="block2">
          <div className="tag_free">
            <div className="twitter-timeline twitter-timeline-rendered" style={{display: 'flex', width: '100%', maxWidth: '100%', marginTop: 0, marginBottom: 0}}>
              <iframe 
                id="twitter-widget-0" 
                scrolling="no" 
                frameBorder="0" 
                allowTransparency="true" 
                allowFullScreen="true" 
                className="" 
                title="Twitter Timeline" 
                src="https://syndication.twitter.com/srv/timeline-profile/screen-name/SweetQueen_02?dnt=false&embedId=twitter-widget-0&frame=false&hideBorder=false&hideFooter=false&hideHeader=false&hideScrollBar=false&lang=ja&maxHeight=500px&origin=https%3A%2F%2Fsweetqueen-tokyo.com%2F&sessionId=2545fabf2635c229c91b269588c08da991cde470&showHeader=true&showReplies=false&transparent=false&widgetsVersion=2615f7e52b7e0%3A1702314776716"
                style={{position: 'static', visibility: 'visible', width: '313px', height: '500px', display: 'block', flexGrow: 1}}
              ></iframe>
            </div>
          </div>

          <section id="banner">
            <ul>
              <li>
                <a href="https://pay.star-pay.jp/site/com/shop.php?tel=&payc=S1234&guide=">
                  <img src="https://sweetqueen-tokyo.com/upload/banner/17.png?1717139262" alt="" />
                </a>
              </li>
            </ul>
          </section>

          <div className="tag_free">
            <div>
              <p style={{textAlign: 'center', paddingBottom: '3px', margin: 0}}>
                <a rel="nofollow" href="https://kanto.qzin.jp/sweetqueen/?v=official" target="_blank">
                  <img src="https://ad.qzin.jp/img/vanilla468-60.gif" width="468" border="0" alt="SWEET QUEENで稼ぐならバニラ求人" />
                </a>
              </p>
            </div>
            <div>
              <p style={{textAlign: 'center', paddingBottom: '3px', margin: 0}}>
                <a rel="nofollow" href="https://mens-qzin.jp/" target="_blank">
                  <img src="https://mens-qzin.jp/assets/img/entry/pc/link/mens468_60.png" width="468" height="60" border="0" alt="稼げる男性高収入求人・アルバイトはメンズバニラ" />
                </a>
              </p>
            </div>
            <a href="https://esthe-r.com/?m=shop/index®ion=3&pref=13&area=31">
              <img src="https://esthe-r.com/images/user/bnr_234x060.jpg" alt="東京都池袋・目白のメンズエステ求人・高収入アルバイト「メンエスリクルート」" />
            </a>
            <a href="https://esta-kanto.com/">
              <img src="https://sweetqueen-tokyo.com/upload/pub/esta-200_40.jpg" alt="" width="100%" height="40" />
            </a>
            <a href="https://mens-mg.com/ranking_area.php?area=0100" target="_blank" rel="noopener">
              <img src="https://mens-mg.com/banner/234x60_0100.png" alt="池袋のメンズエステ店人気ランキング" />
              <br />池袋のメンズエステ店人気ランキング
            </a>
            <a href="https://www.aroma-baito.com/">
              <img src="https://www.aroma-baito.com/img/banner200.gif" alt="メンズエステ・セラピスト高収入求人情報 アロマバイトナビ" />
            </a>
            <a href="https://www.aroma-yoyaku.com/">
              <img src="https://www.aroma-yoyaku.com/img/200.gif" alt="メンズエステ・出張マッサージの検索サイト アロマ予約.com" />
            </a>
            <a href="http://www.esthe-de-job.com/">
              <img src="https://sweetqueen-tokyo.com/upload/pub/200x40.jpg" alt="" width="200" height="40" />
            </a>
            <a href="https://esthe-woods.com/tokyo/shop/?search&area=76" target="_blank">
              <img src="https://esthe-woods.com/html/banner/esthe_woods_200_40.jpg" width="100%" border="0" alt="東京の池袋・代々木で非風俗エステを探すなら「エステの森」" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import styles from "./schedule.module.css"; // スタイルのインポート

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(0);
  const [castList, setCastList] = useState([]);

  useEffect(() => {
    async function fetchCastData() {
      try {
        const res = await fetch('/cast.json');  // ローカルのJSONファイルを取得
        const data = await res.json();
        setCastList(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    }
    fetchCastData();
  }, []);

  const dates = ["9/7", "9/8", "9/9", "9/10", "9/11", "9/12", "9/13"];

  return (
    <div id="wrap" className={styles.scheduleContainer}>
      <p id="header-open" className={styles.headerOpen}>12:00-翌5:00(電話受付 翌3:30)</p>

      {/* ページタイトル */}
      <h2 className={styles.pageTitle}>SCHEDULE<span>出勤情報</span></h2>

      {/* パンくずリスト */}
      <nav className={styles.breadcrumb}>
        <ol>
          <li><a href="/">SWEET QUEEN</a></li>
          <li>出勤情報</li>
        </ol>
      </nav>

      {/* 日付ナビゲーション */}
      <ul id="daynavi" className={styles.dayNavi}>
        {dates.map((date, index) => (
          <li key={index}>
            <a
              href="#"
              className={index === selectedDate ? styles.current : ""}
              onClick={() => setSelectedDate(index)}
            >
              <p><span className={styles.month}>{date}</span></p>
              <p className={styles.dotw}>{["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"][index]}</p>
            </a>
          </li>
        ))}
      </ul>

      {/* キャスト一覧 */}
      <ul id="list" className={styles.castList}>
        {castList.map((cast) => (
          <li key={cast.id} className={styles.listItem}>
            <a href={`/profile?id=${cast.id}`}>
              <div className={styles.ph}>
                <img
                  className={styles.photo}
                  src={cast.thumbnail}
                  alt={`${cast.name}の画像`}
                />
              </div>
              <article>
                <h3>{cast.name} ({cast.age}歳)</h3>
                <p className="body">T{cast.height} B{cast.bust}({cast.cup}) W{cast.waist} H{cast.hip}</p>
                <div className={styles.timeData}>
                  <p className={styles.time}>{cast.schedule}</p>
                </div>
              </article>
            </a>
          </li>
        ))}
      </ul>

      {/* 次週リンク */}
      <div id="week-next" className={styles.weekNext}>
        <nav>
          <ul>
            <li>
              <a href="/schedule?s=2024-09-14">
                <i className="fa fa-angle-right" aria-hidden="true"></i>
                <span>次週</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import styles from './page.module.css';  // 正しいCSSパスのまま

export default function Schedule() {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 仮のスケジュールデータ
  const scheduleData = [
    { date: '9/7(土)', time: '18:00 | 03:00' },
    { date: '9/8(日)', time: '13:00 | 03:00' },
    { date: '9/9(月)', time: '' },
    { date: '9/10(火)', time: '18:00 | 03:00' },
    { date: '9/11(水)', time: '19:00 | 03:00' },
    { date: '9/12(木)', time: '13:00 | 03:00' },
    { date: '9/13(金)', time: '19:00 | 03:00' },
  ];

  return (
    <div>
      <div className={styles.scheduleBtnArea}>
        <ul className={styles.scheduleBtnList}>
          <li className={styles.scheduleBtnItem}>
            <a href="#" className={styles.scheduleLastWeekBtn}>
              <i className="fa fa-angle-left" aria-hidden="true"></i>
              <span>前週</span>
            </a>
          </li>
          <li className={styles.scheduleBtnItem}>
            <a href="#" className={styles.scheduleNextWeekBtn}>
              <i className="fa fa-angle-right" aria-hidden="true"></i>
              <span>次週</span>
            </a>
          </li>
        </ul>
      </div>
      <div id="schebox" className={styles.schInner}>
        <ul className={styles.pc}>
          {scheduleData.map((day, index) => (
            <li key={index}>
              <div className={styles.infoHeader}>
                <p className={styles.days}>{day.date}</p>
              </div>
              <p className={styles.time}>{day.time}</p>
            </li>
          ))}
        </ul>
        <div className={styles.sp}>
          <ul className={styles.scheduleList}>
            {scheduleData.map((day, index) => (
              <li key={index} className={styles.scheduleItem}>
                <div className={styles.scheduleLeft}>
                  <p className={styles.scheduleDays}>{day.date}</p>
                </div>
                <div className={styles.scheduleRight}>
                  <p className={styles.scheduleTime}>{day.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
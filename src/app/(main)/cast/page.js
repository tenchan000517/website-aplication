"use client";
import styles from './castList.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // ← これを追加

export default function CastList() {
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

  return (
    <div className={styles.castListContainer}>
      <h2 className={styles.pageTitle}>CAST<span>在籍一覧</span></h2>
      <ul className={styles.galList}>
        {castList.map(cast => (
          <li className={styles.listItem} key={cast.id}>
            <Link href={`/cast/${cast.id}`}>
              <div className={styles.ph}>
                <img src={cast.thumbnail} alt={cast.name} />
              </div>
              <article>
                <div className={styles.sns}>
                  <p className={styles.sns02}>Twitter</p>
                </div>
                <h3 className={styles.castName}>{cast.name} ({cast.age})</h3>
                <p className={styles.body}>{`T${cast.height} B${cast.bust}(${cast.cup}) W${cast.waist} H${cast.hip}`}</p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
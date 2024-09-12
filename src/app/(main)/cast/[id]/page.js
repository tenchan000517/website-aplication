'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';  // 個別キャストページのスタイル
import ImageGallery from '../../../../components/main/ImageGallery';
import Schedule from './Schedule';

export default function CastPage({ params }) {
  const [cast, setCast] = useState(null);
  const [commonComment, setCommonComment] = useState('');

  useEffect(() => {
    async function fetchCastData() {
      try {
        const res = await fetch('/cast.json');
        const data = await res.json();
        const commonCommentObj = data.find(item => item.common_comment);
        setCommonComment(commonCommentObj ? commonCommentObj.common_comment : '');
        const foundCast = data.find(c => c.id === parseInt(params.id));
        setCast(foundCast);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    }
    fetchCastData();
  }, [params.id]);

  if (!cast) {
    return <p>読み込み中...</p>;
  }

  return (
    <div id="wrap" className={styles.wrap}>
      <h2 className={styles.pageTitle}>PROFILE<span>プロフィール</span></h2>
      
      <div id="topbox" className={styles.topBox}>
        <section id="photodata" className={styles.photoData}>
          <ImageGallery images={cast.images} name={cast.name} />
        </section>

        <section id="profdata" className={styles.profData}>
          <h3 className={styles.castName}>{cast.name}({cast.age})</h3>
          <p className={styles.body}>{`T${cast.height} B${cast.bust}(${cast.cup}) W${cast.waist} H${cast.hip}`}</p>
          <div className={styles.type}>
            <ul>
              {cast.type && cast.type.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <dl>
            <dt>コメント</dt>
            <dd>
              {commonComment && (
                <>
                  {commonComment}
                  <br /><br />
                </>
              )}
              {cast.comment.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </dd>
          </dl>
        </section>
      </div>
      
      <div id="bottombox" className={styles.bottomBox}>
        <h2 className={styles.subTitle}>SCHEDULE<span>出勤スケジュール</span></h2>
        <Schedule />
      </div>
    </div>
  );
}
// app/components/CastList.js
import '../styles/page.css';  // スタイルのインポート
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CastList() {
  const [castList, setCastList] = useState([]);

  useEffect(() => {
    async function fetchCastData() {
      try {
        const res = await fetch('/cast.json');  // JSONデータを取得
        const data = await res.json();
        setCastList(data);
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      }
    }
    fetchCastData();
  }, []);

  return (
    <div>
      <h2 className="pagetitle">CAST<span>在籍一覧</span></h2>
      <ul className="gallist listswich">
        {castList.map(cast => (
          <li className="list__item" key={cast.id}>
            <Link href={`/cast/${cast.id}`}>
              <div className="ph">
                <img src={cast.thumbnail} alt={cast.name} />
              </div>
              <article>
                <h3>{cast.name} ({cast.age})</h3>
                <p className="body">{`T${cast.height} B${cast.bust}(${cast.cup}) W${cast.waist} H${cast.hip}`}</p>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

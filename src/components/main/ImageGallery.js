'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ImageGallery.module.css';  // 正しいパスでCSSモジュールをインポート

export default function ImageGallery({ images, name }) {
  const [mainImage, setMainImage] = useState(0);
  const [startX, setStartX] = useState(null);
  const [endX, setEndX] = useState(null);
  const mainImageRef = useRef(null);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!mainImageRef.current) return;
      const touchObject = e.changedTouches[0];
      const touchX = touchObject.pageX;
      const clientRect = mainImageRef.current.getBoundingClientRect();
      const positionX = clientRect.left + window.pageXOffset;
      setEndX(touchX - positionX);
    };

    const handleTouchStart = (e) => {
      if (!mainImageRef.current) return;
      const touchObject = e.changedTouches[0];
      const touchX = touchObject.pageX;
      const clientRect = mainImageRef.current.getBoundingClientRect();
      const positionX = clientRect.left + window.pageXOffset;
      setStartX(touchX - positionX);
    };

    const handleTouchEnd = () => {
      if (startX !== null && endX !== null) {
        const diff = endX - startX;
        if (Math.abs(diff) > 100) {
          let next = mainImage;
          if (diff > 0) {
            next = (next + 1) % images.length;
          } else {
            next = (next - 1 + images.length) % images.length;
          }
          setMainImage(next);
        }
      }
      setStartX(null);
      setEndX(null);
    };

    const mainImageElement = mainImageRef.current;

    if (mainImageElement) {
      mainImageElement.addEventListener('touchmove', handleTouchMove, { passive: true });
      mainImageElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      mainImageElement.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (mainImageElement) {
        mainImageElement.removeEventListener('touchmove', handleTouchMove);
        mainImageElement.removeEventListener('touchstart', handleTouchStart);
        mainImageElement.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [mainImage, images.length, startX, endX]);

  return (
    <>
      <div id="mainImage" className={styles.mainImage}>
        <div className={styles.ldsRing}><div></div><div></div><div></div><div></div></div>
        <div className={styles.ph2}>
          <img 
            ref={mainImageRef}
            src={images[mainImage]} 
            alt={`${name}${mainImage + 1}`} 
            data-num={mainImage + 1} 
            data-max={images.length}
          />
        </div>
      </div>
      <div id="imageList" className={styles.imageList}>
        <ul>
          {images.map((img, index) => (
            <li key={index}>
              <div className={styles.ph2_vthumb}>
                <img 
                  src={img} 
                  id={`thum-${index + 1}`} 
                  alt={`${name}${index + 1}`}
                  onClick={() => setMainImage(index)}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Store } from 'lucide-react';
import styles from './ShopList.module.css';

export default function ShopList({ shops, selectedShop, onSelectShop, onShopAdded }) {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newShop = await onShopAdded(data);
      console.log('New shop added:', newShop);
      reset();
    } catch (error) {
      console.error('Error adding shop:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.shopList}>
      <h2 className={styles.title}>店舗一覧</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <input {...register('name')} placeholder="店舗名" className={styles.input} />
        <button type="submit" className={styles.addButton} disabled={isSubmitting}>
          <Plus size={16} />
          {isSubmitting ? '追加中...' : '追加'}
        </button>
      </form>
      <ul className={styles.list}>
        {shops.map((shop) => (
          <li 
            key={shop.shopId} 
            onClick={() => onSelectShop(shop)}
            className={`${styles.listItem} ${selectedShop?.shopId === shop.shopId ? styles.selected : ''}`}
          >
            <Store size={16} className={styles.icon} />
            {shop.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
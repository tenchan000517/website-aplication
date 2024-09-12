import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, Trash2 } from 'lucide-react';
import styles from './ShopDetails.module.css';

export default function ShopDetails({ shop, onUpdate, onDelete }) {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({
      shopId: shop.shopId,
      name: shop.name,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      email: shop.email,
      openingHours: shop.openingHours,
      closedHours: shop.closedHours,
      description: shop.description,
    });
  }, [shop, reset]);

  const onSubmit = async (data) => {
    await onUpdate(shop.shopId, data);
    alert('店舗情報が更新されました');
  };

  return (
    <div className={styles.shopDetails}>
      <h2 className={styles.title}>店舗詳細: {shop.name}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>店舗ID</label>
          <input value={shop.shopId} disabled className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>店舗名</label>
          <input {...register('name')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>住所</label>
          <input {...register('address')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>電話番号</label>
          <input {...register('phoneNumber')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>メールアドレス</label>
          <input {...register('email')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>開店時間</label>
          <input {...register('openingHours')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>閉店時間</label>
          <input {...register('closedHours')} className={styles.input} />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>備考</label>
          <textarea {...register('description')} className={styles.textarea} rows="3" />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.saveButton}>
            <Save size={16} />
            更新
          </button>
          <button type="button" onClick={() => onDelete(shop.shopId)} className={styles.deleteButton}>
            <Trash2 size={16} />
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
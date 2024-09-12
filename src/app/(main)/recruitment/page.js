import React from 'react';
import styles from './recruitment.module.css';
import LeftMenu from '@components/main/recruitment/LeftMenu';
import RightMenu from '@components/main/recruitment/RightMenu';
import MainContent from '@components/main/recruitment/main';

const RecruitmentPage = () => {
  return (

    <div className={styles.recruitmentContainer}>
      <main className={styles.recruitmentMainContents}>
        <div className={styles.recruitmentContainer} style={{ position: 'relative' }}>
          <div className={styles.recruitmentSideColumn}>
            <LeftMenu />
          </div>


          {/* メインコンテンツ */}
          <div className={styles.lMainColumn}>
            <MainContent />  {/* main.js の内容をここに適用します */}
          </div>

          <div className={styles.recruitmentRightColumn + ' ' + styles.recruitmentFixedColumn}>
            <RightMenu />
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruitmentPage;

async function cleanupDriveExplicit() {
    const companyCode = '20240910002'; // 企業コード
    const shopId = '27';
  
    // 保持するフォルダのID
    const keepFolderIds = [
      '1WECKs466MvEzlOkNQAnKJPpIwJxzN7Z0', // 27フォルダ
      '1ihlVAcLfyc83X5_sTUkDoTdX0sR39dsL', // membersフォルダ
      '1nGg-MsYfR5nWVuuSBciiPcp7oWG1Fx2N', // 5フォルダ（memberId）
      '1fHjAzthpE05RDLkmps72Wc8Yjk-G1QNF', // imagesフォルダ
      '1coA33d830zT3VC0YSbU80f1JTIW_7kZh', // publicフォルダ
      '1OBYbtoB80jXmkvURF5Bdk3oV2_b-FqVl', // docフォルダ
      '1p1Qwf56V5lg02cGYrFQdq2Fzc7KpRUqQ', // imagesフォルダ（public内）
    ];
  
    // 削除するフォルダとファイルのID
    const deleteIds = [
      '1Ih_6wMdOfLxKxeiKDJUhG53-FG6mlsqR', // images
      '1TWhGVtMjzXVbgAbJOCZQLw_Ze1eYrZNf', // New Folder
      '1YZSAws9KYvaTkIgO9AFVNELB8nxWQyHk', // New Folder
      '1LTP4woZ6Ia719GDu4QCcQjSYTouehaCF', // New Folder
      '1JkJstOrs-_VghUjK4uyuYQL3Hn8l5ys-', // New Folder
      '1hi1BUBWlnlaUx_SbnA4pdWMimyEWMPZT', // 20240910001
      '1mGXZZb_C4edHGRKO3B85eEQpLMf_c2Dc', // 001
      '1xkynPZzEwRkK6Sd-YlRKEMBlK8-qokpr', // 25467725.png
      '1it47HcwV3knf7rpncsd0l0JmoQeFGqX0', // 25396590.png
      '1uoyO5s_hHd5WVHtbvxnEr7DwLrLIs7yF', // 25166282.png
      '18r8WwCfnWGtfAZxvqtiwl3QOM8ksBi9n', // 24192645.png
      '1m05LOosLE9Ds78e2pNlg6R8ehnnCukPT', // 25334574.png
      '1-w2YBdAmNvdi3eSUk4EDtCpRQyam-ZlF', // 25282025.png
      '1I-1DvycX8s2KiuD6qMCoqGBpql2UEySv', // 24192645.png
      '19pA6Skj34viyfs8l3wE876rurnhLblb0', // 25414570.png
      '1dkp0tGPViWPbToV26Yy9maCY0bwo-SmE', // 25430413.png
      '1pAwyn7jRkiwk7zx8-e9PIWf870ObNhhu', // グレーと白　ビジネス　営業資料　プレゼンテーション (6).png
    ];
  
    try {
      // API呼び出し
      const response = await fetch('/api/drive/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyCode,
          shopId,
          keepFolderIds,
          deleteIds
        }),
      });
  
      if (!response.ok) {
        throw new Error('Cleanup failed');
      }
  
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
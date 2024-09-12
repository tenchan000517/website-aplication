"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Folder, File, ArrowLeft, Home, Upload, Trash2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const SHOPS_SHEET_NAME = process.env.GOOGLE_SHOPS_SHEET_NAME || 'shops';

const LibraryManagement = () => {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({ id: null, name: 'Home' });
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState('');
  const [memberId, setMemberId] = useState('');
  const [shops, setShops] = useState([]);
  const [members, setMembers] = useState([]); 
  const [filePreviews, setFilePreviews] = useState([]); // プレビュー用のステートを追加
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]); // アップロード予定のファイル
  const [companyCode, setCompanyCode] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // 追加
  
  useEffect(() => {
    fetchShops();
    fetchCompanyCode();
  }, []);

  useEffect(() => {
    if (companyCode) {
      fetchDirectoryContents();
    }
  }, [companyCode, currentPath]);

  const fetchCompanyCode = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/company-code');
      if (res.ok) {
        const { companyCode } = await res.json();
        setCompanyCode(companyCode);
      } else {
        throw new Error('Failed to fetch company code');
      }
    } catch (error) {
      console.error('Error fetching company code:', error);
      setError('companyCodeの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCompanyCode = async () => {
      try {
        const res = await fetch('/api/company-code');
        if (res.ok) {
          const { companyCode } = await res.json();

          setCompanyCode(companyCode);
          setCurrentFolder({ id: companyCode, name: 'Company' });
          setBreadcrumbs([{ id: companyCode, name: 'Company' }]);
          console.log('Fetching companyCode:', companyCode); // デバッグログ
        }
      } catch (error) {
        console.error('Error fetching company code:', error);
      }
    };
    fetchCompanyCode();
  }, []);

  useEffect(() => {
    if (selectedShopId) {
      fetchMembers(selectedShopId);
      fetchFiles();
    }
  }, [currentFolder, selectedShopId, memberId]);

  const fetchShops = async () => {
    try {
      const res = await fetch('/api/shops');
      if (!res.ok) throw new Error('Failed to fetch shops');
      const data = await res.json();
      setShops(data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  useEffect(() => {
    // Google Drive画像のURLを最適化
    const optimizeGoogleDriveUrls = async () => {
      const optimizedImages = await Promise.all(
        existingImages.map(async (image) => ({
          ...image,
          optimizedUrl: `/api/proxy-image?id=${image.id}&name=${encodeURIComponent(image.name)}`
        }))
      );
      setExistingImages(optimizedImages);
    };

    if (existingImages.length > 0) {
      optimizeGoogleDriveUrls();
    }
  }, [existingImages]);

  const fetchMembers = async (shopId) => {
    try {
      console.log('Fetching members for shopId:', shopId); // デバッグログ
      const res = await fetch(`/api/members?shopId=${shopId}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server response:', errorText); // デバッグログ
        throw new Error(`Failed to fetch members: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log('Fetched members:', data); // デバッグログ
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchFiles = async () => {
    if (!companyCode) return; // companyCode が設定されるまで待機

    try {
      const role = session?.user?.role || 'admin';
      const res = await fetch(`/api/drive?role=${role}&companyCode=${companyCode}&shopId=${selectedShopId}&memberId=${memberId}`);
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setFilePreviews(acceptedFiles.map((file) => URL.createObjectURL(file))); // プレビュー用のファイルURLを生成
    setSelectedUploadFiles(acceptedFiles); // アップロード用のファイルをセット
  }, []);

  const handleUpload = async () => {
    console.log('Upload started'); // ログ追加

    if (!companyCode) return; // companyCode が設定されるまで待機
    console.log('Company code not set, aborting upload'); // ログ追加

    setIsUploading(true);
    try {
      for (let file of selectedUploadFiles) {
        console.log(`Uploading file: ${file.name}`); // ログ追加

        const formData = new FormData();
        formData.append('file', file);
        formData.append('shopId', selectedShopId);
        formData.append('memberId', memberId);
        formData.append('folderType', 'images');

        console.log('FormData:', Object.fromEntries(formData)); // ログ追加（ファイル以外の内容を表示）
  
        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (!res.ok) {
            const errorText = await res.text();
            console.error('Upload failed:', errorText); // ログ追加
            throw new Error(`Failed to upload file: ${errorText}`);
          }
        
          console.log(`File uploaded successfully: ${file.name}`); // ログ追加

        }
        console.log('All files uploaded, fetching updated file list'); // ログ追加
        await fetchFiles();

      setFilePreviews([]);
      setSelectedUploadFiles([]);
      console.log('Upload process completed'); // ログ追加

    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadToPath = async () => {
    setIsUploading(true);
    try {
      for (let file of selectedUploadFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', [companyCode, ...currentPath].join('/'));
  
        const res = await fetch('/api/drive/upload-to-path', {
          method: 'POST',
          body: formData,
        });
  
        if (!res.ok) {
          throw new Error(`Failed to upload file: ${await res.text()}`);
        }
      }
      await fetchDirectoryContents();
      setFilePreviews([]);
      setSelectedUploadFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleShopChange = (e) => {
    const newShopId = e.target.value;
    setSelectedShopId(newShopId);
    if (newShopId) {
      const selectedShop = shops.find(shop => shop.shopId === newShopId);
      setCurrentFolder({ id: newShopId, name: selectedShop?.name || 'Shop' });
      setBreadcrumbs(prevBreadcrumbs => [
        prevBreadcrumbs[0], // Companyのブレッドクラムを保持
        { id: newShopId, name: selectedShop?.name || 'Shop' }
      ]);
    } else {
      // 店舗が選択されていない場合は、companyCodeフォルダに戻る
      setCurrentFolder(prevFolder => ({ id: prevFolder.id, name: 'Company' }));
      setBreadcrumbs(prevBreadcrumbs => [prevBreadcrumbs[0]]);
    }
    setMemberId(''); // メンバー選択をリセット
    
    // 新しい店舗が選択されたら、ファイル一覧を更新
    if (newShopId) {
      fetchFiles();
    }
  };

  const fetchDirectoryContents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const path = [companyCode, ...currentPath].join('/');
      const res = await fetch(`/api/drive/list?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error('Failed to fetch directory contents');
      const data = await res.json();
      setDirectories(data.folders || []);
      setFiles(data.documents || []);
    } catch (error) {
      console.error('Error fetching directory contents:', error);
      setError('ディレクトリ内容の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const handleFileClick = (file) => {
    if (file.mimeType.startsWith('image/')) {
      setPreviewImage(file);
    }
  };

  const getImageSrc = (file) => {
    if (file.optimizedUrl) {
      return file.optimizedUrl;
    }
    if (file.thumbnailLink) {
      return file.thumbnailLink.replace('=s220', '=s1000');
    }
    return '/placeholder.jpg'; // プレースホルダー画像のパス
  };

  const imageLoader = ({ src }) => {
    return `${src}`;
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  const handleDelete = async () => {
    try {
      for (let fileId of selectedFiles) {
        const res = await fetch(`/api/drive/${fileId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete file');
      }
      fetchFiles();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-left mb-6">アップロード</h2>

      <div className="flex space-x-4 items-center">
        <div className="w-1/3">
          <label className="block text-lg font-medium mb-2">店舗選択</label>
          <select
            value={selectedShopId}
            onChange={handleShopChange}
            className="w-full border p-2 rounded"
          >
            <option value="">店舗を選択</option>
            {shops.map((shop, index) => (
              <option key={`${shop.shopId}-${index}`} value={shop.shopId}>{shop.name}</option>
            ))}
          </select>
        </div>

        <div className="w-1/3">
          <label className="block text-lg font-medium mb-2">メンバー選択</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!selectedShopId}
          >
            <option value="">メンバーを選択 (任意)</option>
            {members.map((member, index) => (
              <option key={`${member.memberId}-${index}`} value={member.memberId}>{member.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* ドラッグ＆ドロップエリア */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-6 text-center w-1/2 flex flex-col justify-center items-center ${isDragActive ? 'bg-blue-50' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div>
              <p className="mb-2">ここにファイルをドロップ...</p>
              <Upload className="mx-auto" size={40} />
            </div>
          ) : (
            <div>
              <p className="mb-2">ドラッグ＆ドロップ、またはファイルを選択</p>
              <Upload className="mx-auto" size={40} />
            </div>
          )}
        </div>

        {/* プレビューエリア */}
        <div className="w-1/2 overflow-auto border p-2 flex flex-col justify-start items-center">
        <h3 className="text-lg font-medium mb-2 text-center">プレビュー</h3>
          {filePreviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 w-full">
            {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                <img src={preview} alt="preview" className="w-full h-auto max-h-96 object-contain mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">選択されたファイルがありません</p>
          )}
        </div>
      </div>

      {/* アップロードボタン */}
      {selectedUploadFiles.length > 0 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            アップロード
          </button>
          <button
            onClick={() => { setFilePreviews([]); setSelectedUploadFiles([]); }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            キャンセル
          </button>
        </div>
      )}

      {isUploading && <p className="text-center text-blue-500">アップロード中...</p>}

    {/* パンくずリスト */}
    <div className="flex items-center space-x-2 mb-4">
        <button onClick={() => setCurrentPath([])} className="text-blue-500 hover:underline">
          <Home size={16} />
        </button>
        {currentPath.map((folder, index) => (
          <React.Fragment key={index}>
            <span>/</span>
            <button
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              className="text-blue-500 hover:underline"
            >
              {folder}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* ディレクトリとファイル表示 */}
      <div className="grid grid-cols-6 gap-4">
        {currentPath.length > 0 && (
          <div
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={handleBackClick}
          >
            <ArrowLeft className="mx-auto mb-2" size={40} />
            <p className="text-center text-sm truncate">..</p>
          </div>
        )}
        {directories.map((dir) => (
          <div
            key={dir.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleFolderClick(dir.name)}
          >
            <Folder className="mx-auto mb-2" size={40} />
            <p className="text-center text-sm truncate">{dir.name}</p>
          </div>
        ))}
        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            {file.mimeType.startsWith('image/') ? (
              <img src={file.thumbnailLink} alt={file.name} className="w-full h-32 object-cover mb-2" />
            ) : (
              <File className="mx-auto mb-2" size={40} />
            )}
            <p className="text-center text-sm truncate">{file.name}</p>
          </div>
        ))}
      </div>

    {/* アップロード領域 */}
    {/* <div {...getRootProps()} className="border-2 border-dashed p-6 text-center mt-6">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>ファイルをドロップしてアップロード</p>
        ) : (
          <p>クリックまたはドラッグ＆ドロップでファイルをアップロード</p>
        )}
      </div> */}

      {/* アップロードボタン */}
      {/* {selectedUploadFiles.length > 0 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleUploadToPath}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isUploading}
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </button>
          <button
            onClick={() => { setFilePreviews([]); setSelectedUploadFiles([]); }}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            キャンセル
          </button>
        </div>
      )} */}

    {/* 画像プレビューモーダル */}
    {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-3xl relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <X size={24} />
            </button>
            <Image
              loader={imageLoader}
              src={getImageSrc(previewImage)}
              alt={previewImage.name}
              width={1000}
              height={1000}
              className="max-w-full max-h-[calc(100vh-100px)] object-contain"
            />
            <p className="mt-2 text-center">{previewImage.name}</p>
          </div>
        </div>
      )}

      {/* ファイル削除ボタン */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <Trash2 size={16} /> <span>選択したファイルを削除</span>
        </button>
      )}
    </div>
  );
};

export default LibraryManagement;

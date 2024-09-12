import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Folder, File, ArrowLeft, Home, Upload, Trash2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const ShopLibraryManagement = ({ shopId }) => {
  const { data: session } = useSession();
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [companyCode, setCompanyCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // 追加

  useEffect(() => {
    fetchCompanyCode();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (companyCode) {
      fetchDirectoryContents();
    }
  }, [companyCode, currentPath, memberId]);

  const fetchCompanyCode = async () => {
    try {
      const res = await fetch('/api/company-code');
      if (res.ok) {
        const { companyCode } = await res.json();
        setCompanyCode(companyCode);
      } else {
        throw new Error('Failed to fetch company code');
      }
    } catch (error) {
      console.error('Error fetching company code:', error);
      setError('会社コードの取得に失敗しました。');
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

  const fetchMembers = async () => {
    try {
      const res = await fetch(`/api/members?shopId=${shopId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch members: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('メンバー情報の取得に失敗しました。');
    }
  };

  const fetchDirectoryContents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const path = [companyCode, shopId, ...currentPath].join('/');
      const res = await fetch(`/api/drive/list?path=${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error('Failed to fetch directory contents');
      const data = await res.json();

    // // ここでログを追加
    // data.folders && data.folders.forEach(file => {
    //   console.log(`Folder: ${file.name}, thumbnailLink: ${file.thumbnailLink}, webViewLink: ${file.webViewLink}`);
    // });
    // data.documents && data.documents.forEach(file => {
    //   console.log(`File: ${file.name}, thumbnailLink: ${file.thumbnailLink}, webViewLink: ${file.webViewLink}`);
    // });

      setFiles(data.folders ? [...data.folders, ...(data.documents || [])] : []);
    } catch (error) {
      console.error('Error fetching directory contents:', error);
      setError('ディレクトリ内容の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setFilePreviews(acceptedFiles.map((file) => URL.createObjectURL(file)));
    setSelectedUploadFiles(acceptedFiles);
  }, []);

  const handleUpload = async () => {
    if (!companyCode) return;
    setIsUploading(true);
    try {
      for (let file of selectedUploadFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', [companyCode, shopId, ...currentPath, memberId].filter(Boolean).join('/'));

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
      setError('ファイルのアップロードに失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFolderClick = (folderName) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const handleBackClick = () => {
    setCurrentPath(currentPath.slice(0, -1));
  };

  const extractFileIdFromWebViewLink = (webViewLink) => {
    const match = webViewLink.match(/\/d\/(.*?)\//);
    return match ? match[1] : null;
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
  

  // const handleFileClick = (file) => {
  //   if (file.mimeType.startsWith('image/')) {
  //     setPreviewImage(file);
  //   }
  // };

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
      fetchDirectoryContents();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error deleting files:', error);
      setError('ファイルの削除に失敗しました。');
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
      <h2 className="text-3xl font-bold text-left mb-6">ライブラリ</h2>

      <div className="flex space-x-4 items-center">
        <div className="w-1/3">
          <label className="block text-lg font-medium mb-2">メンバー選択</label>
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">メンバーを選択 (任意)</option>
            {members.map((member, index) => (
              <option key={`${member.memberId}-${index}`} value={member.memberId}>{member.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex space-x-6">
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

      {selectedUploadFiles.length > 0 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={handleUpload}
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
      )}

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
        {files.map((file) => (
          <div
            key={file.id}
            className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => file.mimeType === 'application/vnd.google-apps.folder' ? handleFolderClick(file.name) : handleFileClick(file)}
          >
            {file.mimeType === 'application/vnd.google-apps.folder' ? (
              <Folder className="mx-auto mb-2" size={40} />
            ) : file.mimeType.startsWith('image/') ? (
              <img src={file.thumbnailLink} alt={file.name} className="w-full h-32 object-cover mb-2" />
            ) : (
              <File className="mx-auto mb-2" size={40} />
            )}
            <p className="text-center text-sm truncate">{file.name}</p>
          </div>
        ))}
      </div>

      {selectedFiles.length > 0 && (
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2 mt-4"
        >
          <Trash2 size={16} /> <span>選択したファイルを削除</span>
        </button>
      )}

      {previewImage && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div className="relative bg-white p-4 rounded-lg max-w-[60vw] max-h-[60vh] overflow-auto lg:ml-[250px] lg:w-[calc(100%-250px)]">
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
    </div>
  );
};

export default ShopLibraryManagement;
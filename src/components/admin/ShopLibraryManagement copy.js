'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Folder, File, Image, ArrowLeft, Home, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useParams } from 'next/navigation';

const ShopLibraryManagement = () => {
  const { data: session } = useSession();
  const params = useParams();
  const shopId = params.shopId;

  const [files, setFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState({ id: null, name: 'Home' });
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [selectedUploadFiles, setSelectedUploadFiles] = useState([]);
  const [companyCode, setCompanyCode] = useState(null);

  useEffect(() => {
    fetchCompanyCode();
    fetchMembers();
  }, []);

  useEffect(() => {
    if (companyCode) {
      fetchFiles();
    }
  }, [currentFolder, memberId, companyCode]);

  const fetchCompanyCode = async () => {
    try {
      const res = await fetch('/api/company-code');
      if (res.ok) {
        const { companyCode } = await res.json();
        setCompanyCode(companyCode);
        setCurrentFolder({ id: companyCode, name: 'Company' });
        setBreadcrumbs([{ id: companyCode, name: 'Company' }]);
      }
    } catch (error) {
      console.error('Error fetching company code:', error);
    }
  };

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
    }
  };

  const fetchFiles = async () => {
    if (!companyCode) return;

    try {
      const role = session?.user?.role || 'admin';
      const folderId = currentFolder?.id || companyCode;
      const res = await fetch(`/api/drive?role=${role}&folderId=${folderId}&shopId=${shopId}&memberId=${memberId}`);
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
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
        formData.append('shopId', shopId);
        formData.append('memberId', memberId);
        formData.append('folderType', 'images');

        const res = await fetch('/api/drive/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to upload file: ${errorText}`);
        }
      }
      await fetchFiles();
      setFilePreviews([]);
      setSelectedUploadFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFolderClick = (folder) => {
    setCurrentFolder(folder);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    const selectedBreadcrumb = breadcrumbs[index];
    setCurrentFolder(selectedBreadcrumb.id ? { id: selectedBreadcrumb.id, name: selectedBreadcrumb.name } : null);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-left mb-6">店舗ライブラリ管理</h2>

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
          className={`border-2 border-dashed p-6 text-center w-1/2 h-48 flex flex-col justify-center items-center ${isDragActive ? 'bg-blue-50' : ''}`}
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

        <div className="w-1/2 h-48 overflow-auto border p-2">
          <h3 className="text-lg font-medium mb-2">プレビュー</h3>
          {filePreviews.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {filePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt="preview" className="w-full h-32 object-cover" />
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

      <div className="mt-6">
        <h2 className="text-3xl font-bold text-left mb-6">ディレクトリ</h2>
        <div className="grid grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => handleFolderClick(file)}
            >
              {file.mimeType === 'application/vnd.google-apps.folder' ? (
                <Folder className="mx-auto mb-2" size={40} />
              ) : (
                <Image className="mx-auto mb-2" size={40} />
              )}
              <p className="text-center text-sm truncate">{file.name}</p>
            </div>
          ))}
        </div>
      </div>

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

export default ShopLibraryManagement;
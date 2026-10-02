'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Button from '@/components/materials/form/Button';

interface FileUploaderProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
}

export default function FileUploader({ onUploadSuccess, folder = 'uploads' }: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${folder}/${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Upload failed');

      const blob = await response.json();
      onUploadSuccess(blob.url);
    } catch (error) {
      console.error(error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
}

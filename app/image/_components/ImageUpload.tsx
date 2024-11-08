'use client';
import React, { useEffect, useState } from 'react';
import { DropzoneOptions, useDropzone } from 'react-dropzone';
import { DeleteIcon } from './Icons';

type ImageUploadProps = {
  title: string;
  label?: string;
  description?: string;
  multiple?: boolean;
  preview?: string | File;
  onRemove?: () => void;
  onUpload: (acceptedFiles: File[]) => void;
};

export default function ImageUpload({
  title = '',
  label = '',
  preview = '',
  onUpload,
  onRemove,
  description,
  multiple,
}: ImageUploadProps) {
  const [imageMedia, setImageMedia] = useState<string>('');

  useEffect(() => {
    if (typeof preview === 'string') {
      setImageMedia(preview);
    } else if (preview instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageMedia(reader.result as string);
      };
      reader.readAsDataURL(preview);
    }
  }, [preview]);

  const onRemoveChange = () => {
    if (onRemove) {
      setImageMedia('');
      onRemove();
    }
  };

  const onUploadChange = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      alert('No file selected.');
      return;
    }

    if (!(acceptedFiles[0] instanceof File)) {
      alert('Selected item is not a valid file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageMedia(reader.result as string);
    };

    reader.onerror = () => {
      alert('Failed to read file. Ensure the file format is correct.');
    };

    reader.readAsDataURL(acceptedFiles[0]);
    onUpload(acceptedFiles);
  };

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
    },
    onDrop: onUploadChange,
    multiple,
  };
  const { getRootProps, getInputProps } = useDropzone(dropzoneOptions);

  return (
    <div
      className="relative border-2 border-gray-300 border-dashed cursor-pointer rounded-xl flex flex-col justify-center items-center p-3 text-center"
      style={{ width: '100%', height: '200px', maxWidth: '400px' }}>
      {imageMedia ? (
        <>
          {label && (
            <p className="absolute bg-white px-4 py-1 font-bold top-1 left-1 text-base text-black rounded-full">
              {label}
            </p>
          )}
          <img src={imageMedia} alt={label} className="h-full object-contain m-auto rounded-md" />
          <DeleteIcon
            data-testid={label}
            className="absolute top-1 right-1 cursor-pointer rounded-full w-5 h-5 opacity-70"
            onClick={onRemoveChange}
          />
        </>
      ) : (
        <div {...getRootProps()} className="flex flex-col justify-center items-center">
          <input data-testid={description} {...getInputProps()} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-gray-500 dark:text-gray-400">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          <h2 className="mt-1 font-semibold tracking-wide dark:text-gray-200">{title}</h2>
          <h2 className="mt-1 text-sm font-medium tracking-wide text-gray-400 dark:text-gray-200">{description}</h2>
          <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
            Upload or drag & drop your file (PNG, JPG, or JPEG).
          </p>
        </div>
      )}
    </div>
  );
}

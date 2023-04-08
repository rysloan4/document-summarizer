import React, { ChangeEvent, FormEvent, useState } from 'react';

interface FileUploadFormProps {
  onFileSubmit: (file: File) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onFileSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFile) {
      onFileSubmit(selectedFile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-x-4">
      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
        <span>Select File</span>
        <input
          className="sr-only"
          type="file"
          onChange={handleFileChange}
        />
      </label>
      {selectedFile && (
        <span className="text-sm text-gray-500">{selectedFile.name}</span>
      )}
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default FileUploadForm;

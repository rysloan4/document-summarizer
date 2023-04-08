import React from 'react';
import FileUploadForm from '../components/FileUploadForm';

const Home: React.FC = () => {
  const [extractedText, setExtractedText] = React.useState("");
  const handleFileSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('/api/textract', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setExtractedText(data.result);
        alert('File submitted successfully');
      } else {
        throw new Error('File submission failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('File submission failed');
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl mx-auto text-center">
        <span className="text-2xl font-light">Upload Document</span>
        <div className="mt-4 bg-white shadow-md rounded-lg p-8">
          <FileUploadForm onFileSubmit={handleFileSubmit} />
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-medium">Summary:</h2>
          <p className="mt-2">{extractedText}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

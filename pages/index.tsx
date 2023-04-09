import React from 'react';
import FileUploadForm from '../components/FileUploadForm';

const Home: React.FC = () => {
  const [extractedText, setExtractedText] = React.useState("");
  const [queryResponse, setQueryResponse] = React.useState("");
  const [questionText, setQuestionText] = React.useState("");

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setQuestionText(text);
  }; 
  
  const handleFileSubmit = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionText', questionText);

    try {
      const response = await fetch('/api/textract', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setExtractedText(data.summary);
        setQueryResponse(data.queryResponse);
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
        <span className="text-2xl font-light">Document Analyzer</span>
        <div>
          <p>Upload PNG, JPEG, TIFF, and PDF (single page only) files</p>
        </div>
        <div className="mt-4 bg-white shadow-md rounded-lg p-8">
          <FileUploadForm onFileSubmit={handleFileSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Ask me a question</label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
                value={questionText}
                onChange={handleQuestionTextChange}
              />
            </div>
          </FileUploadForm>
        </div>
        <div className="mt-4 bg-white shadow-md rounded-lg p-8">
        <div className="mt-4">
          {/* <h2 className="text-xl font-medium">Summary:</h2>
          <p className="mt-2">{extractedText}</p> */}
          <h3 className="text-xl font-medium">Result</h3>
          <p className="mt-2">{queryResponse}</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

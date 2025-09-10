import React, { useState, useEffect } from "react";
import "../styles/FileUpload.css";
import {
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileVideo,
  FaFileAlt,
  FaFile,
  FaTrash,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Load from server on mount
  useEffect(() => {
    fetch(`${API_URL}/files`)
      .then((res) => res.json())
      .then((data) =>
        setFiles(
          data.map((name, idx) => ({
            id: idx,
            name,
            url: `${API_URL}/uploads/${name}`,
          }))
        )
      )
      .catch((err) => console.error("Error loading files:", err));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const newFile = {
        id: Date.now(),
        name: data.fileName,
        url: `${API_URL}${data.filePath}`,
        isNew: true,
      };

      setFiles((prev) => [newFile, ...prev]);
      setSelectedFile(null);

      // remove highlight after 3 sec
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === newFile.id ? { ...f, isNew: false } : f
          )
        );
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    // TODO: Add backend delete later
  };

  const getFileIcon = (fileName) => {
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return <FaFileImage className="file-icon image" />;
    if (fileName.match(/\.pdf$/i)) return <FaFilePdf className="file-icon pdf" />;
    if (fileName.match(/\.docx?$/i)) return <FaFileWord className="file-icon word" />;
    if (fileName.match(/\.xlsx?$/i)) return <FaFileExcel className="file-icon excel" />;
    if (fileName.match(/\.(mp4|mov|avi)$/i)) return <FaFileVideo className="file-icon video" />;
    if (fileName.match(/\.txt$/i)) return <FaFileAlt className="file-icon text" />;
    return <FaFile className="file-icon generic" />;
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="file-upload-container">
      <h2>File Upload</h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="file-search"
      />

      {/* Upload area */}
      <div className="upload-area">
        <input type="file" id="fileInput" onChange={handleFileChange} />
        <label htmlFor="fileInput" className="choose-file-btn">
          Choose File
        </label>
        {selectedFile && (
          <button onClick={handleUpload} className="upload-btn">
            Upload
          </button>
        )}
      </div>

      {/* Uploaded files list */}
      <div className="uploaded-files">
        <h3>Uploaded Files</h3>
        {filteredFiles.length === 0 ? (
          <p className="empty-msg">No files found</p>
        ) : (
          <ul>
            {filteredFiles.map((file) => (
              <li key={file.id} className={file.isNew ? "new-file" : ""}>
                {getFileIcon(file.name)}
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(file.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

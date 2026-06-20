import React, { useState, useRef } from 'react';

interface ScannerProps {
  onScanStart: () => void;
  onScanComplete: (result: any) => void;
  onError: (error: string) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanStart, onScanComplete, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file (PNG, JPG, JPEG).');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    onScanStart();

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/scan/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze the leaf image. Please try again.');
      }

      const result = await response.json();
      onScanComplete(result);
    } catch (err: any) {
      onError(err.message || 'An error occurred during prediction.');
    } finally {
      setScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanning(false);
  };

  return (
    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Leaf Diagnostics Scanner
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
        Upload a high-quality photo of your plant's leaf (showing the spots or symptoms clearly) to run our plant health diagnosis algorithm.
      </p>

      {/* Drag & Drop Area */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--panel-border)'}`,
          borderRadius: '12px',
          background: 'rgba(5, 11, 7, 0.2)',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: scanning ? 'not-allowed' : 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          minHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={scanning ? undefined : triggerFileInput}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept="image/*"
          disabled={scanning}
        />

        {previewUrl ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '280px', maxHeight: '200px', borderRadius: '8px', overflow: 'hidden' }}>
              <img 
                src={previewUrl} 
                alt="Leaf scan preview" 
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px', maxHeight: '200px', objectFit: 'contain' }}
              />
              {scanning && <div className="scanner-laser"></div>}
            </div>
            {!scanning && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Click or drag to change image ({selectedFile?.name})
              </span>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--primary)'
            }} className="pulse-target">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            </div>
            <div>
              <p style={{ fontWeight: 500, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Drag and drop your leaf photo here
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px' }}>
                or click to browse local files (supports PNG, JPG, JPEG)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            className="btn-secondary" 
            onClick={handleReset} 
            disabled={scanning}
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Clear
          </button>
          <button 
            className="btn-neon" 
            onClick={handleScan} 
            disabled={scanning}
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            {scanning ? (
              <>
                <svg className="animate-spin" style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Begin Scan
              </>
            )}
          </button>
        </div>
      )}

      {/* Supported Info Box */}
      <div style={{ 
        background: 'rgba(6, 182, 212, 0.05)', 
        border: '1px solid rgba(6, 182, 212, 0.1)', 
        borderRadius: '8px', 
        padding: '12px 16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" style={{ marginTop: '2px', flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong>Diagnosable Crops:</strong> Tomato, Potato, Apple, Corn, Grape, and Pepper. The AI model detects Rust, Scabs, Blight, Spots, and general leaf health status.
        </span>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Scanner } from './components/Scanner';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';

interface ScanResult {
  id: number;
  image: string;
  plant_name: string;
  disease_name: string;
  confidence: number;
  treatment: string;
  prevention: string;
  created_at: string;
}

function App() {
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [activeResult, setActiveResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load history from Django backend on app load
  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history/');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
        // Load latest scan into dashboard by default if history is not empty
        if (data.length > 0) {
          setActiveResult(data[0]);
        }
      } else {
        throw new Error('Failed to load scan records');
      }
    } catch (err: any) {
      console.error('History fetch error:', err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleScanStart = () => {
    setError(null);
  };

  const handleScanComplete = (result: ScanResult) => {
    // Prepend new scan to history
    setHistory((prev) => [result, ...prev]);
    setActiveResult(result);
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all scans from database history?')) {
      return;
    }

    try {
      const response = await fetch('/api/clear/', {
        method: 'DELETE',
      });
      if (response.ok) {
        setHistory([]);
        setActiveResult(null);
      } else {
        throw new Error('Could not clear scan archive');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to clear records.');
    }
  };

  const handleSelectHistoryItem = (item: ScanResult) => {
    setActiveResult(item);
    // Smooth scroll to diagnostic details on mobile
    if (window.innerWidth < 1024) {
      const element = document.getElementById('diagnostic-dashboard');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div>
          <div className="app-title-wrapper">
            <span className="app-logo">🌿</span>
            <h1 className="app-title">FloraScan AI</h1>
          </div>
          <p className="app-subtitle">Real-time Plant Pathogen Scanning & Diagnostic Dashboard</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            background: 'var(--primary)',
            boxShadow: 'var(--shadow-neon)'
          }}></span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            AI Engine Connected
          </span>
        </div>
      </header>

      {/* Error Notification Alert */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--accent-rose)',
          padding: '14px 20px',
          borderRadius: '10px',
          fontSize: '0.95rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <strong>Error:</strong> {error}
          </span>
          <button 
            onClick={() => setError(null)}
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <main className="main-layout">
        {/* Left Hand Panel: Scanner & History list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <Scanner 
            onScanStart={handleScanStart} 
            onScanComplete={handleScanComplete} 
            onError={(msg) => setError(msg)} 
          />
          
          <History 
            items={history} 
            onItemSelect={handleSelectHistoryItem} 
            onClearHistory={handleClearHistory}
            selectedId={activeResult?.id}
          />
        </div>

        {/* Right Hand Panel: Diagnosis Dashboard */}
        <div id="diagnostic-dashboard" style={{ scrollMarginTop: '20px' }}>
          <Dashboard result={activeResult} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        marginTop: 'auto', 
        paddingTop: '30px', 
        borderTop: '1px solid var(--panel-border)', 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <p>FloraScan AI Project. Powering crop management & farming protection.</p>
        <p style={{ marginTop: '4px' }}>Powered by MobileNetV2 Fine-Tuned (PlantVillage dataset) & Django REST Framework</p>
      </footer>
    </div>
  );
}

export default App;

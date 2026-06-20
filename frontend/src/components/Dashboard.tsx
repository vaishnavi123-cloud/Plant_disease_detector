import React, { useState } from 'react';

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

interface DashboardProps {
  result: ScanResult | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'treatment' | 'prevention'>('diagnosis');

  if (!result) {
    return (
      <div 
        className="glass-panel" 
        style={{ 
          padding: '60px 30px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '20px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          minHeight: '400px'
        }}
      >
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          background: 'rgba(16, 185, 129, 0.05)', 
          border: '1px solid rgba(16, 185, 129, 0.1)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600 }}>Awaiting Plant Scan</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px', maxWidth: '320px' }}>
            Please select and scan a leaf image on the left to see the diagnosis and treatment recommendations here.
          </p>
        </div>
      </div>
    );
  }

  const isHealthy = result.disease_name.toLowerCase() === 'healthy';
  const confidencePercent = Math.round(result.confidence * 100);

  // Status styling configurations
  const badgeClass = isHealthy ? 'status-badge status-healthy' : 'status-badge status-diseased';
  const statusColor = isHealthy ? 'var(--primary)' : 'var(--accent-rose)';
  const statusGlow = isHealthy ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';

  return (
    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Title & Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Diagnostic Results
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {result.plant_name}
          </h2>
        </div>
        <div className={badgeClass}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
          {isHealthy ? 'HEALTHY' : 'DISEASE DETECTED'}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: '20px',
        background: 'rgba(5, 11, 7, 0.2)',
        borderRadius: '12px',
        border: '1px solid var(--panel-border)',
        padding: '20px'
      }}>
        {/* Diagnosis Field */}
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Condition Identified</span>
          <p style={{ fontSize: '1.25rem', fontWeight: 600, color: statusColor, marginTop: '2px' }}>
            {result.disease_name}
          </p>
        </div>

        {/* Confidence Meter */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>AI Classifier Confidence</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{confidencePercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${confidencePercent}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${statusColor} 0%, var(--secondary) 100%)`, 
              boxShadow: `0 0 10px ${statusGlow}`,
              borderRadius: '10px',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'diagnosis' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnosis')}
        >
          Diagnosis Details
        </button>
        <button 
          className={`tab-btn ${activeTab === 'treatment' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatment')}
        >
          Treatment Plan
        </button>
        <button 
          className={`tab-btn ${activeTab === 'prevention' ? 'active' : ''}`}
          onClick={() => setActiveTab('prevention')}
        >
          Prevention Protocols
        </button>
      </div>

      {/* Tab Contents */}
      <div style={{ minHeight: '180px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        {activeTab === 'diagnosis' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p>
              Our diagnostic engine scanned the leaf sample and identified signs of <strong>{result.disease_name}</strong> on the <strong>{result.plant_name}</strong> plant.
            </p>
            {isHealthy ? (
              <p>
                The leaf exhibits optimal color balance and structural cell patterns. Chlorophyll levels appear healthy and no active fungal spores or lesions are visible on the surface.
              </p>
            ) : (
              <p>
                This disease commonly targets the vascular or leaf system, limiting crop yield. Fungal spots, spore counts, or moisture-driven decay patches can propagate rapidly if the environment is humid or hot.
              </p>
            )}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scan ID: #{result.id} | Analyzed on: {new Date(result.created_at).toLocaleString()}
            </span>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Recommended Actions:</h4>
            <p style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '15px', borderRadius: '8px', borderLeft: `3px solid ${statusColor}`, color: 'var(--text-primary)' }}>
              {result.treatment}
            </p>
          </div>
        )}

        {activeTab === 'prevention' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Long-Term Prevention Strategy:</h4>
            {result.prevention ? (
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.prevention.split(', ').map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            ) : (
              <p>No special prevention requirements. Continue keeping the plant in suitable soil, sunlight, and clean water conditions.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

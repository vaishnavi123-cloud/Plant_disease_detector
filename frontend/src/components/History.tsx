import React from 'react';

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

interface HistoryProps {
  items: ScanResult[];
  onItemSelect: (item: ScanResult) => void;
  onClearHistory: () => void;
  selectedId?: number;
}

export const History: React.FC<HistoryProps> = ({ items, onItemSelect, onClearHistory, selectedId }) => {
  return (
    <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '560px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>
          Scan Archives
        </h3>
        {items.length > 0 && (
          <button 
            onClick={onClearHistory}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-rose)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'opacity 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Clear Logs
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ 
          padding: '40px 10px', 
          textAlign: 'center', 
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>
          <p>No scans archived yet. Diagnostics history will populate here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item) => {
            const isHealthy = item.disease_name.toLowerCase() === 'healthy';
            const isSelected = selectedId === item.id;
            
            return (
              <div
                key={item.id}
                onClick={() => onItemSelect(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--panel-border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--panel-border-hover)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--panel-border)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
              >
                {/* Thumbnail */}
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                  <img 
                    src={item.image} 
                    alt="Thumbnail" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Details */}
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.plant_name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: isHealthy ? 'var(--primary)' : 'var(--accent-rose)', fontWeight: 600 }}>
                      {isHealthy ? 'Healthy' : 'Diseased'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {item.disease_name}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Conf: {Math.round(item.confidence * 100)}%</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

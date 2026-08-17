import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StatItem {
  icon: any;
  value: string;
  label: string;
  description?: string;
  color: string;
}

interface StatsSectionProps {
  title: string;
  description?: string;
  stats: StatItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ title, description, stats }) => {
  return (
    <section style={{
      maxWidth: '1100px',
      margin: '0 auto 2rem auto',
      padding: '0 20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{
          fontFamily: 'Chakra Petch',
          color: '#D4AF37',
          fontSize: 'clamp(1.25rem, 3.5vw, 1.6rem)',
          margin: '0 0 0.4rem',
          lineHeight: 1.2
        }}>
          {title}
        </h2>
        {description && (
          <p style={{
            color: '#94a3b8',
            fontSize: 'clamp(0.85rem, 2.2vw, 0.95rem)',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.55
          }}>
            {description}
          </p>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
        gap: 'clamp(0.5rem, 2vw, 0.85rem)'
      }} className="stats-grid-compact">
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(20,20,30,0.7)',
              borderRadius: '12px',
              padding: 'clamp(0.7rem, 2vw, 0.95rem)',
              textAlign: 'left',
              border: `1px solid ${stat.color}33`,
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              minHeight: 0
            }}
          >
            <div style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `${stat.color}22`,
              border: `1px solid ${stat.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '0.85rem' }} />
            </div>
            <div style={{
              fontSize: 'clamp(1.1rem, 4vw, 1.5rem)',
              fontWeight: 700,
              color: '#fff',
              fontFamily: 'Chakra Petch',
              lineHeight: 1.1
            }}>
              {stat.value}
            </div>
            <div style={{
              color: '#94a3b8',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontWeight: 600
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 600px) {
          .stats-grid-compact {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;

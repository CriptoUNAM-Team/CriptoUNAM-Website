import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  image: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface TeamCardProps {
  member: TeamMember;
}

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.8)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
      e.currentTarget.style.boxShadow = '0 12px 32px rgba(212, 175, 55, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Imagen del miembro */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        margin: '0 auto 16px auto',
        background: 'linear-gradient(135deg, #D4AF37, #2563EB)',
        padding: '3px',
        position: 'relative'
      }}>
        <img 
          src={member.image} 
          alt={member.name}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Nombre */}
      <h3 style={{
        color: '#D4AF37',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
        fontFamily: 'Chakra Petch'
      }}>
        {member.name}
      </h3>

      {/* Rol */}
      <p style={{
        color: '#2563EB',
        fontSize: '1rem',
        fontWeight: '600',
        margin: '0 0 12px 0'
      }}>
        {member.role}
      </p>

      {/* Descripción */}
      <p style={{
        color: '#E0E0E0',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        margin: '0 0 20px 0'
      }}>
        {member.description}
      </p>

      {/* Redes sociales */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        {member.linkedin && (
          <a 
            href={member.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#0077B5',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
              e.currentTarget.style.color = '#D4AF37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = '#0077B5';
            }}
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        )}
        {member.twitter && (
          <a 
            href={member.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#1DA1F2',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
              e.currentTarget.style.color = '#D4AF37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = '#1DA1F2';
            }}
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        )}
        {member.github && (
          <a 
            href={member.github} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#333',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
              e.currentTarget.style.color = '#D4AF37';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = '#333';
            }}
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faCode, faUsers, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface Project {
  title: string;
  description: string;
  image: string;
  category: 'hackathon' | 'community' | 'research';
  prize?: string;
  team?: string[];
  technologies: string[];
  link?: string;
  github?: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hackathon': return '#FFD700';
      case 'community': return '#34D399';
      case 'research': return '#3B82F6';
      default: return '#D4AF37';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hackathon': return faTrophy;
      case 'community': return faUsers;
      case 'research': return faCode;
      default: return faCode;
    }
  };

  return (
    <div style={{
      background: 'rgba(26, 26, 26, 0.8)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(212, 175, 55, 0.2)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      height: '100%'
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
      {/* Imagen del proyecto */}
      <div style={{
        width: '100%',
        height: '180px',
        borderRadius: '12px',
        marginBottom: '16px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img 
          src={project.image} 
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />
        
        {/* Badge de categoría */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: getCategoryColor(project.category),
          color: '#000',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <FontAwesomeIcon icon={getCategoryIcon(project.category)} />
          {project.category === 'hackathon' ? 'Hackathon' : 
           project.category === 'community' ? 'Comunidad' : 'Investigación'}
        </div>
      </div>

      {/* Título */}
      <h3 style={{
        color: '#D4AF37',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        margin: '0 0 8px 0',
        fontFamily: 'Chakra Petch'
      }}>
        {project.title}
      </h3>

      {/* Descripción */}
      <p style={{
        color: '#E0E0E0',
        fontSize: '0.9rem',
        lineHeight: '1.5',
        margin: '0 0 16px 0'
      }}>
        {project.description}
      </p>

      {/* Premio (si aplica) */}
      {project.prize && (
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FontAwesomeIcon icon={faTrophy} style={{ color: '#FFD700' }} />
          <span style={{ color: '#FFD700', fontSize: '0.9rem', fontWeight: '600' }}>
            {project.prize}
          </span>
        </div>
      )}

      {/* Equipo (si aplica) */}
      {project.team && project.team.length > 0 && (
        <div style={{
          marginBottom: '16px'
        }}>
          <p style={{
            color: '#2563EB',
            fontSize: '0.8rem',
            fontWeight: '600',
            margin: '0 0 4px 0'
          }}>
            Equipo:
          </p>
          <p style={{
            color: '#E0E0E0',
            fontSize: '0.8rem',
            margin: '0'
          }}>
            {project.team.join(', ')}
          </p>
        </div>
      )}

      {/* Tecnologías */}
      <div style={{
        marginBottom: '16px'
      }}>
        <p style={{
          color: '#2563EB',
          fontSize: '0.8rem',
          fontWeight: '600',
          margin: '0 0 8px 0'
        }}>
          Tecnologías:
        </p>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          {project.technologies.map((tech, index) => (
            <span 
              key={index}
              style={{
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#3B82F6',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '500'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Enlaces */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end'
      }}>
        {project.link && (
          <a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#D4AF37',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D4AF37';
            }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
            Demo
          </a>
        )}
        {project.github && (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#D4AF37',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#D4AF37';
            }}
          >
            <FontAwesomeIcon icon={faCode} />
            Código
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

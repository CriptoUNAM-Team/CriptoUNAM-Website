import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  url: string;
}

interface SocialFeedProps {
  title: string;
  description?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ title, description }) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'twitter'>('all');

  // Datos simulados (en producción se conectaría a las APIs reales)
  useEffect(() => {
    const mockPosts: SocialPost[] = [
      {
        id: '1',
        platform: 'instagram',
        content: '🚀 ¡Hackathon Blockchain 2024 fue un éxito total! Más de 200 participantes desarrollando el futuro de la Web3. #CriptoUNAM #Blockchain #Hackathon',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=400&fit=crop',
        likes: 156,
        comments: 23,
        timestamp: '2 horas',
        url: 'https://instagram.com/p/example1'
      },
      {
        id: '2',
        platform: 'twitter',
        content: '🎓 Nuevo curso: "Smart Contracts Avanzados" - Aprende Solidity, DeFi protocols y auditoría de contratos. ¡Inscripciones abiertas! #Web3Education',
        likes: 89,
        comments: 12,
        timestamp: '4 horas',
        url: 'https://twitter.com/Cripto_UNAM/status/example2'
      },
      {
        id: '3',
        platform: 'instagram',
        content: '💡 Workshop de NFTs: Desde la creación hasta el marketplace. Los estudiantes de CriptoUNAM están creando arte digital increíble! 🎨',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
        likes: 203,
        comments: 31,
        timestamp: '1 día',
        url: 'https://instagram.com/p/example3'
      },
      {
        id: '4',
        platform: 'twitter',
        content: '🔥 ¡CriptoUNAM en el top 10 de comunidades blockchain universitarias de Latinoamérica! Gracias a todos los miembros por hacer esto posible. #ProudToBeCriptoUNAM',
        likes: 234,
        comments: 45,
        timestamp: '2 días',
        url: 'https://twitter.com/Cripto_UNAM/status/example4'
      },
      {
        id: '5',
        platform: 'instagram',
        content: '🌟 Meetup mensual: "El futuro de DeFi en México" - Expertos de la industria compartiendo insights sobre finanzas descentralizadas.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
        likes: 178,
        comments: 28,
        timestamp: '3 días',
        url: 'https://instagram.com/p/example5'
      },
      {
        id: '6',
        platform: 'twitter',
        content: '📚 Biblioteca blockchain: Hemos agregado 50+ recursos nuevos sobre Layer 2, Zero-Knowledge Proofs y más. ¡Todo disponible para la comunidad!',
        likes: 67,
        comments: 8,
        timestamp: '4 días',
        url: 'https://twitter.com/Cripto_UNAM/status/example6'
      }
    ];

    // Simular carga
    setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => 
    activeTab === 'all' || post.platform === activeTab
  );

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <section style={{
      maxWidth: '1200px',
      margin: '0 auto 3rem auto',
      padding: '0 20px'
    }}>
      {/* Título y descripción */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: 'Chakra Petch',
          color: '#D4AF37',
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }}>
          {title}
        </h2>
        {description && (
          <p style={{
            color: '#E0E0E0',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Tabs de filtro */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { key: 'all', label: 'Todas', icon: null },
          { key: 'instagram', label: 'Instagram', icon: faInstagram },
          { key: 'twitter', label: 'Twitter', icon: faTwitter }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? '#D4AF37' : 'rgba(26, 26, 26, 0.8)',
              color: activeTab === tab.key ? '#000' : '#E0E0E0',
              border: `1px solid ${activeTab === tab.key ? '#D4AF37' : 'rgba(212, 175, 55, 0.2)'}`,
              borderRadius: '25px',
              padding: '12px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              }
            }}
          >
            {tab.icon && <FontAwesomeIcon icon={tab.icon} />}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid de posts */}
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(212, 175, 55, 0.3)',
            borderTop: '3px solid #D4AF37',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              style={{
                background: 'rgba(26, 26, 26, 0.8)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header con plataforma */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FontAwesomeIcon 
                    icon={post.platform === 'instagram' ? faInstagram : faTwitter}
                    style={{
                      color: post.platform === 'instagram' ? '#E4405F' : '#1DA1F2',
                      fontSize: '1.2rem'
                    }}
                  />
                  <span style={{
                    color: '#D4AF37',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                  }}>
                    @Cripto_UNAM
                  </span>
                </div>
                <span style={{
                  color: '#999',
                  fontSize: '0.8rem'
                }}>
                  {post.timestamp}
                </span>
              </div>

              {/* Imagen si existe */}
              {post.image && (
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  <img
                    src={post.image}
                    alt="Post content"
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
                </div>
              )}

              {/* Contenido */}
              <p style={{
                color: '#E0E0E0',
                fontSize: '0.95rem',
                lineHeight: '1.5',
                margin: '0 0 16px 0'
              }}>
                {post.content}
              </p>

              {/* Stats y enlace */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  <span style={{
                    color: '#999',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    ❤️ {formatNumber(post.likes)}
                  </span>
                  <span style={{
                    color: '#999',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    💬 {formatNumber(post.comments)}
                  </span>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#D4AF37',
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#FFD700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#D4AF37';
                  }}
                >
                  Ver post
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlaces a redes sociales */}
      <div style={{
        textAlign: 'center',
        marginTop: '3rem',
        padding: '2rem',
        background: 'rgba(26, 26, 26, 0.5)',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <h3 style={{
          color: '#D4AF37',
          fontSize: '1.5rem',
          marginBottom: '1rem',
          fontFamily: 'Chakra Petch'
        }}>
          ¡Síguenos en nuestras redes!
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <a
            href="https://instagram.com/Cripto_UNAM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#E4405F',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '25px',
              background: 'rgba(228, 64, 95, 0.1)',
              border: '1px solid rgba(228, 64, 95, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(228, 64, 95, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(228, 64, 95, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faInstagram} />
            @Cripto_UNAM
          </a>
          <a
            href="https://twitter.com/Cripto_UNAM"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#1DA1F2',
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '25px',
              background: 'rgba(29, 161, 242, 0.1)',
              border: '1px solid rgba(29, 161, 242, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(29, 161, 242, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(29, 161, 242, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FontAwesomeIcon icon={faTwitter} />
            @Cripto_UNAM
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialFeed;

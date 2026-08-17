import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSearch, faFileCsv, faSpinner, faCheckCircle, faFilter } from '@fortawesome/free-solid-svg-icons'
import { suscripcionesApi } from '../../config/supabaseApi'

interface SuscripcionRow {
  id?: number
  email: string
  fuente?: string
  created_at?: string
}

const SuscripcionesAdminTab: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [suscripciones, setSuscripciones] = useState<SuscripcionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [sourceFilter, setSourceFilter] = useState('all')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await suscripcionesApi.getAll()
      setSuscripciones(data || [])
    } catch (err) {
      console.error('Error al obtener suscripciones:', err)
      setError('No se pudieron cargar las suscripciones de la base de datos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadData()
    }
  }, [isAdmin])

  if (!isAdmin) return null

  const filteredData = suscripciones.filter((item) => {
    const matchesQuery = item.email?.toLowerCase().includes(filterQuery.toLowerCase()) || 
                         item.fuente?.toLowerCase().includes(filterQuery.toLowerCase())
    const matchesSource = sourceFilter === 'all' || item.fuente?.toLowerCase() === sourceFilter.toLowerCase()
    return matchesQuery && matchesSource
  })

  const exportCSV = () => {
    if (suscripciones.length === 0) return
    const headers = ['ID', 'Email', 'Fuente', 'Fecha de Registro']
    const rows = filteredData.map((item) => [
      item.id || '',
      `"${item.email || ''}"`,
      `"${item.fuente || 'website'}"`,
      `"${item.created_at ? new Date(item.created_at).toLocaleString() : ''}"`
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `suscripciones_criptounam_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sources = Array.from(new Set(suscripciones.map(item => item.fuente || 'website')))

  return (
    <div className="puma-section" style={{ background: 'rgba(26,26,26,0.95)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Chakra Petch', color: '#D4AF37', margin: 0, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FontAwesomeIcon icon={faEnvelope} />
            Suscriptores de Newsletter ({suscripciones.length})
          </h2>
          <p style={{ color: '#B0B0B0', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            Lista completa de usuarios suscritos desde el Home, Newsletter y CTAs (guardados en base de datos).
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={exportCSV}
            disabled={filteredData.length === 0}
            className="puma-btn puma-btn--ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D4AF37', color: '#D4AF37', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
          >
            <FontAwesomeIcon icon={faFileCsv} />
            Descargar CSV ({filteredData.length})
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            placeholder="Buscar por correo o fuente..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FontAwesomeIcon icon={faFilter} style={{ color: '#D4AF37' }} />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#1a1a1a', color: '#fff', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">Todas las fuentes</option>
            {sources.map((src, idx) => (
              <option key={idx} value={src}>{src}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#D4AF37' }}>
          <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ marginBottom: '0.75rem' }} />
          <p>Cargando suscriptores de la base de datos...</p>
        </div>
      ) : error ? (
        <div className="puma-alert puma-alert--error">
          <span>{error}</span>
        </div>
      ) : filteredData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#888', margin: 0, fontSize: '1.1rem' }}>No se encontraron suscriptores con los filtros actuales.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: 'rgba(212,175,55,0.15)', borderBottom: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', fontFamily: 'Chakra Petch' }}>
                <th style={{ padding: '12px 16px' }}>#</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Fuente</th>
                <th style={{ padding: '12px 16px' }}>Fecha de Suscripción</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => (
                <tr key={item.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '12px 16px', color: '#888' }}>{item.id || idx + 1}</td>
                  <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#22c55e', fontSize: '0.85rem' }} />
                    {item.email}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      background: item.fuente === 'home' ? 'rgba(37,99,235,0.2)' : 'rgba(212,175,55,0.2)',
                      color: item.fuente === 'home' ? '#60a5fa' : '#F4D03F',
                      border: `1px solid ${item.fuente === 'home' ? 'rgba(37,99,235,0.4)' : 'rgba(212,175,55,0.4)'}`,
                      textTransform: 'capitalize'
                    }}>
                      {item.fuente || 'website'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#aaa', fontSize: '0.88rem' }}>
                    {item.created_at ? new Date(item.created_at).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : 'No disponible'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SuscripcionesAdminTab

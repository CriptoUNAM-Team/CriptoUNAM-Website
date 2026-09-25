import React from 'react'
import { Link } from 'react-router-dom'
import { Pencil, ArrowRight } from 'lucide-react'
import { FECHAS_CARTEL } from '../../data/hackathonInfo'
import { Avatar } from './ui'
import PixelG from '../goya/PixelG'

type Props = {
  name: string
  avatarUrl?: string | null
  bio?: string | null
  skills?: string[]
  lookingForTeam?: boolean
  teamName?: string | null
  projectStatus?: 'submitted' | 'draft' | null
  onEdit?: () => void
  panelHref?: string
}

/**
 * Credencial del hacker. Mismo contenido en el perfil y en el panel.
 */
const HackerCredential: React.FC<Props> = ({
  name,
  avatarUrl,
  bio,
  skills = [],
  lookingForTeam,
  teamName,
  projectStatus,
  onEdit,
  panelHref,
}) => {
  const estadoBuidl =
    projectStatus === 'submitted' ? 'BUIDL enviado' : projectStatus === 'draft' ? 'BUIDL en borrador' : null

  return (
    <article
      className="goya-cut overflow-hidden"
      style={{
        ['--cut' as string]: '14px',
        background: 'linear-gradient(165deg, #141820 0%, #0b0e14 100%)',
        color: '#e2e8f0',
        border: '1px solid rgba(233,175,60,0.55)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-2.5"
        style={{ background: '#E9AF3C', color: '#010004' }}
      >
        <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-label">
          <PixelG className="w-3.5 shrink-0" />
          Goya Hack · FI-UNAM
        </span>
        <span className="font-mono text-[10px] uppercase tracking-label">{FECHAS_CARTEL.completo} 2026</span>
      </div>

      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6">
        <Avatar src={avatarUrl} name={name} size={96} style={{ borderColor: '#E9AF3C', color: '#010004' }} />

        <div className="min-w-0 flex-1">
          <p className="m-0 font-mono text-[10px] uppercase tracking-label" style={{ color: '#94a3b8' }}>
            Hacker acreditado
          </p>
          <h2
            className="mt-1 font-display text-2xl uppercase leading-tight tracking-wide sm:text-3xl"
            style={{ color: '#fff', marginBottom: 0 }}
          >
            {name}
          </h2>
          {bio && (
            <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
              {bio}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {teamName && (
              <span
                className="inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
                style={{ background: '#010004', color: '#E9AF3C' }}
              >
                {teamName}
              </span>
            )}
            {estadoBuidl && (
              <span
                className="inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
                style={{ background: 'rgba(16,185,129,0.16)', color: '#6ee7b7' }}
              >
                {estadoBuidl}
              </span>
            )}
            {lookingForTeam && (
              <span
                className="inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase"
                style={{ background: 'rgba(59,130,246,0.16)', color: '#93c5fd' }}
              >
                Busca equipo
              </span>
            )}
            {skills.slice(0, 6).map((s) => (
              <span
                key={s}
                className="inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {s}
              </span>
            ))}
          </div>

          {(onEdit || panelHref) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1.5 border border-[#E9AF3C] bg-transparent px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-label"
                  style={{ color: '#E9AF3C' }}
                >
                  <Pencil size={12} />
                  Editar
                </button>
              )}
              {panelHref && (
                <Link
                  to={panelHref}
                  className="inline-flex items-center gap-1.5 bg-[#E9AF3C] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-label no-underline"
                  style={{ color: '#010004' }}
                >
                  Ir a mi panel
                  <ArrowRight size={12} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default HackerCredential

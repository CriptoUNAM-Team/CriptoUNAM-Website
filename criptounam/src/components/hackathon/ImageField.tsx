import React, { useRef, useState } from 'react'
import { Field, Input, Button, GOLD } from './ui'
import { hackathonApi } from '../../services/hackathon.service'

/**
 * Campo de imagen reutilizable: sube un archivo al bucket 'hackathon' de
 * Supabase Storage (vía /api/hackathon/upload) o acepta una URL directa.
 */
const ImageField: React.FC<{
  label: string
  value: string
  onChange: (url: string) => void
  onError: (msg: string) => void
  round?: boolean
}> = ({ label, value, onChange, onError, round }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const pick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await hackathonApi.uploadImage(file)
      onChange(url)
    } catch (err: any) {
      onError(err.message || 'No se pudo subir la imagen')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {value && (
          <img
            src={value}
            alt=""
            style={{
              width: 40,
              height: 40,
              borderRadius: round ? '50%' : 8,
              objectFit: 'cover',
              border: `1px solid ${GOLD}55`,
              flexShrink: 0,
            }}
          />
        )}
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… o sube un archivo →"
          style={{ flex: 1 }}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          hidden
          onChange={pick}
        />
        <Button type="button" variant="ghost" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Subiendo…' : '📤 Subir'}
        </Button>
      </div>
    </Field>
  )
}

export default ImageField

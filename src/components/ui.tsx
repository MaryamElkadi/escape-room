import { useEffect, useMemo, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  className?: string
}

export function Modal({ title, subtitle, onClose, children, wide, className = '' }: ModalProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={`modal-panel ${wide ? 'modal-wide' : ''} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 1.4,
        duration: 2.4 + Math.random() * 2.2,
        size: 6 + Math.random() * 9,
        rotate: Math.random() * 360,
        color: ['#38f5a0', '#43c7ff', '#ffb703', '#ff5a76', '#ffffff', '#9d7bff'][
          Math.floor(Math.random() * 6)
        ],
      })),
    [count],
  )

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          style={{
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 0.45}px`,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export function DigitSlot({
  value,
  label,
  active = false,
  muted = false,
}: {
  value?: string
  label: string
  active?: boolean
  muted?: boolean
}) {
  return (
    <div className={`digit-slot ${value ? 'is-filled' : ''} ${active ? 'is-active' : ''} ${muted ? 'is-muted' : ''}`}>
      <span className="digit-glyph">{value ?? '?'}</span>
      <span className="digit-label">{label}</span>
    </div>
  )
}

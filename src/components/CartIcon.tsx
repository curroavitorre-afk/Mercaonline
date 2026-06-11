import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@/lib/stores/cart'

interface Props {
  iconColor?: string
}

export default function CartIcon({ iconColor = '#1B3A2A' }: Props) {
  const navigate = useNavigate()
  const totalLineas = useCartStore((s) => s.getTotalLineas())

  return (
    <button
      onClick={() => navigate('/app/frutero/carrito')}
      className="relative p-2 -mr-2"
      aria-label="Ver carrito"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: iconColor }}
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {totalLineas > 0 && (
        <span
          className="absolute flex items-center justify-center text-white font-bold"
          style={{
            top: 0,
            right: 0,
            backgroundColor: '#F28C28',
            borderRadius: '50%',
            minWidth: 18,
            height: 18,
            fontSize: 10,
            padding: '0 4px',
            lineHeight: 1,
          }}
        >
          {totalLineas > 99 ? '99+' : totalLineas}
        </span>
      )}
    </button>
  )
}

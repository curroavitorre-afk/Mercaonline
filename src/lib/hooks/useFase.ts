import { useEffect, useState } from 'react'
import { getFase, type Fase } from '@/lib/config'

export function useFase(): { fase: Fase | null; loading: boolean } {
  const [fase, setFase] = useState<Fase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFase()
      .then(setFase)
      .catch(() => setFase('fase0'))
      .finally(() => setLoading(false))
  }, [])

  return { fase, loading }
}

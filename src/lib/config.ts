import { supabase } from '@/lib/supabase'

export type Fase = 'fase0' | 'fase2'

export async function getFase(): Promise<Fase> {
  const { data, error } = await supabase
    .from('configuracion')
    .select('fase')
    .eq('id', 1)
    .single()
  if (error) throw new Error(error.message)
  return (data as { fase: string }).fase as Fase
}

export async function setFase(fase: Fase): Promise<void> {
  const { error } = await supabase
    .from('configuracion')
    .update({ fase })
    .eq('id', 1)
  if (error) throw new Error(error.message)
}

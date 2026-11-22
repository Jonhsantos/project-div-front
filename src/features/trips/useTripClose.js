import { useState } from 'react'
import { closeTrip } from './tripsApi'

export default function useTripClose(token, tripId, onClosed) {
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function open() {
    setError('')
    setConfirming(true)
  }

  function cancel() {
    setError('')
    setConfirming(false)
  }

  async function close() {
    setError('')
    setSaving(true)
    try {
      const trip = await closeTrip(token, tripId)
      setConfirming(false)
      onClosed(trip)
    } catch (err) {
      setError(err.message || 'Não foi possível encerrar a viagem.')
    } finally { setSaving(false) }
  }

  return { confirming, open, cancel, saving, error, close }
}

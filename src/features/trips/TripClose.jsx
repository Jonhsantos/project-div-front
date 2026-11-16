import { useState } from 'react'
import { closeTrip } from './tripsApi'

export default function TripClose({ token, tripId, onClosed }) {
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function close() {
    setError('')
    setSaving(true)
    try {
      const trip = await closeTrip(token, tripId)
      onClosed(trip)
    } catch (err) {
      setError(err.message || 'Não foi possível encerrar a viagem.')
    } finally { setSaving(false) }
  }

  return <div className="trip-close">
    {!confirming ? <button className="secondary-button" type="button" onClick={() => setConfirming(true)}>Encerrar viagem</button> : <div className="review-panel">
      <p>Após o encerramento, a viagem e as despesas ficarão somente para consulta. Todas as despesas precisam estar conferidas.</p>
      <button className="workspace-button" type="button" onClick={close} disabled={saving}>{saving ? 'Encerrando...' : 'Confirmar encerramento'}</button>
      <button className="secondary-button" type="button" onClick={() => setConfirming(false)} disabled={saving}>Cancelar</button>
    </div>}
    {error && <p className="message error" role="alert">{error}</p>}
  </div>
}

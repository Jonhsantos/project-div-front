import { useState } from 'react'
import { exportTrip } from './tripsApi'
import { reportFilename } from './filename'

export default function TripExport({ token, trip }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function download() {
    setLoading(true)
    setError('')
    try {
      const pdf = await exportTrip(token, trip.id_viagem)
      const url = URL.createObjectURL(pdf)
      const link = document.createElement('a')
      link.href = url
      link.download = reportFilename(trip.titulo, trip.destino)
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.message || 'Não foi possível exportar o PDF.')
    } finally { setLoading(false) }
  }

  return <div className="review-actions">
    <button className="workspace-button" type="button" disabled={loading} onClick={download}>{loading ? 'Gerando PDF...' : 'Exportar dados em PDF'}</button>
    {error && <p className="message error" role="alert">{error}</p>}
  </div>
}

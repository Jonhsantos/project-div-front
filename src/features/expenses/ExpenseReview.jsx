import { useState } from 'react'
import { reviewExpense } from './expensesApi'

export default function ExpenseReview({ token, expense, onReviewed, expanded = false }) {
  const [reason, setReason] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function review(decision) {
    const trimmed = reason.trim()
    if (decision === 'PENDENTE_CORRECAO' && !trimmed) {
      setError('Informe o motivo da correção.')
      return
    }
    setError('')
    setSaving(true)
    try {
      const result = await reviewExpense(token, expense.id_despesa, decision, decision === 'PENDENTE_CORRECAO' ? trimmed : null)
      onReviewed(result)
      setOpen(false)
      setReason('')
    } catch (err) {
      setError(err.message || 'Não foi possível registrar a conferência.')
    } finally { setSaving(false) }
  }

  return (
    <div className="review-actions">
      {!expanded && <button className="details-link" type="button" onClick={() => setOpen(!open)} disabled={saving}>{open ? 'Fechar conferência' : 'Conferir despesa'}</button>}
      {(open || expanded) && <div className="review-panel">
        {!expanded && <p>Analise a despesa e o comprovante antes de decidir.</p>}
        <button className="workspace-button" type="button" onClick={() => review('CONFERIDA')} disabled={saving}>Marcar conferida</button>
        <button className="secondary-button" type="button" onClick={() => review('PENDENTE_CORRECAO')} disabled={saving}>Solicitar correção</button>
        <label className="field">Motivo da correção<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Descreva o problema" maxLength={2000} disabled={saving} /></label>
        {error && <p className="message error" role="alert">{error}</p>}
      </div>}
    </div>
  )
}

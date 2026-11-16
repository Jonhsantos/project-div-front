import { useState } from 'react'
import { deleteExpense } from './expensesApi'

export default function ExpenseDelete({ token, expense, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function remove() {
    setError('')
    setSaving(true)
    try {
      await deleteExpense(token, expense.id_despesa)
      onDeleted(expense.id_despesa)
    } catch (err) {
      setError(err.message || 'Não foi possível excluir a despesa.')
    } finally { setSaving(false) }
  }

  return <div className="review-actions">
    {!confirming ? <button className="delete-expense-button" type="button" onClick={() => setConfirming(true)}>Excluir despesa</button> : <div className="review-panel">
      <p>Excluir esta despesa e seu comprovante permanentemente?</p>
      <button className="workspace-button" type="button" onClick={remove} disabled={saving}>{saving ? 'Excluindo...' : 'Confirmar exclusão'}</button>
      <button className="secondary-button" type="button" onClick={() => setConfirming(false)} disabled={saving}>Cancelar</button>
    </div>}
    {error && <p className="message error" role="alert">{error}</p>}
  </div>
}

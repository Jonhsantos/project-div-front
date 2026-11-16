import { useState } from 'react'
import { formatCurrencyInput } from './currency'

export default function ExpenseForm({ expense, saving, onSubmit, onCancel, tripTitle }) {
  const [value, setValue] = useState(() => expense ? formatCurrencyInput(expense.valor) : '')
  return (
    <form className="expense-form expense-registration-card" onSubmit={onSubmit}>
      <h2>Dados da despesa</h2><p className="expense-form-trip">Viagem: {tripTitle}</p>
      <div className="trip-form-row"><label className="field">Descrição<input name="descricao" defaultValue={expense?.descricao || ''} placeholder="Ex.: Almoço" maxLength={255} required /></label><label className="field">Valor (R$)<input name="valor" value={value} onChange={(event) => { const input = event.target.value; setValue(event.nativeEvent.inputType?.startsWith('delete') && value === '0,00' ? '' : formatCurrencyInput(input)) }} inputMode="numeric" placeholder="0,00" aria-describedby="valor-ajuda" required /><span id="valor-ajuda">Digite o valor em centavos; a vírgula é adicionada automaticamente.</span></label></div>
      <div className="trip-form-row"><label className="field">Data<input name="data_despesa" type="date" defaultValue={expense?.data_despesa || ''} required /></label><label className="field">Categoria<select name="categoria" defaultValue={expense?.categoria || ''} required><option value="" disabled>Selecione uma categoria</option><option value="ALIMENTACAO">Alimentação</option><option value="HOSPEDAGEM">Hospedagem</option><option value="TRANSPORTE">Transporte</option><option value="ALUGUEL">Aluguel</option><option value="OUTROS">Outros</option></select></label></div>
      <label className="field expense-receipt">{expense ? 'Trocar comprovante (opcional; o atual será mantido)' : 'Anexar comprovante obrigatório'} · PDF, PNG ou JPEG, até 5 MB<input name="comprovante" type="file" accept="application/pdf,image/png,image/jpeg" required={!expense} /></label>
      <div className="trip-form-row"><button className="workspace-button" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar despesa'}</button><button className="secondary-button" type="button" onClick={onCancel} disabled={saving}>Cancelar</button></div>
      <p className="expense-form-note">Ao salvar: aguardando conferência.</p>
    </form>
  )
}

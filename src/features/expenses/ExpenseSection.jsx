import { useEffect, useState } from 'react'
import { createExpense, getReceipt, listExpenses, updateExpense } from './expensesApi'
import ExpenseReview from './ExpenseReview'
import ExpenseForm from './ExpenseForm'
import ExpenseDelete from './ExpenseDelete'
import ExpenseSummary from './ExpenseSummary'
import { currencyToDecimal } from './currency'
import Icon from '../../components/Icon'

function dateLabel(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const categoryLabels = { ALIMENTACAO: 'Alimentação', HOSPEDAGEM: 'Hospedagem', TRANSPORTE: 'Transporte', ALUGUEL: 'Aluguel', OUTROS: 'Outros' }
const statusLabels = { AGUARDANDO_CONFERENCIA: 'Aguardando conferência', CONFERIDA: 'Conferida', PENDENTE_CORRECAO: 'Pendente de correção' }

export default function ExpenseSection({ token, tripId, isLeader, tripStatus, tripTitle, participants = [] }) {
  const [expenses, setExpenses] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [summaryRevision, setSummaryRevision] = useState(0)
  const active = tripStatus === 'EM_ANDAMENTO'

  useEffect(() => {
    let ignore = false
    listExpenses(token, tripId).then((result) => {
      if (!ignore) setExpenses(result)
    }).catch((err) => {
      if (!ignore) setError(err.message || 'Não foi possível carregar as despesas.')
    })
    return () => { ignore = true }
  }, [token, tripId, retry])

  async function submitExpense(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    data.set('valor', currencyToDecimal(String(data.get('valor')).trim()))
    if (editing && !data.get('comprovante')?.name) data.delete('comprovante')
    setError('')
    setSaving(true)
    try {
      const expense = editing ? await updateExpense(token, editing.id_despesa, data) : await createExpense(token, tripId, data)
      setExpenses((previous) => editing ? previous.map((item) => item.id_despesa === expense.id_despesa ? expense : item) : [expense, ...(previous || [])])
      form.reset()
      setShowForm(false)
      setEditing(null)
      setSummaryRevision((n) => n + 1)
      setNotice(editing ? 'Despesa atualizada e aguardando conferência.' : 'Despesa registrada e aguardando conferência.')
    } catch (err) {
      setError(err.message || 'Não foi possível registrar a despesa.')
    } finally { setSaving(false) }
  }

  async function download(expenseId) {
    setError('')
    try {
      const blob = await getReceipt(token, expenseId)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const extension = { 'application/pdf': 'pdf', 'image/png': 'png', 'image/jpeg': 'jpg' }[blob.type] || 'bin'
      link.href = url
      link.download = `comprovante-${expenseId}.${extension}`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) { setError(err.message || 'Não foi possível baixar o comprovante.') }
  }

  function handleDeleted(id) {
    setExpenses((previous) => previous.filter((item) => item.id_despesa !== id))
    setSelectedId(null)
    setSummaryRevision((n) => n + 1)
    if (editing?.id_despesa === id) { setEditing(null); setShowForm(false) }
    setNotice('Despesa e comprovante excluídos.')
  }

  if (active && showForm) return <section className="expense-registration">
    <div className="workspace-heading expense-registration-heading"><div><p className="eyebrow">VIAGEM / {editing ? 'EDITAR DESPESA' : 'NOVA DESPESA'}</p><h1>{editing ? 'Editar despesa' : 'Registrar despesa'}</h1><p>Adicione as informações para conferência pelo líder.</p><p className="expense-registration-mobile-trip">Viagem: {tripTitle}</p></div></div>
    <ExpenseForm key={editing?.id_despesa || 'new'} tripTitle={tripTitle} expense={editing} saving={saving} onSubmit={submitExpense} onCancel={() => { setShowForm(false); setEditing(null); setError('') }} />
    {error && <p className="message error" role="alert">{error}</p>}
  </section>

  const selected = expenses?.find((expense) => expense.id_despesa === selectedId)
  if (selected) return <section className={`expense-detail-view ${isLeader ? 'expense-review-view' : ''}`}>
    <div className="workspace-heading expense-detail-heading"><div><p className="eyebrow"><span className="expense-detail-desktop-path">VIAGEM / DESPESA #{selected.id_despesa}</span><span className="expense-detail-mobile-path">MINHAS VIAGENS / {isLeader ? 'CONFERIR DESPESA' : 'DETALHES DA DESPESA'}</span></p><h1>{isLeader ? 'Conferir despesa' : 'Detalhes da despesa'}</h1><p>Revise as informações e o comprovante do lançamento.</p></div><button className="secondary-button button-icon" type="button" onClick={() => { setSelectedId(null); setError('') }}><Icon name="arrowBack" /> Voltar</button></div>
    {error && <p className="message error" role="alert">{error}</p>}
    <div className="expense-detail-grid">
      <section className="trip-card expense-detail-card">
        <div className="trip-card-heading"><h2>{selected.descricao}<span className="expense-mobile-value"> · R$ {selected.valor.replace('.', ',')}</span></h2><span className={`expense-detail-status status-${selected.status.toLowerCase()}`}>{({ AGUARDANDO_CONFERENCIA: 'Aguardando conferência', CONFERIDA: 'Conferida', PENDENTE_CORRECAO: 'Pendente de correção' })[selected.status]}</span></div>
        <p>Despesa #{selected.id_despesa} · {tripTitle}</p>
        <dl className="expense-detail-data"><div className="expense-detail-value"><dt>Valor</dt><dd>R$ {selected.valor.replace('.', ',')}</dd></div><div><dt>Data</dt><dd>{dateLabel(selected.data_despesa)}</dd></div><div className="expense-detail-category"><dt>Categoria</dt><dd>{categoryLabels[selected.categoria] || selected.categoria.replaceAll('_', ' ')}</dd></div>{isLeader && <div><dt>Técnico</dt><dd>{participants.find((person) => person.id_usuario === selected.id_usuario)?.nome || 'Não disponível'}</dd></div>}<div><dt>Comprovante</dt><dd><button className="details-link" type="button" onClick={() => download(selected.id_despesa)}>Baixar comprovante</button></dd></div></dl>
        {selected.motivo_correcao && <p className="message error"><strong>Motivo da correção:</strong> {selected.motivo_correcao}</p>}
      </section>
      <section className="trip-card expense-detail-actions"><h2>{isLeader ? 'Conferência' : 'Ações disponíveis'}</h2><p>{isLeader ? 'Analise antes de decidir.' : 'Gerencie este lançamento.'}</p>
        {isLeader && active && selected.status === 'AGUARDANDO_CONFERENCIA' && <ExpenseReview token={token} expense={selected} expanded onReviewed={(updated) => setExpenses((previous) => previous.map((item) => item.id_despesa === updated.id_despesa ? updated : item))} />}
        {!isLeader && active && selected.status !== 'CONFERIDA' && <button className="workspace-button" type="button" onClick={() => { setEditing(selected); setShowForm(true); setError(''); setNotice('') }}>Editar despesa</button>}
        {active && (isLeader ? selected.status === 'CONFERIDA' : selected.status !== 'CONFERIDA') && <ExpenseDelete token={token} expense={selected} onDeleted={handleDeleted} />}
        <p>{!active ? 'Esta viagem está encerrada e disponível somente para consulta.' : isLeader ? 'Somente despesas conferidas podem ser excluídas pelo líder.' : 'Despesas conferidas não podem ser editadas ou excluídas.'}</p>
      </section>
    </div>
  </section>

  return <>
    <ExpenseSummary key={summaryRevision} token={token} tripId={tripId} isLeader={isLeader} revision={summaryRevision} />
    <section className={`trip-card ${isLeader ? 'leader-expenses' : 'technician-expenses'}`}>
      <div className="trip-card-heading">
        <h2>{isLeader ? 'Despesas da viagem' : 'Minhas despesas'}</h2>
        {!isLeader && active && <button className="workspace-button" type="button" disabled={saving} onClick={() => { setShowForm(!showForm); setEditing(null); setError(''); setNotice('') }}>{showForm ? 'Cancelar' : '+ Registrar despesa'}</button>}
      </div>
      {notice && <p className="message success" role="status">{notice}</p>}
      {error && <div className="message error" role="alert">{error} {!showForm && <button type="button" onClick={() => { setError(''); setExpenses(null); setRetry((n) => n + 1) }}>Tentar novamente</button>}</div>}
      {!expenses && !error && <p role="status">Carregando despesas...</p>}
      {expenses && !expenses.length && <p>Nenhuma despesa registrada.</p>}
      {expenses?.map((expense) => <article className="expense-item" key={expense.id_despesa}>
        <div>
          <strong>{expense.descricao}</strong>
          <p>{dateLabel(expense.data_despesa)} · {categoryLabels[expense.categoria] || expense.categoria}</p>
          <p><span className={`expense-detail-status status-${expense.status.toLowerCase()}`}>{statusLabels[expense.status] || expense.status}</span></p>
          {expense.motivo_correcao && <p><strong>Motivo da correção:</strong> {expense.motivo_correcao}</p>}
          <button className={isLeader ? 'expense-open-button' : 'details-link'} type="button" onClick={() => { setSelectedId(expense.id_despesa); setError('') }}>{isLeader ? 'Abrir despesa' : 'Ver detalhes'} <Icon name="arrowForward" /><span className="visually-hidden"> de {expense.descricao}</span></button>
          {active && isLeader && expense.status === 'CONFERIDA' && <ExpenseDelete token={token} expense={expense} onDeleted={handleDeleted} />}
        </div>
        <div><strong>R$ {expense.valor.replace('.', ',')}</strong><br /><button className="details-link" type="button" onClick={() => download(expense.id_despesa)}>Baixar comprovante</button></div>
      </article>)}
    </section>
  </>
}

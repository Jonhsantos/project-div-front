import { useEffect, useState } from 'react'
import { createExpense, getReceipt, listExpenses, updateExpense } from './expensesApi'
import ExpenseReview from './ExpenseReview'
import ExpenseForm from './ExpenseForm'
import ExpenseDelete from './ExpenseDelete'
import ExpenseSummary from './ExpenseSummary'
import { currencyToDecimal } from './currency'
import Icon from '../../components/Icon'
import BackButton from '../../components/BackButton'
import LoadingSkeleton from '../../components/LoadingSkeleton'

function dateLabel(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

const categoryLabels = { ALIMENTACAO: 'Alimentação', HOSPEDAGEM: 'Hospedagem', TRANSPORTE: 'Transporte', ALUGUEL: 'Aluguel', OUTROS: 'Outros' }
const statusLabels = { AGUARDANDO_CONFERENCIA: 'Aguardando conferência', CONFERIDA: 'Conferida', PENDENTE_CORRECAO: 'Pendente de correção' }
const expenseColumns = 'grid grid-cols-2 gap-x-4 gap-y-3 min-[1100px]:grid-cols-[minmax(0,2fr)_minmax(0,1.15fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(150px,1fr)]'

export default function ExpenseSection({ token, tripId, userId, isLeader, tripStatus, tripTitle, tripStartDate, participants = [], showForm, setShowForm }) {
  const [expenses, setExpenses] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
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

  if (active && showForm) return <section className="expense-registration motion-enter">
    <div className="workspace-heading expense-registration-heading"><div><p className="eyebrow">VIAGEM / {editing ? 'EDITAR DESPESA' : 'NOVA DESPESA'}</p><div className="back-title"><BackButton disabled={saving} onClick={() => { setShowForm(false); setEditing(null); setError('') }} /><h1>{editing ? 'Editar despesa' : 'Registrar despesa'}</h1></div><p>Adicione as informações para conferência pelo líder.</p><p className="expense-registration-mobile-trip">Viagem: {tripTitle}</p></div></div>
    <ExpenseForm key={editing?.id_despesa || 'new'} tripTitle={tripTitle} tripStartDate={tripStartDate} expense={editing} saving={saving} onSubmit={submitExpense} onCancel={() => { setShowForm(false); setEditing(null); setError('') }} />
    {error && <p className="message error" role="alert">{error}</p>}
  </section>

  const selected = expenses?.find((expense) => expense.id_despesa === selectedId)
  if (selected) return <section className={`expense-detail-view motion-enter ${isLeader ? 'expense-review-view' : ''}`}>
    <div className="workspace-heading expense-detail-heading"><div><p className="eyebrow"><span className="expense-detail-desktop-path">VIAGEM / DESPESA #{selected.id_despesa}</span><span className="expense-detail-mobile-path">MINHAS VIAGENS / {isLeader ? 'CONFERIR DESPESA' : 'DETALHES DA DESPESA'}</span></p><div className="back-title"><BackButton onClick={() => { setSelectedId(null); setError('') }} /><h1>{isLeader ? 'Conferir despesa' : 'Detalhes da despesa'}</h1></div><p>Revise as informações e o comprovante do lançamento.</p></div></div>
    {error && <p className="message error" role="alert">{error}</p>}
    <div className="expense-detail-grid">
      <section className="trip-card expense-detail-card">
        <div className="trip-card-heading"><h2>{selected.descricao}<span className="expense-mobile-value"> · R$ {selected.valor.replace('.', ',')}</span></h2><span className={`expense-detail-status status-${selected.status.toLowerCase()}`}>{({ AGUARDANDO_CONFERENCIA: 'Aguardando conferência', CONFERIDA: 'Conferida', PENDENTE_CORRECAO: 'Pendente de correção' })[selected.status]}</span></div>
        <p>Despesa #{selected.id_despesa} · {tripTitle}</p>
        <dl className="expense-detail-data"><div className="expense-detail-value"><dt>Valor</dt><dd>R$ {selected.valor.replace('.', ',')}</dd></div><div><dt>Data</dt><dd>{dateLabel(selected.data_despesa)}</dd></div><div className="expense-detail-category"><dt>Categoria</dt><dd>{categoryLabels[selected.categoria] || selected.categoria.replaceAll('_', ' ')}</dd></div>{isLeader && <div><dt>Responsável</dt><dd>{participants.find((person) => person.id_usuario === selected.id_usuario)?.nome || 'Não disponível'}</dd></div>}<div><dt>Comprovante</dt><dd><button className="details-link" type="button" onClick={() => download(selected.id_despesa)}>Baixar comprovante</button></dd></div></dl>
        {selected.motivo_correcao && <p className="message error"><strong>Motivo da correção:</strong> {selected.motivo_correcao}</p>}
      </section>
      <section className="trip-card expense-detail-actions"><h2>{isLeader ? 'Conferência' : 'Ações disponíveis'}</h2><p>{isLeader ? 'Analise antes de decidir.' : 'Gerencie este lançamento.'}</p>
        {isLeader && active && selected.status === 'AGUARDANDO_CONFERENCIA' && <ExpenseReview token={token} expense={selected} expanded onReviewed={(updated) => setExpenses((previous) => previous.map((item) => item.id_despesa === updated.id_despesa ? updated : item))} />}
        {active && selected.id_usuario === userId && selected.status !== 'CONFERIDA' && <button className="workspace-button" type="button" onClick={() => { setEditing(selected); setShowForm(true); setError(''); setNotice('') }}>Editar despesa</button>}
        {active && (isLeader ? selected.status === 'CONFERIDA' : selected.status !== 'CONFERIDA') && <ExpenseDelete token={token} expense={selected} onDeleted={handleDeleted} />}
        <p>{!active ? 'Esta viagem está encerrada e disponível somente para consulta.' : isLeader ? 'Somente despesas conferidas podem ser excluídas pelo líder.' : 'Despesas conferidas não podem ser editadas ou excluídas.'}</p>
      </section>
    </div>
  </section>

  return <>
    <ExpenseSummary key={summaryRevision} token={token} tripId={tripId} isLeader={isLeader} revision={summaryRevision} />
    <section className={`trip-card ${isLeader ? 'leader-expenses' : 'technician-expenses'}`}>
      <div className="trip-card-heading">
        <div className="flex flex-col gap-1"><h2>{isLeader ? 'Despesas da viagem' : 'Minhas despesas'}</h2><p className="text-xs text-[#5c655f]">{isLeader ? 'Acompanhe os lançamentos da equipe.' : 'Acompanhe seus lançamentos e suas situações.'}</p></div>
        {!isLeader && active && <button className="workspace-button" type="button" disabled={saving} onClick={() => { setShowForm(!showForm); setEditing(null); setError(''); setNotice('') }}>{showForm ? 'Cancelar' : '+ Registrar despesa'}</button>}
      </div>
      {notice && <p className="message success" role="status">{notice}</p>}
      {error && <div className="message error" role="alert">{error} {!showForm && <button type="button" onClick={() => { setError(''); setExpenses(null); setRetry((n) => n + 1) }}>Tentar novamente</button>}</div>}
      {!expenses && !error && <LoadingSkeleton label="Carregando despesas..." />}
      {expenses && !expenses.length && <p>Nenhuma despesa registrada.</p>}
      {!!expenses?.length && <div className={`${expenseColumns} hidden border-b border-[#daddd8] pb-2 text-[10px] font-bold text-[#5c655f] min-[1100px]:grid`} aria-hidden="true"><span>{isLeader ? 'DESPESA / RESPONSÁVEL' : 'DESPESA'}</span><span>DATA / CATEGORIA</span><span>SITUAÇÃO</span><span>VALOR</span><span>AÇÕES</span></div>}
      {expenses?.map((expense) => <article className={`expense-list-row ${expenseColumns} items-start border-b border-[#daddd8] pb-4 last:border-b-0 last:pb-0 min-[1100px]:items-center`} key={expense.id_despesa}>
        <div className="expense-list-name flex min-w-0 flex-col gap-1"><strong className="text-sm">{expense.descricao}</strong>{isLeader && <p className="text-xs text-[#5c655f]"><span className="visually-hidden">Responsável: </span>{participants.find((person) => person.id_usuario === expense.id_usuario)?.nome || 'Não disponível'}</p>}</div>
        <div className="expense-list-meta flex min-w-0 flex-col gap-1 text-xs"><p><span className="visually-hidden">Data: </span>{dateLabel(expense.data_despesa)}</p><p className="text-[#5c655f]"><span className="visually-hidden">Categoria: </span>{categoryLabels[expense.categoria] || expense.categoria}</p></div>
        <div className="expense-list-status min-w-0"><span className="visually-hidden">Situação: </span><span className={`expense-detail-status inline-block status-${expense.status.toLowerCase()}`}>{statusLabels[expense.status] || expense.status}</span></div>
        <div className="expense-list-value min-w-0"><span className="visually-hidden">Valor: </span><strong className="text-sm">R$ {expense.valor.replace('.', ',')}</strong></div>
        <div className="expense-list-actions col-span-2 min-w-0 min-[1100px]:col-span-1"><button className="expense-open-button" type="button" onClick={() => { setSelectedId(expense.id_despesa); setError('') }}>Abrir despesa <Icon name="arrowForward" /><span className="visually-hidden"> de {expense.descricao}{isLeader && ` - ${participants.find((person) => person.id_usuario === expense.id_usuario)?.nome || 'Não disponível'}`}</span></button>{isLeader && active && expense.status === 'CONFERIDA' && <ExpenseDelete token={token} expense={expense} onDeleted={handleDeleted} />}</div>
        {expense.motivo_correcao && <p className="expense-list-reason col-span-2 min-[1100px]:col-span-5"><strong>Motivo da correção:</strong> {expense.motivo_correcao}</p>}
      </article>)}
    </section>
  </>
}

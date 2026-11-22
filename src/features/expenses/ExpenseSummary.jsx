import { useEffect, useState } from 'react'
import { getExpenseSummary } from './expensesApi'

function money(value) {
  const [whole, fraction = ''] = value.split('.')
  return `R$ ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${fraction.padEnd(2, '0')}`
}

export default function ExpenseSummary({ token, tripId, isLeader, revision }) {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let ignore = false
    getExpenseSummary(token, tripId).then((result) => {
      if (!ignore) { setSummary(result); setError('') }
    }).catch((err) => {
      if (!ignore) { setSummary(null); setError(err.message || 'Não foi possível carregar os totais.') }
    })
    return () => { ignore = true }
  }, [token, tripId, revision, retry])

  return <section className="trip-card" aria-label="Resumo de despesas">
    <h2>{isLeader ? 'Total da viagem' : 'Minhas despesas'}</h2>
    {error ? <p className="message error" role="alert">{error} <button type="button" onClick={() => setRetry((n) => n + 1)}>Tentar novamente</button></p> : !summary ? <p role="status">Carregando totais...</p> : <>
      <p><strong>{money(summary.total)}</strong> · {summary.quantidade} {summary.quantidade === 1 ? 'despesa' : 'despesas'}</p>
      {isLeader && summary.por_tecnico.length > 0 && <div><strong>Total por participante</strong><ul className="participant-list">{summary.por_tecnico.map((person) => <li key={person.id_usuario}>{person.nome}: {money(person.total)} · {person.quantidade} {person.quantidade === 1 ? 'despesa' : 'despesas'}</li>)}</ul></div>}
    </>}
  </section>
}

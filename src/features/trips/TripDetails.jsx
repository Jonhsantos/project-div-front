import { useEffect, useState } from 'react'
import { getTripDetails } from './tripsApi'
import ExpenseSection from '../expenses/ExpenseSection'
import TripClose, { TripCloseDialog } from './TripClose'
import useTripClose from './useTripClose'
import TripExport from './TripExport'
import TripCode from './TripCode'
import BackButton from '../../components/BackButton'
import LoadingSkeleton from '../../components/LoadingSkeleton'

function dateLabel(value) {
  if (!value) return 'Não informada'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

function closedDateLabel(value) {
  if (!value) return 'Não registrada'
  const instant = new Date(value)
  if (Number.isNaN(instant.getTime())) return 'Não registrada'
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo' }).format(instant)
}

export default function TripDetails({ token, tripId, userId, isLeader, onBack, onTripClosed }) {
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const closeController = useTripClose(token, tripId, (trip) => { setDetails((current) => ({ ...current, viagem: trip })); onTripClosed(trip) })

  useEffect(() => {
    let ignore = false
    getTripDetails(token, tripId).then((result) => {
      if (!ignore) setDetails(result)
    }).catch((err) => {
      if (!ignore) setError(err.message || 'Não foi possível carregar a viagem.')
    })
    return () => { ignore = true }
  }, [token, tripId, retry])

  return (
    <>
      <TripCloseDialog controller={closeController} />
      <div className="workspace-heading leader-details-heading"><div><p className="eyebrow">MINHAS VIAGENS / DETALHES<span className="details-mobile-suffix"> DA VIAGEM</span></p><div className="back-title"><BackButton onClick={onBack} /><h1>{isLeader ? 'Detalhes da viagem' : 'Minha viagem'}</h1></div><p>Informações, participantes e despesas em um só lugar.</p></div><div className="trip-detail-heading-actions">{isLeader && details?.viagem.status === 'EM_ANDAMENTO' && <><TripClose controller={closeController} className="trip-close-desktop" /><button className="workspace-button leader-register-desktop" type="button" onClick={() => setShowExpenseForm(true)}>+ Registrar despesa</button></>}</div></div>
      {error ? <div className="message error" role="alert">{error} <button type="button" onClick={() => { setError(''); setRetry((n) => n + 1) }}>Tentar novamente</button></div> : !details ? <LoadingSkeleton label="Carregando detalhes..." /> : (
        <div className={`trip-details ${isLeader ? 'leader-details' : ''}`}>
          <section className="trip-card trip-details-summary">
            <div className="trip-card-heading"><h2>{details.viagem.titulo}</h2><span className={`trip-status ${details.viagem.status === 'ENCERRADA' ? 'trip-status-closed' : ''}`}>{details.viagem.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada'}</span></div>
            <p><strong>Destino:</strong> {details.viagem.destino}</p>
            <p><strong>Início:</strong> {dateLabel(details.viagem.data_inicio)} · <strong>Data prevista de término:</strong> {dateLabel(details.viagem.data_fim)}</p>
            {details.viagem.status === 'ENCERRADA' && <p><strong>Data de encerramento:</strong> {closedDateLabel(details.viagem.encerrada_em)}</p>}
            {details.viagem.descricao && <p><strong>Descrição:</strong> {details.viagem.descricao}</p>}
            {isLeader && <TripCode code={details.viagem.codigo_acesso} />}
          </section>
          {isLeader && details.viagem.status === 'EM_ANDAMENTO' && <button className="workspace-button leader-register-mobile" type="button" onClick={() => setShowExpenseForm(true)}>+ Registrar despesa</button>}
          {details.viagem.status === 'ENCERRADA' && <><div className="closed-trip-notice"><strong>Viagem encerrada · Somente consulta</strong><p>Novas despesas e participantes estão bloqueados. Somente o líder responsável pode exportar os dados.</p>{isLeader && <TripExport token={token} trip={details.viagem} />}</div>{isLeader && <section className="trip-card"><h2>Dados da viagem</h2><p>O relatório inclui viagem, participantes, despesas, valores, datas, situações de conferência e comprovantes.</p></section>}</>}
          {isLeader && <section className="trip-card trip-participants"><h2>Participantes · {details.participantes.length}</h2><ul className="participant-list">{details.participantes.map((person) => <li key={person.id_usuario}>{person.nome} · {person.perfil === 'LIDER' ? 'Líder' : 'Técnico'}</li>)}</ul></section>}
          <ExpenseSection token={token} tripId={tripId} tripTitle={details.viagem.titulo} tripStartDate={details.viagem.data_inicio} participants={details.participantes || []} userId={userId} isLeader={isLeader} tripStatus={details.viagem.status} showForm={showExpenseForm} setShowForm={setShowExpenseForm} />
          {isLeader && details.viagem.status === 'EM_ANDAMENTO' && <TripClose controller={closeController} className="trip-close-mobile" />}
        </div>
      )}
    </>
  )
}

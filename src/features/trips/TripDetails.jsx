import { useEffect, useState } from 'react'
import { getTripDetails } from './tripsApi'
import ExpenseSection from '../expenses/ExpenseSection'
import TripClose from './TripClose'
import TripExport from './TripExport'
import TripCode from './TripCode'
import Icon from '../../components/Icon'

function dateLabel(value) {
  if (!value) return 'Não informada'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export default function TripDetails({ token, tripId, isLeader, onBack, onTripClosed }) {
  const [details, setDetails] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

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
      <div className="workspace-heading leader-details-heading"><div><p className="eyebrow">MINHAS VIAGENS / DETALHES<span className="details-mobile-suffix"> DA VIAGEM</span></p><h1>{isLeader ? 'Detalhes da viagem' : 'Minha viagem'}</h1><p>Informações, participantes e despesas em um só lugar.</p></div><button className="secondary-button button-icon" type="button" onClick={onBack}><Icon name="arrowBack" /> Voltar</button></div>
      {error ? <div className="message error" role="alert">{error} <button type="button" onClick={() => { setError(''); setRetry((n) => n + 1) }}>Tentar novamente</button></div> : !details ? <p role="status">Carregando detalhes...</p> : (
        <div className={`trip-details ${isLeader ? 'leader-details' : ''}`}>
          <section className="trip-card trip-details-summary">
            <div className="trip-card-heading"><h2>{details.viagem.titulo}</h2><span className={`trip-status ${details.viagem.status === 'ENCERRADA' ? 'trip-status-closed' : ''}`}>{details.viagem.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada'}</span></div>
            <p><strong>Destino:</strong> {details.viagem.destino}</p>
            <p><strong>Início:</strong> {dateLabel(details.viagem.data_inicio)} · <strong>Término:</strong> {dateLabel(details.viagem.data_fim)}</p>
            {details.viagem.descricao && <p><strong>Descrição:</strong> {details.viagem.descricao}</p>}
            {isLeader && <TripCode code={details.viagem.codigo_acesso} />}
          </section>
          {details.viagem.status === 'ENCERRADA' && <><div className="closed-trip-notice"><strong>Viagem encerrada · Somente consulta</strong><p>Novas despesas e participantes estão bloqueados. Somente o líder responsável pode exportar os dados.</p>{isLeader && <TripExport token={token} trip={details.viagem} />}</div>{isLeader && <section className="trip-card"><h2>Dados da viagem</h2><p>O relatório inclui viagem, participantes, despesas, valores, datas, situações de conferência e comprovantes.</p></section>}</>}
          {isLeader && <section className="trip-card trip-participants"><h2>Participantes · {details.participantes.length}</h2><ul className="participant-list">{details.participantes.map((person) => <li key={person.id_usuario}>{person.nome} · {person.perfil === 'LIDER' ? 'Líder' : 'Técnico'}</li>)}</ul></section>}
          <ExpenseSection token={token} tripId={tripId} tripTitle={details.viagem.titulo} participants={details.participantes || []} isLeader={isLeader} tripStatus={details.viagem.status} />
          {isLeader && details.viagem.status === 'EM_ANDAMENTO' && <TripClose token={token} tripId={tripId} onClosed={(trip) => { setDetails((current) => ({ ...current, viagem: trip })); onTripClosed(trip) }} />}
        </div>
      )}
    </>
  )
}

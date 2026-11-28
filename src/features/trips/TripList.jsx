import Icon from '../../components/Icon'
import TripCode from './TripCode'

function dateLabel(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export default function TripList({ trips, isLeader, onOpen, emptyMessage, structured = false }) {
  if (!trips.length) return <p>{emptyMessage}</p>

  if (structured) {
    const columns = 'grid grid-cols-2 gap-x-4 gap-y-3 min-[1100px]:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.2fr)_minmax(150px,1fr)]'

    return <section className="trip-card structured-trip-list" aria-label="Lista de viagens">
      <div className={`${columns} hidden border-b border-[#daddd8] pb-2 text-[10px] font-bold text-[#5c655f] min-[1100px]:grid`} aria-hidden="true"><span>NOME</span><span>LOCALIZAÇÃO</span><span>STATUS</span><span>AÇÕES</span></div>
      {trips.map((trip) => <article className={`structured-trip-row ${columns} items-start border-b border-[#daddd8] pb-4 last:border-b-0 last:pb-0 min-[1100px]:items-center`} key={trip.id_viagem}>
        <h2 className="structured-trip-name min-w-0">{trip.titulo}</h2>
        <p className="structured-trip-location min-w-0"><span className="visually-hidden">Localização: </span>{trip.destino}</p>
        <div className="structured-trip-status min-w-0"><span className="visually-hidden">Status: </span><span className={`trip-status inline-block ${trip.status === 'ENCERRADA' ? 'trip-status-closed' : ''}`}>{trip.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada'}</span></div>
        <div className="structured-trip-action min-w-0"><button className="expense-open-button" type="button" onClick={() => onOpen(trip.id_viagem)}>Ver detalhes <Icon name="arrowForward" /><span className="visually-hidden"> de {trip.titulo}</span></button></div>
      </article>)}
    </section>
  }

  return <div className="trip-grid">{trips.map((trip) => <article className="trip-card" key={trip.id_viagem}>
    <div className="trip-card-heading"><h2>{trip.titulo}</h2><span className={`trip-status ${trip.status === 'ENCERRADA' ? 'trip-status-closed' : ''}`}>{trip.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada'}</span></div>
    <p>{trip.destino} · {dateLabel(trip.data_inicio)}</p>
    {isLeader && <TripCode code={trip.codigo_acesso} />}
    <button className="details-link" type="button" onClick={() => onOpen(trip.id_viagem)}>Ver detalhes <Icon name="arrowForward" /><span className="sr-only"> de {trip.titulo}</span></button>
  </article>)}</div>
}

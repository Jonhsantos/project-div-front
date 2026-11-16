import Icon from '../../components/Icon'
import TripCode from './TripCode'

function dateLabel(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export default function TripList({ trips, isLeader, onOpen, emptyMessage }) {
  if (!trips.length) return <p>{emptyMessage}</p>

  return <div className="trip-grid">{trips.map((trip) => <article className="trip-card" key={trip.id_viagem}>
    <div className="trip-card-heading"><h2>{trip.titulo}</h2><span className={`trip-status ${trip.status === 'ENCERRADA' ? 'trip-status-closed' : ''}`}>{trip.status === 'EM_ANDAMENTO' ? 'Em andamento' : 'Encerrada'}</span></div>
    <p>{trip.destino} · {dateLabel(trip.data_inicio)}</p>
    {isLeader && <TripCode code={trip.codigo_acesso} />}
    <button className="details-link" type="button" onClick={() => onOpen(trip.id_viagem)}>Ver detalhes <Icon name="arrowForward" /><span className="sr-only"> de {trip.titulo}</span></button>
  </article>)}</div>
}

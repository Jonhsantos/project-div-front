import { useEffect, useState } from 'react'
import logo from '../../../div-logo-oficial.png'
import { createTrip, joinTrip, listTrips } from './tripsApi'
import TripDetails from './TripDetails'
import TripList from './TripList'
import TripCreateForm from './TripCreateForm'
import TripJoinForm from './TripJoinForm'
import TermsButton from '../auth/TermsButton'
import TermsPage from '../auth/TermsPage'
import Icon from '../../components/Icon'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import useViewMotion from '../../components/useViewMotion'
import './Trips.css'

const emptyTrip = { titulo: '', destino: '', data_inicio: '', data_fim: '', descricao: '' }

export default function Trips({ user, token, onLogout }) {
  const [trips, setTrips] = useState([])
  const [view, setView] = useState('list')
  const [form, setForm] = useState(emptyTrip)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [code, setCode] = useState('')
  const [joinNotice, setJoinNotice] = useState('')
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [section, setSection] = useState('list')
  const [filter, setFilter] = useState('TODAS')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const contentRef = useViewMotion(`${view}:${section}`)
  const isLeader = user.perfil === 'LIDER'
  const visibleTrips = trips.filter((trip) => section === 'history' ? trip.status === 'ENCERRADA' : filter === 'TODAS' || trip.status === filter)

  useEffect(() => {
    let ignore = false
    listTrips(token).then((data) => {
      if (!ignore) { setTrips(data); setError(''); setLoading(false) }
    }).catch((err) => {
      if (!ignore) { setError(err.message); setLoading(false) }
    })
    return () => { ignore = true }
  }, [token, reload])

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!form.titulo.trim() || !form.destino.trim()) {
      setError('Preencha o título e o destino.')
      return
    }
    if (form.data_fim && form.data_fim < form.data_inicio) {
      setError('A data prevista de término não pode ser anterior à data de início.')
      return
    }
    setSaving(true)
    try {
      const trip = await createTrip(token, { ...form, titulo: form.titulo.trim(), destino: form.destino.trim(), data_fim: form.data_fim || null, descricao: form.descricao.trim() || null })
      setTrips((previous) => [trip, ...previous])
      setForm(emptyTrip)
      setSelectedTrip(trip.id_viagem)
      setView('details')
    } catch (err) {
      setError(err.message || 'Não foi possível criar a viagem.')
    } finally {
      setSaving(false)
    }
  }

  async function submitJoin(event) {
    event.preventDefault()
    setError('')
    setJoinNotice('')
    if (!code.trim()) { setError('Informe o código da viagem.'); return }
    setSaving(true)
    try {
      const trip = await joinTrip(token, code.trim())
      setTrips((previous) => [trip, ...previous.filter((item) => item.id_viagem !== trip.id_viagem)])
      setCode('')
      setJoinNotice('Você entrou na viagem com sucesso.')
      setView('list')
    } catch (err) {
      setError(err.message || 'Não foi possível entrar na viagem.')
    } finally {
      setSaving(false)
    }
  }

  function showList() { setView('list'); setError('') }

  function openSection(nextSection) {
    setMenuOpen(false)
    setSection(nextSection)
    setFilter('TODAS')
    setJoinNotice('')
    setView('list')
    setError('')
    setLoading(true)
    setReload((n) => n + 1)
  }

  return (
    <>
    {showTerms && <TermsPage onBack={() => setShowTerms(false)} />}
    <main className={`workspace ${view === 'list' ? 'leader-list' : ''}`} hidden={showTerms}>
      <header className="mobile-workspace-header">
        <img className="logo" src={logo} alt="DIV" />
        <button type="button" className="mobile-menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{isLeader ? 'Líder' : 'Técnico'} <Icon name="menu" /><span className="visually-hidden"> {menuOpen ? 'Fechar menu' : 'Abrir menu'}</span></button>
      </header>
      <nav id="mobile-navigation" className={`mobile-navigation ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal" aria-hidden={!menuOpen} inert={!menuOpen} onKeyDown={(event) => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector('.mobile-menu-toggle')?.focus() } }}>
        <div className="mobile-navigation-inner">
        <button type="button" className={section === 'list' ? 'sidebar-active' : 'sidebar-logout'} aria-current={section === 'list' ? 'page' : undefined} onClick={() => openSection('list')}><Icon name="trips" /> &nbsp; Minhas viagens</button>
        <button type="button" className={section === 'history' ? 'sidebar-active' : 'sidebar-logout'} aria-current={section === 'history' ? 'page' : undefined} onClick={() => openSection('history')}><Icon name="history" /> &nbsp; Histórico</button>
        <button type="button" className="sidebar-logout" onClick={onLogout}><Icon name="logout" /> &nbsp; Sair</button>
        </div>
      </nav>
      <aside className="sidebar">
        <img className="logo" src={logo} alt="DIV" />
        <p className="sidebar-subtitle">DIVIDINDO CORRETAMENTE</p>
        <button className={section === 'list' ? 'sidebar-active' : 'sidebar-logout'} type="button" onClick={() => openSection('list')} aria-current={section === 'list' ? 'page' : undefined}><Icon name="trips" /> &nbsp; Minhas viagens</button>
        <button className={section === 'history' ? 'sidebar-active' : 'sidebar-logout'} type="button" onClick={() => openSection('history')} aria-current={section === 'history' ? 'page' : undefined}><Icon name="history" /> &nbsp; Histórico</button>
        <button className="sidebar-logout" type="button" onClick={onLogout}><Icon name="logout" /> &nbsp; Sair</button>
        <div className="sidebar-profile"><span>Conta conectada</span><strong>{user.nome} · {isLeader ? 'Líder' : 'Técnico'}</strong></div>
      </aside>
      <section className="workspace-content" ref={contentRef}>
        <header className="workspace-top"><span>DIV / {section === 'history' ? 'Histórico' : 'Minhas viagens'}</span><strong>{isLeader ? 'Líder' : 'Técnico'}</strong></header>
        {view === 'list' ? (
          <>
            <div className="workspace-heading"><div><p className="eyebrow"><span className="heading-desktop">ÁREA DE TRABALHO</span><span className="heading-mobile">{section === 'history' ? 'HISTÓRICO' : isLeader ? 'MINHAS VIAGENS / MINHAS VIAGENS' : 'Minhas Viagens'}</span></p><h1>{section === 'history' ? 'Histórico de viagens' : 'Minhas viagens'}</h1><p>{section === 'history' ? 'Consulte suas viagens encerradas.' : <><span className="heading-desktop">Organize e acompanhe suas viagens de trabalho.</span><span className="heading-mobile">Acompanhe suas viagens de trabalho.</span></>}</p></div>{section === 'list' && <button className={isLeader ? 'workspace-button' : 'secondary-button'} type="button" onClick={() => { setError(''); setJoinNotice(''); setView(isLeader ? 'create' : 'join') }}>{isLeader ? '+ Criar viagem' : 'Entrar com código'}</button>}</div>
            {section === 'list' && <div className="trip-filters" aria-label="Filtrar viagens">{[['TODAS', 'Todas as viagens'], ['EM_ANDAMENTO', 'Em andamento'], ['ENCERRADA', 'Encerradas']].map(([value, label]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div>}
            {joinNotice && <p className="message success" role="status">{joinNotice}</p>}
            {loading && <LoadingSkeleton label="Carregando viagens..." cards={2} />}
            {error && <div className="message error" role="alert">{error} <button type="button" onClick={() => { setLoading(true); setReload((n) => n + 1) }}>Tentar novamente</button></div>}
            {!loading && !error && <TripList trips={visibleTrips} isLeader={isLeader} emptyMessage={section === 'history' || filter === 'ENCERRADA' ? 'Nenhuma viagem encerrada para exibir.' : filter === 'EM_ANDAMENTO' ? 'Nenhuma viagem em andamento para exibir.' : isLeader ? 'Você ainda não criou nenhuma viagem.' : 'Você ainda não participa de nenhuma viagem.'} onOpen={(id) => { setSelectedTrip(id); setView('details') }} />}
          </>
        ) : view === 'details' ? (
          <TripDetails token={token} tripId={selectedTrip} userId={user.id_usuario} isLeader={isLeader} onBack={showList} onTripClosed={(closedTrip) => setTrips((previous) => previous.map((trip) => trip.id_viagem === closedTrip.id_viagem ? closedTrip : trip))} />
        ) : view === 'join' ? (
          <TripJoinForm code={code} onCodeChange={(event) => setCode(event.target.value)} onSubmit={submitJoin} onBack={showList} saving={saving} error={error} />
        ) : (
          <TripCreateForm form={form} onChange={change} onSubmit={submit} onBack={showList} saving={saving} error={error} />
        )}
      </section>
      <TermsButton onClick={() => setShowTerms(true)} />
    </main>
    </>
  )
}

import BackButton from '../../components/BackButton'

export default function TripJoinForm({ code, onCodeChange, onSubmit, onBack, saving, error }) {
  return <>
    <div className="workspace-heading"><div><p className="eyebrow">MINHAS VIAGENS</p><div className="back-title"><BackButton onClick={onBack} disabled={saving} /><h1>Entrar em uma viagem</h1></div><p>Insira o código compartilhado pelo líder.</p></div></div>
    <form className="trip-form join-form" onSubmit={onSubmit}>
      <label className="field">Código da viagem<input value={code} onChange={onCodeChange} placeholder="Ex.: DIV-0123456789ABCDEF" maxLength={20} required /></label>
      <div className="trip-form-row"><button className="workspace-button" type="submit" disabled={saving}>{saving ? 'Entrando...' : 'Entrar na viagem'}</button><button className="secondary-button" type="button" onClick={onBack} disabled={saving}>Cancelar</button></div>
      {error && <p className="message error" role="alert">{error}</p>}
    </form>
  </>
}

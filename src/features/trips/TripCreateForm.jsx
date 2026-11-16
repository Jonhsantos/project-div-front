import Icon from '../../components/Icon'

export default function TripCreateForm({ form, onChange, onSubmit, onBack, saving, error }) {
  return <>
    <div className="workspace-heading create-heading">
      <div><p className="eyebrow"><span className="create-desktop-text">MINHAS VIAGENS / NOVA VIAGEM</span><span className="create-mobile-text">MINHAS VIAGENS / CRIAR VIAGEM</span></p><h1>Criar viagem</h1><p><span className="create-desktop-text">Preencha os dados e compartilhe o código com sua equipe.</span><span className="create-mobile-text">Preencha os dados da viagem.</span></p></div>
      <button className="secondary-button button-icon" type="button" onClick={onBack}><Icon name="arrowBack" /> Voltar</button>
    </div>
    <form className="trip-form create-trip-form" onSubmit={onSubmit}>
      <h2>Dados da viagem</h2><p className="create-form-intro">Os campos marcados são necessários para começar.</p>
      <div className="trip-form-row">
        <label className="field">Título *<input name="titulo" value={form.titulo} onChange={onChange} placeholder="Ex.: Instalação de equipamentos" maxLength={150} required /></label>
        <label className="field">Destino *<input name="destino" value={form.destino} onChange={onChange} placeholder="Cidade ou endereço" maxLength={255} required /></label>
      </div>
      <div className="trip-form-row">
        <label className="field">Data de início *<input type="date" name="data_inicio" value={form.data_inicio} onChange={onChange} required /></label>
        <label className="field">Data de término · opcional<input type="date" name="data_fim" min={form.data_inicio || undefined} value={form.data_fim} onChange={onChange} /></label>
      </div>
      <label className="field">Descrição · opcional<textarea name="descricao" value={form.descricao} onChange={onChange} placeholder="Informações adicionais" maxLength={5000} /></label>
      <button className="workspace-button full-width" type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar viagem'}</button>
      {error && <p className="message error" role="alert">{error}</p>}
    </form>
  </>
}

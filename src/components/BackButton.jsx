import Icon from './Icon'

export default function BackButton({ onClick, disabled = false }) {
  return <button className="back-button" type="button" onClick={onClick} disabled={disabled} aria-label="Voltar" title="Voltar"><Icon name="arrowBack" /></button>
}

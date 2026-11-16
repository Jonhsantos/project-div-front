import { useState } from 'react'
import Icon from '../../components/Icon'

export default function TripCode({ code }) {
  const [notice, setNotice] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setNotice('Código copiado.')
    } catch {
      setNotice('Não foi possível copiar. Selecione o código e copie manualmente.')
    }
  }

  return <div><p><strong>Código:</strong> <button className="copy-button" type="button" onClick={copy} aria-label={`Copiar código ${code}`}><span>{code}</span><Icon name="copy" /></button></p>{notice && <p role="status">{notice}</p>}</div>
}

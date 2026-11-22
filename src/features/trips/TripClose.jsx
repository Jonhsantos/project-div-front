import { useEffect, useRef } from 'react'
import Icon from '../../components/Icon'

export default function TripClose({ controller, className = '' }) {
  return <div className={`trip-close ${className}`}>
    <button className="secondary-button" type="button" onClick={controller.open}>Encerrar viagem</button>
  </div>
}

export function TripCloseDialog({ controller }) {
  const { confirming, cancel, saving, error, close } = controller
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!confirming) return
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [confirming])

  return <dialog ref={dialogRef} className="trip-close-dialog" aria-labelledby="trip-close-title" aria-describedby="trip-close-description" onCancel={(event) => { event.preventDefault(); if (!saving) cancel() }}>
    <div className="trip-close-dialog-content">
      <span className="trip-close-dialog-icon" aria-hidden="true"><Icon name="warning" /></span>
      <h2 id="trip-close-title">Encerrar viagem?</h2>
      <p id="trip-close-description">Após o encerramento, a viagem e as despesas ficarão somente para consulta. Todas as despesas precisam estar conferidas.</p>
      {error && <p className="message error" role="alert">{error}</p>}
      <div className="trip-close-dialog-actions">
        <button className="secondary-button" type="button" onClick={cancel} disabled={saving} autoFocus>Cancelar</button>
        <button className="workspace-button" type="button" onClick={close} disabled={saving}>{saving ? 'Encerrando...' : 'Confirmar encerramento'}</button>
      </div>
    </div>
  </dialog>
}

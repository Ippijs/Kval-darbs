export default function Alert({ type, message, onClose }) {
  if (!message) return null

  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && <button onClick={onClose} style={{marginLeft: '1rem'}}>×</button>}
    </div>
  )
}

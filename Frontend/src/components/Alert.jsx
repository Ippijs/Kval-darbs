export default function Alert({ alert, type, message, onClose }) {
  const resolvedType = type ?? alert?.type
  const resolvedMessage = message ?? alert?.message

  if (!resolvedMessage) return null

  return (
    <div className={`alert alert-${resolvedType}`}>
      <span className="alert-message">{resolvedMessage}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Close alert">
          ×
        </button>
      )}
    </div>
  )
}

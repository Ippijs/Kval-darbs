import { useState } from 'react'

export default function About({ t }) {
  const [documentText, setDocumentText] = useState('')

  const handleDownloadText = () => {
    const blob = new Blob([documentText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dokuments.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{padding: '2rem'}}>
      <h1>{t.aboutTitle}</h1>
      <p>
        {t.aboutText}
      </p>
      <h2>{t.ourMission}</h2>
      <p>
        {t.missionText}
      </p>
      <h2 style={{ marginTop: '1.5rem' }}>{t.editableTextTitle}</h2>
      <textarea
        value={documentText}
        onChange={(e) => setDocumentText(e.target.value)}
        placeholder={t.editableTextPlaceholder}
        rows="10"
        style={{ width: '100%', marginTop: '0.5rem', marginBottom: '1rem', padding: '0.75rem' }}
      />
      <button
        type="button"
        className="btn-login"
        onClick={handleDownloadText}
        disabled={!documentText.trim()}
      >
        {t.downloadTextFile}
      </button>
    </div>
  )
}

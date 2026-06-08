export default function About({ t }) {
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
      <a
        href="/documents/FishingGear_Pro_Kvalifikacijas_Darba_Dokumentacija.docx"
        download
        className="btn-login"
        style={{display: 'inline-block', marginTop: '1rem', textDecoration: 'none'}}
      >
        {t.downloadWordDocument}
      </a>
    </div>
  )
}

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
    </div>
  )
}
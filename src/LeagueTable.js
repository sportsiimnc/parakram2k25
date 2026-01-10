export default function LeagueTable({ teams }) {
  return (
    <div className="card mt">
      <h3>League Standings</h3>

      {/* DESKTOP TABLE */}
      <table className="league-table desktop-only">
        <thead>
          <tr>
            <th>#</th>
            <th className="team-col">Team</th>
            <th>P</th>
            <th>W</th>
            <th>L</th>
            <th>Pts</th>
          </tr>
        </thead>

        <tbody>
          {teams.map((t, i) => (
            <tr key={t.Team}>
              <td>{i + 1}</td>
              <td className="team-col">{t.Team}</td>
              <td>{t.Played}</td>
              <td>{t.Won}</td>
              <td>{t.Lost}</td>
              <td>{t.Points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MOBILE CARDS */}
      <div className="mobile-only standings-cards">
        {teams.map((t, i) => (
          <div key={t.Team} className={`standing-card ${i < 3 ? "top" : ""}`}>
            <div className="standing-header">
              <span className="rank">#{i + 1}</span>
              <span className="team">{t.Team}</span>
            </div>

            <div className="standing-stats">
              <span>P <b>{t.Played}</b></span>
              <span>W <b>{t.Won}</b></span>
              <span>L <b>{t.Lost}</b></span>
              <span>Pts <b>{t.Points}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

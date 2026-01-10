import "./bracket.css";

export default function KnockoutBracket({ matches, roundOrder }) {
  if (!matches.length) {
    return <p className="muted">No bracket data available.</p>;
  }

  // Group matches by round
  const rounds = {};
  matches.forEach(m => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });

  // Sort matches inside each round
  Object.values(rounds).forEach(r =>
    r.sort((a, b) => a.match - b.match)
  );

  return (
    <div className="card mt">
      <h3>Bracket</h3>

      <div className="bracket">
        {roundOrder.map(round => {
          if (!rounds[round]) return null;

          return (
            <div key={round} className="round">
              <div className="round-title">{round}</div>

              {rounds[round].map((m, idx) => (
                <div key={idx} className="match">
                  <div className={`team ${m.winner === m.teamA ? "winner" : ""}`}>
                    {m.teamA || "TBD"}
                    <span>{m.scoreA ?? "–"}</span>
                  </div>

                  <div className={`team ${m.winner === m.teamB ? "winner" : ""}`}>
                    {m.teamB || "TBD"}
                    <span>{m.scoreB ?? "–"}</span>
                  </div>
                </div>
              ))}
            </div>
          );
        })}

        {/* ---------- BRONZE MATCH ---------- */}
        {rounds["BRONZE"] && (
          <div className="round bronze">
            <div className="round-title">Bronze</div>

            {rounds["BRONZE"].map((m, i) => (
              <div key={i} className="match bronze-match">
                <div className={`team ${m.winner === m.teamA ? "winner" : ""}`}>
                  {m.teamA}
                </div>
                <div className={`team ${m.winner === m.teamB ? "winner" : ""}`}>
                  {m.teamB}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

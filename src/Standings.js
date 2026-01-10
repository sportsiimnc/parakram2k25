import { useState, useEffect, useCallback } from "react";
import LeagueTable from "./LeagueTable";
import KnockoutBracket from "./KnockoutBracket";

const normalize = s => String(s || "").trim().toLowerCase();

/* SPORT TYPES */
const SPORT_FORMAT = {
  cricket: "LEAGUE",
  football: "LEAGUE",
  basketball: "LEAGUE",
  volleyball: "LEAGUE",
  athletics: "LEAGUE",

  tennis: "KNOCKOUT",
  "table tennis": "KNOCKOUT",
  badminton: "KNOCKOUT",
  carrom: "KNOCKOUT",
  pool: "KNOCKOUT",
  chess: "KNOCKOUT"
};

export default function Standings({ SPORTS, WEBAPP_URL }) {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0].name);
  const [league, setLeague] = useState({});
  const [knockout, setKnockout] = useState({});
  const [medals, setMedals] = useState({});
  const [sortBy, setSortBy] = useState("gold");
  const [loading, setLoading] = useState(true);

  /* LOAD DATA */
  const loadData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(WEBAPP_URL);
    const data = await res.json();

    /* STANDINGS */
    const lg = {};
    (data.standings || []).forEach(r => {
      const k = normalize(r.Sport);
      if (SPORT_FORMAT[k] !== "LEAGUE") return;

      lg[k] ??= [];
      lg[k].push({
        Team: r.Team,
        Group: r.Group || "",
        Played: Number(r.P || 0),
        Won: Number(r.W || 0),
        Lost: Number(r.L || 0),
        Points: Number(r.Pts || 0)
      });
    });

    /* KNOCKOUT / PLAYOFF MATCHES */
    const ko = {};
    (data.knockout || []).forEach(r => {
      const k = normalize(r.Sport);
      ko[k] ??= [];
      ko[k].push({
        Round: r.Round,
        Team1: r["Team 1"],
        Team2: r["Team 2"],
        Result: r.Result || ""
      });
    });

    setLeague(lg);
    setKnockout(ko);
    setMedals(data.medals || {});
    setLoading(false);
  }, [WEBAPP_URL]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sportKey = normalize(selectedSport);

  /* SORT LEAGUE TABLE */
  const leagueTeams = (league[sportKey] || []).sort(
    (a, b) =>
      b.Points - a.Points ||
      b.Won - a.Won ||
      a.Lost - b.Lost
  );

  /* CRICKET GROUPS */
  const cricketGroups =
    sportKey === "cricket"
      ? {
          A: leagueTeams.filter(t => t.Group === "A"),
          B: leagueTeams.filter(t => t.Group === "B")
        }
      : null;

  if (cricketGroups) {
    cricketGroups.A.sort((a, b) => b.Points - a.Points);
    cricketGroups.B.sort((a, b) => b.Points - a.Points);
  }

  /* MEDALS */
  const medalRows = Object.entries(medals)
    .map(([team, m]) => ({
      team,
      gold: m.gold,
      silver: m.silver,
      bronze: m.bronze,
      total: m.gold + m.silver + m.bronze
    }))
    .sort((a, b) =>
      sortBy === "gold"
        ? b.gold - a.gold || b.total - a.total
        : b.total - a.total || b.gold - a.gold
    );

  return (
    <section className="wrap panel">
      <h2>Standings</h2>

      {/* MEDALS */}
      <div className="card mt">
        <div className="medal-header">
          <h3>Overall Medals</h3>
          <div>
            <button
              className={`btn ghost ${sortBy === "gold" ? "primary" : ""}`}
              onClick={() => setSortBy("gold")}
            >
              Sort by Gold
            </button>
            <button
              className={`btn ghost ${sortBy === "total" ? "primary" : ""}`}
              onClick={() => setSortBy("total")}
            >
              Sort by Total
            </button>
          </div>
        </div>

        <table className="table medals">
          <thead>
            <tr>
              <th>Team</th>
              <th>🥇</th>
              <th>🥈</th>
              <th>🥉</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {medalRows.map((m, i) => (
              <tr key={m.team} style={i < 3 ? { fontWeight: 700 } : null}>
                <td>{m.team}</td>
                <td>{m.gold}</td>
                <td>{m.silver}</td>
                <td>{m.bronze}</td>
                <td>{m.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SPORT SELECT */}
      <select
        className="sport-select mt"
        value={selectedSport}
        onChange={e => setSelectedSport(e.target.value)}
      >
        {SPORTS.map(s => (
          <option key={s.name}>{s.name}</option>
        ))}
      </select>

      {loading && <p>Loading…</p>}

      {/* LEAGUE TABLES */}
      {!loading && SPORT_FORMAT[sportKey] === "LEAGUE" && sportKey !== "cricket" && (
        leagueTeams.length ? (
          <LeagueTable teams={leagueTeams} />
        ) : (
          <p className="muted mt">No matches played yet</p>
        )
      )}

      {/* CRICKET GROUP TABLES */}
      {!loading && sportKey === "cricket" && cricketGroups && (
        <>
          <LeagueTable title="Group A" teams={cricketGroups.A} />
          <LeagueTable title="Group B" teams={cricketGroups.B} />
        </>
      )}

      {/* PLAYOFF / MATCHES FROM KNOCKOUT SHEET */}
      {!loading && knockout[sportKey] && (
  <div className="card mt">
    <h3>{selectedSport} Matches</h3>

    {knockout[sportKey].map((m, i) => (
      <div key={i} className="playoff-card">
        <div className="round">{m.Round}</div>

        <div className="match">
          <span>{m.Team1}</span>
          <span className="vs">vs</span>
          <span>{m.Team2}</span>
        </div>

        <div className="result muted">
          {m.Result || "Result: —"}
        </div>
      </div>
    ))}
  </div>
)}

      {/* PURE KNOCKOUT SPORTS */}
      {!loading && SPORT_FORMAT[sportKey] === "KNOCKOUT" && (
        <KnockoutBracket matches={knockout[sportKey] || []} />
      )}
    </section>
  );
}

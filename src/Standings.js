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

/* SPORTS THAT USE MATCH LIST (NOT BRACKET) */
const KNOCKOUT_MATCH_LIST = [
  "cricket",
  "football",
  "volleyball",
  "basketball"
];

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

    /* LEAGUE */
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

    /* KNOCKOUT */
    const ko = {};
    (data.knockout || []).forEach(r => {
      const k = normalize(r.Sport);
      ko[k] ??= [];
      ko[k].push({
        Round: r.Round,
        Team1: r["Team 1"] || "",
        Team2: r["Team 2"] || "",
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
  const leagueTeams = (league[sportKey] || []).sort(
    (a, b) =>
      b.Points - a.Points ||
      b.Won - a.Won ||
      a.Lost - b.Lost
  );

  const knockoutMatches = knockout[sportKey] || [];

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
              <th>Gold</th>
              <th>Silver</th>
              <th>Bronze</th>
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

      {/* LEAGUE TABLE */}
      {!loading && SPORT_FORMAT[sportKey] === "LEAGUE" && sportKey !== "cricket" && (
        leagueTeams.length ? (
          <LeagueTable teams={leagueTeams} />
        ) : (
          <p className="muted mt">No matches played yet</p>
        )
      )}

      {/* CRICKET GROUPS */}
      {!loading && sportKey === "cricket" && cricketGroups && (
        <>
          <LeagueTable title="Group A" teams={cricketGroups.A} />
          <LeagueTable title="Group B" teams={cricketGroups.B} />
        </>
      )}

      {/* KNOCKOUT MATCH LIST */}
      {!loading && KNOCKOUT_MATCH_LIST.includes(sportKey) && (
        <div className="card mt">
          <h3>{selectedSport} – Knockout Matches</h3>

          {knockoutMatches.length === 0 ? (
            <p className="muted mt">Knockout stage not started yet</p>
          ) : (
            knockoutMatches.map((m, i) => {
              const winner = m.Result || "";

              return (
                <div
                  key={i}
                  className={`ko-match ${winner ? "completed" : ""}`}
                >
                  <div className="ko-round">{m.Round}</div>

                  <div className="ko-teams">
                    <div className={`team ${winner === m.Team1 ? "winner" : ""}`}>
                      {m.Team1 || "TBD"}
                    </div>

                    <div className="vs">vs</div>

                    <div className={`team ${winner === m.Team2 ? "winner" : ""}`}>
                      {m.Team2 || "TBD"}
                    </div>
                  </div>

                  <div className="ko-result">
                    {winner ? `Winner: ${winner}` : "Result: —"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* BRACKET (PURE KNOCKOUT SPORTS) */}
      {!loading &&
        SPORT_FORMAT[sportKey] === "KNOCKOUT" &&
        !KNOCKOUT_MATCH_LIST.includes(sportKey) && (
          <KnockoutBracket matches={knockoutMatches} />
        )}
    </section>
  );
}

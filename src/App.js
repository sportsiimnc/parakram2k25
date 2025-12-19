import React, { useEffect, useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";

/* ---------- CONFIG ---------- */
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwy0f2FLYxdPLQzwkNT_qGUEJ7IAKGtqPEhKK-jkhy3WLawIaCSRhTYBOJn2Fa6TDTz/exec";

/* REGISTRATION DEADLINE */
const REGISTRATION_DEADLINE = new Date("2025-12-20T11:59:59");

/* GOOGLE FORMS */
const FORMS = {
  cricket: { team: "https://forms.gle/DJqJ9NkeB2Lp1Y6g8" },
  football: { team: "https://forms.gle/LvyQw2ZgTTFtV6598" },
  basketball: { team: "https://forms.gle/P8krKiWpHF5aBbB1A" },
  volleyball: { team: "https://forms.gle/zftm8ecteN9642B99" },
  tennis: { team: "https://forms.gle/EgMHk6HKftHrjgJa8" },
  carrom: { team: "https://forms.gle/PpsrXL4jNbKSoCmg8" },

  tabletennis: {
    team: "https://forms.gle/yhNg3ia738C1Dibs7",
    individual: "https://forms.gle/3bHKVTFrhuVsxhfd6",
  },
  badminton: {
    team: "https://forms.gle/BLD8tQUvsTZuiEPf8",
    individual: "https://forms.gle/2jBt3tvPGqVTBiHi6",
  },

  athletics: { individual: "https://forms.gle/JfqKJUSHT9Xg4CyZ7" },
  pool: { individual: "https://forms.gle/2appdVDRZFmZ1sGu7" },
  chess: { individual: "https://forms.gle/xS9cALrk1EGgxkoZ7" },
};

/* ---------- ASSETS ---------- */
const LOGO_PATH = "/assets/Parakram_Logo.png";
const HERO_IMG = "/assets/home-bg.png";
const PAMPHLET_PDF = "/assets/OfficialPoster.pdf";

const SPORT_IMAGES = [
  "/assets/sports-cricket.jpg",
  "/assets/sports-football.jpg",
  "/assets/sports-basketball.jpeg",
  "/assets/sports-volleyball.jpeg",
  "/assets/sports-tennis.jpeg",
  "/assets/sports-carrom.jpg",
  "/assets/sports-tabletennis.jpeg",
  "/assets/sports-badminton.jpeg",
  "/assets/sports-athletics.jpeg",
  "/assets/sports-pool.jpeg",
  "/assets/sports-chess.jpg",
];

const SPORTS = [
  { name: "Cricket", type: "team" },
  { name: "Football", type: "team" },
  { name: "Basketball", type: "team" },
  { name: "Volleyball", type: "team" },
  { name: "Tennis", type: "team" },
  { name: "Carrom", type: "team" },

  { name: "Table Tennis", type: "both" },
  { name: "Badminton", type: "both" },

  { name: "Athletics", type: "individual" },
  { name: "Pool", type: "individual" },
  { name: "Chess", type: "individual" },
];

const GALLERY_IMAGES = Array.from({ length: 20 }, (_, i) => `/assets/gallery-${i + 1}.jpeg`);

const COMMITTEE_IMAGES = [
  "/assets/committee-1.jpg",
  "/assets/committee-2.jpg",
  "/assets/committee-3.jpg",
  "/assets/committee-4.jpg",
  "/assets/committee-5.jpg",
  "/assets/committee-6.jpg",
];

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <rect width='100%' height='100%' fill='#e6eef8'/>
    <text x='50%' y='55%' text-anchor='middle' fill='#94a3b8' font-size='20'>
      Image not found
    </text>
  </svg>`
)}`;

/* ---------- THEME ---------- */
function getInitialTheme() {
  const saved = localStorage.getItem("parakram_theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* ---------- ROUTE WRAPPER ---------- */
function AnimatedRoutes({ children }) {
  const location = useLocation();
  return <Routes location={location}>{children}</Routes>;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
}



/* ---------- APP ---------- */
export default function App() {
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("parakram_theme", theme);
  }, [theme]);

  return (
    <Router>
      <ScrollToTop />
      <Header theme={theme} setTheme={setTheme} />
      <main className="main">
        <AnimatedRoutes>
          <Route path="/" element={<Home />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/poster" element={<OfficialPoster />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </AnimatedRoutes>
      </main>
      <Footer />
      <Analytics />
    </Router>
  );
}

/* ---------- HEADER ---------- */
function Header({ theme, setTheme }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  React.useEffect(() => {
    setOpen(false); // 🔥 close menu on route change
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <img src={LOGO_PATH} alt="logo" />
          <div className="brand-text">
            <div className="brand-title">Parakram 2026</div>
            <div className="brand-sub">Annual Sports Festival of IIML-NC</div>
          </div>
        </Link>

        <nav className="nav-desktop">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/sports">Sports</NavLink>
          <NavLink to="/poster">Official Poster</NavLink>
          <NavLink to="/standings">Standings</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="header-actions">
          <button
            className="btn icon"
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          <button
            className={`hamburger ${open ? "open" : ""}`}
            onClick={() => setOpen(o => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        className={`mobile-overlay ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
      >
        <nav
          className="mobile-nav"
          onClick={(e) => e.stopPropagation()}
        >
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/sports" onClick={() => setOpen(false)}>Sports</NavLink>
          <NavLink to="/poster" onClick={() => setOpen(false)}>Official Poster</NavLink>
          <NavLink to="/standings" onClick={() => setOpen(false)}>Standings</NavLink>
          <NavLink to="/gallery" onClick={() => setOpen(false)}>Gallery</NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}



function NavLink({ to, children }) {
  return <Link to={to} className="nav-link">{children}</Link>;
}

/* ---------- HOME ---------- */
function Home() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
      <div className="hero-overlay">
        <div className="wrap hero-inner">
          <h1 className="funky-title">PARAKRAM 2026</h1>
          <p className="lead">
            Built on grit. Driven by passion. Defined by excellence.
          </p>

           <CountdownTimer />
           
          <div className="cta-row">
            <Link to="/sports" className="btn primary">Register</Link>
            <Link to="/poster" className="btn ghost">Official Poster</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = React.useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = REGISTRATION_DEADLINE - now;

    if (diff <= 0) {
      return null;
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) {
    return (
      <div className="countdown closed">
         Registrations Closed
      </div>
    );
  }

  return (
  <div className="countdown-wrap">
    <div className="countdown-label">
    Registrations close in
    </div>

    <div className="countdown">
      <strong>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </strong>
    </div>
  </div>
);

}


/* ---------- SPORTS ---------- */
function Sports() {
  const closed = new Date() > REGISTRATION_DEADLINE;

  const key = s => s.toLowerCase().replace(/\s+/g, "");

  return (
    <section className="wrap panel">
      <h2>Sports Lineup</h2>
      <div className="sports-grid">
        {SPORTS.map((s, i) => {
          const k = key(s.name);
          const forms = FORMS[k] || {};

          return (
            <div key={s.name} className="card sport-card">
              <div className="sport-thumb" style={{ backgroundImage: `url(${SPORT_IMAGES[i]})` }} />
              <div className="card-body">
                <h3>{s.name}</h3>

                <a className="btn ghost" href={`/assets/rules-${k}.pdf`} download>
                  Rules
                </a>

                {!closed ? (
                  <>
                    {(s.type === "team" || s.type === "both") && (
                      <a className="btn primary" href={forms.team} target="_blank" rel="noreferrer">
                        Register Your Team
                      </a>
                    )}
                    {(s.type === "individual" || s.type === "both") && (
                      <a className="btn ghost" href={forms.individual} target="_blank" rel="noreferrer">
                        Register Yourself
                      </a>
                    )}
                  </>
                ) : (
                  <p className="muted">Registrations Closed</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- OFFICIAL POSTER ---------- */
function OfficialPoster() {
  return (
    <section className="wrap panel">
      <h2>Official Poster</h2>
      <a className="btn primary" href={PAMPHLET_PDF} download>Download Poster</a>
      <object data={PAMPHLET_PDF} width="100%" height="640" type="application/pdf" />
    </section>
  );
}

function Standings() {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0].name);
  const [results, setResults] = useState([]);
  const [teamsBySport, setTeamsBySport] = useState({});
  const [medals, setMedals] = useState({});
  const [medalSortBy, setMedalSortBy] = useState("gold");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const normalizeSport = (s) => String(s || "").trim().toLowerCase();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(WEBAPP_URL);
      const data = await res.json();

      /* RESULTS */
      const filteredResults = (data.results || []).filter(
        r => normalizeSport(r.Sport) === normalizeSport(selectedSport)
      );
      setResults(filteredResults);

      /* STANDINGS */
      const grouped = {};
      SPORTS.forEach(s => (grouped[s.name] = []));

      (data.standings || []).forEach(row => {
  SPORTS.forEach(sport => {
    grouped[sport.name].push({
      Team: row.Team,
      Played: Number(row.P || 0),
      Won: Number(row.W || 0),
      Lost: Number(row.L || 0),
      Points: Number(row.Pts || 0)
    });
  });
});

      setTeamsBySport(grouped);

      /* MEDALS */
      const medalSafe = {};
      Object.entries(data.medals || {}).forEach(([team, m]) => {
        medalSafe[team] = {
          gold: Number(m.gold ?? m.Gold ?? 0),
          silver: Number(m.silver ?? m.Silver ?? 0),
          bronze: Number(m.bronze ?? m.Bronze ?? 0)
        };
      });
      setMedals(medalSafe);

      setLastUpdated(new Date());
      setStatus("Live data");
    } catch (e) {
      console.error(e);
      setStatus("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [selectedSport]);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 60000);
    return () => clearInterval(id);
  }, [loadData]);

  /* MEDAL SORTING */
  const overall = Object.entries(medals)
    .map(([team, m]) => ({
      team,
      gold: m.gold,
      silver: m.silver,
      bronze: m.bronze,
      total: m.gold + m.silver + m.bronze
    }))
    .sort((a, b) =>
      medalSortBy === "gold"
        ? b.gold - a.gold || b.total - a.total
        : b.total - a.total || b.gold - a.gold
    );

  return (
    <section className="wrap panel">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>
          Standings & Results
          <span style={{ marginLeft: 10, color: "#ef4444", fontWeight: 700 }}>● LIVE</span>
        </h2>
        <button className="btn ghost" onClick={loadData}>Refresh</button>
      </div>

      <select
  className="sport-select"
  value={selectedSport}
  onChange={(e) => setSelectedSport(e.target.value)}
>
  {SPORTS.map(s => (
    <option key={s.name} value={s.name}>
      {s.name}
    </option>
  ))}
</select>


      {/* MATCH RESULTS */}
      <div className="card mt">
        <h3>Match Results</h3>

        {loading ? (
          "Loading…"
        ) : results.length === 0 ? (
          <p className="muted">No results yet.</p>
        ) : (
          results.map((r, i) => (
            <div key={i} className="card mt">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong className={r.Winner === r.TeamA ? "winner" : ""}>
                  {r.TeamA}
                </strong>

                <strong>
                  {r.ScoreA} - {r.ScoreB}
                </strong>

                <strong className={r.Winner === r.TeamB ? "winner" : ""}>
                  {r.TeamB}
                </strong>
              </div>

              <div className="small muted" style={{ marginTop: 6 }}>
                {r.Status === "LIVE" && (
                  <span className="live-badge">● LIVE</span>
                )}
                {r.Winner && r.Winner !== "DRAW" && r.Status !== "LIVE" && (
                  <span>
                    Winner: <strong>{r.Winner}</strong>
                  </span>
                )}
                {r.Winner === "DRAW" && <span>Match Drawn</span>}
              </div>

              {r.Date && (
                <div className="small muted">📅 {r.Date}</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* STANDINGS */}
      <div className="card mt">
        <h3>Standings</h3>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "6%", textAlign: "center" }}>#</th>
              <th style={{ width: "34%", textAlign: "left" }}>Team</th>
              <th style={{ textAlign: "center" }}>P</th>
              <th style={{ textAlign: "center" }}>W</th>
              <th style={{ textAlign: "center" }}>L</th>
              <th style={{ textAlign: "center" }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {(teamsBySport[selectedSport] || []).map((t, i) => (
              <tr key={i} style={i === 0 ? { background: "rgba(34,197,94,0.12)", fontWeight: 700 } : {}}>
                <td style={{ textAlign: "center" }}>{i + 1}</td>
                <td style={{ textAlign: "left" }}>{t.Team}</td>
                <td style={{ textAlign: "center" }}>{t.Played}</td>
                <td style={{ textAlign: "center" }}>{t.Won}</td>
                <td style={{ textAlign: "center" }}>{t.Lost}</td>
                <td style={{ textAlign: "center" }}>{t.Points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MEDALS */}
      <div className="card mt">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Overall Medals</h3>
          <div>
            <button
              className={`btn ghost ${medalSortBy === "gold" ? "primary" : ""}`}
              onClick={() => setMedalSortBy("gold")}
            >
              Sort by Gold
            </button>
            <button
              className={`btn ghost ${medalSortBy === "total" ? "primary" : ""}`}
              onClick={() => setMedalSortBy("total")}
              style={{ marginLeft: 8 }}
            >
              Sort by Total
            </button>
          </div>
        </div>

        <table className="table mt">
          <thead>
            <tr>
              <th style={{ width: "6%", textAlign: "center" }}>#</th>
              <th style={{ width: "34%", textAlign: "left" }}>Team</th>
              <th style={{ textAlign: "center" }}>🥇</th>
              <th style={{ textAlign: "center" }}>🥈</th>
              <th style={{ textAlign: "center" }}>🥉</th>
              <th style={{ textAlign: "center" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {overall.map((o, i) => (
              <tr key={o.team} style={i < 3 ? { fontWeight: 700 } : {}}>
                <td style={{ textAlign: "center" }}>{i + 1}</td>
                <td style={{ textAlign: "left" }}>{o.team}</td>
                <td style={{ textAlign: "center" }}>{o.gold}</td>
                <td style={{ textAlign: "center" }}>{o.silver}</td>
                <td style={{ textAlign: "center" }}>{o.bronze}</td>
                <td style={{ textAlign: "center" }}>{o.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="small muted mt">
        {status} • Last updated: {lastUpdated?.toLocaleTimeString()}
      </div>
    </section>
  );
}




function Gallery() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(()=> setIdx(i => (i+1) % GALLERY_IMAGES.length), 5000);
    return ()=> clearInterval(timerRef.current);
  }, []);

  const prev = () => { clearInterval(timerRef.current); setIdx(i => (i-1+GALLERY_IMAGES.length)%GALLERY_IMAGES.length); timerRef.current = setInterval(()=> setIdx(i => (i+1)%GALLERY_IMAGES.length), 5000); };
  const next = () => { clearInterval(timerRef.current); setIdx(i => (i+1)%GALLERY_IMAGES.length); timerRef.current = setInterval(()=> setIdx(i => (i+1)%GALLERY_IMAGES.length), 5000); };

  return (
    <section className="wrap panel">
      <h2>Gallery</h2>
      <p className="muted"> </p>

      <div className="gallery-carousel card">
        <button className="gallery-nav left" onClick={prev} aria-label="Previous">‹</button>
        <div className="gallery-stage fade">
          <img src={GALLERY_IMAGES[idx]} alt={`Slide ${idx+1}`} onError={(e)=> e.target.src = PLACEHOLDER_SVG} />
          <div className="gallery-caption small">{idx+1} / {GALLERY_IMAGES.length}</div>
        </div>
        <button className="gallery-nav right" onClick={next} aria-label="Next">›</button>
      </div>
    </section>
  );
}

/* Contact */
function Contact() {
  const committee = [
    { name: "Ayush Kanojiya", role: "Sports Committee - SM", phone: "+91-8439885496", photo: COMMITTEE_IMAGES[0] },
    { name: "Karan Rajput", role: "Sports Committee - SM", phone: "+91-7016802451", photo: COMMITTEE_IMAGES[1] },
    { name: "Santanu Sinha", role: "Sports Committee - IPMX", phone: "+91-8638650476", photo: COMMITTEE_IMAGES[2] },
    { name: "Partha Sarathi", role: "Sports Committee - IPMX", phone: "+91-7008982243", photo: COMMITTEE_IMAGES[3] },
    { name: "Ayush Raj", role: "Sports Committee - WE", phone: "+91-8527091834", photo: COMMITTEE_IMAGES[4] },
    { name: "Sports Committee", role: "Sports Committee - WE", phone: "+91-90022-33445", photo: COMMITTEE_IMAGES[5] },
  ];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function update(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }
  function submit(e) {
    e.preventDefault();
    
    const to = "sportsnc@iiml.ac.in";
    const subject = encodeURIComponent(`Parakram query from ${form.name || "Anonymous"}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="wrap panel two-col">
      <div>
        <h2>Contact Us</h2>
        <p className="muted">Questions about registration, fixtures or venues? Reach out.</p>

        <form className="card form" onSubmit={submit}>
          <label>Name<input name="name" value={form.name} onChange={update} required/></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={update} required/></label>
          <label>Message<textarea name="message" rows={5} value={form.message} onChange={update} required/></label>
          <div className="form-actions"><button className="btn primary" type="submit">Send</button></div>
        </form>
      </div>

      <div>
        <h3>Organising Committee</h3>
        <div className="committee-grid">
          {committee.map(c => (
            <div className="committee-card card" key={c.name}>
              <img src={c.photo} onError={(e)=>e.target.src = PLACEHOLDER_SVG} alt={c.name} />
              <div>
                <div className="name">{c.name}</div>
                <div className="muted small">{c.role}</div>
                <div className="phone"><a href={`tel:${c.phone}`}>{c.phone}</a></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FOOTER ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap small">
        © Parakram 2026 · Sports Committee IIM Lucknow NC | Developed by Bhawesh - SM11
      </div>
    </footer>
  );
}

function NotFound() {
  return <section className="wrap panel"><h2>404</h2></section>;
}

import React, { useEffect, useState, useRef, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./index.css";

/* ---------- CONFIG ---------- */
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwy0f2FLYxdPLQzwkNT_qGUEJ7IAKGtqPEhKK-jkhy3WLawIaCSRhTYBOJn2Fa6TDTz/exec";
/* ----------------------------- */



/* ---------- ASSETS ---------- */
const LOGO_PATH = "/assets/Parakram_Logo.png";
const HERO_IMG = "/assets/home-bg.png";

const SPORT_IMAGES = [
  "/assets/sports-cricket.jpg",
  "/assets/sports-football.jpg",
  "/assets/sports-basketball.jpeg",
  "/assets/sports-volleyball.jpeg",
  "/assets/sports-tennis.jpeg",
  "/assets/sports-tabletennis.jpeg",
  "/assets/sports-athletics.jpeg",
  "/assets/sports-pool.jpeg",
  "/assets/sports-badminton.jpeg",
  "/assets/sports-chess.jpg",
];

const GALLERY_IMAGES = Array.from({ length: 20 }, (_, i) => `/assets/gallery-${i + 1}.jpg`);

const COMMITTEE_IMAGES = [
  "/assets/committee-1.jpg",
  "/assets/committee-2.jpg",
  "/assets/committee-3.jpg",
  "/assets/committee-4.jpg",
  "/assets/committee-5.jpg",
  "/assets/committee-6.jpg",
];

const PAMPHLET_IMG = "/assets/pamphlet.jpg";
const PAMPHLET_FILE = "/assets/pamphlet.pdf";

const SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Tennis",
  "Table Tennis",
  "Athletics",
  "Pool",
  "Badminton",
  "Chess",
];

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#e6eef8'/><text x='50%' y='55%' text-anchor='middle' fill='#94a3b8' font-size='20'>Image not found</text></svg>`
)}`;

/* ---------------------------------- */

/* Theme helper */
function getInitialTheme() {
  const saved = localStorage.getItem("parakram_theme");
  if (saved) return saved;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

/* AnimatedRoutes wrapper — fade/slide on route change */
function AnimatedRoutes({ children }) {
  const location = useLocation();
  const [displayLoc, setDisplayLoc] = useState(location);
  const [stage, setStage] = useState("enter"); // 'enter' | 'exit'
  useEffect(() => {
    if (location.pathname === displayLoc.pathname) return;
    setStage("exit");
    const t = setTimeout(() => {
      setDisplayLoc(location);
      setStage("enter");
    }, 220);
    return () => clearTimeout(t);
  }, [location, displayLoc]);
  return (
    <div className={`route-container route-${stage}`} key={displayLoc.key || displayLoc.pathname}>
      <Routes location={displayLoc}>{children}</Routes>
    </div>
  );
}

/* -------- App root -------- */
export default function App() {
  const [theme, setTheme] = useState(getInitialTheme());
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("parakram_theme", theme);
  }, [theme]);

  return (
    <Router>
      <div className="app-root">
        <Header theme={theme} setTheme={setTheme} />
        <main className="main">
          <AnimatedRoutes>
            <Route path="/" element={<Home />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/register" element={<Register />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </AnimatedRoutes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

/* -------- Header / Mobile menu -------- */
function Header({ theme, setTheme }) {
  const [open, setOpen] = useState(false); // mobile menu
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <Link to="/" className="brand">
          <img src={LOGO_PATH} alt="logo" onError={(e) => (e.target.src = PLACEHOLDER_SVG)} />
          <div className="brand-text">
            <div className="brand-title">Parakram 2026</div>
            <div className="brand-sub">Annual Sports Festival of IIML-NC</div>
          </div>
        </Link>

        <nav className="nav-desktop">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/sports">Sports</NavLink>
          <NavLink to="/schedule">Schedule</NavLink>
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/standings">Standings</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="header-actions">
          <button className="btn icon" aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? "🌙" : "☀️"}
          </button>

          <button className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen((s) => !s)} aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "show" : ""}`}>
        <nav className="mobile-nav">
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/sports" onClick={() => setOpen(false)}>Sports</Link>
          <Link to="/schedule" onClick={() => setOpen(false)}>Schedule</Link>
          <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          <Link to="/standings" onClick={() => setOpen(false)}>Standings</Link>
          <Link to="/gallery" onClick={() => setOpen(false)}>Gallery</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
          <div className="mobile-menu-footer">
            <button className="btn primary" onClick={() => { setTheme((t) => (t === "dark" ? "light" : "dark")); }}>Toggle theme</button>
          </div>
        </nav>
      </div>
    </header>
  );
}
function NavLink({ to, children }) {
  return <Link to={to} className="nav-link">{children}</Link>;
}

/* -------- Footer -------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap small">© Parakram 2026 · Sports committee-IIM Lucknow NC </div>
    </footer>
  );
}


function Home() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
      <div className="hero-overlay">
        <div className="wrap hero-inner">
          <h1 className="funky-title">PARAKRAM 2026</h1>
          <p className="lead">Built on grit. Driven by passion. Defined by excellence.
Every contest demands heart, hustle, and resilience.
Win with pride. Compete with purpose.
The game begins here.</p>
          <div className="cta-row">
            <Link to="/register" className="btn primary">Register</Link>
            <Link to="/schedule" className="btn ghost">View Schedule</Link>
          </div>
        </div>
      </div>
    </section>
  );
}


function Sports() {
  const fileName = (s) => s.toLowerCase().replace(/\s+/g, "-");
  return (
    <section className="wrap panel">
      <h2>Sports Lineup</h2>
      <p className="muted"> Rules & Fixtures for each sport</p>
      <div className="grid sports-grid">
        {SPORTS.map((s, i) => {
          const base = fileName(s);
          const rules = `/assets/rules-${base}.pdf`;
          const fixtures = `/assets/fixtures-${base}.pdf`;
          return (
            <article key={s} className="card sport-card">
              <div className="sport-thumb" style={{ backgroundImage: `url(${SPORT_IMAGES[i]})` }} />
              <div className="card-body">
                <h3>{s}</h3>
                <p className="muted">Official documents for this sport.</p>
                <div className="sport-downloads">
                  <a className="btn primary" href={rules} download>Rules</a>
                  <a className="btn ghost" href={fixtures} download>Fixtures</a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}


function Schedule() {
  return (
    <section className="wrap panel">
      <h2>Schedule</h2>
      <p className="muted">Download and view the latest official upadtes</p>

      <div className="card">
        <a className="btn primary" href="/assets/Schedule.pdf" download>
          Download Schedule
        </a>

        <div style={{ marginTop: 12 }}>
          <object
            data="/assets/Schedule.pdf"
            width="100%"
            height="640"
            type="application/pdf"
          >
            PDF not supported — download instead.
          </object>
        </div>
      </div>
    </section>
  );
}


function Register() {
  const EMBED = "https://forms.gle/oHFEJ1Sv1zrA9AP76";
  return (
    <section className="wrap panel two-col">
      <div className="card">
        <h2>Register</h2>
        <p className="muted">Register via the official Google Form below.</p>
        <div className="embed-iframe">
          <iframe title="form" src={EMBED} width="100%" height="860" />
        </div>
      </div>

      <div>
        <div className="card">
          <h3>Event Pamphlet</h3>
          <img src={PAMPHLET_IMG} alt="pamphlet" className="pamphlet-img" onError={(e)=>e.target.src=PLACEHOLDER_SVG}/>
          <div style={{marginTop:12}}>
            <a className="btn primary" href={PAMPHLET_FILE} download>Download Pamphlet</a>
          </div>
        </div>
      </div>
    </section>
  );
}




function Standings() {
  const [selectedSport, setSelectedSport] = useState(SPORTS[0]);
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
      SPORTS.forEach(s => (grouped[s] = []));

      (data.standings || []).forEach(row => {
        SPORTS.forEach(sport => {
          grouped[sport].push({
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
      setStatus("Live data from Google Sheets");
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
        {SPORTS.map(s => <option key={s}>{s}</option>)}
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




/* Gallery */

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
      <p className="muted">Click arrows or wait for autoplay.</p>

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
    { name: "Ayush Kanojiya", role: "Sports Committee", phone: "+91-98765-43210", photo: COMMITTEE_IMAGES[0] },
    { name: "Karan Rajput", role: "Sports Committee", phone: "+91-91234-56789", photo: COMMITTEE_IMAGES[1] },
    { name: "AAndu", role: "Logistics", phone: "+91-99887-77665", photo: COMMITTEE_IMAGES[2] },
    { name: "Paaandu", role: "Media & PR", phone: "+91-90123-45678", photo: COMMITTEE_IMAGES[3] },
    { name: "Gaandu", role: "Venue Coordinator", phone: "+91-90011-22334", photo: COMMITTEE_IMAGES[4] },
    { name: "Santanu", role: "Volunteer Lead", phone: "+91-90022-33445", photo: COMMITTEE_IMAGES[5] },
  ];

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  function update(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    // Compose mailto to xyz@gmail.com with subject & body
    const to = "xyz@gmail.com";
    const subject = encodeURIComponent(`Parakram query from ${form.name || "Anonymous"}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }

  return (
    <section className="wrap panel two-col">
      <div>
        <h2>Contact Us</h2>
        <p className="muted">Questions about registration, fixtures, or venues? Reach out.</p>

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

/* Not found */
function NotFound(){ return (<section className="wrap panel"><h2>404</h2><p className="muted">Page not found — <Link to="/">home</Link>.</p></section>); }

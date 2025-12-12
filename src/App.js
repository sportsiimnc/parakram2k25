// src/App.js
import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import "./index.css";

/* ---------- CONFIG ---------- */
const WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbwAuHIm4ZADCWfq0NVm8_EHUl4wILFfXHMycZ_qxuxi7dj43M6IeuevqJQO88YLyRo0/exec";
const WEBAPP_SECRET = "IIMLUCKNOWNOIDACAMPUS";
/* ----------------------------- */

/* ---------- ASSETS / DATA ---------- */
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

/* -------- Header / Mobile menu / Theme toggle -------- */
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
            <div className="brand-title">Parakram 2025</div>
            <div className="brand-sub">Annual Sports Festival</div>
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
      <div className="wrap small">© Parakram 2025 · Sports committee-IIM Lucknow NC</div>
    </footer>
  );
}


function Home() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
      <div className="hero-overlay">
        <div className="wrap hero-inner">
          <h1 className="funky-title">PARAKRAM 2025</h1>
          <p className="lead">A festival of sports, grit and glorious competition — see you on the field.</p>
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
      <p className="muted">Download Rules & Fixtures for each sport.</p>
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
  const [sport, setSport] = useState(SPORTS[0]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); 
  const [refreshTime, setRefreshTime] = useState("");

  async function loadResults(selectedSport) {
    setLoading(true);
    try {
      const res = await fetch(WEBAPP_URL);
      const data = await res.json();

      const filtered = (data.results || []).filter(
        (r) => r.Sport === selectedSport
      );

      setResults(filtered);

      const now = new Date();
      setRefreshTime(now.toLocaleTimeString());
    } catch (err) {
      setResults([]);
    }
    setLoading(false);
  }

  // Load on sport change
  useEffect(() => {
    loadResults(sport);
  }, [sport]);

  // Auto refresh every 30 minutes
  useEffect(() => {
    const id = setInterval(() => loadResults(sport), 1800000);
    return () => clearInterval(id);
  }, [sport]);


  /* ------- HELPERS -------- */

  function getWinnerClass(a, b) {
    if (a > b) return "winner";
    if (b > a) return "loser";
    return "tie";
  }

  function toggleDetails(i) {
    setOpenIndex(openIndex === i ? null : i);
  }


  return (
    <section className="wrap panel">
      <h2>Schedule</h2>
      <p className="muted">Download, preview and check match results.</p>

      {/* -------- DOWNLOAD CARD -------- */}
      <div className="card">
        <a className="btn primary" href="/assets/schedule.pdf" download>
          Download Schedule
        </a>

        <div style={{ marginTop: 12 }}>
          <object
            data="/assets/schedule.pdf"
            width="100%"
            height="640"
            type="application/pdf"
          >
            PDF not supported — download instead.
          </object>
        </div>
      </div>

      {/* -------- RESULTS SECTION -------- */}
      <div className="card mt">
        <h3>Match Results (Live)</h3>
        <p className="small muted">
          Last refreshed at: <b>{refreshTime || "—"}</b>
        </p>

        <label className="muted small">Select Sport</label>
        <select
          className="sport-select"
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {SPORTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* ANIMATED SCOREBOARD */}
        <div className="results-wrapper animated-fade mt">
          {loading ? (
            <p className="muted">Loading results…</p>
          ) : results.length === 0 ? (
            <p className="muted">No results uploaded yet for this sport.</p>
          ) : (
            <table className="table animated-slide">
              <thead>
                <tr>
                  <th>Team A</th>
                  <th>Score</th>
                  <th>Team B</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <>
                    <tr key={i}>
                      <td className={getWinnerClass(r.ScoreA, r.ScoreB)}>
                        {r.TeamA}
                      </td>

                      <td>
                        <span className={getWinnerClass(r.ScoreA, r.ScoreB)}>
                          {r.ScoreA}
                        </span>
                        {" - "}
                        <span className={getWinnerClass(r.ScoreB, r.ScoreA)}>
                          {r.ScoreB}
                        </span>
                      </td>

                      <td className={getWinnerClass(r.ScoreB, r.ScoreA)}>
                        {r.TeamB}
                      </td>

                      <td>
                        <button
                          className="btn ghost small"
                          onClick={() => toggleDetails(i)}
                        >
                          {openIndex === i ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {/* DETAILS DRAWER */}
                    {openIndex === i && (
                      <tr className="details-row animated-expand">
                        <td colSpan={4}>
                          <div className="details-box">
                            <p><b>Match Time:</b> {r.Time || "Not provided"}</p>
                            <p><b>Venue:</b> {r.Venue || "Not provided"}</p>
                            <p><b>Referee:</b> {r.Referee || "Not provided"}</p>
                            <p><b>Notes:</b> {r.Notes || "No additional details"}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}



function Register() {
  const EMBED = "https://docs.google.com/forms/d/e/1FAIpQLSczbPmTZNPUPm0AKwPYCgnUHv8UiyPB9MPSBL8NXLl2qS3Cow/viewform?embedded=true";
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

/* Standings (read-only) */
function Standings() {
  const [teams, setTeams] = useState(Object.fromEntries(SPORTS.map((s) => [s, []])));
  const [medals, setMedals] = useState({});
  const [selected, setSelected] = useState(SPORTS[0]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(WEBAPP_URL);
        if (!res.ok) throw new Error("Network");
        const data = await res.json();
        const bySport = {}; SPORTS.forEach((s) => (bySport[s] = []));
        (data.standings || []).forEach((row) => {
          const sport = row.Sport || row.sport || "Unknown";
          if (!bySport[sport]) bySport[sport] = [];
          bySport[sport].push({
            team: row.Team || row.team || "",
            played: row.Played || row.played || 0,
            won: row.Won || row.won || 0,
            lost: row.Lost || row.lost || 0,
            points: row.Points || row.points || 0,
          });
        });
        if (mounted) {
          setTeams(bySport);
          setMedals(data.medals || {});
          setStatus("Loaded from sheet.");
        }
      } catch (err) {
        if (mounted) {
          setStatus("Failed to load standings.");
          setTeams(Object.fromEntries(SPORTS.map((s) => [s, []])));
          setMedals({});
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    const id = setInterval(load, 3000); // 5 minutes
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const overall = Object.entries(medals)
    .map(([team, m]) => ({ team, gold: m?.gold || 0, silver: m?.silver || 0, bronze: m?.bronze || 0, total: (m?.gold||0)+(m?.silver||0)+(m?.bronze||0) }))
    .sort((a,b) => b.gold - a.gold || b.total - a.total);

  return (
    <section className="wrap panel">
      <h2>Standings (Live)</h2>
      <p className="muted">Read-only standings — update via Google Sheets.</p>
      <select className="sport-select" value={selected} onChange={(e)=>setSelected(e.target.value)}>
        {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="card table-wrap mt">
        {loading ? "Loading…" : (
          <table className="table">
            <thead><tr><th>Team</th><th>Played</th><th>Won</th><th>Lost</th><th>Points</th></tr></thead>
            <tbody>
              {(teams[selected]||[]).length ? (teams[selected]||[]).map((t,i)=>(
                <tr key={i}><td>{t.team}</td><td>{t.played}</td><td>{t.won}</td><td>{t.lost}</td><td>{t.points}</td></tr>
              )) : <tr><td colSpan={5}>No data yet for {selected}.</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      <div className="card mt">
        <h3>Overall Medals</h3>
        <table className="table">
          <thead><tr><th>Team</th><th>Gold</th><th>Silver</th><th>Bronze</th><th>Total</th></tr></thead>
          <tbody>
            {overall.length ? overall.map(o=>(
              <tr key={o.team}><td>{o.team}</td><td>{o.gold}</td><td>{o.silver}</td><td>{o.bronze}</td><td>{o.total}</td></tr>
            )) : <tr><td colSpan={5}>No medals recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="small muted mt">{status}</div>
    </section>
  );
}

/* Gallery: carousel with 20 images */

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

/* Contact: 6 committee members and form sends to xyz@gmail.com */
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

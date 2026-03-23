import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={styles.page}>

      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoDot} />
          MoodNest
        </div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how" style={styles.navLink}>How it works</a>
          <a href="#stats" style={styles.navLink}>Results</a>
          <button style={styles.navBtn} onClick={() => navigate('/auth')}>
            Get started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.eyebrow}>
            <div style={styles.eyebrowDot} />
            AI-powered well-being
          </div>
          <h1 style={styles.heroH1}>
            Your mood.<br />
            <em style={{ color: '#7B9E87', fontStyle: 'italic' }}>Understood.</em><br />
            Your day, improved.
          </h1>
          <p style={styles.heroSub}>
            MoodNest learns your emotional patterns, tracks your tasks, and quietly
            guides you toward better days — one check-in at a time.
          </p>
          <div style={styles.heroCtas}>
            <button style={styles.btnPrimary} onClick={() => navigate('/auth')}>
              Start your free nest
            </button>
            <a href="#how" style={styles.btnGhost}>See how it works →</a>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div style={styles.heroVisual}>
          <div style={styles.dashCard}>
            <div style={styles.dashHeader}>
              <span style={styles.dashTitle}>Weekly mood overview</span>
              <span style={styles.dashDate}>Mar 16 – 22, 2026</span>
            </div>
            <div style={styles.moodChart}>
              {[
                { day: 'Mon', h: '55%', color: '#C4B8E8' },
                { day: 'Tue', h: '40%', color: '#E8B4A0' },
                { day: 'Wed', h: '70%', color: '#7B9E87' },
                { day: 'Thu', h: '60%', color: '#7B9E87' },
                { day: 'Fri', h: '45%', color: '#E8B4A0' },
                { day: 'Sat', h: '85%', color: '#4A6741' },
                { day: 'Sun', h: '75%', color: '#7B9E87' },
              ].map((b, i) => (
                <div key={i} style={styles.barWrap}>
                  <div style={{ ...styles.bar, height: b.h, background: b.color }} />
                  <span style={styles.barDay}>{b.day}</span>
                </div>
              ))}
            </div>
            <div style={styles.moodRow}>
              {['😔','😐','🙂','😄','🤩'].map((e, i) => (
                <div key={i} style={{
                  ...styles.moodChip,
                  background: i === 2 ? 'rgba(123,158,135,0.15)' : 'rgba(45,49,66,0.04)',
                  border: i === 2 ? '1.5px solid #7B9E87' : '1.5px solid transparent',
                }}>
                  <span style={{ fontSize: 20 }}>{e}</span>
                  <span style={styles.chipLabel}>
                    {['Low','Okay','Good','Great','Amazing'][i]}
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.chatPreview}>
              <div style={styles.chatMsg}>
                <div style={{ ...styles.chatAvatar, background: 'rgba(74,103,65,0.15)', color: '#4A6741' }}>N</div>
                <div style={styles.chatBubble}>You've completed 4 tasks today — 30% above your weekly average 🌱</div>
              </div>
              <div style={{ ...styles.chatMsg, flexDirection: 'row-reverse' }}>
                <div style={{ ...styles.chatAvatar, background: 'rgba(107,127,163,0.15)', color: '#6B7FA3' }}>U</div>
                <div style={styles.chatBubbleUser}>Why do I feel anxious even when I'm productive?</div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div style={{ ...styles.floatCard, top: -16, right: -16 }}>
            <div style={{ ...styles.floatTag, background: 'rgba(196,184,232,0.2)', color: '#6B5BA0' }}>Insight</div>
            <div style={styles.floatText}>Your focus peaks on <strong>Wednesday mornings</strong></div>
          </div>
          <div style={{ ...styles.floatCard, bottom: -16, left: -16 }}>
            <div style={{ ...styles.floatTag, background: 'rgba(123,158,135,0.15)', color: '#4A6741' }}>🔥 Streak 7 days</div>
            <div style={styles.floatText}>Daily check-in maintained</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <div style={styles.sectionLabel}>Core features</div>
        <h2 style={styles.sectionTitle}>Everything your well-being needs</h2>
        <p style={styles.sectionSub}>Six deeply connected systems, working together to understand and support you.</p>
        <div style={styles.featuresGrid}>
          {[
            { icon: '🌡️', name: 'Daily mood tracking', desc: 'Quick check-ins with sentiment analysis that reads between the lines — not just your emoji, but your words.', badge: 'NLP powered', new: false },
            { icon: '🤖', name: 'AI support chatbot', desc: 'An emotionally aware assistant that offers guidance, helps manage tasks, and remembers your patterns.', badge: 'OpenAI + HuggingFace', new: false },
            { icon: '✅', name: 'Smart task manager', desc: 'Priority-aware task tracking with time estimation that adapts to your energy level on any given day.', badge: 'Adaptive scheduling', new: false },
            { icon: '🔮', name: 'Mood forecasting', desc: 'Predict low-energy or burnout days 1–3 days ahead so you can plan lighter tasks before the slump hits.', badge: 'New feature ✦', new: true },
            { icon: '📊', name: 'Behavioral analytics', desc: 'Visual charts connecting mood to productivity — revealing which conditions help you thrive.', badge: 'Pattern analysis', new: false },
            { icon: '🎙️', name: 'Voice journaling', desc: 'Speak your check-in in 30 seconds. Auto transcription + emotion detection, zero typing required.', badge: 'New feature ✦', new: true },
          ].map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureName}>{f.name}</div>
              <div style={styles.featureDesc}>{f.desc}</div>
              <span style={{
                ...styles.featureBadge,
                background: f.new ? 'rgba(196,184,232,0.25)' : 'rgba(123,158,135,0.12)',
                color: f.new ? '#6B5BA0' : '#4A6741',
              }}>{f.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ ...styles.section, background: '#fff' }}>
        <div style={styles.sectionLabel}>How it works</div>
        <h2 style={styles.sectionTitle}>Three simple steps</h2>
        <p style={styles.sectionSub}>MoodNest fits into your day without disrupting it.</p>
        <div style={styles.stepsGrid}>
          {[
            { num: '01', title: 'Check in daily', desc: 'Take 30 seconds to log your mood and energy. Type or speak — MoodNest understands both.' },
            { num: '02', title: 'Track your tasks', desc: 'Add tasks with priorities and deadlines. MoodNest learns which tasks drain you and which energize you.' },
            { num: '03', title: 'Get personalized guidance', desc: 'Your AI companion analyzes patterns and suggests the right activities, techniques, and habits for you.' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNum}>{s.num}</div>
              <div style={styles.stepTitle}>{s.title}</div>
              <div style={styles.stepDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="stats" style={styles.statsSection}>
        {[
          { num: '94%', label: 'users report clearer self-awareness' },
          { num: '3×', label: 'more tasks completed on tracked days' },
          { num: '21 days', label: 'to build a measurable habit' },
          { num: '∞', label: 'personalized to only you' },
        ].map((s, i) => (
          <div key={i} style={styles.statItem}>
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start nesting today.</h2>
        <p style={styles.ctaSub}>Your mood matters. Your patterns tell a story. Let MoodNest help you read it.</p>
        <button style={styles.btnWhite} onClick={() => navigate('/auth')}>
          Create your free account
        </button>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>MoodNest</div>
        <div style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy</a>
          <a href="#" style={styles.footerLink}>Terms</a>
          <a href="#" style={styles.footerLink}>Contact</a>
        </div>
        <div style={styles.footerCopy}>© 2026 MoodNest. All rights reserved.</div>
      </footer>

    </div>
  )
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", background: '#F7F3EE', color: '#2D3142' },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 40px', background: 'rgba(247,243,238,0.95)',
    borderBottom: '1px solid rgba(123,158,135,0.15)',
    position: 'sticky', top: 0, zIndex: 99,
  },
  logo: {
    fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600,
    color: '#4A6741', display: 'flex', alignItems: 'center', gap: 8,
  },
  logoDot: { width: 8, height: 8, borderRadius: '50%', background: '#E8B4A0' },
  navLinks: { display: 'flex', gap: 28, alignItems: 'center' },
  navLink: { fontSize: 13, color: '#2D3142', textDecoration: 'none', opacity: 0.6 },
  navBtn: {
    background: '#4A6741', color: '#fff', padding: '8px 18px',
    borderRadius: 20, fontSize: 13, border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  hero: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 40, padding: '80px 40px 60px', alignItems: 'center',
  },
  heroContent: {},
  eyebrow: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(123,158,135,0.12)', border: '1px solid rgba(123,158,135,0.3)',
    borderRadius: 20, padding: '5px 12px', fontSize: 12, fontWeight: 500,
    color: '#4A6741', marginBottom: 20,
  },
  eyebrowDot: {
    width: 6, height: 6, background: '#7B9E87', borderRadius: '50%',
  },
  heroH1: {
    fontFamily: "'Playfair Display', serif", fontSize: 52, fontWeight: 600,
    lineHeight: 1.12, color: '#2D3142', letterSpacing: '-1px', marginBottom: 20,
  },
  heroSub: {
    fontSize: 16, fontWeight: 300, color: '#2D3142', opacity: 0.65,
    lineHeight: 1.7, maxWidth: 440, marginBottom: 36,
  },
  heroCtas: { display: 'flex', gap: 12, alignItems: 'center' },
  btnPrimary: {
    background: '#2D3142', color: '#fff', padding: '13px 26px',
    borderRadius: 26, fontSize: 14, fontWeight: 500, border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  btnGhost: {
    color: '#2D3142', fontSize: 14, textDecoration: 'none', opacity: 0.6,
  },
  heroVisual: { position: 'relative' },
  dashCard: {
    background: '#fff', borderRadius: 20, padding: 22,
    border: '1px solid rgba(45,49,66,0.08)',
    boxShadow: '0 20px 60px rgba(45,49,66,0.08)',
  },
  dashHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  dashTitle: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
  dashDate: { fontSize: 11, color: '#2D3142', opacity: 0.4 },
  moodChart: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, marginBottom: 18 },
  barWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: '4px 4px 0 0' },
  barDay: { fontSize: 9, color: '#2D3142', opacity: 0.4 },
  moodRow: { display: 'flex', gap: 8, marginBottom: 18 },
  moodChip: { flex: 1, borderRadius: 10, padding: '10px 4px', textAlign: 'center', cursor: 'pointer' },
  chipLabel: { display: 'block', fontSize: 9, fontWeight: 500, opacity: 0.6, marginTop: 2, color: '#2D3142' },
  chatPreview: { background: 'rgba(247,243,238,0.7)', borderRadius: 12, padding: 12 },
  chatMsg: { fontSize: 11, lineHeight: 1.5, marginBottom: 8, display: 'flex', gap: 6 },
  chatAvatar: { width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500 },
  chatBubble: { background: '#fff', borderRadius: '0 8px 8px 8px', padding: '6px 9px', color: '#2D3142', maxWidth: 200, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
  chatBubbleUser: { background: '#4A6741', color: '#fff', borderRadius: '8px 0 8px 8px', padding: '6px 9px', maxWidth: 200 },
  floatCard: {
    position: 'absolute', background: '#fff', borderRadius: 12,
    padding: '12px 14px', border: '1px solid rgba(45,49,66,0.08)',
    boxShadow: '0 8px 24px rgba(45,49,66,0.1)', fontSize: 11, minWidth: 140,
  },
  floatTag: { display: 'inline-block', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 8, marginBottom: 4 },
  floatText: { fontSize: 11, color: '#2D3142', opacity: 0.7, lineHeight: 1.4 },
  section: { padding: '70px 40px', background: '#F7F3EE' },
  sectionLabel: { fontSize: 11, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#7B9E87', marginBottom: 12 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: 38, fontWeight: 600, color: '#2D3142', letterSpacing: '-0.5px', lineHeight: 1.2, marginBottom: 10 },
  sectionSub: { fontSize: 15, fontWeight: 300, opacity: 0.6, maxWidth: 500, lineHeight: 1.7, marginBottom: 48 },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  featureCard: {
    background: '#fff', borderRadius: 16, padding: 24,
    border: '1px solid rgba(45,49,66,0.07)',
  },
  featureIcon: { fontSize: 28, marginBottom: 14 },
  featureName: { fontSize: 14, fontWeight: 500, color: '#2D3142', marginBottom: 6 },
  featureDesc: { fontSize: 12, fontWeight: 300, opacity: 0.6, lineHeight: 1.6 },
  featureBadge: { display: 'inline-block', fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: 8, marginTop: 10 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  stepCard: { padding: 24, borderRadius: 16, border: '1px solid rgba(45,49,66,0.07)', background: '#F7F3EE' },
  stepNum: { fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 600, color: '#7B9E87', marginBottom: 12 },
  stepTitle: { fontSize: 16, fontWeight: 500, color: '#2D3142', marginBottom: 8 },
  stepDesc: { fontSize: 13, fontWeight: 300, opacity: 0.6, lineHeight: 1.7 },
  statsSection: {
    background: '#2D3142', padding: '60px 40px',
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center',
  },
  statItem: {},
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 600, color: '#fff', marginBottom: 6 },
  statLabel: { fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.5)' },
  ctaSection: { background: '#4A6741', padding: '70px 40px', textAlign: 'center' },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 600, color: '#fff', letterSpacing: '-0.5px', marginBottom: 14 },
  ctaSub: { fontSize: 15, fontWeight: 300, color: 'rgba(255,255,255,0.7)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 },
  btnWhite: {
    background: '#fff', color: '#4A6741', padding: '13px 30px',
    borderRadius: 26, fontSize: 14, fontWeight: 500, border: 'none',
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  footer: {
    background: '#1E2133', padding: '32px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  footerLogo: { fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.8)' },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' },
  footerCopy: { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
}
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { db, app } from '../firebase/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

const auth = getAuth(app)

const moodColors = { 1: '#E8B4A0', 2: '#C4B8E8', 3: '#7B9E87', 4: '#4A6741', 5: '#6B7FA3' }
const moodEmojis = { 1: '😔', 2: '😐', 3: '🙂', 4: '😄', 5: '🤩' }
const moodLabels = { 1: 'Low', 2: 'Okay', 3: 'Good', 4: 'Great', 5: 'Amazing' }

export default function Analytics() {
  const navigate = useNavigate()
  const [moodHistory, setMoodHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const q = query(collection(db, 'moods'), where('uid', '==', user.uid))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
      setMoodHistory(data)
      setLoading(false)
    }
    load()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const avgMood = moodHistory.length > 0
    ? (moodHistory.reduce((a, b) => a + b.moodValue, 0) / moodHistory.length).toFixed(1)
    : '—'

  const bestMood = moodHistory.length > 0
    ? moodHistory.reduce((a, b) => a.moodValue > b.moodValue ? a : b)
    : null

  const moodDist = [5, 4, 3, 2, 1].map(val => ({
    value: val,
    label: moodLabels[val],
    count: moodHistory.filter(m => m.moodValue === val).length,
    color: moodColors[val],
  }))

  const last7 = moodHistory.slice(-7)

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}><div style={styles.logoDot} />MoodNest</div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', path: '/chat' },
            { icon: '📊', label: 'Analytics', path: '/analytics', active: true },
            { icon: '✅', label: 'Tasks', path: '/tasks' },
            { icon: '⚙️', label: 'Settings', path: '/settings' },
          ].map((item, i) => (
            <div key={i} style={{ ...styles.navItem, background: item.active ? 'rgba(123,158,135,0.15)' : 'transparent', color: item.active ? '#4A6741' : '#2D3142', opacity: item.active ? 1 : 0.55 }} onClick={() => navigate(item.path)}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>{user?.email?.[0]?.toUpperCase() || 'H'}</div>
            <div>
              <div style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</div>
              <div style={styles.userSub}>🔥 {moodHistory.length} check-ins</div>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={handleLogout}>← Log out</div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Mood Analytics 📊</h1>
            <p style={styles.pageDate}>Your emotional patterns over time</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your mood data...</div>
        ) : moodHistory.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#2D3142', marginBottom: 8 }}>No mood data yet</div>
            <div style={{ fontSize: 14, color: '#2D3142', opacity: 0.5, marginBottom: 20 }}>Start checking in on the Dashboard to see your analytics here!</div>
            <button style={styles.goBtn} onClick={() => navigate('/dashboard')}>Go to Dashboard →</button>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div style={styles.statsRow}>
              {[
                { label: 'Total check-ins', value: moodHistory.length, sub: 'all time' },
                { label: 'Average mood', value: avgMood, sub: 'out of 5.0' },
                { label: 'Best mood', value: bestMood ? moodEmojis[bestMood.moodValue] : '—', sub: bestMood ? moodLabels[bestMood.moodValue] : '' },
                { label: 'This week', value: last7.length, sub: 'check-ins' },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <div style={styles.statLabel}>{s.label}</div>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statSub}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* LAST 7 MOODS CHART */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Recent mood trend</span>
                <span style={styles.chartSub}>Last {last7.length} check-ins</span>
              </div>
              {last7.length > 0 ? (
                <div style={styles.chart}>
                  {last7.map((m, i) => (
                    <div key={i} style={styles.chartCol}>
                      <span style={styles.chartEmoji}>{moodEmojis[m.moodValue]}</span>
                      <div style={styles.chartBarBg}>
                        <div style={{ ...styles.chartBarFill, height: `${(m.moodValue / 5) * 100}%`, background: moodColors[m.moodValue] }} />
                      </div>
                      <span style={styles.chartDay}>{new Date(m.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noData}>No recent check-ins</div>
              )}
            </div>

            {/* MOOD DISTRIBUTION */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Mood distribution</span>
                <span style={styles.chartSub}>All time ({moodHistory.length} check-ins)</span>
              </div>
              <div style={styles.distList}>
                {moodDist.map((m, i) => (
                  <div key={i} style={styles.distRow}>
                    <span style={styles.distEmoji}>{moodEmojis[m.value]}</span>
                    <span style={styles.distLabel}>{m.label}</span>
                    <div style={styles.distBarBg}>
                      <div style={{ ...styles.distBarFill, width: moodHistory.length > 0 ? `${(m.count / moodHistory.length) * 100}%` : '0%', background: m.color }} />
                    </div>
                    <span style={styles.distValue}>{m.count} {m.count === 1 ? 'time' : 'times'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MOOD LOG */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <span style={styles.chartTitle}>Check-in history</span>
                <span style={styles.chartSub}>Most recent first</span>
              </div>
              <div style={styles.logList}>
                {[...moodHistory].reverse().slice(0, 10).map((m, i) => (
                  <div key={i} style={styles.logItem}>
                    <div style={{ ...styles.logEmoji, background: `${moodColors[m.moodValue]}25` }}>
                      {moodEmojis[m.moodValue]}
                    </div>
                    <div style={styles.logBody}>
                      <div style={styles.logMood}>{moodLabels[m.moodValue]}</div>
                      {m.note && <div style={styles.logNote}>{m.note}</div>}
                    </div>
                    <div style={styles.logDate}>{new Date(m.date).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif" },
  sidebar: { width: 220, background: '#fff', borderRight: '1px solid rgba(45,49,66,0.08)', display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0 },
  sidebarLogo: { fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#4A6741', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, paddingLeft: 8 },
  logoDot: { width: 8, height: 8, borderRadius: '50%', background: '#E8B4A0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' },
  sidebarBottom: { borderTop: '1px solid rgba(45,49,66,0.08)', paddingTop: 16 },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  userAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'rgba(123,158,135,0.2)', color: '#4A6741', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 },
  userName: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
  userSub: { fontSize: 11, color: '#2D3142', opacity: 0.5 },
  logoutBtn: { fontSize: 12, color: '#2D3142', opacity: 0.4, cursor: 'pointer', paddingLeft: 4 },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#2D3142', marginBottom: 4 },
  pageDate: { fontSize: 13, color: '#2D3142', opacity: 0.5 },
  loading: { textAlign: 'center', padding: '60px', color: '#2D3142', opacity: 0.5 },
  emptyState: { textAlign: 'center', padding: '80px 20px' },
  goBtn: { background: '#2D3142', color: '#fff', padding: '11px 24px', borderRadius: 24, border: 'none', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(45,49,66,0.07)' },
  statLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 600, color: '#2D3142', marginBottom: 4, fontFamily: "'Playfair Display', serif" },
  statSub: { fontSize: 11, color: '#7B9E87', fontWeight: 500 },
  chartCard: { background: '#fff', borderRadius: 16, padding: '22px', border: '1px solid rgba(45,49,66,0.07)', marginBottom: 20 },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142' },
  chartSub: { fontSize: 12, color: '#2D3142', opacity: 0.4 },
  chart: { display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 },
  chartCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' },
  chartEmoji: { fontSize: 16 },
  chartBarBg: { flex: 1, width: '100%', background: 'rgba(45,49,66,0.06)', borderRadius: 6, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 6, transition: 'height 0.5s' },
  chartDay: { fontSize: 10, color: '#2D3142', opacity: 0.4 },
  noData: { textAlign: 'center', color: '#2D3142', opacity: 0.4, padding: '20px' },
  distList: { display: 'flex', flexDirection: 'column', gap: 12 },
  distRow: { display: 'flex', alignItems: 'center', gap: 10 },
  distEmoji: { fontSize: 16, width: 24, textAlign: 'center' },
  distLabel: { fontSize: 12, color: '#2D3142', opacity: 0.7, width: 52, flexShrink: 0 },
  distBarBg: { flex: 1, height: 8, background: 'rgba(45,49,66,0.06)', borderRadius: 4 },
  distBarFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s' },
  distValue: { fontSize: 11, color: '#2D3142', opacity: 0.5, width: 56, textAlign: 'right', flexShrink: 0 },
  logList: { display: 'flex', flexDirection: 'column', gap: 10 },
  logItem: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px', borderRadius: 12, background: '#F7F3EE' },
  logEmoji: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  logBody: { flex: 1 },
  logMood: { fontSize: 13, fontWeight: 500, color: '#2D3142', marginBottom: 2 },
  logNote: { fontSize: 12, color: '#2D3142', opacity: 0.55, lineHeight: 1.5 },
  logDate: { fontSize: 11, color: '#2D3142', opacity: 0.35, flexShrink: 0 },
}
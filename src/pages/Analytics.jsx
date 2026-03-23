import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const weeklyMoodData = [
  { day: 'Mon', mood: 3, tasks: 4, energy: 60 },
  { day: 'Tue', mood: 2, tasks: 2, energy: 40 },
  { day: 'Wed', mood: 4, tasks: 6, energy: 80 },
  { day: 'Thu', mood: 3, tasks: 5, energy: 65 },
  { day: 'Fri', mood: 2, tasks: 3, energy: 45 },
  { day: 'Sat', mood: 5, tasks: 7, energy: 95 },
  { day: 'Sun', mood: 3, tasks: 4, energy: 70 },
]

const monthlyMoodData = [
  { day: 'W1', mood: 3.2, tasks: 18, energy: 65 },
  { day: 'W2', mood: 2.8, tasks: 14, energy: 55 },
  { day: 'W3', mood: 3.9, tasks: 22, energy: 78 },
  { day: 'W4', mood: 3.5, tasks: 20, energy: 72 },
]

const moodColors = {
  1: '#E8B4A0',
  2: '#C4B8E8',
  3: '#7B9E87',
  4: '#4A6741',
  5: '#6B7FA3',
}

const moodLabels = {
  1: 'Low 😔',
  2: 'Okay 😐',
  3: 'Good 🙂',
  4: 'Great 😄',
  5: 'Amazing 🤩',
}

const insights = [
  { icon: '🌅', title: 'Peak productivity time', desc: 'You perform best on Wednesday and Saturday mornings. Schedule important tasks then.', color: 'rgba(123,158,135,0.12)', border: 'rgba(123,158,135,0.3)', textColor: '#4A6741' },
  { icon: '😴', title: 'Low energy pattern', desc: 'Tuesday and Friday afternoons show consistent low mood. Consider lighter tasks or breaks.', color: 'rgba(196,184,232,0.15)', border: 'rgba(196,184,232,0.4)', textColor: '#6B5BA0' },
  { icon: '📈', title: 'Mood & productivity link', desc: 'On days when your mood score is 4+, you complete 40% more tasks on average.', color: 'rgba(107,127,163,0.12)', border: 'rgba(107,127,163,0.3)', textColor: '#4A5F82' },
  { icon: '🔥', title: '7 day streak!', desc: 'You\'ve checked in every day this week. Consistency is the key to self-awareness.', color: 'rgba(232,180,160,0.15)', border: 'rgba(232,180,160,0.4)', textColor: '#C0663A' },
]

const moodDistribution = [
  { label: 'Amazing', value: 2, color: '#6B7FA3' },
  { label: 'Great', value: 5, color: '#4A6741' },
  { label: 'Good', value: 12, color: '#7B9E87' },
  { label: 'Okay', value: 7, color: '#C4B8E8' },
  { label: 'Low', value: 4, color: '#E8B4A0' },
]

export default function Analytics() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState('week')
  const data = period === 'week' ? weeklyMoodData : monthlyMoodData
  const maxMood = 5
  const maxTasks = Math.max(...data.map(d => d.tasks))

  const totalDays = moodDistribution.reduce((a, b) => a + b.value, 0)
  const avgMood = ((weeklyMoodData.reduce((a, b) => a + b.mood, 0) / weeklyMoodData.length)).toFixed(1)

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoDot} />
          MoodNest
        </div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', path: '/chat' },
            { icon: '📊', label: 'Analytics', path: '/analytics', active: true },
            { icon: '✅', label: 'Tasks', path: '/tasks' },
            { icon: '⚙️', label: 'Settings', path: '/settings' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.navItem,
                background: item.active ? 'rgba(123,158,135,0.15)' : 'transparent',
                color: item.active ? '#4A6741' : '#2D3142',
                opacity: item.active ? 1 : 0.55,
              }}
              onClick={() => navigate(item.path)}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
        <div style={styles.sidebarBottom}>
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>HK</div>
            <div>
              <div style={styles.userName}>Harsimran</div>
              <div style={styles.userSub}>7 day streak 🔥</div>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={() => navigate('/')}>← Log out</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Mood Analytics 📊</h1>
            <p style={styles.pageDate}>Your emotional & productivity patterns</p>
          </div>
          <div style={styles.periodToggle}>
            {['week', 'month'].map(p => (
              <button
                key={p}
                style={{
                  ...styles.periodBtn,
                  background: period === p ? '#2D3142' : 'transparent',
                  color: period === p ? '#fff' : '#2D3142',
                  opacity: period === p ? 1 : 0.5,
                }}
                onClick={() => setPeriod(p)}
              >
                {p === 'week' ? 'This week' : 'This month'}
              </button>
            ))}
          </div>
        </div>

        {/* STATS ROW */}
        <div style={styles.statsRow}>
          {[
            { label: 'Average mood', value: avgMood, sub: 'out of 5.0', color: '#7B9E87' },
            { label: 'Check-in streak', value: '7', sub: 'days in a row 🔥', color: '#E8B4A0' },
            { label: 'Tasks completed', value: '31', sub: 'this week', color: '#C4B8E8' },
            { label: 'Best day', value: 'Sat', sub: 'mood score 5.0 🤩', color: '#6B7FA3' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={{ ...styles.statValue, color: s.color }}>{s.value}</div>
              <div style={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div style={styles.chartsRow}>

          {/* Mood Trend Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Mood trend</span>
              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: '#7B9E87' }} />
                  <span>Mood</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={{ ...styles.legendDot, background: '#C4B8E8' }} />
                  <span>Tasks</span>
                </div>
              </div>
            </div>
            <div style={styles.chart}>
              {data.map((d, i) => (
                <div key={i} style={styles.chartCol}>
                  <div style={styles.barsWrap}>
                    {/* Tasks bar */}
                    <div style={styles.barGroup}>
                      <div style={{
                        ...styles.bar,
                        height: `${(d.tasks / maxTasks) * 100}%`,
                        background: 'rgba(196,184,232,0.5)',
                        width: 14,
                      }} />
                    </div>
                    {/* Mood bar */}
                    <div style={styles.barGroup}>
                      <div style={{
                        ...styles.bar,
                        height: `${(d.mood / maxMood) * 100}%`,
                        background: moodColors[Math.round(d.mood)] || '#7B9E87',
                        width: 14,
                      }} />
                    </div>
                  </div>
                  <span style={styles.chartDay}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mood Distribution */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>Mood distribution</span>
              <span style={styles.chartSub}>Last 30 days</span>
            </div>
            <div style={styles.distList}>
              {moodDistribution.map((m, i) => (
                <div key={i} style={styles.distRow}>
                  <span style={styles.distLabel}>{m.label}</span>
                  <div style={styles.distBarBg}>
                    <div style={{
                      ...styles.distBarFill,
                      width: `${(m.value / totalDays) * 100}%`,
                      background: m.color,
                    }} />
                  </div>
                  <span style={styles.distValue}>{m.value} days</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ENERGY + PRODUCTIVITY */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Energy levels this week</span>
            <span style={styles.chartSub}>Based on your check-ins</span>
          </div>
          <div style={styles.energyChart}>
            {weeklyMoodData.map((d, i) => (
              <div key={i} style={styles.energyCol}>
                <span style={styles.energyPct}>{d.energy}%</span>
                <div style={styles.energyBarBg}>
                  <div style={{
                    ...styles.energyBarFill,
                    height: `${d.energy}%`,
                    background: d.energy >= 70 ? '#7B9E87' : d.energy >= 50 ? '#C4B8E8' : '#E8B4A0',
                  }} />
                </div>
                <span style={styles.energyDay}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI INSIGHTS */}
        <div style={styles.insightsSection}>
          <div style={styles.insightsSectionTitle}>🤖 AI-powered insights</div>
          <div style={styles.insightsGrid}>
            {insights.map((ins, i) => (
              <div key={i} style={{
                ...styles.insightCard,
                background: ins.color,
                border: `1px solid ${ins.border}`,
              }}>
                <div style={styles.insightIcon}>{ins.icon}</div>
                <div style={{ ...styles.insightTitle, color: ins.textColor }}>{ins.title}</div>
                <div style={styles.insightDesc}>{ins.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MOOD CALENDAR */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>Mood calendar — March 2026</span>
          </div>
          <div style={styles.calendar}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} style={styles.calHeader}>{d}</div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
              const moodVal = [3,2,4,3,2,5,3,4,3,2,3,4,5,3,2,4,3,3,2,4,3,5,3,2,4,3,3,4,2,3,4][day - 1] || 3
              return (
                <div key={day} style={{
                  ...styles.calDay,
                  background: `${moodColors[moodVal]}40`,
                  border: day === 22 ? `2px solid ${moodColors[moodVal]}` : '2px solid transparent',
                }}>
                  <span style={styles.calDayNum}>{day}</span>
                  <span style={styles.calEmoji}>{['😔','😐','🙂','😄','🤩'][moodVal - 1]}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif" },
  sidebar: {
    width: 220, background: '#fff', borderRight: '1px solid rgba(45,49,66,0.08)',
    display: 'flex', flexDirection: 'column', padding: '24px 16px', flexShrink: 0,
  },
  sidebarLogo: {
    fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600,
    color: '#4A6741', display: 'flex', alignItems: 'center', gap: 8,
    marginBottom: 36, paddingLeft: 8,
  },
  logoDot: { width: 8, height: 8, borderRadius: '50%', background: '#E8B4A0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navItem: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
    borderRadius: 10, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
  },
  sidebarBottom: { borderTop: '1px solid rgba(45,49,66,0.08)', paddingTop: 16 },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  userAvatar: {
    width: 36, height: 36, borderRadius: '50%', background: 'rgba(123,158,135,0.2)',
    color: '#4A6741', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 600,
  },
  userName: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
  userSub: { fontSize: 11, color: '#2D3142', opacity: 0.5 },
  logoutBtn: { fontSize: 12, color: '#2D3142', opacity: 0.4, cursor: 'pointer', paddingLeft: 4 },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#2D3142', marginBottom: 4 },
  pageDate: { fontSize: 13, color: '#2D3142', opacity: 0.5 },
  periodToggle: { display: 'flex', background: '#fff', borderRadius: 12, padding: 4, border: '1px solid rgba(45,49,66,0.07)' },
  periodBtn: {
    padding: '8px 16px', borderRadius: 9, border: 'none', fontSize: 13,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
  },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: {
    background: '#fff', borderRadius: 14, padding: '18px 20px',
    border: '1px solid rgba(45,49,66,0.07)',
  },
  statLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 600, marginBottom: 4, fontFamily: "'Playfair Display', serif" },
  statSub: { fontSize: 11, color: '#2D3142', opacity: 0.5 },
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  chartCard: {
    background: '#fff', borderRadius: 16, padding: '22px',
    border: '1px solid rgba(45,49,66,0.07)', marginBottom: 20,
  },
  chartHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  chartTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142' },
  chartSub: { fontSize: 12, color: '#2D3142', opacity: 0.4 },
  chartLegend: { display: 'flex', gap: 12 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#2D3142', opacity: 0.6 },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },
  chart: { display: 'flex', gap: 8, alignItems: 'flex-end', height: 140 },
  chartCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' },
  barsWrap: { flex: 1, display: 'flex', gap: 3, alignItems: 'flex-end', width: '100%', justifyContent: 'center' },
  barGroup: { display: 'flex', alignItems: 'flex-end', height: '100%' },
  bar: { borderRadius: '3px 3px 0 0', transition: 'height 0.5s' },
  chartDay: { fontSize: 10, color: '#2D3142', opacity: 0.4 },
  distList: { display: 'flex', flexDirection: 'column', gap: 12 },
  distRow: { display: 'flex', alignItems: 'center', gap: 10 },
  distLabel: { fontSize: 12, color: '#2D3142', opacity: 0.7, width: 60, flexShrink: 0 },
  distBarBg: { flex: 1, height: 8, background: 'rgba(45,49,66,0.06)', borderRadius: 4 },
  distBarFill: { height: '100%', borderRadius: 4, transition: 'width 0.5s' },
  distValue: { fontSize: 11, color: '#2D3142', opacity: 0.5, width: 50, textAlign: 'right', flexShrink: 0 },
  energyChart: { display: 'flex', gap: 12, alignItems: 'flex-end', height: 120 },
  energyCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' },
  energyPct: { fontSize: 10, color: '#2D3142', opacity: 0.5 },
  energyBarBg: { flex: 1, width: '100%', background: 'rgba(45,49,66,0.06)', borderRadius: 6, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  energyBarFill: { width: '100%', borderRadius: 6, transition: 'height 0.5s' },
  energyDay: { fontSize: 10, color: '#2D3142', opacity: 0.4 },
  insightsSection: { marginBottom: 20 },
  insightsSectionTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142', marginBottom: 14 },
  insightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  insightCard: { borderRadius: 14, padding: '16px' },
  insightIcon: { fontSize: 22, marginBottom: 8 },
  insightTitle: { fontSize: 13, fontWeight: 500, marginBottom: 6 },
  insightDesc: { fontSize: 12, color: '#2D3142', opacity: 0.65, lineHeight: 1.6 },
  calendar: {
    display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
  },
  calHeader: { fontSize: 11, color: '#2D3142', opacity: 0.4, textAlign: 'center', paddingBottom: 6, fontWeight: 500 },
  calDay: {
    borderRadius: 8, padding: '6px 4px', textAlign: 'center',
    cursor: 'pointer', transition: 'transform 0.15s',
  },
  calDayNum: { display: 'block', fontSize: 11, color: '#2D3142', opacity: 0.6, marginBottom: 2 },
  calEmoji: { fontSize: 12 },
}
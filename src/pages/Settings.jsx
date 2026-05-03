import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut, updateEmail, updatePassword, deleteUser } from 'firebase/auth'
import { db, app } from '../firebase/firebase'
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore'

const auth = getAuth(app)

export default function Settings() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [taskCount, setTaskCount] = useState(0)
  const [moodCount, setMoodCount] = useState(0)
  const user = auth.currentUser

  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    bio: 'Trying to be a little better every day 🌱',
    timezone: 'America/New_York',
  })

  const [notifications, setNotifications] = useState({
    dailyCheckin: true,
    moodReminder: true,
    taskReminder: false,
    weeklyReport: true,
    aiInsights: true,
    streakAlert: true,
  })

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'English',
    startOfWeek: 'Monday',
    defaultMood: 'Good',
    checkinTime: '09:00',
  })

  const [privacy, setPrivacy] = useState({
    shareData: false,
    analytics: true,
    crashReports: true,
  })

  useEffect(() => {
    if (!user) return
    const loadStats = async () => {
      const tSnap = await getDocs(query(collection(db, 'tasks'), where('uid', '==', user.uid)))
      const mSnap = await getDocs(query(collection(db, 'moods'), where('uid', '==', user.uid)))
      setTaskCount(tSnap.size)
      setMoodCount(mSnap.size)
    }
    loadStats()
  }, [user])

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const handleClearData = async () => {
    if (!window.confirm('Delete all your moods and tasks? This cannot be undone.')) return
    const tSnap = await getDocs(query(collection(db, 'tasks'), where('uid', '==', user.uid)))
    const mSnap = await getDocs(query(collection(db, 'moods'), where('uid', '==', user.uid)))
    await Promise.all([...tSnap.docs, ...mSnap.docs].map(d => deleteDoc(doc(db, d.ref.parent.id, d.id))))
    setTaskCount(0)
    setMoodCount(0)
    alert('All data cleared!')
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your account? This cannot be undone.')) return
    await handleClearData()
    await deleteUser(user)
    navigate('/')
  }

  const Toggle = ({ value, onChange }) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: value ? '#4A6741' : 'rgba(45,49,66,0.15)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  )

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'preferences', icon: '🎨', label: 'Preferences' },
    { id: 'privacy', icon: '🔒', label: 'Privacy' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}><div style={styles.logoDot} />MoodNest</div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', path: '/chat' },
            { icon: '📊', label: 'Analytics', path: '/analytics' },
            { icon: '✅', label: 'Tasks', path: '/tasks' },
            { icon: '⚙️', label: 'Settings', path: '/settings', active: true },
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
              <div style={styles.userSub}>🔥 {moodCount} check-ins</div>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={handleLogout}>← Log out</div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Settings ⚙️</h1>
            <p style={styles.pageDate}>Manage your account and preferences</p>
          </div>
          <button style={{ ...styles.saveBtn, background: saved ? '#7B9E87' : '#2D3142' }} onClick={handleSave}>
            {saved ? '✅ Saved!' : 'Save changes'}
          </button>
        </div>

        <div style={styles.settingsLayout}>
          <div style={styles.tabNav}>
            {tabs.map(tab => (
              <div key={tab.id} style={{ ...styles.tabItem, background: activeTab === tab.id ? 'rgba(123,158,135,0.12)' : 'transparent', color: activeTab === tab.id ? '#4A6741' : '#2D3142', opacity: activeTab === tab.id ? 1 : 0.6, fontWeight: activeTab === tab.id ? 500 : 400 }} onClick={() => setActiveTab(tab.id)}>
                <span style={{ fontSize: 18 }}>{tab.icon}</span>{tab.label}
              </div>
            ))}
            <div style={styles.tabDivider} />
            <div style={styles.dangerZone}>
              <div style={styles.dangerTitle}>Danger zone</div>
              <button style={styles.dangerBtn} onClick={handleDeleteAccount}>Delete account</button>
              <button style={styles.dangerBtn} onClick={handleClearData}>Clear all data</button>
            </div>
          </div>

          <div style={styles.tabContent}>

            {activeTab === 'profile' && (
              <div>
                <div style={styles.sectionTitle}>Profile information</div>
                <div style={styles.avatarSection}>
                  <div style={styles.avatarLarge}>{user?.email?.[0]?.toUpperCase() || 'H'}</div>
                  <div>
                    <div style={styles.avatarName}>{profile.name}</div>
                    <div style={styles.avatarEmail}>{user?.email}</div>
                  </div>
                </div>
                <div style={styles.formGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Display name</label>
                    <input style={styles.input} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Email address</label>
                    <input style={{ ...styles.input, opacity: 0.6 }} value={user?.email} disabled />
                  </div>
                  <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                    <label style={styles.label}>Bio</label>
                    <textarea style={{ ...styles.input, resize: 'none' }} rows={3} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Timezone</label>
                    <select style={styles.input} value={profile.timezone} onChange={e => setProfile({ ...profile, timezone: e.target.value })}>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                    </select>
                  </div>
                </div>
                <div style={styles.sectionTitle}>Account stats</div>
                <div style={styles.statsGrid}>
                  {[
                    { label: 'Member since', value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en', { month: 'short', year: 'numeric' }) : '—' },
                    { label: 'Total check-ins', value: moodCount },
                    { label: 'Tasks created', value: taskCount },
                    { label: 'Account status', value: '✅ Active' },
                  ].map((s, i) => (
                    <div key={i} style={styles.statCard}>
                      <div style={styles.statLabel}>{s.label}</div>
                      <div style={styles.statValue}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <div style={styles.sectionTitle}>Notification preferences</div>
                <div style={styles.toggleList}>
                  {[
                    { key: 'dailyCheckin', label: 'Daily check-in reminder', desc: 'Get reminded to log your mood every day' },
                    { key: 'moodReminder', label: 'Mood pattern alerts', desc: 'Alerts when your mood pattern changes significantly' },
                    { key: 'taskReminder', label: 'Task reminders', desc: 'Reminders for upcoming and overdue tasks' },
                    { key: 'weeklyReport', label: 'Weekly summary report', desc: 'A summary of your mood and productivity each week' },
                    { key: 'aiInsights', label: 'AI insights', desc: 'Personalized suggestions from your AI assistant' },
                    { key: 'streakAlert', label: 'Streak alerts', desc: "Get notified when you're about to lose your streak" },
                  ].map(item => (
                    <div key={item.key} style={styles.toggleRow}>
                      <div style={styles.toggleInfo}>
                        <div style={styles.toggleLabel}>{item.label}</div>
                        <div style={styles.toggleDesc}>{item.desc}</div>
                      </div>
                      <Toggle value={notifications[item.key]} onChange={val => setNotifications({ ...notifications, [item.key]: val })} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <div style={styles.sectionTitle}>App preferences</div>
                <div style={styles.formGrid}>
                  <div style={styles.field}>
                    <label style={styles.label}>Theme</label>
                    <select style={styles.input} value={preferences.theme} onChange={e => setPreferences({ ...preferences, theme: e.target.value })}>
                      <option value="light">☀️ Light</option>
                      <option value="dark">🌙 Dark</option>
                      <option value="system">💻 System default</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Language</label>
                    <select style={styles.input} value={preferences.language} onChange={e => setPreferences({ ...preferences, language: e.target.value })}>
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                      <option>Hindi</option>
                      <option>Punjabi</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Start of week</label>
                    <select style={styles.input} value={preferences.startOfWeek} onChange={e => setPreferences({ ...preferences, startOfWeek: e.target.value })}>
                      <option>Monday</option>
                      <option>Sunday</option>
                      <option>Saturday</option>
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Check-in reminder time</label>
                    <input type="time" style={styles.input} value={preferences.checkinTime} onChange={e => setPreferences({ ...preferences, checkinTime: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <div style={styles.sectionTitle}>Privacy & data</div>
                <div style={styles.toggleList}>
                  {[
                    { key: 'shareData', label: 'Share anonymous usage data', desc: 'Help improve MoodNest by sharing anonymized usage patterns' },
                    { key: 'analytics', label: 'In-app analytics', desc: 'Allow MoodNest to track feature usage to improve your experience' },
                    { key: 'crashReports', label: 'Crash reports', desc: 'Automatically send crash reports to help fix bugs faster' },
                  ].map(item => (
                    <div key={item.key} style={styles.toggleRow}>
                      <div style={styles.toggleInfo}>
                        <div style={styles.toggleLabel}>{item.label}</div>
                        <div style={styles.toggleDesc}>{item.desc}</div>
                      </div>
                      <Toggle value={privacy[item.key]} onChange={val => setPrivacy({ ...privacy, [item.key]: val })} />
                    </div>
                  ))}
                </div>
                <div style={styles.sectionTitle}>Your data</div>
                <div style={styles.dataActions}>
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>📊</div>
                    <div style={styles.dataTitle}>Your data summary</div>
                    <div style={styles.dataDesc}>{moodCount} mood check-ins and {taskCount} tasks stored securely in Firebase.</div>
                  </div>
                  <div style={styles.dataCard}>
                    <div style={styles.dataIcon}>🗑️</div>
                    <div style={styles.dataTitle}>Delete all data</div>
                    <div style={styles.dataDesc}>Permanently delete all your mood and task history. This cannot be undone.</div>
                    <button style={{ ...styles.dataBtn, background: 'rgba(192,57,43,0.08)', color: '#C0392B', borderColor: 'rgba(192,57,43,0.2)' }} onClick={handleClearData}>Delete data</button>
                  </div>
                </div>
                <div style={styles.privacyNote}>🔒 Your data is encrypted and stored securely in Firebase. MoodNest never sells your personal information.</div>
              </div>
            )}

          </div>
        </div>
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
  saveBtn: { color: '#fff', padding: '10px 22px', borderRadius: 24, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.3s' },
  settingsLayout: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24 },
  tabNav: { background: '#fff', borderRadius: 16, padding: '12px', border: '1px solid rgba(45,49,66,0.07)', height: 'fit-content' },
  tabItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 2 },
  tabDivider: { height: 1, background: 'rgba(45,49,66,0.07)', margin: '12px 0' },
  dangerZone: { padding: '4px' },
  dangerTitle: { fontSize: 11, fontWeight: 500, color: '#C0392B', opacity: 0.7, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' },
  dangerBtn: { display: 'block', width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(192,57,43,0.2)', background: 'rgba(192,57,43,0.05)', color: '#C0392B', fontSize: 12, cursor: 'pointer', marginBottom: 6, fontFamily: "'DM Sans', sans-serif", textAlign: 'left' },
  tabContent: { background: '#fff', borderRadius: 16, padding: '28px', border: '1px solid rgba(45,49,66,0.07)' },
  sectionTitle: { fontSize: 15, fontWeight: 500, color: '#2D3142', marginBottom: 20, marginTop: 28, paddingBottom: 10, borderBottom: '1px solid rgba(45,49,66,0.07)' },
  avatarSection: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 },
  avatarLarge: { width: 72, height: 72, borderRadius: '50%', background: 'rgba(123,158,135,0.2)', color: '#4A6741', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 600, flexShrink: 0 },
  avatarName: { fontSize: 18, fontWeight: 500, color: '#2D3142', marginBottom: 4 },
  avatarEmail: { fontSize: 13, color: '#2D3142', opacity: 0.5 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 500, color: '#2D3142', opacity: 0.6 },
  input: { padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', outline: 'none', background: '#F7F3EE', width: '100%' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  statCard: { background: '#F7F3EE', borderRadius: 12, padding: '14px 16px', border: '1px solid rgba(45,49,66,0.06)' },
  statLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: 600, color: '#2D3142', fontFamily: "'Playfair Display', serif" },
  toggleList: { display: 'flex', flexDirection: 'column', gap: 4 },
  toggleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 12, background: '#F7F3EE', marginBottom: 8 },
  toggleInfo: { flex: 1, paddingRight: 20 },
  toggleLabel: { fontSize: 14, fontWeight: 500, color: '#2D3142', marginBottom: 3 },
  toggleDesc: { fontSize: 12, color: '#2D3142', opacity: 0.5, lineHeight: 1.5 },
  dataActions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 },
  dataCard: { background: '#F7F3EE', borderRadius: 14, padding: '20px', border: '1px solid rgba(45,49,66,0.07)' },
  dataIcon: { fontSize: 28, marginBottom: 10 },
  dataTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142', marginBottom: 6 },
  dataDesc: { fontSize: 12, color: '#2D3142', opacity: 0.55, lineHeight: 1.6, marginBottom: 14 },
  dataBtn: { padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(45,49,66,0.15)', background: 'transparent', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: '#2D3142' },
  privacyNote: { background: 'rgba(123,158,135,0.1)', border: '1px solid rgba(123,158,135,0.25)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#4A6741', lineHeight: 1.6 },
}	
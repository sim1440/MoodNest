import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { db, app } from '../firebase/firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore'

const auth = getAuth(app)

const moods = [
  { emoji: '😔', label: 'Low', color: '#E8B4A0', value: 1 },
  { emoji: '😐', label: 'Okay', color: '#C4B8E8', value: 2 },
  { emoji: '🙂', label: 'Good', color: '#7B9E87', value: 3 },
  { emoji: '😄', label: 'Great', color: '#4A6741', value: 4 },
  { emoji: '🤩', label: 'Amazing', color: '#6B7FA3', value: 5 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState(2)
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [moodNote, setMoodNote] = useState('')
  const [checkedIn, setCheckedIn] = useState(false)
  const user = auth.currentUser

  const completedTasks = tasks.filter(t => t.done).length
  const totalTasks = tasks.length
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Load tasks from Firestore
  useEffect(() => {
    if (!user) return
    const loadTasks = async () => {
      const q = query(collection(db, 'tasks'), where('uid', '==', user.uid))
      const snap = await getDocs(q)
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    loadTasks()
  }, [user])

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    await updateDoc(doc(db, 'tasks', id), { done: !task.done })
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const addTask = async () => {
    if (!newTask.trim() || !user) return
   const newT = { text: newTask, priority: newPriority, done: false, time: 'Today', due: 'Today', category: 'Work', uid: user.uid }
    const docRef = await addDoc(collection(db, 'tasks'), newT)
    setTasks([...tasks, { id: docRef.id, ...newT }])
    setNewTask('')
  }

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleCheckin = async () => {
    if (!user) return
    await addDoc(collection(db, 'moods'), {
      uid: user.uid,
      mood: moods[selectedMood].label,
      moodValue: moods[selectedMood].value,
      note: moodNote,
      date: new Date().toISOString(),
    })
    setCheckedIn(true)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const weeklyMoods = [3, 2, 4, 3, 2, 5, 3]
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  const priorityColor = {
    high: { bg: 'rgba(232,90,90,0.1)', text: '#C0392B' },
    medium: { bg: 'rgba(196,184,232,0.2)', text: '#6B5BA0' },
    low: { bg: 'rgba(123,158,135,0.15)', text: '#4A6741' },
  }

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
            { icon: '🏠', label: 'Dashboard', active: true, path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', active: false, path: '/chat' },
            { icon: '📊', label: 'Analytics', active: false, path: '/analytics' },
            { icon: '✅', label: 'Tasks', active: false, path: '/tasks' },
            { icon: '⚙️', label: 'Settings', active: false, path: '/settings' },
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
            <div style={styles.userAvatar}>{user?.email?.[0]?.toUpperCase() || 'H'}</div>
            <div>
              <div style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</div>
              <div style={styles.userEmail}>7 day streak 🔥</div>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={handleLogout}>← Log out</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Good morning 🌿</h1>
            <p style={styles.pageDate}>{new Date().toDateString()}</p>
          </div>
          <div style={styles.topBarRight}>
            <div style={styles.streakBadge}>🔥 7 day streak</div>
          </div>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: 'Tasks completed', value: `${completedTasks}/${totalTasks}`, sub: `${progressPct}% done today` },
            { label: 'Current mood', value: moods[selectedMood].emoji, sub: moods[selectedMood].label },
            { label: 'Check-ins this week', value: '6', sub: 'out of 7 days' },
            { label: 'Mood score', value: '3.8', sub: 'above average ↑' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={styles.twoCol}>
          <div style={styles.leftCol}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Today's mood check-in</span>
                {checkedIn && <span style={styles.checkedBadge}>✅ Checked in</span>}
              </div>
              <div style={styles.moodRow}>
                {moods.map((m, i) => (
                  <div key={i} onClick={() => setSelectedMood(i)} style={{
                    ...styles.moodChip,
                    background: selectedMood === i ? `${m.color}25` : 'rgba(45,49,66,0.04)',
                    border: selectedMood === i ? `2px solid ${m.color}` : '2px solid transparent',
                    transform: selectedMood === i ? 'scale(1.08)' : 'scale(1)',
                  }}>
                    <span style={{ fontSize: 24 }}>{m.emoji}</span>
                    <span style={styles.moodLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
              <textarea
                style={styles.moodNote}
                placeholder="How are you feeling? Any thoughts to share..."
                value={moodNote}
                onChange={e => setMoodNote(e.target.value)}
                rows={3}
              />
              <button
                style={{ ...styles.checkinBtn, background: checkedIn ? '#7B9E87' : '#2D3142' }}
                onClick={handleCheckin}
              >
                {checkedIn ? '✅ Check-in saved!' : 'Save check-in'}
              </button>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Weekly mood trend</span>
              </div>
              <div style={styles.weekChart}>
                {weeklyMoods.map((val, i) => (
                  <div key={i} style={styles.weekBarWrap}>
                    <div style={styles.weekBarBg}>
                      <div style={{ ...styles.weekBarFill, height: `${(val / 5) * 100}%`, background: moods[val - 1].color }} />
                    </div>
                    <span style={styles.weekDay}>{weekDays[i]}</span>
                    <span style={styles.weekEmoji}>{moods[val - 1].emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...styles.card, background: '#2D3142' }}>
              <div style={styles.insightHeader}>
                <span style={styles.insightIcon}>🤖</span>
                <span style={styles.insightTitle}>AI Insight</span>
              </div>
              <p style={styles.insightText}>
                Based on your patterns, you tend to feel most productive on <strong style={{ color: '#7B9E87' }}>Wednesday and Saturday mornings</strong>. Your mood has been trending upward this week — keep it up! 🌱
              </p>
              <button style={styles.chatBtn} onClick={() => navigate('/chat')}>
                Chat with AI assistant →
              </button>
            </div>
          </div>

          <div style={styles.rightCol}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Today's tasks</span>
                <span style={styles.taskCount}>{completedTasks}/{totalTasks} done</span>
              </div>
              <div style={styles.progressBg}>
                <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
              </div>
              <p style={styles.progressLabel}>{progressPct}% complete</p>
              <div style={styles.addTaskRow}>
                <input
                  style={styles.taskInput}
                  placeholder="Add a new task..."
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <select style={styles.prioritySelect} value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <button style={styles.addBtn} onClick={addTask}>+</button>
              </div>
              <div style={styles.taskList}>
                {tasks.map(task => (
                  <div key={task.id} style={{ ...styles.taskItem, opacity: task.done ? 0.5 : 1 }}>
                    <div
                      style={{ ...styles.taskCheck, background: task.done ? '#7B9E87' : 'transparent', borderColor: task.done ? '#7B9E87' : 'rgba(45,49,66,0.2)' }}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.done && <span style={{ color: '#fff', fontSize: 10 }}>✓</span>}
                    </div>
                    <div style={styles.taskBody}>
                      <span style={{ ...styles.taskText, textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
                      <div style={styles.taskMeta}>
                        <span style={styles.taskTime}>🕐 {task.time}</span>
                        <span style={{ ...styles.priorityBadge, background: priorityColor[task.priority].bg, color: priorityColor[task.priority].text }}>{task.priority}</span>
                      </div>
                    </div>
                    <div style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>×</div>
                  </div>
                ))}
              </div>
            </div>
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
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: 400, cursor: 'pointer', transition: 'all 0.2s' },
  sidebarBottom: { borderTop: '1px solid rgba(45,49,66,0.08)', paddingTop: 16 },
  userCard: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  userAvatar: { width: 36, height: 36, borderRadius: '50%', background: 'rgba(123,158,135,0.2)', color: '#4A6741', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 },
  userName: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
  userEmail: { fontSize: 11, color: '#2D3142', opacity: 0.5 },
  logoutBtn: { fontSize: 12, color: '#2D3142', opacity: 0.4, cursor: 'pointer', paddingLeft: 4 },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, color: '#2D3142', marginBottom: 4 },
  pageDate: { fontSize: 13, color: '#2D3142', opacity: 0.5 },
  topBarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  streakBadge: { background: 'rgba(232,180,160,0.2)', border: '1px solid rgba(232,180,160,0.4)', borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 500, color: '#C0663A' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: { background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(45,49,66,0.07)' },
  statLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 6, fontWeight: 500 },
  statValue: { fontSize: 26, fontWeight: 600, color: '#2D3142', marginBottom: 4, fontFamily: "'Playfair Display', serif" },
  statSub: { fontSize: 11, color: '#7B9E87', fontWeight: 500 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  leftCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  rightCol: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: { background: '#fff', borderRadius: 16, padding: '22px', border: '1px solid rgba(45,49,66,0.07)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  cardTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142' },
  checkedBadge: { fontSize: 11, color: '#4A6741', background: 'rgba(74,103,65,0.1)', padding: '3px 8px', borderRadius: 8 },
  moodRow: { display: 'flex', gap: 8, marginBottom: 16 },
  moodChip: { flex: 1, borderRadius: 12, padding: '12px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' },
  moodLabel: { display: 'block', fontSize: 10, fontWeight: 500, color: '#2D3142', opacity: 0.6, marginTop: 4 },
  moodNote: { width: '100%', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', padding: '10px 12px', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', resize: 'none', outline: 'none', marginBottom: 12, background: '#F7F3EE' },
  checkinBtn: { width: '100%', padding: '11px', borderRadius: 24, border: 'none', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.3s' },
  weekChart: { display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 16 },
  weekBarWrap: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  weekBarBg: { width: '100%', height: 80, background: 'rgba(45,49,66,0.05)', borderRadius: 6, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' },
  weekBarFill: { width: '100%', borderRadius: 6, transition: 'height 0.5s' },
  weekDay: { fontSize: 10, color: '#2D3142', opacity: 0.4 },
  weekEmoji: { fontSize: 12 },
  insightHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  insightIcon: { fontSize: 18 },
  insightTitle: { fontSize: 14, fontWeight: 500, color: '#fff' },
  insightText: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 16 },
  chatBtn: { background: 'rgba(123,158,135,0.2)', border: '1px solid rgba(123,158,135,0.3)', color: '#7B9E87', padding: '9px 16px', borderRadius: 20, fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  taskCount: { fontSize: 12, color: '#7B9E87', fontWeight: 500 },
  progressBg: { height: 6, background: 'rgba(45,49,66,0.08)', borderRadius: 3, marginBottom: 6 },
  progressFill: { height: '100%', background: '#7B9E87', borderRadius: 3, transition: 'width 0.4s' },
  progressLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 16 },
  addTaskRow: { display: 'flex', gap: 8, marginBottom: 16 },
  taskInput: { flex: 1, padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', outline: 'none', background: '#F7F3EE' },
  prioritySelect: { padding: '9px 8px', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', background: '#F7F3EE', outline: 'none' },
  addBtn: { width: 36, height: 36, borderRadius: 10, border: 'none', background: '#2D3142', color: '#fff', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" },
  taskList: { display: 'flex', flexDirection: 'column', gap: 10 },
  taskItem: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px', borderRadius: 12, background: '#F7F3EE', transition: 'opacity 0.3s' },
  taskCheck: { width: 20, height: 20, borderRadius: 6, border: '2px solid', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, transition: 'all 0.2s' },
  taskBody: { flex: 1 },
  taskText: { fontSize: 13, color: '#2D3142', fontWeight: 400, display: 'block', marginBottom: 4 },
  taskMeta: { display: 'flex', alignItems: 'center', gap: 8 },
  taskTime: { fontSize: 11, color: '#2D3142', opacity: 0.4 },
  priorityBadge: { fontSize: 10, fontWeight: 500, padding: '2px 7px', borderRadius: 6 },
  deleteBtn: { fontSize: 16, color: '#2D3142', opacity: 0.25, cursor: 'pointer', lineHeight: 1, paddingTop: 2, transition: 'opacity 0.2s' },
}
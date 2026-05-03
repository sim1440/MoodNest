import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { db, app } from '../firebase/firebase'
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'

const auth = getAuth(app)

const categories = ['All', 'Work', 'Wellness', 'Personal']
const priorities = ['all', 'high', 'medium', 'low']

const priorityColor = {
  high: { bg: 'rgba(232,90,90,0.1)', text: '#C0392B' },
  medium: { bg: 'rgba(196,184,232,0.2)', text: '#6B5BA0' },
  low: { bg: 'rgba(123,158,135,0.15)', text: '#4A6741' },
}

const categoryColor = {
  Work: { bg: 'rgba(107,127,163,0.12)', text: '#4A5F82' },
  Wellness: { bg: 'rgba(123,158,135,0.12)', text: '#4A6741' },
  Personal: { bg: 'rgba(232,180,160,0.2)', text: '#A0522D' },
}

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [newTask, setNewTask] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newCategory, setNewCategory] = useState('Work')
  const [newDue, setNewDue] = useState('Today')
  const [showAdd, setShowAdd] = useState(false)
  const user = auth.currentUser

  useEffect(() => {
    if (!user) return
    const loadTasks = async () => {
      const q = query(collection(db, 'tasks'), where('uid', '==', user.uid))
      const snap = await getDocs(q)
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    loadTasks()
  }, [user])

  const filtered = tasks.filter(t => {
    const catMatch = filter === 'All' || t.category === filter
    const priMatch = priorityFilter === 'all' || t.priority === priorityFilter
    return catMatch && priMatch
  })

  const todayTasks = filtered.filter(t => t.due === 'Today' || !t.due)
  const tomorrowTasks = filtered.filter(t => t.due === 'Tomorrow')
  const doneTasks = tasks.filter(t => t.done).length
  const totalTasks = tasks.length

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    await updateDoc(doc(db, 'tasks', id), { done: !task.done })
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id))
    setTasks(tasks.filter(t => t.id !== id))
  }

  const addTask = async () => {
    if (!newTask.trim() || !user) return
    const newT = { text: newTask, priority: newPriority, done: false, time: 'Anytime', category: newCategory, due: newDue, uid: user.uid }
    const docRef = await addDoc(collection(db, 'tasks'), newT)
    setTasks([...tasks, { id: docRef.id, ...newT }])
    setNewTask('')
    setShowAdd(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const TaskItem = ({ task }) => (
    <div style={{ ...styles.taskItem, opacity: task.done ? 0.55 : 1, borderLeft: `3px solid ${task.done ? '#ccc' : priorityColor[task.priority].text}` }}>
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
          <span style={{ ...styles.badge, background: priorityColor[task.priority].bg, color: priorityColor[task.priority].text }}>{task.priority}</span>
          <span style={{ ...styles.badge, background: categoryColor[task.category]?.bg || '#eee', color: categoryColor[task.category]?.text || '#333' }}>{task.category}</span>
        </div>
      </div>
      <div style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>×</div>
    </div>
  )

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}><div style={styles.logoDot} />MoodNest</div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', path: '/chat' },
            { icon: '📊', label: 'Analytics', path: '/analytics' },
            { icon: '✅', label: 'Tasks', path: '/tasks', active: true },
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
              <div style={styles.userSub}>7 day streak 🔥</div>
            </div>
          </div>
          <div style={styles.logoutBtn} onClick={handleLogout}>← Log out</div>
        </div>
      </div>

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Task Manager ✅</h1>
            <p style={styles.pageDate}>{new Date().toDateString()}</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>+ Add task</button>
        </div>

        <div style={styles.statsRow}>
          {[
            { label: 'Total tasks', value: totalTasks },
            { label: 'Completed', value: doneTasks },
            { label: 'Remaining', value: totalTasks - doneTasks },
            { label: 'Completion rate', value: totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}%` : '0%' },
          ].map((s, i) => (
            <div key={i} style={styles.statCard}>
              <div style={styles.statLabel}>{s.label}</div>
              <div style={styles.statValue}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={styles.progressCard}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>Overall progress</span>
            <span style={styles.progressPct}>{totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}% complete</span>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill, width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }} />
          </div>
        </div>

        {showAdd && (
          <div style={styles.addForm}>
            <div style={styles.addFormTitle}>New task</div>
            <input style={styles.addInput} placeholder="What do you need to do?" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} autoFocus />
            <div style={styles.addFormRow}>
              <select style={styles.select} value={newPriority} onChange={e => setNewPriority(e.target.value)}>
                <option value="high">🔴 High priority</option>
                <option value="medium">🟣 Medium priority</option>
                <option value="low">🟢 Low priority</option>
              </select>
              <select style={styles.select} value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                <option value="Work">💼 Work</option>
                <option value="Wellness">🌿 Wellness</option>
                <option value="Personal">👤 Personal</option>
              </select>
              <select style={styles.select} value={newDue} onChange={e => setNewDue(e.target.value)}>
                <option value="Today">📅 Today</option>
                <option value="Tomorrow">📆 Tomorrow</option>
              </select>
              <button style={styles.saveBtn} onClick={addTask}>Save task</button>
              <button style={styles.cancelBtn} onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            {categories.map(c => (
              <button key={c} style={{ ...styles.filterBtn, background: filter === c ? '#2D3142' : 'transparent', color: filter === c ? '#fff' : '#2D3142', opacity: filter === c ? 1 : 0.5 }} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div style={styles.filterGroup}>
            {priorities.map(p => (
              <button key={p} style={{ ...styles.filterBtn, background: priorityFilter === p ? '#2D3142' : 'transparent', color: priorityFilter === p ? '#fff' : '#2D3142', opacity: priorityFilter === p ? 1 : 0.5, textTransform: 'capitalize' }} onClick={() => setPriorityFilter(p)}>{p === 'all' ? 'All priorities' : p}</button>
            ))}
          </div>
        </div>

        <div style={styles.taskSections}>
          {todayTasks.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>📅 Today</span>
                <span style={styles.sectionCount}>{todayTasks.filter(t => t.done).length}/{todayTasks.length} done</span>
              </div>
              <div style={styles.taskList}>{todayTasks.map(task => <TaskItem key={task.id} task={task} />)}</div>
            </div>
          )}
          {tomorrowTasks.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionTitle}>📆 Tomorrow</span>
                <span style={styles.sectionCount}>{tomorrowTasks.filter(t => t.done).length}/{tomorrowTasks.length} done</span>
              </div>
              <div style={styles.taskList}>{tomorrowTasks.map(task => <TaskItem key={task.id} task={task} />)}</div>
            </div>
          )}
          {filtered.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✅</div>
              <div style={styles.emptyText}>No tasks found for this filter</div>
              <button style={styles.emptyBtn} onClick={() => { setFilter('All'); setPriorityFilter('all') }}>Clear filters</button>
            </div>
          )}
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
  addBtn: { background: '#2D3142', color: '#fff', padding: '10px 20px', borderRadius: 24, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 },
  statCard: { background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(45,49,66,0.07)' },
  statLabel: { fontSize: 11, color: '#2D3142', opacity: 0.5, marginBottom: 6 },
  statValue: { fontSize: 26, fontWeight: 600, color: '#2D3142', fontFamily: "'Playfair Display', serif" },
  progressCard: { background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid rgba(45,49,66,0.07)', marginBottom: 20 },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
  progressPct: { fontSize: 13, color: '#7B9E87', fontWeight: 500 },
  progressBg: { height: 8, background: 'rgba(45,49,66,0.08)', borderRadius: 4 },
  progressFill: { height: '100%', background: '#7B9E87', borderRadius: 4, transition: 'width 0.4s' },
  addForm: { background: '#fff', borderRadius: 16, padding: '20px', border: '1px solid rgba(45,49,66,0.1)', marginBottom: 20 },
  addFormTitle: { fontSize: 14, fontWeight: 500, color: '#2D3142', marginBottom: 12 },
  addInput: { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', outline: 'none', background: '#F7F3EE', marginBottom: 12 },
  addFormRow: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  select: { padding: '9px 10px', borderRadius: 10, border: '1px solid rgba(45,49,66,0.12)', fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', background: '#F7F3EE', outline: 'none', cursor: 'pointer' },
  saveBtn: { background: '#2D3142', color: '#fff', padding: '9px 18px', borderRadius: 20, border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  cancelBtn: { background: 'transparent', color: '#2D3142', padding: '9px 14px', borderRadius: 20, border: '1px solid rgba(45,49,66,0.15)', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: 0.6 },
  filtersRow: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' },
  filterGroup: { display: 'flex', gap: 4, background: '#fff', borderRadius: 12, padding: 4, border: '1px solid rgba(45,49,66,0.07)' },
  filterBtn: { padding: '7px 14px', borderRadius: 9, border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s' },
  taskSections: { display: 'flex', flexDirection: 'column', gap: 28 },
  section: {},
  sectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 500, color: '#2D3142' },
  sectionCount: { fontSize: 12, color: '#7B9E87', fontWeight: 500 },
  taskList: { display: 'flex', flexDirection: 'column', gap: 8 },
  taskItem: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 12, background: '#fff', border: '1px solid rgba(45,49,66,0.06)', transition: 'opacity 0.3s' },
  taskCheck: { width: 20, height: 20, borderRadius: 6, border: '2px solid', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, transition: 'all 0.2s' },
  taskBody: { flex: 1 },
  taskText: { fontSize: 14, color: '#2D3142', display: 'block', marginBottom: 6 },
  taskMeta: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  taskTime: { fontSize: 11, color: '#2D3142', opacity: 0.4 },
  badge: { fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 6 },
  deleteBtn: { fontSize: 18, color: '#2D3142', opacity: 0.2, cursor: 'pointer', lineHeight: 1, paddingTop: 1 },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#2D3142', opacity: 0.5, marginBottom: 16 },
  emptyBtn: { background: '#2D3142', color: '#fff', padding: '10px 20px', borderRadius: 20, border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
}
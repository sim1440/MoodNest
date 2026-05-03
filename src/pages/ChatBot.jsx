import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { db, app } from '../firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

const auth = getAuth(app)

const suggestions = [
  "Why do I feel anxious when I'm productive?",
  "Help me plan my day",
  "I'm feeling overwhelmed today",
  "Give me a mood boost",
  "How can I stop procrastinating?",
  "I need help prioritizing my tasks",
]

export default function ChatBot() {
  const navigate = useNavigate()
  const user = auth.currentUser
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      text: `Hi ${user?.email?.split('@')[0] || 'there'}! 🌿 I'm Nest, your personal well-being assistant. How are you feeling today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [moodHistory, setMoodHistory] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const q = query(collection(db, 'moods'), where('uid', '==', user.uid))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => d.data())
      data.sort((a, b) => new Date(a.date) - new Date(b.date))
      setMoodHistory(data.slice(-7))
    }
    load()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const sendMessage = async (text) => {
    const userMsg = text || input
    if (!userMsg.trim()) return

    const newMsg = {
      id: Date.now(),
      role: 'user',
      text: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    try {
      const moodContext = moodHistory.length > 0
        ? `User's recent mood check-ins: ${moodHistory.map(m => `${m.mood} (${new Date(m.date).toLocaleDateString()})`).join(', ')}. ${moodHistory[moodHistory.length-1]?.note ? `Latest note: "${moodHistory[moodHistory.length-1].note}"` : ''}`
        : 'No mood history yet.'

      const conversationHistory = messages
        .filter(m => m.id !== 1)
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are Nest, a warm and empathetic AI well-being assistant built into MoodNest, a mood tracking app. You help users understand their emotions, manage tasks, and improve their mental wellness. Keep responses concise (2-4 sentences), warm, and actionable. ${moodContext}`,
          messages: [
            ...conversationHistory,
            { role: 'user', content: userMsg }
          ],
        })
      })

      const data = await response.json()
      const botText = data.content?.[0]?.text || "I'm here for you. Could you tell me more about how you're feeling?"

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm having trouble connecting right now. Please try again in a moment 🌿",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    }
    setIsTyping(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}><div style={styles.logoDot} />MoodNest</div>
        <nav style={styles.sidebarNav}>
          {[
            { icon: '🏠', label: 'Dashboard', path: '/dashboard' },
            { icon: '💬', label: 'AI Chatbot', path: '/chat', active: true },
            { icon: '📊', label: 'Analytics', path: '/analytics' },
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

      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          <div style={styles.botInfo}>
            <div style={styles.botAvatar}>🌿</div>
            <div>
              <div style={styles.botName}>Nest — AI Assistant</div>
              <div style={styles.botStatus}><div style={styles.onlineDot} />Always here for you</div>
            </div>
          </div>
          <div style={styles.headerBadge}>Powered by Claude AI 🤖</div>
        </div>

        <div style={styles.messages}>
          <div style={styles.dateDivider}>
            <div style={styles.dateLine} />
            <span style={styles.dateText}>{new Date().toDateString()}</span>
            <div style={styles.dateLine} />
          </div>

          {messages.map(msg => (
            <div key={msg.id} style={{ ...styles.msgRow, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
              {msg.role === 'bot' && <div style={styles.botAvatarSmall}>🌿</div>}
              <div style={{ ...styles.bubble, background: msg.role === 'user' ? '#2D3142' : '#fff', color: msg.role === 'user' ? '#fff' : '#2D3142', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', boxShadow: msg.role === 'bot' ? '0 2px 8px rgba(45,49,66,0.07)' : 'none' }}>
                <p style={styles.bubbleText}>{msg.text}</p>
                <span style={{ ...styles.bubbleTime, color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : 'rgba(45,49,66,0.35)' }}>{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div style={styles.msgRow}>
              <div style={styles.botAvatarSmall}>🌿</div>
              <div style={{ ...styles.bubble, background: '#fff', boxShadow: '0 2px 8px rgba(45,49,66,0.07)' }}>
                <div style={styles.typingDots}>
                  <div style={{ ...styles.dot, animationDelay: '0s' }} />
                  <div style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <div style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length < 3 && (
          <div style={styles.suggestions}>
            {suggestions.map((s, i) => (
              <button key={i} style={styles.suggestionChip} onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        <div style={styles.inputArea}>
          <input
            style={styles.input}
            placeholder="Share how you're feeling or ask for help..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            style={{ ...styles.sendBtn, background: input.trim() ? '#2D3142' : 'rgba(45,49,66,0.1)', cursor: input.trim() ? 'pointer' : 'default' }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
          >↑</button>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.panelTitle}>Your mood snapshot</div>
        <div style={styles.moodSnapshot}>
          {moodHistory.length > 0 ? moodHistory.slice(-7).map((m, i) => (
            <div key={i} style={styles.snapshotDay}>
              <div style={{ ...styles.snapshotDot, background: ['#E8B4A0','#C4B8E8','#7B9E87','#4A6741','#6B7FA3'][m.moodValue - 1] }} />
              <span style={styles.snapshotEmoji}>{['😔','😐','🙂','😄','🤩'][m.moodValue - 1]}</span>
              <span style={styles.snapshotDayLabel}>{new Date(m.date).toLocaleDateString('en', { weekday: 'short' })}</span>
            </div>
          )) : <span style={{ fontSize: 12, color: '#2D3142', opacity: 0.4 }}>No check-ins yet</span>}
        </div>

        <div style={styles.divider} />
        <div style={styles.panelTitle}>Suggested topics</div>
        <div style={styles.topicList}>
          {[
            { icon: '😮‍💨', label: 'Managing stress' },
            { icon: '🎯', label: 'Focus techniques' },
            { icon: '😴', label: 'Sleep & recovery' },
            { icon: '🏃', label: 'Building habits' },
            { icon: '🧠', label: 'Mindfulness' },
            { icon: '📅', label: 'Time management' },
          ].map((t, i) => (
            <div key={i} style={styles.topicChip} onClick={() => sendMessage(`Tell me about ${t.label.toLowerCase()}`)}>
              <span>{t.icon}</span>
              <span style={styles.topicLabel}>{t.label}</span>
            </div>
          ))}
        </div>

        <div style={styles.divider} />
        <div style={styles.panelTitle}>This week</div>
        <div style={styles.weekStats}>
          {[
            { label: 'Check-ins', value: `${moodHistory.length} / 7` },
            { label: 'Avg mood', value: moodHistory.length > 0 ? `${(moodHistory.reduce((a,b) => a + b.moodValue, 0) / moodHistory.length).toFixed(1)} / 5` : '— / 5' },
          ].map((s, i) => (
            <div key={i} style={styles.weekStat}>
              <span style={styles.weekStatLabel}>{s.label}</span>
              <span style={styles.weekStatValue}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: { display: 'flex', height: '100vh', background: '#F7F3EE', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden' },
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
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { background: '#fff', borderBottom: '1px solid rgba(45,49,66,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  botInfo: { display: 'flex', alignItems: 'center', gap: 12 },
  botAvatar: { width: 44, height: 44, borderRadius: '50%', background: 'rgba(123,158,135,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  botName: { fontSize: 15, fontWeight: 500, color: '#2D3142', marginBottom: 3 },
  botStatus: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2D3142', opacity: 0.5 },
  onlineDot: { width: 7, height: 7, borderRadius: '50%', background: '#7B9E87' },
  headerBadge: { background: 'rgba(123,158,135,0.12)', border: '1px solid rgba(123,158,135,0.2)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#4A6741' },
  messages: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 },
  dateDivider: { display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' },
  dateLine: { flex: 1, height: 1, background: 'rgba(45,49,66,0.08)' },
  dateText: { fontSize: 11, color: '#2D3142', opacity: 0.4, whiteSpace: 'nowrap' },
  msgRow: { display: 'flex', alignItems: 'flex-end', gap: 10 },
  botAvatarSmall: { width: 32, height: 32, borderRadius: '50%', background: 'rgba(123,158,135,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  bubble: { maxWidth: '65%', padding: '12px 16px', borderRadius: 18 },
  bubbleText: { fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 4 },
  bubbleTime: { fontSize: 10 },
  typingDots: { display: 'flex', gap: 4, padding: '4px 0' },
  dot: { width: 7, height: 7, borderRadius: '50%', background: 'rgba(45,49,66,0.25)', animation: 'bounce 0.8s ease-in-out infinite' },
  suggestions: { padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 },
  suggestionChip: { background: '#fff', border: '1px solid rgba(45,49,66,0.12)', borderRadius: 20, padding: '7px 14px', fontSize: 12, color: '#2D3142', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
  inputArea: { padding: '16px 24px', background: '#fff', borderTop: '1px solid rgba(45,49,66,0.08)', display: 'flex', gap: 10, alignItems: 'center' },
  input: { flex: 1, padding: '12px 16px', borderRadius: 24, border: '1px solid rgba(45,49,66,0.12)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: '#2D3142', outline: 'none', background: '#F7F3EE' },
  sendBtn: { width: 42, height: 42, borderRadius: '50%', border: 'none', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' },
  rightPanel: { width: 240, background: '#fff', borderLeft: '1px solid rgba(45,49,66,0.08)', padding: '24px 16px', overflowY: 'auto', flexShrink: 0 },
  panelTitle: { fontSize: 11, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#7B9E87', marginBottom: 14 },
  moodSnapshot: { display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 4 },
  snapshotDay: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 },
  snapshotDot: { width: 6, height: 6, borderRadius: '50%' },
  snapshotEmoji: { fontSize: 14 },
  snapshotDayLabel: { fontSize: 9, color: '#2D3142', opacity: 0.4 },
  divider: { height: 1, background: 'rgba(45,49,66,0.07)', margin: '16px 0' },
  topicList: { display: 'flex', flexDirection: 'column', gap: 6 },
  topicChip: { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10, background: '#F7F3EE', cursor: 'pointer', fontSize: 13 },
  topicLabel: { fontSize: 13, color: '#2D3142', opacity: 0.7 },
  weekStats: { display: 'flex', flexDirection: 'column', gap: 10 },
  weekStat: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  weekStatLabel: { fontSize: 12, color: '#2D3142', opacity: 0.5 },
  weekStatValue: { fontSize: 13, fontWeight: 500, color: '#2D3142' },
}
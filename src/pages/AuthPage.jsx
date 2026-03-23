import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
    }, 1500)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div style={styles.page}>

      {/* Left Panel */}
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.logo}>
            <div style={styles.logoDot} />
            MoodNest
          </div>
          <div style={styles.tagline}>
            <h1 style={styles.taglineH1}>Your mood.<br /><em style={{ color: '#7B9E87' }}>Understood.</em></h1>
            <p style={styles.taglineSub}>Track your emotions, manage your tasks, and let AI guide you to better days.</p>
          </div>

          {/* Mood preview card */}
          <div style={styles.previewCard}>
            <div style={styles.previewHeader}>
              <span style={styles.previewTitle}>Today's check-in</span>
              <span style={styles.previewDate}>Sun, Mar 22</span>
            </div>
            <div style={styles.moodRow}>
              {['😔','😐','🙂','😄','🤩'].map((emoji, i) => (
                <div key={i} style={{
                  ...styles.moodChip,
                  background: i === 2 ? 'rgba(123,158,135,0.2)' : 'rgba(45,49,66,0.04)',
                  border: i === 2 ? '1.5px solid #7B9E87' : '1.5px solid transparent',
                }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                </div>
              ))}
            </div>
            <div style={styles.insightChip}>
              🌱 You've been consistent for <strong>7 days</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.right}>
        <div style={styles.formWrap}>

          {/* Tab switcher */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }}
              onClick={() => setIsLogin(true)}
            >
              Log in
            </button>
            <button
              style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }}
              onClick={() => setIsLogin(false)}
            >
              Sign up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h2 style={styles.formTitle}>
                {isLogin ? 'Welcome back 🌿' : 'Create your nest 🪺'}
              </h2>
              <p style={styles.formSub}>
                {isLogin
                  ? 'Log in to continue your mood journey.'
                  : 'Join MoodNest and start understanding yourself better.'}
              </p>

              <form onSubmit={handleSubmit} style={styles.form}>

                {!isLogin && (
                  <div style={styles.field}>
                    <label style={styles.label}>Full name</label>
                    <input
                      style={styles.input}
                      type="text"
                      name="name"
                      placeholder="Harsimran Kaur"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div style={styles.field}>
                  <label style={styles.label}>Email address</label>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {isLogin && (
                  <div style={{ textAlign: 'right', marginBottom: 8 }}>
                    <a href="#" style={styles.forgotLink}>Forgot password?</a>
                  </div>
                )}

                <button
                  type="submit"
                  style={{
                    ...styles.submitBtn,
                    background: loading ? '#7B9E87' : '#2D3142',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : isLogin ? 'Log in to MoodNest' : 'Create my account'}
                </button>

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={styles.successMsg}
                  >
                    ✅ {isLogin ? 'Logged in successfully!' : 'Account created! Welcome to MoodNest 🌱'}
                  </motion.div>
                )}

              </form>

              <p style={styles.switchText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span
                  style={styles.switchLink}
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </span>
              </p>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
  },
  left: {
    flex: 1,
    background: '#2D3142',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  leftInner: {
    maxWidth: 420,
    width: '100%',
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 24,
    fontWeight: 600,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 48,
  },
  logoDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#E8B4A0',
  },
  taglineH1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 44,
    fontWeight: 600,
    color: '#fff',
    lineHeight: 1.15,
    marginBottom: 16,
    letterSpacing: '-0.5px',
  },
  taglineSub: {
    fontSize: 15,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.7,
    marginBottom: 40,
  },
  previewCard: {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '20px',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  previewDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  moodRow: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  moodChip: {
    flex: 1,
    borderRadius: 10,
    padding: '10px 4px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  insightChip: {
    background: 'rgba(123,158,135,0.15)',
    border: '1px solid rgba(123,158,135,0.3)',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 1.5,
  },
  right: {
    flex: 1,
    background: '#F7F3EE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  formWrap: {
    width: '100%',
    maxWidth: 400,
  },
  tabs: {
    display: 'flex',
    background: 'rgba(45,49,66,0.07)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: 9,
    background: 'transparent',
    fontSize: 14,
    fontWeight: 400,
    color: '#2D3142',
    opacity: 0.5,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabActive: {
    background: '#fff',
    opacity: 1,
    fontWeight: 500,
    boxShadow: '0 1px 4px rgba(45,49,66,0.1)',
  },
  formTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 600,
    color: '#2D3142',
    marginBottom: 8,
  },
  formSub: {
    fontSize: 14,
    fontWeight: 300,
    color: '#2D3142',
    opacity: 0.55,
    marginBottom: 28,
    lineHeight: 1.6,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#2D3142',
    opacity: 0.7,
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid rgba(45,49,66,0.15)',
    background: '#fff',
    fontSize: 14,
    color: '#2D3142',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border 0.2s',
  },
  forgotLink: {
    fontSize: 12,
    color: '#7B9E87',
    textDecoration: 'none',
  },
  submitBtn: {
    padding: '13px',
    borderRadius: 26,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: 4,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'background 0.2s, transform 0.15s',
  },
  successMsg: {
    background: 'rgba(123,158,135,0.12)',
    border: '1px solid rgba(123,158,135,0.3)',
    borderRadius: 10,
    padding: '12px 14px',
    fontSize: 13,
    color: '#4A6741',
    textAlign: 'center',
  },
  switchText: {
    fontSize: 13,
    color: '#2D3142',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 24,
  },
  switchLink: {
    color: '#7B9E87',
    fontWeight: 500,
    cursor: 'pointer',
    opacity: 1,
  },
}
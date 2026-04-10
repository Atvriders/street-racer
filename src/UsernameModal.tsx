import { useState } from 'react'
import { useGameStore } from './store'
import './UsernameModal.css'

export function UsernameModal() {
  const setUsername = useGameStore(s => s.setUsername)
  const [value, setValue] = useState('')

  const trimmed = value.trim()
  const valid = trimmed.length >= 2 && trimmed.length <= 16

  const handleSubmit = () => {
    if (!valid) return
    setUsername(trimmed)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="username-overlay">
      <div className="username-modal">
        <div className="username-title">STREET RACER</div>
        <div className="username-subtitle">ENTER YOUR NAME</div>
        <input
          className="username-input"
          type="text"
          placeholder="DRIVER TAG"
          maxLength={16}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
        />
        {trimmed.length > 0 && trimmed.length < 2 && (
          <div className="username-error">Minimum 2 characters</div>
        )}
        <button
          className="username-start-btn"
          onClick={handleSubmit}
          disabled={!valid}
        >
          START RACING
        </button>
      </div>
    </div>
  )
}

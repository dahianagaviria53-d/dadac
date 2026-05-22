import { useState, useEffect, useRef, useCallback } from 'react'
import { HEROES, ENEMIES, WORLDS, HYPE_PHRASES, COMBO_PHRASES, MOTIVATION_PHRASES } from './gameData.js'
import {
  generateArithmetic,
  generateRiddle,
  generateTrinityQuestion,
  generateHint,
  pickWrongChoice,
  pickRandom,
} from './gameLogic.js'
import { sfx, initAudio, setMuted, isMuted } from './sounds.js'

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════
const POWER_CHARGE_PER_HIT = 50 // % cada acierto → llena en 2 aciertos
const TRINITY_EVERY = 4 // 1 desafío de la trinidad cada N preguntas
const COMBO_THRESHOLD = 3 // a partir de cuántos aciertos seguidos mostrar combo

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState('intro') // intro | world | battle | levelup | gameover | victory
  const [worldIdx, setWorldIdx] = useState(0)
  const [enemyIdx, setEnemyIdx] = useState(0)
  const [muted, setMutedState] = useState(false)

  // Estado del equipo
  const [team, setTeam] = useState({
    hp: 150,
    maxHp: 150,
    gold: 0,
    streak: 0,
    powers: { dahiana: 0, david: 0, cristian: 0 }, // % de cada barra
    eliminatedChoices: {}, // { questionId: [valor] }
    activeHint: null, // texto de la pista activa
  })

  // Estado del enemigo
  const [enemy, setEnemy] = useState(null)
  const [enemyShake, setEnemyShake] = useState(false)
  const [teamShake, setTeamShake] = useState(false)

  // Pregunta actual
  const [question, setQuestion] = useState(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [usedTrinityIds, setUsedTrinityIds] = useState([])
  const [isTrinity, setIsTrinity] = useState(false)

  // UI
  const [timeLeft, setTimeLeft] = useState(15)
  const [answered, setAnswered] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [hypeText, setHypeText] = useState(null)
  const [floatTexts, setFloatTexts] = useState([])

  const timerRef = useRef(null)
  const world = WORLDS[worldIdx]

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  const showHype = (text) => {
    setHypeText({ text, id: Date.now() })
    setTimeout(() => setHypeText(null), 1000)
  }

  const addFloatText = (text, kind, side) => {
    const id = Date.now() + Math.random()
    setFloatTexts((prev) => [...prev, { id, text, kind, side }])
    setTimeout(() => setFloatTexts((prev) => prev.filter((f) => f.id !== id)), 1200)
  }

  const toggleMute = () => {
    const newMuted = !muted
    setMutedState(newMuted)
    setMuted(newMuted)
    sfx.click()
  }

  // ─── INICIAR MUNDO ────────────────────────────────────────────────────────
  const startWorld = useCallback(() => {
    initAudio()
    setEnemyIdx(0)
    spawnEnemy(0)
    setQuestionCount(0)
    setIsTrinity(false)
    setScreen('battle')
  }, [worldIdx])

  const spawnEnemy = (idx) => {
    const enemyKey = world.enemies[idx]
    const base = ENEMIES[enemyKey]
    setEnemy({ ...base, hp: base.maxHp })
    setupNextQuestion(base)
    setTeam((t) => ({ ...t, activeHint: null }))
  }

  // ─── GENERAR PREGUNTA ─────────────────────────────────────────────────────
  const setupNextQuestion = (enemyData) => {
    const useEnemy = enemyData || enemy
    const newCount = questionCount + 1
    setQuestionCount(newCount)

    // ¿Es momento de Desafío de la Trinidad?
    const shouldBeTrinity = newCount > 0 && newCount % TRINITY_EVERY === 0
    let q
    if (shouldBeTrinity) {
      q = generateTrinityQuestion(usedTrinityIds)
      setUsedTrinityIds((prev) => [...prev, q.id])
      setIsTrinity(true)
      sfx.trinity()
      // Activar los 3 poderes automáticamente
      setTeam((t) => ({
        ...t,
        powers: { dahiana: 100, david: 100, cristian: 100 },
      }))
    } else {
      setIsTrinity(false)
      // Tipo de pregunta según mundo
      const types = world.questionTypes
      const type = pickRandom(types)
      if (type === 'riddle') {
        q = generateRiddle()
      } else if (type === 'mixed') {
        const r = Math.random()
        if (r < 0.4) q = generateRiddle()
        else if (r < 0.6 && usedTrinityIds.length < 8) q = generateTrinityQuestion(usedTrinityIds)
        else q = generateArithmetic('arithmetic_hard')
      } else {
        q = generateArithmetic(type)
      }
    }

    setQuestion(q)
    setSelectedChoice(null)
    setAnswered(false)
    setFeedback(null)
    if (world.timed) setTimeLeft(world.timer)
  }

  // ─── TIMER ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'battle' || answered || !world.timed) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeout()
          return 0
        }
        if (t <= 4) sfx.tick()
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [screen, question, answered, world.timed])

  const handleTimeout = () => {
    if (answered) return
    setAnswered(true)
    const dmg = Math.floor(Math.random() * (enemy.atk[1] - enemy.atk[0] + 1)) + enemy.atk[0]
    applyDamageToTeam(dmg, '⏱️ ¡Tiempo agotado!')
  }

  // ─── APLICAR DAÑO AL EQUIPO ───────────────────────────────────────────────
  const applyDamageToTeam = (dmg, msg) => {
    sfx.wrong()
    setTeamShake(true)
    setTimeout(() => setTeamShake(false), 600)
    addFloatText(`-${dmg}`, 'damage', 'team')
    setTeam((t) => ({ ...t, hp: Math.max(0, t.hp - dmg), streak: 0 }))
    setFeedback({ type: 'miss', msg: `${msg} El ${enemy.name} te golpea por ${dmg} de daño.` })

    setTimeout(() => {
      setTeam((t) => {
        if (t.hp <= 0) {
          sfx.gameover()
          setScreen('gameover')
        } else {
          setupNextQuestion()
        }
        return t
      })
    }, 1800)
  }

  // ─── RESPONDER ────────────────────────────────────────────────────────────
  const handleAnswer = (choice) => {
    if (answered) return
    clearInterval(timerRef.current)
    setAnswered(true)
    setSelectedChoice(choice)

    if (choice === question.answer) {
      handleCorrect()
    } else {
      handleIncorrect()
    }
  }

  const handleCorrect = () => {
    sfx.correct()
    const newStreak = team.streak + 1
    const isTrinityHit = isTrinity
    const baseDmg = isTrinityHit ? 80 : 30 + Math.floor(Math.random() * 20)
    const streakBonus = newStreak >= 3 ? 10 + newStreak * 2 : 0
    const totalDmg = baseDmg + streakBonus

    // Aplicar daño al enemigo
    setEnemyShake(true)
    setTimeout(() => setEnemyShake(false), 600)
    addFloatText(`-${totalDmg}`, streakBonus > 0 ? 'crit' : 'damage', 'enemy')
    sfx.hit()

    // Hype text
    showHype(pickRandom(HYPE_PHRASES))

    // Combo
    if (newStreak >= COMBO_THRESHOLD && COMBO_PHRASES[newStreak]) {
      setTimeout(() => sfx.combo(), 300)
    }

    const newEnemyHp = Math.max(0, enemy.hp - totalDmg)
    setEnemy((e) => ({ ...e, hp: newEnemyHp }))

    // Cargar poderes (excepto en Trinity que ya están al 100%)
    if (!isTrinityHit) {
      setTeam((t) => ({
        ...t,
        streak: newStreak,
        powers: {
          dahiana: Math.min(100, t.powers.dahiana + POWER_CHARGE_PER_HIT),
          david: Math.min(100, t.powers.david + POWER_CHARGE_PER_HIT),
          cristian: Math.min(100, t.powers.cristian + POWER_CHARGE_PER_HIT),
        },
      }))
    } else {
      setTeam((t) => ({ ...t, streak: newStreak }))
    }

    setFeedback({
      type: 'hit',
      msg: `⚔️ ¡Correcto! Inflingen ${totalDmg} de daño${streakBonus > 0 ? ` (+${streakBonus} combo)` : ''}.`,
    })

    if (newEnemyHp <= 0) {
      // Enemigo derrotado
      const goldGain = enemy.reward + (isTrinityHit ? 100 : 0)
      const hpHeal = isTrinityHit ? 30 : 0
      setTimeout(() => {
        sfx.enemyDeath()
        setTeam((t) => ({
          ...t,
          gold: t.gold + goldGain,
          hp: Math.min(t.maxHp, t.hp + hpHeal),
        }))
        showHype('¡VICTORIA!')
        setFeedback({
          type: 'hit',
          msg: `💀 ¡${enemy.name} derrotado! +${goldGain} oro${hpHeal ? ` y +${hpHeal} HP` : ''}.`,
        })
        setTimeout(advanceEnemy, 2000)
      }, 600)
    } else {
      setTimeout(setupNextQuestion, 1800)
    }
  }

  const handleIncorrect = () => {
    const dmg = Math.floor(Math.random() * (enemy.atk[1] - enemy.atk[0] + 1)) + enemy.atk[0]
    applyDamageToTeam(dmg, `❌ Era ${question.answer}.`)

    // Mensaje motivador en rachas de fallos
    if (team.streak === 0 && Math.random() < 0.3) {
      setTimeout(() => {
        setFeedback((f) => f ? { ...f, msg: f.msg + ' ' + pickRandom(MOTIVATION_PHRASES) } : f)
      }, 800)
    }
  }

  // ─── PODERES ──────────────────────────────────────────────────────────────
  const usePower = (heroId) => {
    if (team.powers[heroId] < 100 || answered) return
    sfx.powerUp()

    if (heroId === 'dahiana') {
      // Eliminar respuesta incorrecta
      const wrong = pickWrongChoice(question)
      setTeam((t) => ({
        ...t,
        powers: { ...t.powers, dahiana: 0 },
        eliminatedChoices: {
          ...t.eliminatedChoices,
          current: [...(t.eliminatedChoices.current || []), wrong],
        },
      }))
      showHype('✨ ¡VISIÓN ARITMÉTICA!')
    } else if (heroId === 'david') {
      // Saltar pregunta
      setTeam((t) => ({
        ...t,
        powers: { ...t.powers, david: 0 },
        eliminatedChoices: { ...t.eliminatedChoices, current: [] },
      }))
      showHype('⏭️ ¡DRENAJE ARCANO!')
      setFeedback({ type: 'hit', msg: '⏭️ Pregunta omitida sin daño.' })
      setTimeout(() => setupNextQuestion(), 1200)
    } else if (heroId === 'cristian') {
      // Revelar pista
      const hint = generateHint(question)
      setTeam((t) => ({
        ...t,
        powers: { ...t.powers, cristian: 0 },
        activeHint: hint,
      }))
      showHype('📜 ¡REVELACIÓN DEL SABIO!')
    }
  }

  // ─── AVANZAR ──────────────────────────────────────────────────────────────
  const advanceEnemy = () => {
    const next = enemyIdx + 1
    if (next < world.enemies.length) {
      setEnemyIdx(next)
      spawnEnemy(next)
      setTeam((t) => ({ ...t, eliminatedChoices: {}, activeHint: null }))
    } else {
      // Mundo completado
      if (worldIdx + 1 < WORLDS.length) {
        setScreen('levelup')
      } else {
        sfx.victory()
        setScreen('victory')
      }
    }
  }

  const nextWorld = () => {
    setWorldIdx((w) => w + 1)
    setTeam((t) => ({
      ...t,
      hp: Math.min(t.maxHp, t.hp + 50),
      streak: 0,
      eliminatedChoices: {},
      activeHint: null,
    }))
    setEnemyIdx(0)
    setQuestionCount(0)
    setIsTrinity(false)
    setScreen('world')
  }

  const restart = () => {
    setWorldIdx(0)
    setEnemyIdx(0)
    setQuestionCount(0)
    setUsedTrinityIds([])
    setIsTrinity(false)
    setTeam({
      hp: 150,
      maxHp: 150,
      gold: 0,
      streak: 0,
      powers: { dahiana: 0, david: 0, cristian: 0 },
      eliminatedChoices: {},
      activeHint: null,
    })
    setEnemy(null)
    setQuestion(null)
    setFeedback(null)
    setScreen('intro')
  }

  // ─── HELPERS DE RENDER ────────────────────────────────────────────────────
  const hpPercent = (hp, max) => Math.max(0, Math.min(100, (hp / max) * 100))
  const hpColor = (pct) => (pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#ef4444')

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <div className="app-root">
      <div className="app-bg" />

      {/* Partículas decorativas */}
      <Particles />

      {/* Botón mute */}
      <button className="mute-btn" onClick={toggleMute} title={muted ? 'Activar sonido' : 'Silenciar'}>
        {muted ? '🔇' : '🔊'}
      </button>

      {/* Hype text flotante */}
      {hypeText && <div className="hype-text" key={hypeText.id}>{hypeText.text}</div>}

      {/* INTRO ───────────────────────────────────────────────────────────── */}
      {screen === 'intro' && (
        <div className="card">
          <h1 className="title">DADAC</h1>
          <h2 className="subtitle">Una aventura aritmética</h2>
          <div className="divider" />
          <p className="story-text">
            Los números han comenzado a desvanecerse del mundo.
            <br />
            <em>Dahiana</em>, <em>David</em> y <em>Cristian</em> son los últimos campeones
            capaces de restaurar el equilibrio matemático del universo.
            <br /><br />
            <strong style={{ color: '#d4aa50' }}>¿Estás listo para la aventura?</strong>
          </p>
          <div className="divider" />

          {/* Presentación de héroes */}
          <div className="heroes-row" style={{ marginBottom: 20 }}>
            {Object.values(HEROES).map((h) => (
              <div key={h.id} className="hero-card" style={{ color: h.color }}>
                <span className="hero-emoji">{h.emoji}</span>
                <div className="hero-name">{h.name}</div>
                <div className="hero-power-label">{h.power.icon} {h.power.name}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid #2a1f08',
              borderRadius: 4,
              padding: '14px 18px',
              marginBottom: 22,
              fontSize: 'clamp(0.78rem, 1.9vw, 0.88rem)',
              color: '#b09060',
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: '#d4aa50', display: 'block', marginBottom: 6, letterSpacing: '0.15em', fontFamily: 'Cinzel, serif', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              ⚙ Cómo jugar
            </strong>
            • Responde correctamente para atacar al enemigo<br />
            • Cada 2 aciertos cargas los poderes especiales<br />
            • Activa un poder tocando al héroe cuando su barra brille<br />
            • ¡Cuidado con el <span style={{ color: '#fbbf24' }}>Desafío de la Trinidad</span>! Aparece cada cierto tiempo y activa los 3 poderes
          </div>

          <div className="text-center">
            <button className="btn btn-primary" onClick={() => { sfx.click(); setScreen('world') }}>
              ⚔ Comenzar la aventura
            </button>
          </div>
        </div>
      )}

      {/* WORLD INTRO ──────────────────────────────────────────────────────── */}
      {screen === 'world' && world && (
        <div className="card">
          <div className="text-center mb-3">
            <span className="chapter-badge">Mundo {world.id} de {WORLDS.length}</span>
          </div>
          <h1 className="title" style={{ fontSize: 'clamp(1.3rem, 3.5vw, 2rem)', color: world.accentColor }}>
            {world.icon} {world.title}
          </h1>
          <h2 className="subtitle" style={{ color: world.accentColor }}>{world.subtitle}</h2>
          <div className="divider" />

          <div className="stats-row mb-3">
            <span className="stat-badge">❤️ HP <strong>{team.hp}/{team.maxHp}</strong></span>
            <span className="stat-badge">🪙 Oro <strong>{team.gold}</strong></span>
            <span className="stat-badge">
              {world.timed ? `⏱️ ${world.timer}s/preg` : '🧘 Sin tiempo'}
            </span>
          </div>

          <p className="story-text">{world.story}</p>

          <div className="divider" />

          <div className="mb-3">
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5a4015', marginBottom: 8, textAlign: 'center' }}>
              Enemigos en esta zona
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {world.enemies.map((ek, i) => {
                const e = ENEMIES[ek]
                return (
                  <div key={i} style={{
                    background: 'rgba(0,0,0,0.3)', border: '1px solid #2a1f08',
                    borderRadius: 3, padding: '8px 14px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>{e.emoji}</span>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', color: '#9a7a40' }}>{e.name}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-center">
            <button className="btn btn-primary" onClick={() => { sfx.click(); startWorld() }}>
              ⚔ Entrar al mundo
            </button>
          </div>
        </div>
      )}

      {/* BATTLE ──────────────────────────────────────────────────────────── */}
      {screen === 'battle' && enemy && question && (
        <div className="card" style={{ borderColor: world.accentColor + '60' }}>
          {/* HUD superior */}
          <div className="top-hud">
            <span className="chapter-badge">{world.icon} {world.title}</span>
            {team.streak >= COMBO_THRESHOLD && (
              <span className="combo-badge">{COMBO_PHRASES[team.streak] || `🔥 x${team.streak}`}</span>
            )}
          </div>

          {/* Héroes con barras de poder */}
          <div className={`heroes-row ${teamShake ? 'shake-x' : ''}`} style={{ position: 'relative' }}>
            {Object.values(HEROES).map((h) => {
              const power = team.powers[h.id]
              const ready = power >= 100
              return (
                <div
                  key={h.id}
                  className={`hero-card ${ready ? 'power-ready' : ''}`}
                  style={{ color: h.color }}
                  onClick={() => ready && usePower(h.id)}
                  title={h.power.description}
                >
                  <span className="hero-emoji">{h.emoji}</span>
                  <div className="hero-name">{h.name}</div>
                  <div className="power-bar-wrap">
                    <div
                      className={`power-bar-fill ${ready ? 'ready' : ''}`}
                      style={{ width: `${power}%`, backgroundColor: h.color }}
                    />
                  </div>
                  <div className="hero-power-label">
                    {ready ? `${h.power.icon} ¡LISTO!` : h.power.name}
                  </div>
                </div>
              )
            })}

            {/* Float texts del equipo */}
            {floatTexts.filter((f) => f.side === 'team').map((f) => (
              <div
                key={f.id}
                className={`float-dmg ${f.kind}`}
                style={{ left: '50%', top: '40%', transform: 'translateX(-50%)' }}
              >
                {f.text}
              </div>
            ))}
          </div>

          {/* HP del equipo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: '0.8rem', color: '#9a7a40', fontFamily: "'Cinzel', serif" }}>❤️ Equipo</span>
            <div className="hp-bar-wrap">
              <div
                className="hp-bar-fill"
                style={{
                  width: `${hpPercent(team.hp, team.maxHp)}%`,
                  backgroundColor: hpColor(hpPercent(team.hp, team.maxHp)),
                }}
              />
            </div>
            <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.78rem', color: '#d4aa50', minWidth: 60, textAlign: 'right' }}>
              {team.hp}/{team.maxHp}
            </span>
          </div>

          {/* Enemigo */}
          <div className={`enemy-card ${enemyShake ? 'shake-x' : ''}`} style={{ position: 'relative' }}>
            <span className="enemy-emoji">{enemy.emoji}</span>
            <div className="enemy-name" style={{ color: enemy.color }}>{enemy.name}</div>
            <div className="enemy-quote">"{enemy.quote}"</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', color: '#9a7a40' }}>HP</span>
              <div className="hp-bar-wrap">
                <div
                  className="hp-bar-fill"
                  style={{
                    width: `${hpPercent(enemy.hp, enemy.maxHp)}%`,
                    backgroundColor: hpColor(hpPercent(enemy.hp, enemy.maxHp)),
                  }}
                />
              </div>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.75rem', color: '#d4aa50', minWidth: 60, textAlign: 'right' }}>
                {enemy.hp}/{enemy.maxHp}
              </span>
            </div>

            {/* Float texts del enemigo */}
            {floatTexts.filter((f) => f.side === 'enemy').map((f) => (
              <div
                key={f.id}
                className={`float-dmg ${f.kind}`}
                style={{ left: '50%', top: '20%', transform: 'translateX(-50%)' }}
              >
                {f.text}
              </div>
            ))}
          </div>

          {/* Timer (solo si el mundo es timed) */}
          {world.timed && !answered && (
            <div className="timer-row">
              <span style={{ fontSize: '0.85rem' }}>⏱</span>
              <div className="timer-bar-wrap">
                <div
                  className="timer-bar-fill"
                  style={{
                    width: `${(timeLeft / world.timer) * 100}%`,
                    backgroundColor: timeLeft > world.timer * 0.5 ? '#22c55e' : timeLeft > world.timer * 0.25 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <span className={`timer-num ${timeLeft <= 3 ? 'urgent' : ''}`}>{timeLeft}s</span>
            </div>
          )}

          {/* Hint scroll (poder de Cristian activado) */}
          {team.activeHint && (
            <div className="hint-scroll">
              <div className="hint-icon">📜</div>
              <div className="hint-text">{team.activeHint}</div>
            </div>
          )}

          {/* Banner Trinity */}
          {isTrinity && <div className="trinity-banner">⚡ DESAFÍO DE LA TRINIDAD ⚡</div>}

          {/* Pregunta */}
          <div className={`question-zone ${isTrinity ? 'trinity' : ''}`}>
            <div className="question-label">
              {question.kind === 'riddle'
                ? 'Adivinanza'
                : question.kind === 'trinity'
                ? 'Regla de Tres'
                : `El ${enemy.name} desafía al equipo`}
            </div>
            <div className={`question-text ${question.kind === 'riddle' || question.kind === 'trinity' ? 'riddle' : ''}`}>
              {question.question}
            </div>
          </div>

          {/* Opciones */}
          <div className="choices-grid">
            {question.choices.map((c, i) => {
              const eliminated = team.eliminatedChoices.current?.includes(c)
              const isSelected = selectedChoice === c
              const isCorrect = answered && c === question.answer
              const isWrongPick = answered && isSelected && c !== question.answer
              return (
                <button
                  key={i}
                  className={`choice-btn ${eliminated ? 'eliminated' : ''} ${isCorrect ? 'correct' : ''} ${isWrongPick ? 'wrong' : ''}`}
                  onClick={() => handleAnswer(c)}
                  disabled={answered || eliminated}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {feedback && <div className={`feedback ${feedback.type}`}>{feedback.msg}</div>}

          {/* Gold badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span className="stat-badge">🪙 <strong>{team.gold}</strong></span>
          </div>
        </div>
      )}

      {/* LEVELUP ─────────────────────────────────────────────────────────── */}
      {screen === 'levelup' && (
        <div className="card text-center">
          <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: 8 }}>🏆</span>
          <h1 className="title" style={{ color: '#22c55e', fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)' }}>
            ¡Mundo Conquistado!
          </h1>
          <div className="divider" />
          <p className="story-text">
            Habéis liberado <em>{world.title}</em> del caos numérico.
            <br />
            Las antorchas vuelven a arder con la luz de los números restaurados.
          </p>
          <div className="stats-row mt-4">
            <span className="stat-badge">❤️ HP <strong>{team.hp} → {Math.min(team.maxHp, team.hp + 50)}</strong></span>
            <span className="stat-badge">🪙 <strong>{team.gold}</strong> oro</span>
          </div>
          <p style={{ color: '#8a6a30', fontSize: '0.82rem', margin: '16px 0 22px', fontStyle: 'italic' }}>
            +50 HP recuperados por descanso
          </p>
          <button className="btn btn-primary" onClick={() => { sfx.click(); nextWorld() }}>
            ➤ Avanzar al siguiente mundo
          </button>
        </div>
      )}

      {/* GAMEOVER ────────────────────────────────────────────────────────── */}
      {screen === 'gameover' && (
        <div className="card text-center">
          <span style={{ fontSize: '4.5rem', display: 'block', marginBottom: 8 }}>💀</span>
          <h1 className="title" style={{ color: '#ef4444', fontSize: 'clamp(1.3rem, 3.5vw, 1.9rem)' }}>
            Habéis Caído
          </h1>
          <div className="divider" />
          <p className="story-text">
            El caos numérico ha consumido a los tres campeones.
            <br />
            Pero las leyendas dicen que renacerán... ¿lo intentas otra vez?
          </p>
          <div className="stats-row mt-4">
            <span className="stat-badge">🪙 Oro acumulado <strong>{team.gold}</strong></span>
            <span className="stat-badge">📍 <strong>{world.title}</strong></span>
          </div>
          <div className="divider" />
          <button className="btn btn-danger" onClick={() => { sfx.click(); restart() }}>
            💀 Intentar de nuevo
          </button>
        </div>
      )}

      {/* VICTORY ─────────────────────────────────────────────────────────── */}
      {screen === 'victory' && (
        <div className="card text-center">
          <span style={{ fontSize: '5.5rem', display: 'block', marginBottom: 8 }}>🏅</span>
          <h1 className="title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)' }}>
            ¡EL CAOS HA SIDO VENCIDO!
          </h1>
          <div className="divider" />
          <p className="story-text">
            Dahiana, David y Cristian han restaurado el equilibrio numérico del universo.
            <br /><br />
            Los números brillan de nuevo en cada rincón del mundo.
            <br />
            <em style={{ color: '#fbbf24' }}>¡QUÉ CRACKS!</em>
          </p>
          <div className="stats-row mt-4">
            <span className="stat-badge">❤️ HP final <strong>{team.hp}</strong></span>
            <span className="stat-badge">🪙 Oro total <strong>{team.gold}</strong></span>
          </div>
          <div className="divider" />
          <button className="btn btn-primary" onClick={() => { sfx.click(); restart() }}>
            🔄 Nueva aventura
          </button>
        </div>
      )}
    </div>
  )
}

// ─── PARTICLES BG ────────────────────────────────────────────────────────────
function Particles() {
  const [particles, setParticles] = useState([])
  useEffect(() => {
    const arr = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
    }))
    setParticles(arr)
  }, [])
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  )
}

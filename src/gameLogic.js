// ═══════════════════════════════════════════════════════════════════════════
// DADAC — Lógica del juego
// Generadores de preguntas, pistas dinámicas y utilidades
// ═══════════════════════════════════════════════════════════════════════════

import { RIDDLES, TRINITY_QUESTIONS } from './gameData.js'

// ─── GENERADOR DE PREGUNTAS ARITMÉTICAS ────────────────────────────────────
export function generateArithmetic(type = 'arithmetic_basic') {
  let a, b, op, answer
  let opPool

  switch (type) {
    case 'arithmetic_basic':
      opPool = ['+', '-']
      a = rand(1, 25)
      b = rand(1, 25)
      break
    case 'arithmetic_medium':
      opPool = ['+', '-', '×']
      a = rand(5, 50)
      b = rand(2, 20)
      break
    case 'arithmetic_hard':
      opPool = ['+', '-', '×', '÷']
      a = rand(10, 100)
      b = rand(2, 25)
      break
    case 'mixed':
      opPool = ['+', '-', '×', '÷']
      a = rand(20, 150)
      b = rand(2, 30)
      break
    default:
      opPool = ['+', '-']
      a = rand(1, 20)
      b = rand(1, 20)
  }

  op = opPool[rand(0, opPool.length - 1)]

  // División siempre exacta
  if (op === '÷') {
    b = rand(2, 12)
    answer = rand(2, 15)
    a = b * answer
  }

  // Evitar restas negativas en niveles bajos
  if (op === '-' && b > a) {
    ;[a, b] = [b, a]
  }

  // Calcular respuesta
  switch (op) {
    case '+':
      answer = a + b
      break
    case '-':
      answer = a - b
      break
    case '×':
      answer = a * b
      break
    case '÷':
      // ya calculado arriba
      break
  }

  const choices = generateChoices(answer, 4)
  return {
    kind: 'arithmetic',
    question: `${a} ${op} ${b} = ?`,
    answer,
    choices,
    rawData: { a, b, op },
  }
}

// ─── GENERADOR DE OPCIONES INCORRECTAS ─────────────────────────────────────
function generateChoices(correct, count) {
  const choices = new Set([correct])
  let tries = 0
  while (choices.size < count && tries < 50) {
    const offset = rand(-15, 15)
    const candidate = correct + (offset === 0 ? 1 : offset)
    if (candidate >= 0 && candidate !== correct) {
      choices.add(candidate)
    }
    tries++
  }
  // Si no llenamos, agregar más
  let extra = 1
  while (choices.size < count) {
    choices.add(correct + extra)
    extra++
  }
  return shuffle(Array.from(choices))
}

// ─── GENERADOR DE ADIVINANZAS ──────────────────────────────────────────────
export function generateRiddle() {
  const r = RIDDLES[rand(0, RIDDLES.length - 1)]
  return {
    kind: 'riddle',
    question: r.question,
    answer: r.answer,
    choices: shuffle([...r.choices]),
    riddleHints: r.hints,
  }
}

// ─── GENERADOR DE REGLA DE TRES ────────────────────────────────────────────
export function generateTrinityQuestion(usedIds = []) {
  const available = TRINITY_QUESTIONS.filter((_, i) => !usedIds.includes(i))
  const pool = available.length > 0 ? available : TRINITY_QUESTIONS
  const idx = TRINITY_QUESTIONS.indexOf(pool[rand(0, pool.length - 1)])
  const q = TRINITY_QUESTIONS[idx]
  return {
    kind: 'trinity',
    question: q.question,
    answer: q.answer,
    choices: shuffle([...q.choices]),
    trinityHint: q.hint,
    explanation: q.explanation,
    id: idx,
  }
}

// ─── GENERADOR DE PISTAS PARA EL PODER DE CRISTIAN ─────────────────────────
export function generateHint(question) {
  if (question.kind === 'riddle' && question.riddleHints?.length > 0) {
    return question.riddleHints[rand(0, question.riddleHints.length - 1)]
  }

  if (question.kind === 'trinity' && question.trinityHint) {
    return question.trinityHint
  }

  // Aritmética: pistas generadas dinámicamente
  const ans = question.answer
  const possibleHints = []

  // Pista 1: Par/Impar
  if (typeof ans === 'number') {
    possibleHints.push(`El resultado es ${ans % 2 === 0 ? 'par' : 'impar'}`)

    // Pista 2: Rango
    const lower = Math.floor(ans / 10) * 10
    const upper = lower + 10
    possibleHints.push(`El resultado está entre ${lower} y ${upper}`)

    // Pista 3: Termina en
    const lastDigit = ans % 10
    possibleHints.push(`El resultado termina en ${lastDigit}`)

    // Pista 4: Múltiplo
    if (ans % 5 === 0) {
      possibleHints.push('El resultado es múltiplo de 5')
    } else if (ans % 3 === 0) {
      possibleHints.push('El resultado es múltiplo de 3')
    } else if (ans % 2 === 0) {
      possibleHints.push('El resultado es múltiplo de 2')
    }

    // Pista 5: Cantidad de dígitos
    possibleHints.push(`El resultado tiene ${String(ans).length} ${String(ans).length === 1 ? 'dígito' : 'dígitos'}`)
  }

  return possibleHints[rand(0, possibleHints.length - 1)] || 'Confía en tu instinto'
}

// ─── ELIMINAR RESPUESTA INCORRECTA (poder de Dahiana) ──────────────────────
export function pickWrongChoice(question) {
  const wrongs = question.choices.filter((c) => c !== question.answer)
  return wrongs[rand(0, wrongs.length - 1)]
}

// ─── UTILIDADES ────────────────────────────────────────────────────────────
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function pickRandom(arr) {
  return arr[rand(0, arr.length - 1)]
}

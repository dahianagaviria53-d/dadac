// ═══════════════════════════════════════════════════════════════════════════
// DADAC — Datos del juego
// Villanos, mundos, adivinanzas, regla de tres y frases de celebración
// ═══════════════════════════════════════════════════════════════════════════

// ─── HÉROES ────────────────────────────────────────────────────────────────
export const HEROES = {
  dahiana: {
    id: 'dahiana',
    name: 'Dahiana',
    role: 'Arquera Mística',
    emoji: '🏹',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.5)',
    power: {
      name: 'Visión Aritmética',
      description: 'Elimina una respuesta incorrecta',
      icon: '✨',
    },
  },
  david: {
    id: 'david',
    name: 'David',
    role: 'Guerrero Saqueador',
    emoji: '⚔️',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.5)',
    power: {
      name: 'Drenaje Arcano',
      description: 'Salta la pregunta actual sin recibir daño',
      icon: '⏭️',
    },
  },
  cristian: {
    id: 'cristian',
    name: 'Cristian',
    role: 'Sabio Cronomante',
    emoji: '🧙‍♂️',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.5)',
    power: {
      name: 'Revelación del Sabio',
      description: 'Revela una pista útil de la pregunta',
      icon: '📜',
    },
  },
}

// ─── VILLANOS ──────────────────────────────────────────────────────────────
export const ENEMIES = {
  bufon: {
    id: 'bufon',
    name: 'Bufón del Cero',
    emoji: '🃏',
    maxHp: 40,
    atk: [5, 10],
    difficulty: 1,
    reward: 25,
    color: '#7e22ce',
    quote: '¡Jajaja! ¡Resuelve si puedes, mortal!',
  },
  goblin: {
    id: 'goblin',
    name: 'Goblin Mercader',
    emoji: '👺',
    maxHp: 60,
    atk: [8, 14],
    difficulty: 2,
    reward: 50,
    color: '#65a30d',
    quote: 'Mis cuentas nunca fallan... ¿las tuyas?',
  },
  aracne: {
    id: 'aracne',
    name: 'Aracne Algebraica',
    emoji: '🕷️',
    maxHp: 70,
    atk: [10, 16],
    difficulty: 2,
    reward: 60,
    color: '#1e293b',
    quote: 'Caerás en mi red de números...',
  },
  vampiro: {
    id: 'vampiro',
    name: 'Vampiro de Fracciones',
    emoji: '🦇',
    maxHp: 80,
    atk: [12, 20],
    difficulty: 3,
    reward: 80,
    color: '#7f1d1d',
    quote: 'Tu sangre será mi próximo numerador...',
  },
  espectro: {
    id: 'espectro',
    name: 'Espectro del Infinito',
    emoji: '🌀',
    maxHp: 75,
    atk: [14, 22],
    difficulty: 3,
    reward: 90,
    color: '#4c1d95',
    quote: '∞... ∞... ∞... no puedes vencer al infinito.',
  },
  necromante: {
    id: 'necromante',
    name: 'Necromante de Variables',
    emoji: '🧙‍♂️',
    maxHp: 100,
    atk: [18, 26],
    difficulty: 4,
    reward: 120,
    color: '#581c87',
    quote: 'X, Y, Z... mis sombras te consumirán.',
  },
  hidra: {
    id: 'hidra',
    name: 'Hidra Numérica',
    emoji: '🐍',
    maxHp: 110,
    atk: [20, 28],
    difficulty: 4,
    reward: 140,
    color: '#166534',
    quote: 'Por cada respuesta, surgen mil más...',
  },
  reyCaos: {
    id: 'reyCaos',
    name: 'Rey Caos',
    emoji: '👑',
    maxHp: 180,
    atk: [25, 35],
    difficulty: 5,
    reward: 250,
    color: '#991b1b',
    quote: '¡SOY EL ORIGEN DEL CAOS NUMÉRICO! ¡PERECERÁS!',
  },
}

// ─── MUNDOS ────────────────────────────────────────────────────────────────
export const WORLDS = [
  {
    id: 1,
    title: 'El Bosque del Tutorial',
    subtitle: 'Modo Práctica',
    timed: false,
    timer: 0,
    bgColor: '#1a2e1a',
    accentColor: '#22c55e',
    story:
      'Tras años de paz, los números han comenzado a desvanecerse del mundo. Dahiana, David y Cristian se adentran en el Bosque Ancestral buscando respuestas. Aquí no hay prisa: respira, piensa y aprende.',
    enemies: ['bufon'],
    questionTypes: ['arithmetic_basic'],
    icon: '🌳',
  },
  {
    id: 2,
    title: 'Las Ruinas Numéricas',
    subtitle: 'Modo Velocidad',
    timed: true,
    timer: 15,
    bgColor: '#2e1f0a',
    accentColor: '#f59e0b',
    story:
      'Las ruinas susurran fórmulas olvidadas. Cada segundo cuenta — los guardianes despiertan al sentir vuestra presencia. ¡Rápido, sin pausa!',
    enemies: ['goblin', 'aracne'],
    questionTypes: ['arithmetic_medium'],
    icon: '🏛️',
  },
  {
    id: 3,
    title: 'El Laberinto de Adivinanzas',
    subtitle: 'Modo Acertijos',
    timed: false,
    timer: 0,
    bgColor: '#1e1a2e',
    accentColor: '#a855f7',
    story:
      'Paredes que cambian, pasadizos que mienten. En este laberinto, los enemigos lanzan acertijos en lugar de operaciones. Piensa como un poeta de los números.',
    enemies: ['vampiro', 'espectro'],
    questionTypes: ['riddle'],
    icon: '🧩',
  },
  {
    id: 4,
    title: 'La Torre del Cálculo',
    subtitle: 'Modo Maestro',
    timed: true,
    timer: 12,
    bgColor: '#2e0a1f',
    accentColor: '#ec4899',
    story:
      'Una torre infinita donde los pisos son ecuaciones. Solo los más rápidos llegan arriba. El tiempo aprieta y los villanos son implacables.',
    enemies: ['necromante', 'hidra'],
    questionTypes: ['arithmetic_hard'],
    icon: '🗼',
  },
  {
    id: 5,
    title: 'El Templo del Caos',
    subtitle: 'Batalla Final',
    timed: true,
    timer: 18,
    bgColor: '#2e0a0a',
    accentColor: '#dc2626',
    story:
      'El origen de todo. El Rey Caos os espera, rodeado de números corruptos. Solo la unión de Dahiana, David y Cristian podrá restaurar el equilibrio del mundo.',
    enemies: ['reyCaos'],
    questionTypes: ['mixed'],
    icon: '🔥',
  },
]

// ─── ADIVINANZAS MATEMÁTICAS ───────────────────────────────────────────────
export const RIDDLES = [
  {
    question: 'Soy par, mayor que 10 y menor que 20. La suma de mis dígitos es 6. ¿Quién soy?',
    choices: [12, 15, 18, 24],
    answer: 24,
    hints: ['Soy par', 'Mis dígitos suman 6', 'Soy mayor que 20... ¡cuidado, era trampa!'],
    realAnswer: 'Soy 24, pero ¡soy mayor que 20!',
  },
  {
    question: 'Tengo cuatro lados iguales pero no soy cuadrado. ¿Qué figura soy?',
    choices: ['Rombo', 'Rectángulo', 'Trapecio', 'Pentágono'],
    answer: 'Rombo',
    hints: ['Mis lados son iguales', 'Mis ángulos no son rectos', 'Parezco un diamante'],
  },
  {
    question: 'Soy el único número par que es primo. ¿Cuál soy?',
    choices: [1, 2, 3, 4],
    answer: 2,
    hints: ['Soy menor que 5', 'Soy par', 'Solo me divido por 1 y por mí mismo'],
  },
  {
    question: 'Si me multiplicas por cualquier número, sigo siendo yo mismo. ¿Quién soy?',
    choices: [0, 1, 10, 100],
    answer: 0,
    hints: ['Cualquier cosa por mí desaparece', 'Soy menor que 1', 'Soy el principio de todo conteo'],
  },
  {
    question: 'Soy múltiplo de 3 y 5, mayor que 10 y menor que 20. ¿Quién soy?',
    choices: [12, 15, 18, 20],
    answer: 15,
    hints: ['Soy múltiplo de 5', 'Soy múltiplo de 3', '3 × 5 = ¿quién?'],
  },
  {
    question: 'Tengo tres lados y todos mis ángulos son iguales. ¿Qué figura soy?',
    choices: ['Triángulo equilátero', 'Triángulo isósceles', 'Cuadrado', 'Pentágono'],
    answer: 'Triángulo equilátero',
    hints: ['Soy un triángulo', 'Mis ángulos miden 60° cada uno', 'Todos mis lados son iguales'],
  },
  {
    question: 'Soy el resultado de elevar 2 al cubo. ¿Quién soy?',
    choices: [4, 6, 8, 16],
    answer: 8,
    hints: ['Soy 2 × 2 × 2', 'Soy par', 'Estoy entre 5 y 10'],
  },
  {
    question: '¿Cuál es el siguiente número en la sucesión: 2, 4, 8, 16, ?',
    choices: [20, 24, 30, 32],
    answer: 32,
    hints: ['Cada número es el doble del anterior', 'Soy potencia de 2', 'Soy 16 × 2'],
  },
  {
    question: 'Soy un número primo entre 20 y 30. La suma de mis dígitos es 5. ¿Quién soy?',
    choices: [21, 23, 25, 29],
    answer: 23,
    hints: ['Soy primo', 'Mis dígitos suman 5', 'Soy menor que 25'],
  },
  {
    question: 'Si el doble de un número es 24, ¿cuál es el número?',
    choices: [10, 12, 14, 16],
    answer: 12,
    hints: ['Yo × 2 = 24', '24 ÷ 2 = ?', 'Soy par'],
  },
  {
    question: '¿Cuántas caras tiene un cubo?',
    choices: [4, 6, 8, 12],
    answer: 6,
    hints: ['Más de 4', 'Una por cada dirección del espacio', 'Como un dado'],
  },
  {
    question: 'Soy el número que está justo entre 99 y 101. ¿Quién soy?',
    choices: [98, 100, 102, 1000],
    answer: 100,
    hints: ['Tengo 3 dígitos', 'Soy redondo', 'Soy 10 × 10'],
  },
  {
    question: 'Si tengo 3 docenas, ¿cuántos objetos tengo?',
    choices: [24, 30, 36, 48],
    answer: 36,
    hints: ['Una docena son 12', '12 × 3 = ?', 'Soy mayor que 30'],
  },
  {
    question: '¿Cuál es la mitad de la mitad de 100?',
    choices: [10, 20, 25, 50],
    answer: 25,
    hints: ['Mitad de 100 es 50', 'Y la mitad de eso es...', 'Soy menor que 30'],
  },
  {
    question: 'Soy el número de minutos en una hora. ¿Quién soy?',
    choices: [30, 45, 60, 100],
    answer: 60,
    hints: ['Mido el tiempo', 'Tengo 2 dígitos', '6 × 10 = ?'],
  },
]

// ─── PREGUNTAS DE REGLA DE TRES (Desafío de la Trinidad) ──────────────────
export const TRINITY_QUESTIONS = [
  {
    question:
      'Si 4 obreros construyen un muro en 12 días, ¿cuántos días tardarán 6 obreros (al mismo ritmo)?',
    choices: [6, 8, 10, 14],
    answer: 8,
    hint: 'Más obreros = menos días (proporción inversa). 4×12 = 6×?',
    explanation: '4 × 12 = 48 días-obrero. 48 ÷ 6 = 8 días.',
  },
  {
    question: 'Si 3 manzanas cuestan $6.000, ¿cuánto cuestan 7 manzanas?',
    choices: [12000, 14000, 16000, 18000],
    answer: 14000,
    hint: 'Cada manzana cuesta $2.000. 7 × 2.000 = ?',
    explanation: '6.000 ÷ 3 = 2.000 por manzana. 2.000 × 7 = 14.000.',
  },
  {
    question: 'Un auto recorre 120 km en 2 horas. ¿Cuántos km recorrerá en 5 horas?',
    choices: [240, 280, 300, 360],
    answer: 300,
    hint: 'Velocidad = 60 km/h. 60 × 5 = ?',
    explanation: '120 ÷ 2 = 60 km/h. 60 × 5 = 300 km.',
  },
  {
    question: 'Si 5 panaderos hacen 200 panes en 1 hora, ¿cuántos panes harán 8 panaderos en 1 hora?',
    choices: [280, 300, 320, 400],
    answer: 320,
    hint: 'Cada panadero hace 40 panes. 40 × 8 = ?',
    explanation: '200 ÷ 5 = 40 panes por panadero. 40 × 8 = 320.',
  },
  {
    question:
      'Si 6 grifos llenan una piscina en 4 horas, ¿cuántas horas tardarán 8 grifos (proporción inversa)?',
    choices: [2, 3, 5, 6],
    answer: 3,
    hint: 'Más grifos = menos tiempo. 6×4 = 8×?',
    explanation: '6 × 4 = 24 grifo-horas. 24 ÷ 8 = 3 horas.',
  },
  {
    question: 'Si 2 kg de arroz cuestan $8.000, ¿cuánto cuestan 5 kg?',
    choices: [15000, 18000, 20000, 25000],
    answer: 20000,
    hint: '1 kg cuesta $4.000. 4.000 × 5 = ?',
    explanation: '8.000 ÷ 2 = 4.000 por kg. 4.000 × 5 = 20.000.',
  },
  {
    question: 'Un libro tiene 300 páginas y Cristian lee 25 por día. ¿En cuántos días termina el libro?',
    choices: [10, 12, 14, 15],
    answer: 12,
    hint: 'Total ÷ por día = días totales',
    explanation: '300 ÷ 25 = 12 días.',
  },
  {
    question:
      'Si 10 trabajadores tardan 6 días en una obra, ¿cuántos días tardarán 15 trabajadores (proporción inversa)?',
    choices: [3, 4, 5, 9],
    answer: 4,
    hint: 'Más trabajadores = menos días. 10×6 = 15×?',
    explanation: '10 × 6 = 60. 60 ÷ 15 = 4 días.',
  },
]

// ─── FRASES DE CELEBRACIÓN ─────────────────────────────────────────────────
export const HYPE_PHRASES = [
  '¡QUÉ CRACK!',
  '¡SOS UN GENIO!',
  '¡PURO TALENTO!',
  '¡IMPARABLE!',
  '¡BRUTAL!',
  '¡FENÓMENO!',
  '¡MAESTRO!',
  '¡TREMENDO!',
]

export const COMBO_PHRASES = {
  3: '¡COMBO x3! 🔥',
  4: '¡EN LLAMAS! 🔥🔥',
  5: '¡COMBO LEGENDARIO! ⭐',
  6: '¡IMPARABLE! ⚡',
  7: '¡DIVINIDAD MATEMÁTICA! 👑',
}

export const MOTIVATION_PHRASES = [
  '¡Vamos, tú puedes!',
  '¡Respira y enfócate!',
  '¡La próxima es tuya!',
  '¡No te rindas!',
]

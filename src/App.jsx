import { useEffect, useMemo, useRef, useState } from 'react'
import { ExperienceSection } from '@/components/sections/ExperienceSection.jsx'
import { HeroSection } from '@/components/sections/HeroSection.jsx'
import { useIntroLoader } from '@/hooks/useIntroLoader.js'
import portfolioLogo from './assets/portfolio-logo.svg'

const LINKEDIN_URL = 'https://www.linkedin.com/in/puskarkafle'
const GITHUB_URL = 'https://github.com/puskarkafle12'

const getResumeAssetUrl = () =>
  new URL(`${import.meta.env.BASE_URL}Puskar-Kafle-Resume.pdf`, window.location.href).href

const layerConfig = [6, 10, 14, 18, 18, 14, 10, 6]

const buildNetwork = () => {
  const nodes = []
  const layerIndexes = []
  const width = 1200
  const height = 800
  const xPadding = 80
  const yPadding = 72

  layerConfig.forEach((count, layerIndex) => {
    const x =
      xPadding + (layerIndex * (width - xPadding * 2)) / Math.max(1, layerConfig.length - 1)
    const yStep = (height - yPadding * 2) / Math.max(1, count - 1)
    const indexes = []

    for (let nodeIndex = 0; nodeIndex < count; nodeIndex += 1) {
      const jitter = ((nodeIndex + layerIndex) % 2 === 0 ? 1 : -1) * 8
      const y = yPadding + nodeIndex * yStep + jitter
      const radius = 2.6 + Math.min(2.4, count / 9)
      const idx = nodes.length
      nodes.push({
        x,
        y,
        r: radius,
        layer: layerIndex,
        nodeInLayer: nodeIndex,
        totalInLayer: count,
      })
      indexes.push(idx)
    }

    layerIndexes.push(indexes)
  })

  const edges = []
  for (let layer = 0; layer < layerIndexes.length - 1; layer += 1) {
    const currentLayer = layerIndexes[layer]
    const nextLayer = layerIndexes[layer + 1]
    currentLayer.forEach((fromIndex, fromLocal) => {
      const mapped = Math.round((fromLocal / Math.max(1, currentLayer.length - 1)) * (nextLayer.length - 1))
      ;[-1, 0, 1].forEach((offset) => {
        const toLocal = mapped + offset
        if (toLocal >= 0 && toLocal < nextLayer.length) {
          edges.push({
            from: fromIndex,
            to: nextLayer[toLocal],
            layer,
            fromLocal,
            toLocal,
          })
        }
      })
    })
  }

  return { nodes, edges, layerIndexes }
}

const network = buildNetwork()
const neuralNodes = network.nodes
const neuralEdges = network.edges

function App() {
  const neuralCanvasRef = useRef(null)
  const neuralContainerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      const initial = saved === 'dark' ? 'dark' : 'light'
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', initial)
      }
      return initial
    } catch {
      return 'light'
    }
  })
  const [copiedField, setCopiedField] = useState('')
  const [activeNeuron, setActiveNeuron] = useState(2)
  const [processStep, setProcessStep] = useState(0)
  const { showContent } = useIntroLoader()
  const [gameOpen, setGameOpen] = useState(false)
  const [gameRunning, setGameRunning] = useState(false)
  const [gamePhase, setGamePhase] = useState('ready') // 'ready' | 'waiting' | 'result'
  const [gameRound, setGameRound] = useState(1)
  const [gameScore, setGameScore] = useState(0)
  const [gameTimeLeft, setGameTimeLeft] = useState(20)
  const [gameTarget, setGameTarget] = useState(2)
  const [gameMessage, setGameMessage] = useState('')
  const [gamePulseValue, setGamePulseValue] = useState(0)
  const [gameDropoutCount, setGameDropoutCount] = useState(0)
  const triggerForwardPassRef = useRef(null)
  const droppedCountRef = useRef(0)
  const gamePassStartRef = useRef(0)
  const annTimingRef = useRef({
    layerDelayMs: 0,
    layerPulseWindowMs: 0,
    outputLayerIndex: 0,
    slowFactor: 1,
  })
  const gameNeuronIds = useMemo(
    () =>
      neuralNodes
        .map((node, index) => ({ index, ...node }))
        .filter((node) => node.layer % 2 === 0 && node.nodeInLayer % 2 === 0)
        .slice(0, 18)
        .map((node) => node.index),
    [],
  )
  const processFeed = useMemo(
    () => [
      'BOOT> initializing tensor runtime',
      'L0.INPUT> sensor vectors normalized',
      'L1-H4> activation sweep in progress',
      'WEIGHTS> dynamic confidence map updated',
      'OUTPUT> candidate decision paths scored',
      'RENDER> unlocking portfolio interface',
    ],
    [],
  )
  const quickContactItems = [
    {
      id: 'email',
      label: 'Email',
      value: 'puskarkafle2031@gmail.com',
      href: 'mailto:puskarkafle2031@gmail.com',
    },
    {
      id: 'phone',
      label: 'Phone',
      value: '+1 (806) 441-9487',
      copyValue: '+18064419487',
      href: 'tel:+18064419487',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/puskarkafle',
      href: LINKEDIN_URL,
    },
  ]
  const featuredProjects = [
    {
      title: 'Multimodal Stress Prediction Research',
      summary:
        'Multimodal stress prediction from wearable data using machine learning.',
      tech: 'Python, Multimodal AI, Graduate Research',
      link: 'https://github.com/puskarkafle12/multimodal-stress-detection-from-wearables',
      featured: true,
    },
    {
      title: 'Soil Carbon Estimation Using a Dilated Convolutional Network',
      summary:
        'PVAMU SOC estimation with Dilated CNN (Prof. Yonghui Wang); improved training with Huber loss + tiered weighting + RobustScaler; low-SOC MAE 0.32 (46% lower).',
      tech: 'Python, Dilated CNN, Huber Loss, RobustScaler, Tiered Loss Weighting',
      featured: true,
    },
    {
      title: 'Bulk IPO Workflow Automation',
      summary:
        'IPO workflow automation to improve speed, reliability, and scalable execution.',
      tech: 'JavaScript, Automation',
      link: 'https://github.com/puskarkafle12/bulk-ipo',
    },
    {
      title: 'Stock Market Prediction (RNN / LSTM)',
      summary:
        'RNN/LSTM time-series model for stock market forecasting.',
      tech: 'Python, Deep Learning, Time-Series',
      link: 'https://github.com/puskarkafle12/stock_market_prediction',
    },
  ]

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? (window.scrollY / max) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  // Theme is initialized from localStorage in useState initializer.

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const canvas = neuralCanvasRef.current
    const container = neuralContainerRef.current
    if (!canvas || !container) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isLight = theme === 'light'
    const maxDpr = Math.min(window.devicePixelRatio || 1, 2)
    const cpu = navigator.hardwareConcurrency || 6
    const lowPower = cpu <= 4 || prefersReducedMotion

    let width = 0
    let height = 0
    let frameId = 0
    let tick = 0
    // Intro (feed-forward only) should finish quickly so content feels instant.
    const slowFactor = showContent ? 4.8 : 0.55
    const cycleMs = (lowPower ? 2600 : 2200) * slowFactor
    const layerDelayMs = (lowPower ? 240 : 180) * slowFactor
    const edgeTravelMs = (lowPower ? 320 : 260) * slowFactor
    const layerPulseWindowMs = (lowPower ? 250 : 210) * slowFactor
    const pointer = { x: 0.5, y: 0.5, active: false }
    const ripples = []
    const particles = []
    let nodes = []
    let edges = []
    let droppedNodes = new Set()
    let passStart = 0
    let passId = 0
    // Backprop stays in the “red” family, but differs slightly per theme.
    const backPropRed = isLight ? { r: 239, g: 68, b: 68 } : { r: 244, g: 114, b: 182 }
    let forwardPalette = null

    const hslToRgb = (h, s, l) => {
      // h: 0..360, s/l: 0..100
      const ss = s / 100
      const ll = l / 100
      const c = (1 - Math.abs(2 * ll - 1)) * ss
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
      const m = ll - c / 2
      let r1 = 0
      let g1 = 0
      let b1 = 0

      if (h < 60) {
        r1 = c
        g1 = x
      } else if (h < 120) {
        r1 = x
        g1 = c
      } else if (h < 180) {
        g1 = c
        b1 = x
      } else if (h < 240) {
        g1 = x
        b1 = c
      } else if (h < 300) {
        r1 = x
        b1 = c
      } else {
        r1 = c
        b1 = x
      }

      return {
        r: Math.round((r1 + m) * 255),
        g: Math.round((g1 + m) * 255),
        b: Math.round((b1 + m) * 255),
      }
    }

    const createForwardPalette = () => {
      // Fixed forward palette per theme (no per-pass randomness).
      const baseHue = isLight ? 205 : 235

      const fwdHigh = hslToRgb(baseHue + 35, 85, 55)
      const fwdMid = hslToRgb(baseHue + 15, 90, 55)
      const fwdLow = hslToRgb(baseHue - 20, 90, 50)
      const fwdBase = hslToRgb(baseHue + 5, 85, 62)
      const layer0Start = hslToRgb(baseHue + 10, 85, 52)
      const layer0End = hslToRgb(baseHue - 10, 85, 65)
      const edgeRGB = fwdMid
      const particleRGB = fwdBase

      return {
        fwdHigh,
        fwdMid,
        fwdLow,
        fwdBase,
        layer0Start,
        layer0End,
        edgeRGB,
        particleRGB,
      }
    }

    forwardPalette = createForwardPalette()
    let outputLayerIndex = 0
    let hiddenMinLayer = 1
    let hiddenMaxLayer = 0
    let introLocked = false
    const textParticles = []
    const neuronRings = []
    let lastNow = performance.now()
    const hoverBreakStreaks = []

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * maxDpr)
      canvas.height = Math.floor(height * maxDpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(maxDpr, 0, 0, maxDpr, 0, 0)

      const baseLayers = width < 680 ? 6 : width < 1100 ? 8 : 10
      const layers = Array.from({ length: baseLayers }, (_, layer) => {
        if (layer === baseLayers - 1) return width < 680 ? 3 : 4
        const t = layer / Math.max(1, baseLayers - 1)
        const base = width < 680 ? 7 : 10
        return Math.round(base + Math.sin(t * Math.PI) * (lowPower ? 4 : 9))
      })
      outputLayerIndex = layers.length - 1
      hiddenMinLayer = 1
      hiddenMaxLayer = outputLayerIndex - 1
      annTimingRef.current = {
        layerDelayMs,
        layerPulseWindowMs,
        outputLayerIndex,
        slowFactor,
      }

      nodes = []
      const layerIndexes = []
      layers.forEach((count, layer) => {
        const x = 70 + (layer * (width - 140)) / Math.max(1, layers.length - 1)
        const gap = (height - 120) / Math.max(1, count - 1)
        const ids = []
        for (let i = 0; i < count; i += 1) {
          const depth = 0.4 + Math.random() * 0.9
          const y = 60 + i * gap + ((i + layer) % 2 === 0 ? 1 : -1) * 8
          const idx = nodes.length
          nodes.push({
            x,
            y,
            z: depth,
            r: 1.8 + depth * 1.6,
            layer,
            i,
            total: count,
            activation: 0,
            history: 0,
            historyMode: 'fwd',
            noise: Math.random(),
            lastNumericPass: -1,
          })
          ids.push(idx)
        }
        layerIndexes.push(ids)
      })

      edges = []
      for (let layer = 0; layer < layerIndexes.length - 1; layer += 1) {
        const left = layerIndexes[layer]
        const right = layerIndexes[layer + 1]
        left.forEach((fromIdx) => {
          right.forEach((toIdx, j) => {
            edges.push({
              from: fromIdx,
              to: toIdx,
              layer,
              gate: Math.random(),
              history: 0,
              historyMode: 'fwd',
            })
          })
        })
      }

      particles.length = 0
      hoverBreakStreaks.length = 0
      const particleCount = lowPower ? 24 : 56
      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.2 + Math.random() * 1.2,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        })
      }
    }

    // Fully-connected network (no dropout concept for intro/portfolio animation).
    const dropoutRate = 0
    const rerollDropout = () => {
      droppedNodes = new Set()
      droppedCountRef.current = 0
    }

    triggerForwardPassRef.current = () => {
      const now = performance.now()
      passStart = now
      passId += 1
      rerollDropout()
      neuronRings.length = 0
      textParticles.length = 0
      ripples.length = 0
      lastNow = now
      return now
    }

    const draw = () => {
      tick += 1
      const now = performance.now()
      const dt = Math.min(0.06, (now - lastNow) / 1000)
      lastNow = now
      let cycleElapsed = now - passStart
      const introForwardOnly = !showContent
      const forwardFinishMs = outputLayerIndex * layerDelayMs + layerPulseWindowMs
      const backBufferMs = layerDelayMs * 0.35
      const backStartMs = introForwardOnly ? Number.POSITIVE_INFINITY : forwardFinishMs + backBufferMs
      const backFinishMs = introForwardOnly ? Number.POSITIVE_INFINITY : backStartMs + outputLayerIndex * layerDelayMs + layerPulseWindowMs
      const cycleMsEffective = introForwardOnly ? forwardFinishMs + layerDelayMs * 0.15 : backFinishMs + layerDelayMs * 0.4

      if (cycleElapsed >= cycleMsEffective) {
        if (introForwardOnly) {
          if (!introLocked) {
            introLocked = true
          }
          cycleElapsed = cycleMsEffective
        } else {
          passStart = now
          passId += 1
          rerollDropout()
          cycleElapsed = 0
          neuronRings.length = 0
          textParticles.length = 0
        }
      }
      const cycleTime = cycleElapsed
      const cycleProgress = cycleMsEffective ? cycleTime / cycleMsEffective : 0

      const inputNodeStaggerMs = Math.max(16, 30 * slowFactor) * (lowPower ? 1.05 : 1)
      const layerBasePulse = (t, window) => {
        if (t < 0 || t > window) return 0
        const x = t / window
        return Math.sin(x * Math.PI)
      }

      const bgA = showContent
        ? isLight
          ? '#eef6ff'
          : '#04143a'
        : isLight
          ? '#f4f3ff'
          : '#030712'
      const bgB = showContent
        ? isLight
          ? '#dbeafe'
          : '#060f2a'
        : isLight
          ? '#eaeaff'
          : '#050b1a'
      const grad = ctx.createLinearGradient(0, 0, width, height)
      grad.addColorStop(0, bgA)
      grad.addColorStop(1, bgB)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, width, height)

      const motionScale = showContent ? 0.35 : 1
      particles.forEach((p) => {
        p.x += p.vx * p.z * motionScale
        p.y += p.vy * p.z * motionScale
        if (p.x < -4) p.x = width + 4
        if (p.x > width + 4) p.x = -4
        if (p.y < -4) p.y = height + 4
        if (p.y > height + 4) p.y = -4
        const alpha = isLight ? 0.12 : 0.22
        ctx.fillStyle = isLight ? `rgba(99,102,241,${alpha * p.z})` : `rgba(56,189,248,${alpha * p.z})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 0.9 + p.z, 0, Math.PI * 2)
        ctx.fill()
      })

      const clamp01 = (v) => Math.max(0, Math.min(1, v))
      const dropoutFlickerMs = Math.max(200, layerDelayMs * 0.8)
      const dropoutPreMs = Math.min(dropoutFlickerMs, 240 * slowFactor)
      const pointerX = pointer.active ? pointer.x * width : 0
      const pointerY = pointer.active ? pointer.y * height : 0

      const layerBasePulseLocal = (local, windowMs) => {
        if (local < 0 || local > windowMs) return 0
        return Math.sin((local / windowMs) * Math.PI)
      }

      // Color mapping for hover "line break" streaks.
      // Forward colors rotate per pass; backprop is always red.
      const clamp01local = (v) => Math.max(0, Math.min(1, v))
      const lerpLocal = (a, b, t) => a + (b - a) * t
      const getNeuronBreakRGB = (node) => {
        const pulse = node.pulse ?? 0
        const history = node.history ?? 0
        const signal = Math.max(pulse, history)
        const mode = node.historyMode === 'back' ? 'back' : 'fwd'

        if (mode === 'back') return backPropRed

        if (node.layer === 0) {
          const t = clamp01local(signal)
          return {
            r: Math.round(lerpLocal(forwardPalette.layer0Start.r, forwardPalette.layer0End.r, t)),
            g: Math.round(lerpLocal(forwardPalette.layer0Start.g, forwardPalette.layer0End.g, t)),
            b: Math.round(lerpLocal(forwardPalette.layer0Start.b, forwardPalette.layer0End.b, t)),
          }
        }

        if (signal > 0.72) return forwardPalette.fwdHigh
        if (signal > 0.45) return forwardPalette.fwdMid
        if (signal > 0.18) return forwardPalette.fwdLow
        return forwardPalette.fwdBase
      }

      // 1) Node activations (feed-forward + color story + dropout)
      nodes.forEach((node, nodeIdx) => {
        const forwardLocalStart = node.layer * layerDelayMs
        let forwardLocal = cycleTime - forwardLocalStart
        if (node.layer === 0) forwardLocal -= node.i * inputNodeStaggerMs
        const forwardPulse = layerBasePulseLocal(forwardLocal, layerPulseWindowMs)

        const backLocal = cycleTime - backStartMs
        const nodeBackStart = (outputLayerIndex - node.layer) * layerDelayMs
        const backPulse = layerBasePulseLocal(backLocal - nodeBackStart, layerPulseWindowMs)

        const pulseMode = backPulse > forwardPulse ? 'back' : 'fwd'
        const pulse = Math.max(forwardPulse, backPulse)
        const noise = 0.78 + node.noise * 0.4

        const isDropped = droppedNodes.has(nodeIdx)

        // Faster forward fade so it doesn't linger after the forward wave passes layers.
        const fwdHistoryDecay = showContent ? 0.992 : 0.988
        const backHistoryDecay = showContent ? 0.9996 : 0.99985
        if (!isDropped && pulse > 0.08) {
          const decay = pulseMode === 'back' ? backHistoryDecay : fwdHistoryDecay
          node.history = Math.max(node.history * decay, pulse)
          node.historyMode = pulseMode
        } else if (!isDropped) {
          const decay = node.historyMode === 'back' ? backHistoryDecay : fwdHistoryDecay
          node.history *= decay
        } else {
          node.history *= 0.9
        }
        let activation = isDropped ? 0 : clamp01(pulse * noise)

        // Mouse hover boosts glow locally (doesn't change direction)
        if (!isDropped && pointer.active && !lowPower) {
          const dx = pointerX - node.x
          const dy = pointerY - node.y
          const d = Math.hypot(dx, dy)
          if (d < 150) {
            const boost = 1 - d / 150
            activation = Math.max(activation, boost * boost * 0.95)
          }
        }

        node.activation = activation
        node.pulse = pulse
        node.pulseMode = pulseMode
        node.isDropped = isDropped
      })

      // 2) Edges + particles (feed-forward + backprop)
      edges.forEach((edge) => {
        const fromIdx = edge.from
        const toIdx = edge.to
        const from = nodes[fromIdx]
        const to = nodes[toIdx]

        const blocked = droppedNodes.has(fromIdx) || droppedNodes.has(toIdx)

        // Forward: left -> right (from -> to)
        const forwardStartAbs = edge.layer * layerDelayMs
        const forwardLocal = cycleTime - forwardStartAbs
        const forwardInFlight =
          forwardLocal >= 0 && forwardLocal <= edgeTravelMs && cycleTime <= forwardFinishMs && !blocked
        const forwardStrength = forwardInFlight
          ? layerBasePulseLocal(forwardLocal, edgeTravelMs) * edge.gate
          : 0

        // Backprop: right -> left (to -> from)
        const edgeBackStartAbs = backStartMs + (outputLayerIndex - (edge.layer + 1)) * layerDelayMs
        const backLocal = cycleTime - edgeBackStartAbs
        const backInFlight = backLocal >= 0 && backLocal <= edgeTravelMs && cycleTime >= backStartMs && !blocked
        const backStrength = backInFlight
          ? layerBasePulseLocal(backLocal, edgeTravelMs) * edge.gate
          : 0

        const edgeStrength = Math.max(forwardStrength, backStrength)
        const backDominant = backStrength > forwardStrength
        const fwdEdgeHistoryDecay = showContent ? 0.9922 : 0.9885
        const backEdgeHistoryDecay = showContent ? 0.9996 : 0.99995
        // Keep edge color based on the last strong propagation direction,
        // so backprop edges slowly fade away instead of snapping back immediately.
        if (!blocked && edgeStrength > 0.03) {
          edge.historyMode = backDominant ? 'back' : 'fwd'
        }
        const edgeMode = edge.historyMode === 'back' ? 'back' : 'fwd'
        const edgeHistoryDecay = edgeMode === 'back' ? backEdgeHistoryDecay : fwdEdgeHistoryDecay
        if (blocked) {
          edge.history *= 0.9
        } else {
          edge.history = Math.max(edge.history * edgeHistoryDecay, edgeStrength)
        }
        const edgeAlpha = blocked ? 0.008 : 0.01 + edge.history * 0.55

        const lineColor =
          edgeMode === 'back'
            ? `rgba(${backPropRed.r},${backPropRed.g},${backPropRed.b},${edgeAlpha})`
            : `rgba(${forwardPalette.edgeRGB.r},${forwardPalette.edgeRGB.g},${forwardPalette.edgeRGB.b},${edgeAlpha})`

        const segAx = from.x
        const segAy = from.y
        const segBx = to.x
        const segBy = to.y

        let didBreak = false
        if (!blocked && pointer.active && !lowPower && edgeAlpha > 0.04) {
          const abx = segBx - segAx
          const aby = segBy - segAy
          const abLen2 = abx * abx + aby * aby
          if (abLen2 > 0.0001) {
            const px = pointerX
            const py = pointerY
            const tClosest =
              ((px - segAx) * abx + (py - segAy) * aby) / abLen2
            const t = clamp01(tClosest)
            const cx = segAx + abx * t
            const cy = segAy + aby * t
            const dist = Math.hypot(px - cx, py - cy)

            const breakDistPx = isLight ? 26 : 24
            if (dist < breakDistPx) {
              didBreak = true
              const segLen = Math.sqrt(abLen2)
              const gapPx = 10 + edgeStrength * 34
              const gapHalf = Math.min(
                0.2,
                (gapPx / (segLen + 0.0001)) / 2,
              )

              const tStart = Math.max(0, t - gapHalf)
              const tEnd = Math.min(1, t + gapHalf)
              const xStart = segAx + abx * tStart
              const yStart = segAy + aby * tStart
              const xEnd = segAx + abx * tEnd
              const yEnd = segAy + aby * tEnd

              const fromSignal = Math.max(from.pulse ?? 0, from.history ?? 0)
              const toSignal = Math.max(to.pulse ?? 0, to.history ?? 0)
              const pickNode = fromSignal >= toSignal ? from : to
              const breakRGB = getNeuronBreakRGB(pickNode)

              const alpha = blocked ? 0.008 : edgeAlpha * 0.98
              ctx.strokeStyle = `rgba(${breakRGB.r},${breakRGB.g},${breakRGB.b},${alpha})`
              ctx.lineWidth = 0.26 + edge.history * 1.35

              ctx.beginPath()
              ctx.moveTo(segAx, segAy)
              ctx.lineTo(xStart, yStart)
              ctx.stroke()

              ctx.beginPath()
              ctx.moveTo(xEnd, yEnd)
              ctx.lineTo(segBx, segBy)
              ctx.stroke()

              if (tick - (edge.lastHoverBreakTick ?? -9999) > 14) {
                edge.lastHoverBreakTick = tick

                const midX = cx
                const midY = cy
                const perpX = -aby / segLen
                const perpY = abx / segLen
                const cross = (px - segAx) * aby - (py - segAy) * abx
                const sign = cross >= 0 ? 1 : -1
                const dirX = perpX * sign
                const dirY = perpY * sign
                const alongX = abx / segLen
                const alongY = aby / segLen
                const speed = 28 + edgeStrength * 120

                const streakCount = lowPower ? 3 : 5
                for (let s = 0; s < streakCount; s += 1) {
                  const alongJitter = (Math.random() - 0.5) * 16
                  const streakLen = 10 + edgeStrength * 30 + Math.random() * 14
                  hoverBreakStreaks.push({
                    x: midX,
                    y: midY,
                    vx: dirX * speed + alongX * alongJitter,
                    vy: dirY * speed + alongY * alongJitter,
                    t: 0,
                    life: 0.48 + Math.random() * 0.22,
                    col: breakRGB,
                    dirX,
                    dirY,
                    len: streakLen,
                    width: 1.0 + Math.random() * 1.0,
                  })
                }
              }
            }
          }
        }

        if (!didBreak) {
          ctx.strokeStyle = lineColor
          ctx.lineWidth = blocked ? 0.26 : 0.26 + edge.history * 1.35
          ctx.beginPath()
          ctx.moveTo(segAx, segAy)
          ctx.lineTo(segBx, segBy)
          ctx.stroke()
        }

        const drawParticleTrail = (dirFrom, dirTo, progress, strength, glow, fadePow = 2) => {
          for (let k = 0; k < 6; k += 1) {
            const t = clamp01(progress - k * 0.05)
            const x = dirFrom.x + (dirTo.x - dirFrom.x) * t
            const y = dirFrom.y + (dirTo.y - dirFrom.y) * t
            const fade = Math.pow(1 - k / 6, fadePow)
            const a = (0.05 + strength * 0.35) * fade
            ctx.fillStyle = `rgba(${glow[0]},${glow[1]},${glow[2]},${a})`
            ctx.shadowColor = `rgba(${glow[0]},${glow[1]},${glow[2]},${a})`
            ctx.shadowBlur = 14 * fade
            ctx.beginPath()
            ctx.arc(x, y, 1 + strength * 1.4 * fade, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.shadowBlur = 0
        }

        // Forward particle trail (left -> right)
        if (forwardInFlight && forwardStrength > 0.12 && !blocked) {
          const progress = forwardLocal / edgeTravelMs
          const glow = [
            forwardPalette.particleRGB.r,
            forwardPalette.particleRGB.g,
            forwardPalette.particleRGB.b,
          ]
          drawParticleTrail(from, to, progress, forwardStrength, glow, 1.7)
        }

        // Backprop particle trail (right -> left)
        if (backInFlight && backStrength > 0.12 && !blocked) {
          const progress = backLocal / edgeTravelMs
          const glow = [backPropRed.r, backPropRed.g, backPropRed.b]
          drawParticleTrail(to, from, progress, backStrength, glow, 1.35)
        }
      })

      // 2.5) Hover line-break streaks (rendered behind neuron circles)
      if (hoverBreakStreaks.length > 0) {
        for (let i = hoverBreakStreaks.length - 1; i >= 0; i -= 1) {
          const b = hoverBreakStreaks[i]
          b.t += dt
          if (b.t >= b.life) {
            hoverBreakStreaks.splice(i, 1)
            continue
          }
          const u = 1 - b.t / b.life
          const alpha = u * u

          b.x += b.vx * dt
          b.y += b.vy * dt
          // Slight damping so the streak "floats" into place.
          const damp = 1 - dt * 1.35
          b.vx *= damp
          b.vy *= damp

          const len = b.len * (0.72 + 0.28 * u)
          ctx.strokeStyle = `rgba(${b.col.r},${b.col.g},${b.col.b},${alpha * 0.9})`
          ctx.lineWidth = b.width * (0.55 + 0.65 * u)
          ctx.beginPath()
          ctx.moveTo(b.x - b.dirX * len * 0.5, b.y - b.dirY * len * 0.5)
          ctx.lineTo(b.x + b.dirX * len * 0.5, b.y + b.dirY * len * 0.5)
          ctx.stroke()
        }
      }

      // 3) Draw neurons + firing bursts + dropout visualization + numeric values
      const backRed = backPropRed
      const fwdHigh = forwardPalette.fwdHigh
      const fwdMid = forwardPalette.fwdMid
      const fwdLow = forwardPalette.fwdLow
      const fwdBase = forwardPalette.fwdBase
      const fwdLayer0Start = forwardPalette.layer0Start
      const fwdLayer0End = forwardPalette.layer0End

      const lerp = (a, b, t) => a + (b - a) * t
      nodes.forEach((node, nodeIdx) => {
        const layerParallax = (node.layer / Math.max(1, outputLayerIndex) - 0.5) * (pointer.active ? 10 : 3)
        const px = node.x + layerParallax * (pointer.x - 0.5)
        const py = node.y + layerParallax * (pointer.y - 0.5)

        if (node.isDropped) {
          const flickerT = cycleTime < dropoutPreMs ? 1 - cycleTime / dropoutPreMs : 0
          const flicker = 0.5 + 0.5 * Math.sin(tick * 0.22 + nodeIdx * 0.9)
          const alpha = 0.08 + flickerT * (0.08 + flicker * 0.12)
          ctx.shadowBlur = 0
          ctx.fillStyle = `rgba(148,163,184,${alpha})`
          ctx.beginPath()
          ctx.arc(px, py, Math.max(0.8, node.r * 0.9), 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = `rgba(148,163,184,${alpha + 0.12})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(px - 4, py - 4)
          ctx.lineTo(px + 4, py + 4)
          ctx.moveTo(px + 4, py - 4)
          ctx.lineTo(px - 4, py + 4)
          ctx.stroke()
          return
        }

        const a = node.activation
        const pulse = node.pulse ?? 0
        const history = node.history ?? 0
        const mode = node.historyMode === 'back' ? 'back' : 'fwd'

        const firedNow = pulse > 0.14
        const showRing = firedNow || history > 0.18
        if (!showRing) {
          ctx.shadowBlur = 0
          return
        }

        const signal = Math.max(pulse, history)

        // Color story driven by the strongest signal (pulse or history)
        let col = fwdBase
        let ringAlpha = 0.0
        if (mode === 'back') {
          // Backprop always stays red.
          col = backRed
          ringAlpha = 0.15 + signal * 0.55
        } else if (node.layer === 0) {
          col = {
            r: Math.round(lerp(fwdLayer0Start.r, fwdLayer0End.r, signal)),
            g: Math.round(lerp(fwdLayer0Start.g, fwdLayer0End.g, signal)),
            b: Math.round(lerp(fwdLayer0Start.b, fwdLayer0End.b, signal)),
          }
          ringAlpha = 0.12 + signal * 0.42
        } else if (signal > 0.72) {
          col = fwdHigh
          ringAlpha = 0.2 + signal * 0.65
        } else if (signal > 0.45) {
          col = fwdMid
          ringAlpha = 0.13 + signal * 0.55
        } else if (signal > 0.18) {
          col = fwdLow
          ringAlpha = 0.11 + signal * 0.5
        } else {
          col = fwdBase
          ringAlpha = 0.06 + signal * 0.22
        }

        // Ring glow / bloom (no filled circles)
        const bloom = 3 + signal * 28
        ctx.shadowBlur = bloom
        ctx.shadowColor = `rgba(${col.r},${col.g},${col.b},${0.65 + a * 0.25})`
        ctx.lineWidth = 1.2 + signal * 1.4
        ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${ringAlpha})`

        const radius = node.r + signal * (node.layer === 0 ? 2.8 : 4.2)
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, Math.PI * 2)
        ctx.stroke()

        // Burst ripple on strong forward firing
        if (node.layer > 0 && mode === 'fwd' && signal > 0.72) {
          const ring = radius + 7 + a * 10
          const ringAlpha = clamp01((signal - 0.6) / 0.4) * 0.85
          ctx.lineWidth = 1.1
          ctx.strokeStyle = `rgba(${col.r},${col.g},${col.b},${ringAlpha})`
          ctx.beginPath()
          ctx.arc(px, py, ring, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Numeric micro-detail when neuron fires strongly during forward
        if (node.layer > 0 && mode === 'fwd' && signal > 0.72 && node.lastNumericPass !== passId) {
          node.lastNumericPass = passId
          const value = a.toFixed(2)
          textParticles.push({ x: px, y: py - 10, t: 0, life: 0.95, text: value, col })
          if (textParticles.length > 10) textParticles.shift()
        }

        ctx.shadowBlur = 0
      })

      // Render numeric value particles
      for (let i = textParticles.length - 1; i >= 0; i -= 1) {
        const p = textParticles[i]
        p.t += dt
        const tt = p.t / p.life
        if (tt >= 1) {
          textParticles.splice(i, 1)
          continue
        }
        const alpha = 1 - tt
        ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
        ctx.fillStyle = `rgba(${p.col.r},${p.col.g},${p.col.b},${0.25 + alpha * 0.85})`
        ctx.shadowBlur = 12 * alpha
        ctx.shadowColor = `rgba(${p.col.r},${p.col.g},${p.col.b},${alpha})`
        ctx.fillText(p.text, p.x - 6, p.y)
        ctx.shadowBlur = 0
      }

      ripples.forEach((r) => {
        r.t += 0.02
        const alpha = 1 - r.t
        if (alpha <= 0) return
        ctx.strokeStyle = isLight ? `rgba(99,102,241,${alpha * 0.55})` : `rgba(34,211,238,${alpha * 0.7})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(r.x, r.y, 12 + r.t * 120, 0, Math.PI * 2)
        ctx.stroke()
      })
      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        if (ripples[i].t >= 1) ripples.splice(i, 1)
      }

      frameId = window.requestAnimationFrame(draw)
    }

    const onPointerMove = (event) => {
      pointer.x = event.clientX / Math.max(1, width)
      pointer.y = event.clientY / Math.max(1, height)
      pointer.active = true
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return
      passStart = performance.now()
      passId += 1
      rerollDropout()
      ripples.length = 0
      textParticles.length = 0
      ripples.push({ x: event.clientX, y: event.clientY, t: 0 })
    }

    resize()
    passStart = performance.now()
    passId = 0
    rerollDropout()
    draw()
    window.addEventListener('resize', resize)
    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('pointerdown', onPointerDown)
    }
  }, [theme, showContent])

  useEffect(() => {
    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100
      const y = (event.clientY / window.innerHeight) * 100
      document.documentElement.style.setProperty('--mx', `${x}%`)
      document.documentElement.style.setProperty('--my', `${y}%`)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [])

  useEffect(() => {
    const sectionIds = ['home', 'summary', 'experience', 'projects', 'skills', 'contact']
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.2, 0.5, 0.8] },
    )

    sectionElements.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!gameRunning || gamePhase !== 'waiting') return undefined
    const timerId = window.setInterval(() => {
      setGameTimeLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timerId)
          setGameRunning(false)
          setGamePhase('result')
          setGameMessage('Time out. Output was not captured.')
          return 0
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timerId)
  }, [gameRunning, gamePhase])

  useEffect(() => {
    if (!gameRunning || gamePhase !== 'waiting') return undefined
    const signalId = window.setInterval(() => {
      setGameTarget((current) => {
        const next = gameNeuronIds[Math.floor(Math.random() * gameNeuronIds.length)]
        return next === current ? gameNeuronIds[(gameNeuronIds.indexOf(next) + 1) % gameNeuronIds.length] : next
      })
    }, 850)
    return () => window.clearInterval(signalId)
  }, [gameNeuronIds, gameRunning])

  useEffect(() => {
    if (gameOpen && gameRunning && gamePhase === 'waiting') setActiveNeuron(gameTarget)
  }, [gameOpen, gameRunning, gamePhase, gameTarget])

  const copyText = async (id, value) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = value
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedField(id)
      window.setTimeout(() => setCopiedField(''), 1500)
    } catch {
      setCopiedField('')
    }
  }

  const resumeHref = `${import.meta.env.BASE_URL}Puskar-Kafle-Resume.pdf`

  const handleResumeDownload = async (event) => {
    event?.preventDefault()
    const url = getResumeAssetUrl()
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = 'Puskar-Kafle-Resume.pdf'
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2500)
    } catch {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const startGame = () => {
    const maxRounds = 5
    setGameRound(1)
    setGameScore(0)
    setGameTimeLeft(18)
    setGamePulseValue(0)
    setGameMessage('Watch the forward pass... press CAPTURE when output turns GREEN.')
    setGamePhase('waiting')
    setGameRunning(true)

    const now = triggerForwardPassRef.current ? triggerForwardPassRef.current() : performance.now()
    gamePassStartRef.current = now
    setGameDropoutCount(droppedCountRef.current)
  }

  const nextPass = () => {
    if (gameRound >= 5) return
    setGameRound((r) => r + 1)
    setGameTimeLeft(18)
    setGamePulseValue(0)
    setGameMessage('New pass started. Press CAPTURE when output turns GREEN.')
    setGamePhase('waiting')
    setGameRunning(true)

    const now = triggerForwardPassRef.current ? triggerForwardPassRef.current() : performance.now()
    gamePassStartRef.current = now
    setGameDropoutCount(droppedCountRef.current)
  }

  const captureOutput = () => {
    if (!gameRunning || gamePhase !== 'waiting') return

    const { layerDelayMs, layerPulseWindowMs, outputLayerIndex } = annTimingRef.current
    const elapsed = performance.now() - gamePassStartRef.current
    const local = elapsed - outputLayerIndex * layerDelayMs

    let pulse = 0
    if (local >= 0 && local <= layerPulseWindowMs) {
      const x = local / layerPulseWindowMs
      pulse = Math.sin(x * Math.PI)
    }

    setGamePulseValue(pulse)
    setGameRunning(false)
    setGamePhase('result')

    if (pulse > 0.72) {
      setGameScore((v) => v + 1)
      setGameMessage('Captured GREEN output. Correct prediction!')
    } else if (pulse > 0.45) {
      setGameMessage('Captured mid activation (YELLOW). Close! +0')
    } else {
      setGameMessage('Captured weak activation (RED/INACTIVE). -0')
    }
  }

  return (
    <>
      <div className="neural-network-bg" aria-hidden="true" ref={neuralContainerRef}>
        <canvas ref={neuralCanvasRef} className="ann-canvas" />
        <div className="neural-cursor-glow" />
      </div>
      <div className="bg-orb orb-one" aria-hidden="true" />
      <div className="bg-orb orb-two" aria-hidden="true" />
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${scrollProgress}%` }} />
      </div>
      <header className={`site-header ${showContent ? 'content-visible' : ''}`}>
        <div className="topbar">
          <div className="nav-left">
            <a href="#home" className="brand" aria-label="Portfolio home">
              <img src={portfolioLogo} alt="" width={37} height={37} />
            </a>
            <div className="brand-copy">
              <strong>Puskar Kafle</strong>
              <span>Software Engineer</span>
            </div>
          </div>
          <button
            className={menuOpen ? 'menu-toggle is-open' : 'menu-toggle'}
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a
              href="#home"
              className={activeSection === 'home' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="#summary"
              className={activeSection === 'summary' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </a>
            <a
              href="#experience"
              className={activeSection === 'experience' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Experience
            </a>
            <a
              href="#projects"
              className={activeSection === 'projects' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Projects
            </a>
            <a
              href="#skills"
              className={activeSection === 'skills' ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              Skills
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-social"
              aria-label="LinkedIn"
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.643-1.85 3.378-1.85 3.61 0 4.275 2.378 4.275 5.471v6.27zM5.337 7.433c-1.086 0-1.959-.9-1.959-1.993 0-1.113.873-1.993 1.959-1.993 1.108 0 1.98.88 1.98 1.993 0 1.093-.872 1.993-1.98 1.993zM6.89 20.452H3.784V9h3.106v11.452z" />
              </svg>
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-social"
              aria-label="GitHub"
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.092.682-.217.682-.483 0-.237-.009-.868-.014-1.705-2.782.605-3.369-1.342-3.369-1.342-.454-1.158-1.11-1.466-1.11-1.466-.907-.62.069-.607.069-.607 1.003.072 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.844-2.339 4.689-4.566 4.937.359.309.678.92.678 1.855 0 1.338-.012 2.418-.012 2.747 0 .269.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href={resumeHref}
              className="nav-download"
              onClick={(e) => {
                handleResumeDownload(e)
                setMenuOpen(false)
              }}
            >
              Download CV
            </a>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              aria-label="Toggle light and dark mode"
              title="Toggle theme"
            >
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </button>
          </nav>
        </div>
      </header>
      <div className={`page ${showContent ? 'content-visible' : ''}`}>
        <main>
        <HeroSection theme={theme} />

        <section id="summary" className="section reveal">
          <p className="section-label">Overview</p>
          <h2>Professional Summary</h2>
          <p>
            Results-driven software engineer with strong expertise in AI, data
            processing, and backend platform engineering. Experienced in ETL
            design, LLM fine-tuning, RAG pipelines, stock sentiment systems,
            and real-world machine learning deployment.
          </p>
          <div className="chips">
            <span>LLM + RAG</span>
            <span>PySpark ETL</span>
            <span>FastAPI / Flask</span>
            <span>NLP + BERT</span>
            <span>AWS Data Stack</span>
          </div>
        </section>

        <ExperienceSection />

        <section id="projects" className="section reveal">
          <div className="section-head">
            <p className="section-label">Portfolio</p>
            <h2>Featured Projects & Research Work</h2>
          </div>
          <div className="grid">
            {featuredProjects.map((project) => (
              <article
                className={project.featured ? 'card project-card-featured' : 'card'}
                key={project.title}
              >
                <p className="meta">Project</p>
                <h3>{project.title}</h3>
                <p className="project-summary">{project.summary}</p>
                <p className="project-tech">{project.tech}</p>
                {project.link ? (
                  <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                    View on GitHub
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section reveal">
          <p className="section-label">Capabilities</p>
          <h2>Core Skills</h2>
          <div className="skills-grid">
            <article>
              <h3>Machine Learning</h3>
              <p>PyTorch, TensorFlow, scikit-learn, CNN, RNN, GAN, NLP</p>
            </article>
            <article>
              <h3>Data & Backend</h3>
              <p>PySpark, Pandas, Flask, FastAPI, MongoDB, MySQL</p>
            </article>
            <article>
              <h3>Cloud & Infra</h3>
              <p>AWS Glue, EC2, S3, ETL pipelines, vector databases</p>
            </article>
        </div>
        </section>

        <section id="contact" className="section reveal">
          <p className="section-label">Quick Links</p>
          <h2>Contact</h2>
          <p>
            Open to software engineering, machine learning, and AI platform
            opportunities.
          </p>
          <div className="contact-social-icons" aria-label="Social links">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.643-1.85 3.378-1.85 3.61 0 4.275 2.378 4.275 5.471v6.27zM5.337 7.433c-1.086 0-1.959-.9-1.959-1.993 0-1.113.873-1.993 1.959-1.993 1.108 0 1.98.88 1.98 1.993 0 1.093-.872 1.993-1.98 1.993zM6.89 20.452H3.784V9h3.106v11.452z" />
              </svg>
            </a>
            <a
              href="https://github.com/puskarkafle12"
              target="_blank"
              rel="noreferrer"
              className="social-icon-btn"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.092.682-.217.682-.483 0-.237-.009-.868-.014-1.705-2.782.605-3.369-1.342-3.369-1.342-.454-1.158-1.11-1.466-1.11-1.466-.907-.62.069-.607.069-.607 1.003.072 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.349-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.947 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.844-2.339 4.689-4.566 4.937.359.309.678.92.678 1.855 0 1.338-.012 2.418-.012 2.747 0 .269.18.58.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
          <div className="contact-copy-grid">
            {quickContactItems.map((item) => (
              <article className="contact-copy-card" key={item.id}>
                <p className="meta">{item.label}</p>
                <div className="contact-copy-row">
                  <a
                    className="contact-copy-value"
                    href={item.href}
                    target={item.id === 'linkedin' ? '_blank' : undefined}
                    rel={item.id === 'linkedin' ? 'noreferrer' : undefined}
                  >
                    {item.value}
                  </a>
                  <button
                    type="button"
                    className="copy-btn"
                    onClick={() => copyText(item.id, item.copyValue ?? item.value)}
                    aria-label={copiedField === item.id ? 'Copied' : 'Copy to clipboard'}
                  >
                    {copiedField === item.id ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z" />
                      </svg>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="contact-actions">
            <a href="mailto:puskarkafle2031@gmail.com" className="btn btn-primary">
              Email Me
            </a>
            <a href="tel:+18064419487" className="btn btn-ghost">
              Call: +1 (806) 441-9487
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              LinkedIn
            </a>
          </div>
        </section>
        </main>

        <footer>
          <p>© {new Date().getFullYear()} Puskar Kafle · Portfolio</p>
        </footer>
      </div>
    </>
  )
}

export default App

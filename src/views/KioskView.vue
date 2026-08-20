<template>
  <div class="kiosk-container">
    <div class="header">
      <h1>Terminal de Acceso Facial</h1>
      <button class="btn btn-secondary" @click="$router.push('/clientes')">Volver</button>
    </div>

    <div class="camera-wrapper">
      <!-- Video oculto, fuente original -->
      <video ref="videoEl" autoplay muted playsinline style="display:none;"></video>
      <!-- Canvas visible con filtros de luz aplicados -->
      <canvas ref="canvasEl" class="kiosk-canvas"></canvas>
      
      <div v-if="loading" class="overlay">
        <div class="spinner"></div>
        <p>{{ statusText }}</p>
      </div>

      <div v-if="successMsg" class="success-overlay">
        <div class="success-icon">✅</div>
        <h2>¡Acceso Concedido!</h2>
        <p>{{ successMsg }}</p>
      </div>
    </div>
    
    <div class="controls">
      <label>
        Mejora de Luz (Brillo):
        <input type="range" min="100" max="300" v-model="brightness" /> {{ brightness }}%
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGymStore } from '../stores/gym'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'
import * as faceapi from '@vladmandic/face-api'

const router = useRouter()
const gym = useGymStore()
const auth = useAuthStore()
const toast = useToastStore()

const videoEl = ref(null)
const canvasEl = ref(null)
const loading = ref(true)
const statusText = ref('Cargando modelos de IA...')
const brightness = ref(150)
const successMsg = ref('')

let animationId = null
let faceMatcher = null
let lastMatchTime = 0

onMounted(async () => {
  try {
    // 1. Cargar modelos
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
    
    statusText.value = 'Iniciando cámara...'

    // 2. Construir descriptores conocidos
    const labeledDescriptors = []
    for (const c of gym.clients) {
      if (c.face_descriptor && c.facial_access) {
        try {
          const desc = new Float32Array(JSON.parse(c.face_descriptor))
          labeledDescriptors.push(new faceapi.LabeledFaceDescriptors(c.id.toString(), [desc]))
        } catch (e) {
          console.error('Descriptor inválido para cliente:', c.id)
        }
      }
    }
    
    if (labeledDescriptors.length > 0) {
      faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5) // 0.5 distancia umbral
    } else {
      toast.warning('No hay clientes registrados con acceso facial.')
    }

    // 3. Iniciar cámara
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    videoEl.value.srcObject = stream

    videoEl.value.onloadedmetadata = () => {
      canvasEl.value.width = videoEl.value.videoWidth
      canvasEl.value.height = videoEl.value.videoHeight
      loading.value = false
      processFrame()
    }
  } catch (err) {
    statusText.value = 'Error: ' + err.message
    toast.error('No se pudo iniciar el kiosco: ' + err.message)
  }
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (videoEl.value && videoEl.value.srcObject) {
    videoEl.value.srcObject.getTracks().forEach(t => t.stop())
  }
})

async function processFrame() {
  if (!videoEl.value || !canvasEl.value || videoEl.value.paused || videoEl.value.ended) return
  
  const ctx = canvasEl.value.getContext('2d')
  
  // Aplicar filtro de mejora de luz (brillo y contraste)
  ctx.filter = `brightness(${brightness.value}%) contrast(120%)`
  ctx.drawImage(videoEl.value, 0, 0, canvasEl.value.width, canvasEl.value.height)
  ctx.filter = 'none'

  // Procesar IA cada N frames para no trabar el navegador
  // En lugar de `videoEl`, le pasamos el `canvasEl` para que la IA "vea" la imagen aclarada
  if (Date.now() - lastMatchTime > 3000 && faceMatcher) { // Throttle 3s si acaba de encontrar a alguien
    const detection = await faceapi.detectSingleFace(canvasEl.value).withFaceLandmarks().withFaceDescriptor()
    
    if (detection) {
      const bestMatch = faceMatcher.findBestMatch(detection.descriptor)
      if (bestMatch.label !== 'unknown') {
        const clientId = parseInt(bestMatch.label)
        const client = gym.clients.find(c => c.id === clientId)
        
        if (client) {
          lastMatchTime = Date.now()
          grantAccess(client)
        }
      }
      
      // Dibujar cuadrito visual
      faceapi.draw.drawDetections(canvasEl.value, detection)
    }
  }

  animationId = requestAnimationFrame(processFrame)
}

async function grantAccess(client) {
  successMsg.value = `Bienvenido, ${client.name}`
  // Emitir señal de apertura de puerta
  const res = await gym.openDoorDirectly(auth.user?.id || 1)
  
  if (res.success) {
    // Si queremos registrar asistencia pospago, llamaríamos a registerCheckin
    gym.registerCheckin(client.id)
  } else {
    toast.error('Error al abrir: ' + res.message)
  }

  setTimeout(() => {
    successMsg.value = ''
  }, 3000)
}
</script>

<style scoped>
.kiosk-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 60px);
  background: var(--bg-dark);
  color: var(--text-light);
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}
.camera-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 4/3;
  background: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.kiosk-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.overlay, .success-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.7);
  z-index: 10;
}
.success-overlay {
  background: rgba(0, 200, 83, 0.9);
  animation: fadeIn 0.3s ease;
}
.success-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}
.controls {
  margin-top: 20px;
  background: var(--bg-card);
  padding: 15px 30px;
  border-radius: var(--radius-md);
}
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255,255,255,0.2);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin { 100% { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>

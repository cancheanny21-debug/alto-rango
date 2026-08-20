# Integración de Control de Acceso con ESP32 (WebSockets)

Para integrar el panel de administración con el cerrojo de la puerta utilizando un **ESP32 DevKit V1 de 30 pines**, usaremos una conexión **WebSocket**. Esto permite una comunicación bidireccional en tiempo real y soluciona problemas comunes de puertos cerrados (el ESP32 se conecta como cliente al servidor Node.js).

## Flujo de la Funcionalidad

1. **Arranque del ESP32:**
   - El ESP32 inicia y utiliza `WiFiManager` para conectarse a la red Wi-Fi local. Si no conoce la red, levanta un punto de acceso (Access Point) temporal llamado "Gimnasio Puerta" para configurarlo desde el celular.
   - Una vez conectado a internet, el ESP32 se conecta al WebSocket de tu servidor Node.js (ej. `ws://tuservidor.com:3001`).

2. **Panel de Admin (Frontend):**
   - El administrador hace clic en el botón "Abrir Puerta Manual" o aprueba el ingreso de un cliente desde `ClientsView.vue`.
   - El Frontend hace una petición `POST` normal a tu endpoint `/api/attendance/direct-open`.

3. **Backend (Node.js):**
   - El endpoint procesa la solicitud (registra que el admin abrió la puerta).
   - Inmediatamente, envía un mensaje JSON a través del servidor WebSocket a todos los dispositivos de tipo "puerta" conectados: `{"command": "open_door"}`.

4. **ESP32:**
   - El ESP32 recibe el mensaje `"open_door"`.
   - Activa el relé conectado al pin (por ejemplo, el GPIO 26) durante 3 segundos para que la cerradura se abra.
   - Apaga el relé para que la cerradura vuelva a su estado bloqueado.

---

## 📌 Identificación de Endpoints y Pines

### Pines del ESP32 DevKit de 30 pines
- **VIN / 5V** ➡️ VCC del Módulo Relé (si es de 5V).
- **GND** ➡️ GND del Módulo Relé.
- **D26 (GPIO 26)** ➡️ IN (Señal) del Módulo Relé.

### Endpoints (Sockets) a implementar en Node.js (Backend)
Debes instalar la librería `ws` (`npm install ws`) en tu backend e integrar un servidor WebSocket junto a Express:
- **Evento de Conexión (`connection`)**: El ESP32 se identifica con el servidor.
- **Evento de Mensaje (`message`)**: El ESP32 puede enviar su estado ("Conectado y listo").
- **Broadcast del API**: Tu archivo `attendance.js` llamará a una función del WebSocket para emitir el comando.

---

## 💻 Código para el ESP32 (Arduino IDE)

Asegúrate de instalar estas librerías en el Arduino IDE:
1. `WiFiManager` de tzapu
2. `ArduinoWebsockets` de Gil Maimon (o similar)

```cpp
#include <WiFi.h>
#include <WiFiManager.h>
#include <ArduinoWebsockets.h>

using namespace websockets;

// ---- CONFIGURACIÓN ----
const int RELAY_PIN = 26; // Pin conectado al Relé
const char* websocket_server = "ws://192.168.1.100:3001"; // IP o dominio de tu servidor Node.js

WebsocketsClient client;

void setup() {
  Serial.begin(115200);
  
  // Configurar el Relé (Normalmente cerrado - HIGH para apagar si usa lógica invertida)
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Ajusta a LOW si tu relé activa en alto

  // Inicializar WiFiManager
  WiFiManager wm;
  
  // wm.resetSettings(); // Descomenta esto para borrar el WiFi guardado si necesitas probar
  
  // Levanta un portal de conexión si no puede conectarse
  bool res = wm.autoConnect("Gym_Puerta_Setup", "admin1234");
  
  if(!res) {
    Serial.println("Fallo al conectar WiFi...");
    ESP.restart();
  } 
  
  Serial.println("WiFi Conectado!");

  // Callback de mensajes WebSocket
  client.onMessage([&](WebsocketsMessage message) {
    Serial.print("Mensaje recibido: ");
    Serial.println(message.data());
    
    // Validar el comando (se asume un texto simple o un JSON parseado)
    if (message.data().indexOf("open_door") > -1) {
      abrirPuerta();
    }
  });

  // Intentar conexión al servidor
  conectarWebSocket();
}

void loop() {
  // Mantener viva la conexión
  if(client.available()) {
    client.poll();
  } else {
    // Si se desconectó, intentar reconectar cada cierto tiempo
    Serial.println("WebSocket desconectado. Reconectando...");
    delay(5000);
    conectarWebSocket();
  }
}

// Función para conectar al WebSocket
void conectarWebSocket() {
  bool connected = client.connect(websocket_server);
  if(connected) {
    Serial.println("Conectado al servidor de acceso!");
    client.send("{\"status\": \"door_controller_online\"}");
  } else {
    Serial.println("No se pudo conectar al servidor.");
  }
}

// Lógica de apertura del relé
void abrirPuerta() {
  Serial.println("¡ABRIENDO PUERTA!");
  
  // Activa el Relé (LOW si el relé es de lógica invertida)
  digitalWrite(RELAY_PIN, LOW); 
  
  // Mantener la puerta abierta por 3 segundos
  delay(3000);
  
  // Cierra la puerta
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("PUERTA CERRADA");
}
```

## Cambios necesarios en tu Backend (`server/index.js`)

Para que el servidor Express pueda hablar con el ESP32, necesitas iniciar el WebSocket:

```javascript
import { WebSocketServer } from 'ws';
// ... (tu código express)

const server = app.listen(PORT, async () => {
  console.log(`🚀 API servidor corriendo en http://localhost:${PORT}/api`)
});

// Crear WebSocket Server conectado al mismo puerto de Express
const wss = new WebSocketServer({ server });

// Para compartir la instancia del websocket al resto de rutas
app.set('wss', wss); 

wss.on('connection', (ws) => {
  console.log('✅ ESP32 conectado al WebSocket');
  
  ws.on('message', (message) => {
    console.log('Mensaje del ESP32:', message.toString());
  });
});
```

En tu endpoint `POST /api/attendance/direct-open`, invocas el envío:
```javascript
  const wss = req.app.get('wss');
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify({ command: 'open_door' }));
    }
  });
```

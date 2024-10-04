// Referencias a los elementos HTML
const customText = document.getElementById('customText');
const canvas = document.getElementById('postcardCanvas');
const ctx = canvas.getContext('2d');
let logData = null;
let qslImage = new Image();

// Función para cargar el archivo log.adi
fetch('src/log.adi')
  .then(response => response.text())
  .then(data => {
    logData = data.replace(/\r?\n|\r/g, ' ');  // Eliminar saltos de línea para facilitar la búsqueda
  })
  .catch(error => console.error('Error al cargar el archivo ADIF:', error));

// Función para cargar la imagen QSL.png
qslImage.src = 'src/QSL.png';
qslImage.onload = function() {
  // Dibujar la imagen QSL cuando se haya cargado
  ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);
};

// Función para buscar el distintivo en el log
function findCallsignInLog(callsign) {
  if (!logData) return null;  // Si no se ha cargado el log, devolver null

  // Regex mejorado para buscar el distintivo, banda, fecha y hora en el log (ignorando saltos de línea y espacios extra)
  const regex = new RegExp(`<CALL:\\d+>${callsign}\\s+<BAND:\\d+>(\\S+)\\s+<QSO_DATE:\\d+>(\\d+)\\s+<TIME_ON:\\d+>(\\d+)`, 'i');
  const match = logData.match(regex);

  console.log("Intentando encontrar: ", callsign);
  console.log("Log data: ", logData);
  console.log("Match: ", match);

  if (match) {
    return {
      band: match[1],   // Banda del QSO
      date: match[2],   // Fecha del QSO
      time: match[3]    // Hora del QSO
    };
  }

  return null;
}

// Función para generar la postal
function generateCard() {
  const callsign = customText.value.trim().toUpperCase();
  if (callsign === '') {
    alert('Por favor, introduce un distintivo de radioaficionado.');
    return;
  }

  const qsoDetails = findCallsignInLog(callsign);

  if (!qsoDetails) {
    alert('El distintivo no está en el log. Por favor, contacta con info@example.com para más información.');
    return;
  }

  // Redibujar la imagen QSL
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
  ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);

  // Dibujar el distintivo centrado en la postal
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.fillText(callsign, x, y);

  // Formatear la fecha y la hora del QSO
  const formattedTime = `${qsoDetails.time.slice(0, 2)}:${qsoDetails.time.slice(2, 4)}:${qsoDetails.time.slice(4, 6)}`;
  const formattedDate = `${qsoDetails.date.slice(6, 8)}/${qsoDetails.date.slice(4, 6)}/${qsoDetails.date.slice(0, 4)}`;
  
  // Dibujar los detalles del QSO (hora, banda, y fecha) debajo del distintivo
  const qsoText = `Hora: ${formattedTime} - Banda: ${qsoDetails.band} - Fecha: ${formattedDate}`;
  ctx.font = "30px Arial";
  ctx.fillText(qsoText, x, y + 50);
}

// Función para descargar la postal
function downloadCard() {
  const link = document.createElement('a');
  link.download = 'postal_personalizada.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

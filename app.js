// Referencias a los elementos HTML
const customText = document.getElementById('customText');
const canvas = document.getElementById('postcardCanvas');
const ctx = canvas.getContext('2d');
let logData = null;
let qslImage = new Image();


fetch('log.adi')
  .then(response => response.text())
  .then(data => {
    logData = data.replace(/\r?\n|\r/g, ' ');  // Eliminar saltos de línea 
  })
  .catch(error => console.error('Error al cargar el archivo ADIF:', error));


qslImage.src = 'QSL.png';

// Función para buscar distintivo en el log
function searchForText(searchText) {
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
    /*// Convert both the bigText and searchText to uppercase for case-insensitive search
    const bigTextUpper = logData.toUpperCase();
    const searchTextUpper = searchText.toUpperCase();

    // Check if searchText is found inside bigText
    if (bigTextUpper.includes(searchTextUpper)) {
        return true;
    } else {
        return false;
    }*/

  return null;
}

// Función para generar la postal
function generateCard() {
  const callsign = customText.value.trim().toUpperCase();
  if (callsign === '') {
    alert('Por favor, introduce un distintivo de llamada.');
    return;
  }

  const qsoDetails = searchForText(callsign);

  if (qsoDetails == null) {
    alert('El distintivo no está en el log. Por favor, contacta con info@example.com para más información.');
    return;
  } else {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
    ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);
  
    // Dibujar el distintivo centrado en la qsl
    ctx.font = "80px Great Vives";
    ctx.fillStyle = "orange";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.fillText(callsign, x, y);
    
    // Dibujar los detalles del QSO (hora, banda, y fecha) debajo del distintivo
    // Formatear la fecha y la hora del QSO
    const formattedTime = `${qsoDetails.time.slice(0, 2)}:${qsoDetails.time.slice(2, 4)}:${qsoDetails.time.slice(4, 6)}`;
    const formattedDate = `${qsoDetails.date.slice(6, 8)}/${qsoDetails.date.slice(4, 6)}/${qsoDetails.date.slice(0, 4)}`;
    
    // Dibujar los detalles del QSO (hora, banda, y fecha) debajo del distintivo
    const qsoText = `Hora: ${formattedTime} - Banda: ${qsoDetails.band} - Fecha: ${formattedDate}`;
    ctx.font = "20px Arial";
    ctx.fillText(qsoText, x, y + 80);
    cert = 'Certificamos que';
    ific = 'realizó el correspondiente QSO con AO180GC (ejemplo).'
    ctx.font = "30px Arial";
    ctx.fillText(cert, x, y + 60);
    ctx.fillText(ific, x, y - 60);
    
  }
}

// descargar la qsl
function downloadCard() {
  const link = document.createElement('a');
  link.download = 'QSL_180GC.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

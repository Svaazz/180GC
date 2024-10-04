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
    // Convert both the bigText and searchText to uppercase for case-insensitive search
    const bigTextUpper = logData.toUpperCase();
    const searchTextUpper = searchText.toUpperCase();

    // Check if searchText is found inside bigText
    if (bigTextUpper.includes(searchTextUpper)) {
        return true;
    } else {
        return false;
    }

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

  if (!qsoDetails) {
    alert('El distintivo no está en el log. Por favor, contacta con info@example.com para más información.');
    return;
  } else {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpiar el canvas
    ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);
  
    // Dibujar el distintivo centrado en la qsl
    ctx.font = "80px Arial";
    ctx.fillStyle = "orange";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.fillText(callsign, x, y);
    // Dibujar los detalles del QSO (hora, banda, y fecha) debajo del distintivo
    cert = `Certificamos que `;
    ific = `realizó el correspondiente QSO con AO180GC (ejemplo).`
    ctx.font = "30px Arial";
    ctx.fillText(cert, x, y + 60);
    ctx.fillText(ific, x, y - 60);
    ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);
    
  }
}

// descargar la qsl
function downloadCard() {
  const link = document.createElement('a');
  link.download = 'QSL_180GC.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

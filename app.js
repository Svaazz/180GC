// Referencias a los elementos HTML
const customText = document.getElementById('customText');
const canvas = document.getElementById('postcardCanvas');
const ctx = canvas.getContext('2d');
let logData = null;
let qslImage = new Image();

// Función para cargar el archivo log.adi
fetch('log.adi')
  .then(response => response.text())
  .then(data => {
    logData = data.replace(/\r?\n|\r/g, ' ');  // Eliminar saltos de línea para facilitar la búsqueda
  })
  .catch(error => console.error('Error al cargar el archivo ADIF:', error));

// Función para cargar la imagen QSL.png
qslImage.src = 'QSL.png';
qslImage.onload = function() {
  // Dibujar la imagen QSL cuando se haya cargado
  ctx.drawImage(qslImage, 0, 0, canvas.width, canvas.height);
};

// Función para buscar el distintivo en el log
function searchForText(searchText) {
    // Convert both the bigText and searchText to uppercase for case-insensitive search
    const bigTextUpper = logData.toUpperCase();
    const searchTextUpper = searchText.toUpperCase();

    // Check if searchText is found inside bigText
    if (bigTextUpper.includes(searchTextUpper)) {
        console.log(`Found: "${searchText}" in the log!`);
        // Do something if the text is found
        // Example: You can return true or trigger an action
        return true;
    } else {
        console.log(`"${searchText}" was not found.`);
        // You can return false or trigger another action if not found
        return false;
    }
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
  }
  else
  {
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
  }
}

// Función para descargar la postal
function downloadCard() {
  const link = document.createElement('a');
  link.download = 'QSL_180GC.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

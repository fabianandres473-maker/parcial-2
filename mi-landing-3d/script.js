// =========================================================================
// 1. CONFIGURACIÓN DE TUS MODELOS Y SUS FONDOS HDR INDIVIDUALES
// =========================================================================
const catalogoModelos = [
  {
    badge: "MODELO INDIVIDUAL 01",
    titulo: "Nombre del Personaje 1",
    descripcion: "Descripción del primer personaje, su diseño, ropa o animación principal.",
    archivo: "modelos/Namikofinal-entregableweb.glb",
    hdr: "entornos/playa.hdr",
    mostrarFondo: true, // true = se ve el HDR de fondo 360° e ilumina
    exposicion: 1.0     // Ajusta el brillo individual si este HDR es muy fuerte o suave
  },
  {
    badge: "MODELO INDIVIDUAL 02",
    titulo: "Nerisa",
    descripcion: "Personaje Nerisa con su diseño, ropa y animaciones.",
    archivo: "modelos/Nerisa-entregable.glb",
    hdr: "entornos/playa.hdr",
    mostrarFondo: true,
    exposicion: 1.0
  },
  {
    badge: "MODELO INDIVIDUAL 03",
    titulo: "Nombre del Personaje 3",
    descripcion: "Descripción del tercer modelo individual.",
    archivo: "modelos/modelo3.glb",
    hdr: "entornos/hdr_modelo3.hdr",
    mostrarFondo: true,
    exposicion: 1.0
  },
  {
    badge: "ESCENA COMPLETA",
    titulo: "Escena Principal Integrada",
    descripcion: "Escenario completo con los 3 personajes animados y los 3 objetos interactivos.",
    archivo: "modelos/escena_completa.glb",
    hdr: "entornos/hdr_escena.hdr",
    mostrarFondo: true, // Cambia a false si no quieres que se vea por fuera de las paredes de la escena
    exposicion: 1.0
  }
];

// Referencias a elementos del DOM
const modelViewer = document.getElementById('visor-glb');
const badgeEl = document.getElementById('model-badge');
const titleEl = document.getElementById('model-title');
const descEl = document.getElementById('model-desc');
const tabs = document.querySelectorAll('.model-tab');

const btnPlayPause = document.getElementById('btn-play-pause');
const animationSelect = document.getElementById('animation-select');
const btnResetCamera = document.getElementById('btn-reset-camera');

// Función para cargar un modelo y su HDR correspondiente
function cargarModelo(index) {
  const item = catalogoModelos[index];
  
  // Actualizar textos en pantalla
  badgeEl.textContent = item.badge;
  titleEl.textContent = item.titulo;
  descEl.textContent = item.descripcion;
  
  // Cambiar el archivo .glb
  modelViewer.src = item.archivo;
  
  // Aplicar la iluminación HDR de este modelo
  modelViewer.setAttribute('environment-image', item.hdr);
  modelViewer.exposure = item.exposicion;
  
  // Mostrar u ocultar el HDR como fondo 360° visible
  if (item.mostrarFondo) {
    modelViewer.setAttribute('skybox-image', item.hdr);
  } else {
    modelViewer.removeAttribute('skybox-image');
  }
  
  // Actualizar botón activo
  tabs.forEach(tab => tab.classList.remove('active'));
  tabs[index].classList.add('active');
  
  // Resetear cámara
  modelViewer.cameraOrbit = 'auto auto auto';
  modelViewer.cameraTarget = 'auto auto auto';
}

// Eventos de clic en los 4 botones de modelos
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const index = parseInt(tab.getAttribute('data-index'));
    cargarModelo(index);
  });
});

// Barra de progreso cada vez que carga un .glb nuevo
modelViewer.addEventListener('progress', (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
  } else {
    progressBar.classList.remove('hide');
  }
});

// Detectar animaciones cada vez que termina de cargar uno de los 4 archivos
modelViewer.addEventListener('load', () => {
  const animations = modelViewer.availableAnimations;
  animationSelect.innerHTML = '';

  if (animations && animations.length > 0) {
    animations.forEach((animName) => {
      const option = document.createElement('option');
      option.value = animName;
      option.textContent = `Animación: ${animName}`;
      animationSelect.appendChild(option);
    });
    modelViewer.animationName = animations[0];
    modelViewer.play();
    animationSelect.disabled = false;
    btnPlayPause.disabled = false;
    btnPlayPause.textContent = 'Pausar Animación';
  } else {
    const option = document.createElement('option');
    option.textContent = 'Sin animaciones';
    animationSelect.appendChild(option);
    animationSelect.disabled = true;
    btnPlayPause.disabled = true;
  }
});

// Selector de pista de animación
animationSelect.addEventListener('change', (event) => {
  modelViewer.animationName = event.target.value;
  modelViewer.play();
  btnPlayPause.textContent = 'Pausar Animación';
});

// Botón Play / Pausa
btnPlayPause.addEventListener('click', () => {
  if (modelViewer.paused) {
    modelViewer.play();
    btnPlayPause.textContent = 'Pausar Animación';
  } else {
    modelViewer.pause();
    btnPlayPause.textContent = 'Reproducir Animación';
  }
});

// Botón Centrar Cámara
btnResetCamera.addEventListener('click', () => {
  modelViewer.cameraOrbit = 'auto auto auto';
  modelViewer.cameraTarget = 'auto auto auto';
  modelViewer.fieldOfView = 'auto';
});

// Inicializar con el primer modelo al abrir la página
cargarModelo(0);
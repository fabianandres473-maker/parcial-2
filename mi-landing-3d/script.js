// =========================================================================
// 1. CONFIGURACIÓN DE TUS MODELOS Y SUS FONDOS HDR INDIVIDUALES
// =========================================================================
const catalogoModelos = [
  {
    badge: "MODELO INDIVIDUAL 01",
    titulo: "Namiko",
    descripcion: "Una joven de 20 años y Ia mejor amiga de Nerissa, es una informante que pasaba su tiempo trabajando en el bar local más popular del pueblo como bailarina recabando cualquier información importante que se les escape a los ebrios que circulan cerca, cuenta con una gracia hipnotica, una sutileza y agilidad excepcional además de una memoria enciclopédica y percepción corporal. sin embargo, no cuenta con mucha fuerza, siendo difícil que soporte golpes fuertes y, debido a su trabajo, tiene aislamiento emocional lo que hace que le cueste confiar en las personas.",
    modelSheet: "",
    palette: [
      { nombre: "Rosa", hex: "#D88E9B" },
      { nombre: "Azul oscuro", hex: "#2F3548" },
      { nombre: "Arena", hex: "#E6C6AA" }
    ],
    archivo: "modelos/Namikofinal-entregableweb.glb",
    hdr: "entornos/playa.hdr",
    mostrarFondo: true, // true = se ve el HDR de fondo 360° e ilumina
    exposicion: 1.0     // Ajusta el brillo individual si este HDR es muy fuerte o suave
  },
  {
    badge: "MODELO INDIVIDUAL 02",
    titulo: "Nerisa",
    descripcion: "Una joven de 22 años y la princesa de los Mizujin, es la princesa y la estratega militar más respetada de su pueblo y la más apta para este cargo, cuenta con una capacidad de adaptación táctica increible además de contar con una vision y punteria excepcional con el arco. Sin embargo, su rigidez y orgullo noble le dificultan improvisar ante tácticas caóticas a pesar de la fuerza para cargar su arco no puede mantener un combate a corta distancia por mucho tiempo",
    modelSheet: "",
    palette: [
      { nombre: "Turquesa", hex: "#3B8E9A" },
      { nombre: "Dorado", hex: "#D8C8A1" },
      { nombre: "Azul noche", hex: "#263044" }
    ],
    archivo: "modelos/Nerisa-entregable.glb",
    hdr: "entornos/playa.hdr",
    mostrarFondo: true,
    exposicion: 1.0
  },
  {
    badge: "MODELO INDIVIDUAL 03",
    titulo: "Tiryon",
    descripcion: "El lider de los piratas enviado por los humanos, tiene 36 años y es reconocido por su habilidad con el manejo de la espada, pese a su gran fuerza no cuenta con mucha inteligencia, y si entra en modo berserker hace que estas cualidades se noten aun más, además, gracias a su fuerza, tiene una resistencia por encima del promedio",
    modelSheet: "",
    palette: [
      { nombre: "Rojo oscuro", hex: "#8A3D33" },
      { nombre: "Bronce", hex: "#A47C3B" },
      { nombre: "Carbón", hex: "#2C2B2A" }
    ],
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
const characterDetailsTitle = document.getElementById('character-details-title');
const characterAssets = document.getElementById('character-assets');
const characterSheet = document.getElementById('character-sheet');
const modelSheetPlaceholder = document.getElementById('model-sheet-placeholder');
const characterPalette = document.getElementById('character-palette');
const sceneDetailsMessage = document.getElementById('scene-details-message');

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
  actualizarDetallesPersonaje(item, index);
  
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

function actualizarDetallesPersonaje(item, index) {
  const esPersonajeIndividual = index < 3;
  characterDetailsTitle.textContent = esPersonajeIndividual
    ? `Diseño de ${item.titulo}`
    : 'Diseño de personajes';
  characterAssets.hidden = !esPersonajeIndividual;
  sceneDetailsMessage.hidden = esPersonajeIndividual;

  if (!esPersonajeIndividual) {
    return;
  }

  characterSheet.hidden = !item.modelSheet;
  modelSheetPlaceholder.hidden = Boolean(item.modelSheet);
  if (item.modelSheet) {
    characterSheet.src = item.modelSheet;
    characterSheet.alt = `Model sheet de ${item.titulo}`;
  } else {
    characterSheet.removeAttribute('src');
    characterSheet.alt = '';
    modelSheetPlaceholder.textContent =
      `Añade la ruta de la imagen del model sheet de ${item.titulo} en los datos del personaje.`;
  }

  characterPalette.replaceChildren();
  item.palette.forEach((color) => {
    const itemEl = document.createElement('li');
    itemEl.className = 'palette-color';

    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.backgroundColor = color.hex;
    swatch.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'color-label';
    label.textContent = `${color.nombre} `;

    const hex = document.createElement('code');
    hex.textContent = color.hex;
    hex.setAttribute('aria-label', `Código hexadecimal ${color.hex}`);

    label.appendChild(hex);
    itemEl.append(swatch, label);
    characterPalette.appendChild(itemEl);
  });
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
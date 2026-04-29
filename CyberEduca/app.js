// =============================================
// NAVBAR
// Agrega la clase .scrolled cuando el usuario
// baja más de 50px para oscurecer el fondo.
// También maneja el menú hamburguesa en móvil.
// =============================================

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Oscurecer navbar al hacer scroll
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Abrir/cerrar el menú en móvil
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Cerrar el menú al hacer clic en cualquier enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Resaltar el link activo según la sección visible
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      // Colorea el link si la sección está en el viewport
      link.style.color = scrollY >= top && scrollY < top + height ? 'var(--neon)' : '';
    }
  });
});

// =============================================
// TARJETAS DE AMENAZAS
// Muestra u oculta el detalle de cada amenaza
// al hacer clic en el botón "Ver más".
// =============================================

function toggleThreat(btn) {
  const card    = btn.closest('.threat-card');
  const details = card.querySelector('.threat-details');
  const isOpen  = details.classList.contains('open');

  // Alternar visibilidad del contenido expandido
  details.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);

  // Cambiar el texto del botón según el estado
  btn.innerHTML = isOpen
    ? 'Ver más <i class="fa-solid fa-chevron-down"></i>'
    : 'Ver menos <i class="fa-solid fa-chevron-down"></i>';
}

// =============================================
// QUIZ INTERACTIVO
// Variables de estado del cuestionario.
// =============================================

let currentQ = 0;   // Índice de la pregunta actual (0 a 5)
let score    = 0;   // Contador de respuestas correctas
let answered = false; // Evita responder dos veces la misma pregunta
const totalQ = 6;   // Total de preguntas

// Referencias a elementos del DOM
const questions    = document.querySelectorAll('.question');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const nextBtn      = document.getElementById('nextBtn');
const prevBtn      = document.getElementById('prevBtn');
const quizContent  = document.getElementById('quizContent');
const quizResult   = document.getElementById('quizResult');

// Actualiza la barra de progreso y el texto "Pregunta X de Y"
function updateProgress() {
  const pct = ((currentQ + 1) / totalQ) * 100;
  progressFill.style.width = pct + '%';
  progressText.textContent = `Pregunta ${currentQ + 1} de ${totalQ}`;
}

// Muestra la pregunta del índice indicado y resetea el estado
function showQuestion(index) {
  questions.forEach((q, i) => q.classList.toggle('active', i === index));
  prevBtn.disabled = index === 0; // Deshabilitar "Anterior" en la primera pregunta
  nextBtn.disabled = true;        // Deshabilitar "Siguiente" hasta que se responda
  nextBtn.textContent = index === totalQ - 1 ? 'Ver resultado' : 'Siguiente';
  answered = false;
  updateProgress();
}

// Se llama al hacer clic en una opción de respuesta
function selectAnswer(btn, isCorrect) {
  // Ignorar si ya se respondió esta pregunta
  if (answered) return;
  answered = true;

  // Deshabilitar todos los botones de esta pregunta
  const options = btn.closest('.options').querySelectorAll('.option-btn');
  options.forEach(opt => {
    opt.disabled = true;
    if (opt === btn) {
      opt.classList.add(isCorrect ? 'correct' : 'wrong');
    }
  });

  if (isCorrect) {
    score++;
    showToast('✓ ¡Correcto!');
  } else {
    // Si es incorrecta, mostrar cuál era la respuesta correcta
    options.forEach(opt => {
      if (opt.onclick.toString().includes('true')) opt.classList.add('correct');
    });
    showToast('✗ Incorrecto');
  }

  // Habilitar el botón para avanzar
  nextBtn.disabled = false;
}

// Avanza a la siguiente pregunta o muestra el resultado final
function nextQuestion() {
  // Pedir que responda antes de avanzar
  if (!answered && currentQ < totalQ) {
    showToast('Selecciona una respuesta primero');
    return;
  }
  if (currentQ < totalQ - 1) {
    currentQ++;
    showQuestion(currentQ);
  } else {
    showResult();
  }
}

// Retrocede a la pregunta anterior
function prevQuestion() {
  if (currentQ > 0) {
    currentQ--;
    showQuestion(currentQ);
  }
}

// Calcula el puntaje y muestra el mensaje de resultado personalizado
function showResult() {
  quizContent.classList.add('hidden');
  document.querySelector('.quiz-nav').classList.add('hidden');
  quizResult.classList.remove('hidden');

  const pct = Math.round((score / totalQ) * 100);
  document.getElementById('resultScore').textContent = `${score}/${totalQ}`;

  // Tres niveles de resultado según el porcentaje obtenido
  let icon, title, msg;
  if (pct >= 83) {
    icon  = '🛡️';
    title = '¡Excelente! Eres un experto en ciberseguridad';
    msg   = 'Tienes un gran conocimiento sobre seguridad digital. Sigue así y comparte lo que sabes.';
  } else if (pct >= 50) {
    icon  = '⚠️';
    title = 'Buen intento, pero hay margen de mejora';
    msg   = 'Conoces los conceptos básicos, pero te recomendamos repasar las secciones de amenazas y protección.';
  } else {
    icon  = '🔓';
    title = 'Necesitas reforzar tus conocimientos';
    msg   = 'No te preocupes, para eso estamos aquí. Revisa las secciones de amenazas y protección digital.';
  }

  document.getElementById('resultIcon').textContent  = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMsg').textContent   = msg;

  // Completar la barra de progreso al 100%
  progressFill.style.width  = '100%';
  progressText.textContent  = `Completado: ${pct}%`;
}

// Reinicia el quiz desde cero
function restartQuiz() {
  currentQ = 0; score = 0; answered = false;

  quizResult.classList.add('hidden');
  quizContent.classList.remove('hidden');
  document.querySelector('.quiz-nav').classList.remove('hidden');

  // Limpiar el estado visual de todos los botones
  questions.forEach(q => {
    q.querySelectorAll('.option-btn').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('correct', 'wrong');
    });
  });

  showQuestion(0);
}

// Inicializar el quiz al cargar la página
showQuestion(0);

// =============================================
// FORMULARIO DE CONTACTO
// Simula el envío con un delay de 1.2 segundos
// y muestra un mensaje de confirmación.
// =============================================

function submitForm(e) {
  e.preventDefault(); // Evitar recarga de página

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simular tiempo de respuesta del servidor
  setTimeout(() => {
    document.getElementById('formSuccess').classList.remove('hidden');
    e.target.reset(); // Limpiar el formulario

    // Restaurar el botón
    btn.innerHTML = 'Enviar mensaje <i class="fa-solid fa-paper-plane"></i>';
    btn.disabled = false;

    // Ocultar el mensaje de éxito después de 5 segundos
    setTimeout(() => document.getElementById('formSuccess').classList.add('hidden'), 5000);
  }, 1200);
}

// =============================================
// TOAST (notificación flotante)
// Muestra un mensaje breve en la esquina
// inferior derecha y lo oculta tras 2 segundos.
// =============================================

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');

  // Cancelar el timer anterior si el toast ya estaba visible
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.add('hidden'), 2000);
}

// =============================================
// ANIMACIONES DE ENTRADA (Scroll)
// Usa IntersectionObserver para animar las
// tarjetas cuando entran al viewport.
// Más eficiente que escuchar el evento scroll.
// =============================================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Hacer visible la tarjeta con transición suave
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible

// Aplicar la animación a todas las tarjetas del sitio
document.querySelectorAll('.threat-card, .protection-card, .tip-card, .info-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

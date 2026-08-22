let usersDatabase = [
  { username: 'user', password: 'user123', name: 'Vecino', role: 'citizen', id: 'user' },
  { username: 'empleado', password: 'empleado123', name: 'Empleado Municipal', role: 'employee', id: 'emp' }
];

const CATEGORY_CONFIG = {
  'Luminarias': { icon: '💡', color: '#D97706', bg: '#FEF3C7', class: 'bg-cat-lum' },
  'Basura acumulada': { icon: '🗑️', color: '#EA580C', bg: '#FFEDD5', class: 'bg-cat-basura' },
  'Baches / Pistas rotas': { icon: '🚧', color: '#DC2626', bg: '#FEE2E2', class: 'bg-cat-baches' },
  'Fugas de agua': { icon: '💧', color: '#2563EB', bg: '#DBEAFE', class: 'bg-cat-agua' },
  'Otro': { icon: '➕', color: '#64748B', bg: '#F1F5F9', class: 'bg-cat-otro' }
};

const STATUS_CONFIG = {
  'Pendiente': { class: 'status-pendiente', dotClass: 'dot-warning' },
  'En Proceso': { class: 'status-proceso', dotClass: 'dot-blue' },
  'Resuelto': { class: 'status-resuelto', dotClass: 'dot-success' }
};

const PRIORITY_CONFIG = {
  'Alta': 'priority-alta',
  'Media': 'priority-media',
  'Baja': 'priority-baja'
};

let reportsData = [
  {
    id: 'SJL-2026-001',
    category: 'Luminarias',
    description: 'Poste de alumbrado apagado desde hace 3 días en la cuadra 5. La zona queda completamente a oscuras en las noches, representando un peligro para los vecinos.',
    address: 'Jr. Las Flores 520, Urb. Zárate, San Juan de Lurigancho, Lima, Lima',
    status: 'En Proceso',
    createdAt: '2026-08-10',
    updatedAt: '2026-08-11',
    citizenName: 'Vecino',
    citizenId: 'user',
    priority: 'Alta',
    notes: [
      { author: 'Téc. Ramírez', text: 'Se ha generado orden de trabajo OT-445. Cuadrilla asignada para revisión técnica.', date: '2026-08-11' }
    ]
  },
  {
    id: 'SJL-2026-002',
    category: 'Basura acumulada',
    description: 'Acumulación de residuos sólidos en esquina desde el fin de semana. El camión recolector no pasó según el horario habitual.',
    address: 'Av. Gran Chimú 1240, Urb. Zárate, San Juan de Lurigancho, Lima, Lima',
    status: 'Pendiente',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    citizenName: 'Vecino',
    citizenId: 'user',
    priority: 'Media',
    notes: []
  },
  {
    id: 'SJL-2026-003',
    category: 'Baches / Pistas rotas',
    description: 'Bache de gran tamaño en calzada vehicular. Ha causado daños en vehículos de vecinos y dificulta el tránsito en hora punta.',
    address: 'Ca. Los Álamos 320, Urb. Campoy, San Juan de Lurigancho, Lima, Lima',
    status: 'Resuelto',
    createdAt: '2026-08-05',
    updatedAt: '2026-08-09',
    citizenName: 'Vecino',
    citizenId: 'user',
    priority: 'Alta',
    notes: [
      { author: 'Ing. Torres', text: 'Bacheo temporal realizado. Se programará asfaltado definitivo en el siguiente plan de mantenimiento.', date: '2026-08-09' }
    ]
  },
  {
    id: 'SJL-2026-004',
    category: 'Fugas de agua',
    description: 'Rotura de tubería en berma central. El agua está generando aniego en la calzada y riesgo para las viviendas aledañas.',
    address: 'Av. Próceres de la Independencia 2100, Urb. San Carlos, San Juan de Lurigancho, Lima, Lima',
    status: 'En Proceso',
    createdAt: '2026-08-11',
    updatedAt: '2026-08-12',
    citizenName: 'Carlos Mendoza',
    citizenId: 'other',
    priority: 'Alta',
    notes: [
      { author: 'Téc. Villanueva', text: 'Coordinando con cuadrilla de emergencia para intervención urgente.', date: '2026-08-12' }
    ]
  },
  {
    id: 'SJL-2026-005',
    category: 'Luminarias',
    description: 'Cuatro postes de luz sin funcionar en avenida principal. El sector afectado tiene alta afluencia peatonal nocturna.',
    address: 'Av. Fernando Wiesse 850, Urb. Canto Grande, San Juan de Lurigancho, Lima, Lima',
    status: 'Pendiente',
    createdAt: '2026-08-12',
    updatedAt: '2026-08-12',
    citizenName: 'Rosa Quispe',
    citizenId: 'other',
    priority: 'Alta',
    notes: []
  },
  {
    id: 'SJL-2026-006',
    category: 'Basura acumulada',
    description: 'Microbasural informal formado en terreno baldío. Desmonte acumulado desde hace dos semanas.',
    address: 'Jr. Cuzco 456, Urb. Chacarilla de Otero, San Juan de Lurigancho, Lima, Lima',
    status: 'Resuelto',
    createdAt: '2026-08-03',
    updatedAt: '2026-08-08',
    citizenName: 'Jorge Huamán',
    citizenId: 'other',
    priority: 'Baja',
    notes: [
      { author: 'Sup. Leiva', text: 'Limpieza y retiro de desmonte ejecutado con maquinaria pesada.', date: '2026-08-08' }
    ]
  }
];

let currentRole = null;
let currentUserId = null;
let currentUserName = '';
let currentScreen = 'login';
let currentSelectedReportId = null;
let currentEmployeeView = 'kanban';
let currentEmployeeFilter = 'Todos';

// Wizard state
let wizardState = {
  step: 1,
  category: null,
  customCategory: '',
  description: '',
  address: '',
  lat: -11.9868,
  lng: -77.0035,
  hasPhoto: false
};

// Leaflet mapa y marcador
let leafletMapInstance = null;
let leafletMarkerInstance = null;
let geocodeDebounceTimer = null;

// editar estado de incidencia
let editIncidentState = {
  status: null,
  note: ''
};

// inicializacion y navegacion
document.addEventListener('DOMContentLoaded', () => {
  renderScreen('screen-login');
});

function navigateTo(screenName) {
  currentScreen = screenName;
  const header = document.getElementById('main-header');
  const btnBack = document.getElementById('btn-nav-back');
  
  // Ocultar todas las pantallas
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));

  if (screenName === 'login') {
    if (header) header.classList.add('hidden');
    const screenLogin = document.getElementById('screen-login');
    if (screenLogin) screenLogin.classList.remove('hidden');
    toggleAuthMode('login');
    return;
  }

  if (header) header.classList.remove('hidden');

  if (['citizen-new-report', 'citizen-report-detail', 'employee-incident'].includes(screenName)) {
    if (btnBack) btnBack.classList.remove('hidden');
  } else {
    if (btnBack) btnBack.classList.add('hidden');
  }

  if (screenName === 'citizen-dashboard') {
    renderCitizenDashboard();
    const sc = document.getElementById('screen-citizen-dashboard');
    if (sc) sc.classList.remove('hidden');
  } else if (screenName === 'citizen-new-report') {
    resetWizard();
    const sc = document.getElementById('screen-citizen-new-report');
    if (sc) sc.classList.remove('hidden');
  } else if (screenName === 'citizen-report-detail') {
    renderCitizenReportDetail(currentSelectedReportId);
    const sc = document.getElementById('screen-citizen-report-detail');
    if (sc) sc.classList.remove('hidden');
  } else if (screenName === 'employee-dashboard') {
    renderEmployeeDashboard();
    const sc = document.getElementById('screen-employee-dashboard');
    if (sc) sc.classList.remove('hidden');
  } else if (screenName === 'employee-incident') {
    renderEmployeeIncident(currentSelectedReportId);
    const sc = document.getElementById('screen-employee-incident');
    if (sc) sc.classList.remove('hidden');
  }
}

function handleNavigationBack() {
  if (currentRole === 'employee') {
    navigateTo('employee-dashboard');
  } else {
    navigateTo('citizen-dashboard');
  }
}

function renderScreen(screenId) {
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(screenId);
  if (target) target.classList.remove('hidden');
}

// login y registro
function toggleAuthMode(mode) {
  const loginBox = document.getElementById('login-box');
  const registerBox = document.getElementById('register-box');
  const loginError = document.getElementById('login-error');
  const registerError = document.getElementById('register-error');

  if (loginError) loginError.classList.add('hidden');
  if (registerError) registerError.classList.add('hidden');

  if (mode === 'register') {
    if (loginBox) loginBox.classList.add('hidden');
    if (registerBox) registerBox.classList.remove('hidden');
    const formReg = document.getElementById('form-register');
    if (formReg) formReg.reset();
  } else {
    if (registerBox) registerBox.classList.add('hidden');
    if (loginBox) loginBox.classList.remove('hidden');
    const formLog = document.getElementById('form-login');
    if (formLog) formLog.reset();
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('login-username').value.trim();
  const passwordInput = document.getElementById('login-password').value.trim();
  const errorBox = document.getElementById('login-error');
  const submitBtn = document.getElementById('btn-login-submit');

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Verificando...</span>`;

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Ingresar</span><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    const userFound = usersDatabase.find(
      u => u.username.toLowerCase() === usernameInput.toLowerCase() && u.password === passwordInput
    );

    if (userFound) {
      currentRole = userFound.role;
      currentUserId = userFound.id;
      currentUserName = userFound.name;

      const avatar = userFound.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'V';
      const roleText = userFound.role === 'employee' ? 'Panel Municipal' : 'Portal Ciudadano';

      setupUserProfile(userFound.name, avatar, roleText);

      if (userFound.role === 'employee') {
        navigateTo('employee-dashboard');
      } else {
        navigateTo('citizen-dashboard');
      }
    } else {
      if (errorBox) errorBox.classList.remove('hidden');
    }
  }, 400);
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('reg-confirm-password').value;
  
  const errorBox = document.getElementById('register-error');
  const errorText = document.getElementById('register-error-text');
  const submitBtn = document.getElementById('btn-register-submit');

  if (errorBox) errorBox.classList.add('hidden');

  if (password !== confirmPassword) {
    if (errorText) errorText.textContent = 'Las contraseñas no coinciden.';
    if (errorBox) errorBox.classList.remove('hidden');
    return;
  }

  if (password.length < 4) {
    if (errorText) errorText.textContent = 'La contraseña debe tener al menos 4 caracteres.';
    if (errorBox) errorBox.classList.remove('hidden');
    return;
  }

  const existingUser = usersDatabase.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUser) {
    if (errorText) errorText.textContent = 'El nombre de usuario ya está registrado.';
    if (errorBox) errorBox.classList.remove('hidden');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Registrando...</span>`;
  }

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Crear Cuenta</span><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>`;
    }

    const newUserId = 'user_' + Date.now();
    const newUser = {
      username: username,
      password: password,
      name: name,
      role: 'citizen',
      id: newUserId
    };

    usersDatabase.push(newUser);

    currentRole = 'citizen';
    currentUserId = newUserId;
    currentUserName = name;

    const avatar = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'V';
    setupUserProfile(name, avatar, 'Portal Ciudadano');

    showToast(`¡Bienvenido/a, ${name}! Cuenta creada exitosamente.`);
    navigateTo('citizen-dashboard');
  }, 500);
}

function setupUserProfile(name, avatarText, roleText) {
  const userNameEl = document.getElementById('user-name');
  const userAvatarEl = document.getElementById('user-avatar');
  const headerRoleBadge = document.getElementById('header-role-badge');
  const citizenDashUserName = document.getElementById('citizen-dashboard-user-name');

  if (userNameEl) userNameEl.textContent = name;
  if (userAvatarEl) userAvatarEl.textContent = avatarText;
  if (headerRoleBadge) headerRoleBadge.textContent = roleText;
  if (citizenDashUserName) citizenDashUserName.textContent = name;
}

function handleLogout() {
  currentRole = null;
  currentUserId = null;
  currentUserName = '';
  currentSelectedReportId = null;

  const formLogin = document.getElementById('form-login');
  if (formLogin) formLogin.reset();

  const formRegister = document.getElementById('form-register');
  if (formRegister) formRegister.reset();

  const loginError = document.getElementById('login-error');
  if (loginError) loginError.classList.add('hidden');

  const registerError = document.getElementById('register-error');
  if (registerError) registerError.classList.add('hidden');

  navigateTo('login');
}

// notificaciones
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgSpan = document.getElementById('toast-message');
  if (!toast || !msgSpan) return;

  msgSpan.textContent = message;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

// portal ciudadano - dashboard
function renderCitizenDashboard() {
  const citizenReports = reportsData.filter(r => r.citizenId === currentUserId || (!currentUserId && r.citizenId === 'user') || (currentUserId === 'user' && r.citizenId === 'user'));
  
  const pending = citizenReports.filter(r => r.status === 'Pendiente').length;
  const inProgress = citizenReports.filter(r => r.status === 'En Proceso').length;
  const resolved = citizenReports.filter(r => r.status === 'Resuelto').length;

  const pendingEl = document.getElementById('citizen-pending-count');
  const progressEl = document.getElementById('citizen-progress-count');
  const resolvedEl = document.getElementById('citizen-resolved-count');
  const countEl = document.getElementById('citizen-list-count');

  if (pendingEl) pendingEl.textContent = pending;
  if (progressEl) progressEl.textContent = inProgress;
  if (resolvedEl) resolvedEl.textContent = resolved;
  if (countEl) countEl.textContent = `HISTORIAL DE REPORTES (${citizenReports.length})`;

  const container = document.getElementById('citizen-reports-container');
  if (!container) return;
  container.innerHTML = '';

  if (citizenReports.length === 0) {
    container.innerHTML = `
      <div class="card p-6 text-center" style="padding: 48px 20px;">
        <div style="font-size: 40px; margin-bottom: 12px;">📋</div>
        <p class="text-slate-500 font-semibold text-sm">No tienes reportes activos aún.</p>
        <p class="text-slate-400 text-xs mt-1">Crea tu primer reporte usando el botón superior.</p>
      </div>
    `;
    return;
  }

  citizenReports.forEach(report => {
    const catCfg = CATEGORY_CONFIG[report.category] || { icon: '📌', color: '#64748B', class: 'bg-cat-otro' };
    const statusCfg = STATUS_CONFIG[report.status] || { class: 'status-pendiente' };
    
    const pct = report.status === 'Pendiente' ? 10 : report.status === 'En Proceso' ? 55 : 100;
    const progressColor = report.status === 'Resuelto' ? 'var(--success-600)' : report.status === 'En Proceso' ? 'var(--navy-700)' : 'var(--warning-600)';

    const card = document.createElement('div');
    card.className = 'report-item-card';
    card.onclick = () => {
      currentSelectedReportId = report.id;
      navigateTo('citizen-report-detail');
    };

    card.innerHTML = `
      <div class="report-card-thumbnail">
        <img src="archivo.jpeg" alt="Pocket Press en uso" class="media__img" onerror="this.style.display='none'">
      </div>
      <div class="report-card-body">
        <div class="report-card-top">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="badge-code">${report.id}</span>
            <span class="badge-pill ${statusCfg.class}">
              <span class="status-dot"></span>
              <span>${report.status}</span>
            </span>
          </div>
          <span class="badge-pill ${catCfg.class}">
            <span>${catCfg.icon}</span>
            <span>${escapeHtml(report.category)}</span>
          </span>
        </div>
        <p class="report-card-desc truncate">${escapeHtml(report.description)}</p>
        <div class="report-card-address">
          <span>📍</span>
          <span>${escapeHtml(report.address)}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${pct}%; background-color: ${progressColor};"></div>
        </div>
        <div class="report-card-footer">
          Actualizado: ${formatDate(report.updatedAt)}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// pasos de nuevo reporte
function resetWizard() {
  wizardState = {
    step: 1,
    category: null,
    customCategory: '',
    description: '',
    address: '',
    lat: -11.9868,
    lng: -77.0035,
    hasPhoto: false
  };

  const descEl = document.getElementById('new-report-desc');
  const addrEl = document.getElementById('new-report-address');
  const fileEl = document.getElementById('new-report-file');
  const otherInputEl = document.getElementById('other-category-input');
  const otherFieldEl = document.getElementById('other-category-field');
  const submitBtn = document.getElementById('btn-step3-submit');

  if (descEl) descEl.value = '';
  if (addrEl) addrEl.value = '';
  if (fileEl) fileEl.value = '';
  if (otherInputEl) otherInputEl.value = '';
  if (otherFieldEl) otherFieldEl.classList.add('hidden');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>✓ Enviar Reporte</span>`;
  }

  removeSelectedPhoto();
  updateCategorySelectionUI();
  goToWizardStep(1);
}

function goToWizardStep(stepNumber) {
  wizardState.step = stepNumber;

  for (let s = 1; s <= 3; s++) {
    const stepView = document.getElementById(`wizard-step-${s}`);
    const navItem = document.getElementById(`step-nav-${s}`);
    
    if (stepView && navItem) {
      if (s === stepNumber) {
        stepView.classList.remove('hidden');
        navItem.classList.add('active');
        navItem.classList.remove('completed');
        const badge = navItem.querySelector('.step-badge');
        if (badge) badge.innerHTML = `${s}`;
      } else {
        stepView.classList.add('hidden');
        if (s < stepNumber) {
          navItem.classList.add('completed');
          navItem.classList.remove('active');
          const badge = navItem.querySelector('.step-badge');
          if (badge) badge.innerHTML = `✓`;
        } else {
          navItem.classList.remove('active', 'completed');
          const badge = navItem.querySelector('.step-badge');
          if (badge) badge.innerHTML = `${s}`;
        }
      }
    }
  }

  const line1 = document.getElementById('step-line-1');
  const line2 = document.getElementById('step-line-2');
  if (line1) {
    if (stepNumber > 1) line1.classList.add('completed');
    else line1.classList.remove('completed');
  }
  if (line2) {
    if (stepNumber > 2) line2.classList.add('completed');
    else line2.classList.remove('completed');
  }

  if (stepNumber === 3) {
    updateSummaryCard();
    setTimeout(initOrUpdateMap, 200);
  }
}

function selectWizardCategory(category) {
  wizardState.category = category;
  updateCategorySelectionUI();

  const otherField = document.getElementById('other-category-field');
  const btnNext = document.getElementById('btn-step1-next');

  if (category === 'Otro') {
    if (otherField) otherField.classList.remove('hidden');
    if (btnNext) btnNext.disabled = wizardState.customCategory.trim().length === 0;
  } else {
    if (otherField) otherField.classList.add('hidden');
    if (btnNext) btnNext.disabled = false;
  }
}

function handleOtherCategoryInput() {
  const otherInput = document.getElementById('other-category-input');
  wizardState.customCategory = otherInput ? otherInput.value.trim() : '';
  const btnNext = document.getElementById('btn-step1-next');
  if (btnNext) btnNext.disabled = wizardState.customCategory.length === 0;
}

function updateCategorySelectionUI() {
  document.querySelectorAll('.category-card-btn').forEach(btn => {
    if (btn.getAttribute('data-cat') === wizardState.category) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

function handleDescriptionInput() {
  const descEl = document.getElementById('new-report-desc');
  wizardState.description = descEl ? descEl.value.trim() : '';
  const btnNext = document.getElementById('btn-step2-next');
  if (btnNext) btnNext.disabled = wizardState.description.length === 0;
}

function triggerFileInput() {
  const fileInput = document.getElementById('new-report-file');
  if (fileInput) fileInput.click();
}

function handleFileSelected(event) {
  const file = event.target.files[0];
  if (file) {
    wizardState.hasPhoto = true;
    const emptyZone = document.getElementById('dropzone-empty');
    const previewZone = document.getElementById('dropzone-preview');
    if (emptyZone) emptyZone.classList.add('hidden');
    if (previewZone) previewZone.classList.remove('hidden');
  }
}

function handleDragOver(e) {
  e.preventDefault();
  const zone = document.getElementById('upload-zone');
  if (zone) zone.classList.add('dragover');
}

function handleDragLeave(e) {
  e.preventDefault();
  const zone = document.getElementById('upload-zone');
  if (zone) zone.classList.remove('dragover');
}

function handleFileDrop(e) {
  e.preventDefault();
  const zone = document.getElementById('upload-zone');
  if (zone) zone.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    wizardState.hasPhoto = true;
    const emptyZone = document.getElementById('dropzone-empty');
    const previewZone = document.getElementById('dropzone-preview');
    if (emptyZone) emptyZone.classList.add('hidden');
    if (previewZone) previewZone.classList.remove('hidden');
  }
}

function removeSelectedPhoto(event) {
  if (event) event.stopPropagation();
  wizardState.hasPhoto = false;
  const fileInput = document.getElementById('new-report-file');
  if (fileInput) fileInput.value = '';
  const emptyZone = document.getElementById('dropzone-empty');
  const previewZone = document.getElementById('dropzone-preview');
  if (emptyZone) emptyZone.classList.remove('hidden');
  if (previewZone) previewZone.classList.add('hidden');
}

function handleAddressInput() {
  const addrEl = document.getElementById('new-report-address');
  wizardState.address = addrEl ? addrEl.value.trim() : '';
  const canSubmit = wizardState.address.length > 0;
  const submitBtn = document.getElementById('btn-step3-submit');
  if (submitBtn) submitBtn.disabled = !canSubmit;

  const addrPreview = document.getElementById('summary-addr-preview');
  if (addrPreview) {
    addrPreview.textContent = wizardState.address ? `📍 ${wizardState.address}` : '';
  }
}

function updateSummaryCard() {
  const finalCategory = wizardState.category === 'Otro' ? (wizardState.customCategory || 'Otro') : wizardState.category;
  const catCfg = CATEGORY_CONFIG[wizardState.category] || { icon: '📌', color: '#64748B', class: 'bg-cat-otro' };
  
  const catBadge = document.getElementById('summary-cat-badge');
  if (catBadge) {
    catBadge.innerHTML = `
      <span class="badge-pill ${catCfg.class}">
        <span>${catCfg.icon}</span>
        <span>${escapeHtml(finalCategory)}</span>
      </span>
    `;
  }

  const descPreview = document.getElementById('summary-desc-preview');
  if (descPreview) {
    descPreview.textContent = wizardState.description || 'Sin descripción';
  }

  const addrPreview = document.getElementById('summary-addr-preview');
  if (addrPreview) {
    addrPreview.textContent = wizardState.address ? `📍 ${wizardState.address}` : '';
  }
}

// motor de geocodificacion y mapa
const SJL_SECTORS = [
  {
    name: 'Zárate / Chacarilla de Otero',
    minLat: -12.0380, maxLat: -12.0080, minLng: -77.0160, maxLng: -76.9900,
    streets: [
      { name: 'Av. Gran Chimú', baseNum: 110, step: 1400 },
      { name: 'Jr. Las Flores', baseNum: 102, step: 980 },
      { name: 'Av. Pirámide del Sol', baseNum: 204, step: 1100 },
      { name: 'Av. Malecón Checa', baseNum: 310, step: 1600 },
      { name: 'Jr. Chinchaysuyo', baseNum: 104, step: 720 },
      { name: 'Jr. Próceres de Tarma', baseNum: 102, step: 640 },
      { name: 'Jr. Cuzco', baseNum: 202, step: 580 },
      { name: 'Jr. Payasca', baseNum: 110, step: 420 },
      { name: 'Pasaje Huancané', baseNum: 104, step: 260 },
      { name: 'Calle Juan A. Moyobamba', baseNum: 102, step: 340 },
      { name: 'Pasaje Río de Janeiro', baseNum: 108, step: 220 },
      { name: 'Ca. Los Tumpis', baseNum: 102, step: 380 }
    ]
  },
  {
    name: 'Las Flores / San Hilarión',
    minLat: -12.0080, maxLat: -11.9820, minLng: -77.0160, maxLng: -76.9850,
    streets: [
      { name: 'Av. Las Flores de Primavera', baseNum: 400, step: 2100 },
      { name: 'Av. Próceres de la Independencia', baseNum: 1200, step: 2800 },
      { name: 'Jr. Los Tusílagos', baseNum: 110, step: 680 },
      { name: 'Jr. Los Tulipanes', baseNum: 104, step: 590 },
      { name: 'Jr. Los Helechos', baseNum: 102, step: 480 },
      { name: 'Jr. Los Jazmines', baseNum: 106, step: 520 },
      { name: 'Av. El Sol', baseNum: 210, step: 880 },
      { name: 'Pasaje San Hilarión', baseNum: 102, step: 240 },
      { name: 'Calle Los Gladiolos', baseNum: 104, step: 360 }
    ]
  },
  {
    name: 'Canto Grande / Canto Rey',
    minLat: -11.9820, maxLat: -11.9400, minLng: -77.0250, maxLng: -76.9800,
    streets: [
      { name: 'Av. José Carlos Mariátegui', baseNum: 310, step: 1850 },
      { name: 'Av. Fernando Wiesse', baseNum: 1100, step: 3600 },
      { name: 'Av. Canto Grande', baseNum: 820, step: 3100 },
      { name: 'Av. San Martín', baseNum: 204, step: 980 },
      { name: 'Av. Santa Rosa', baseNum: 210, step: 1120 },
      { name: 'Jr. Los Postes', baseNum: 102, step: 760 },
      { name: 'Jr. Los Ciruelos', baseNum: 104, step: 590 },
      { name: 'Pasaje El Rosario', baseNum: 102, step: 280 },
      { name: 'Calle Los Geranios', baseNum: 106, step: 410 },
      { name: 'Jr. Canto Rey', baseNum: 110, step: 650 },
      { name: 'Pasaje Las Flores', baseNum: 102, step: 210 }
    ]
  },
  {
    name: 'Mangomarca',
    minLat: -12.0250, maxLat: -11.9950, minLng: -76.9920, maxLng: -76.9680,
    streets: [
      { name: 'Av. Las Lomas', baseNum: 210, step: 1300 },
      { name: 'Av. Santuario', baseNum: 104, step: 820 },
      { name: 'Ca. Las Águilas', baseNum: 102, step: 460 },
      { name: 'Jr. Los Geoglifos', baseNum: 108, step: 580 },
      { name: 'Pasaje Las Terrazas', baseNum: 102, step: 220 },
      { name: 'Ca. El Parque', baseNum: 104, step: 310 }
    ]
  },
  {
    name: 'Campoy / Huachipa Norte',
    minLat: -12.0150, maxLat: -11.9800, minLng: -76.9800, maxLng: -76.9500,
    streets: [
      { name: 'Av. Principal de Campoy', baseNum: 110, step: 1100 },
      { name: 'Ca. Los Álamos', baseNum: 102, step: 620 },
      { name: 'Av. Los Cedros', baseNum: 204, step: 890 },
      { name: 'Ca. El Sol de Campoy', baseNum: 102, step: 480 },
      { name: 'Pasaje Las Palmeras', baseNum: 104, step: 240 },
      { name: 'Av. FAP', baseNum: 110, step: 520 }
    ]
  },
  {
    name: 'Huáscar / Mariscal Cáceres / Bayóvar',
    minLat: -11.9400, maxLat: -11.8950, minLng: -77.0280, maxLng: -76.9750,
    streets: [
      { name: 'Av. 13 de Enero', baseNum: 900, step: 2900 },
      { name: 'Av. Central', baseNum: 350, step: 2100 },
      { name: 'Av. Bayóvar', baseNum: 108, step: 1200 },
      { name: 'Av. Héroes del Cenepa', baseNum: 202, step: 1400 },
      { name: 'Jr. Canto Bello', baseNum: 104, step: 720 },
      { name: 'Av. Montenegro', baseNum: 310, step: 1500 },
      { name: 'Av. Del Muro', baseNum: 102, step: 840 },
      { name: 'Pasaje 24 de Junio', baseNum: 104, step: 260 },
      { name: 'Calle Santa Elena', baseNum: 102, step: 390 }
    ]
  },
  {
    name: 'Jicamarca / Huanta / Cruz de Motupe',
    minLat: -11.8950, maxLat: -11.8300, minLng: -77.0350, maxLng: -76.9550,
    streets: [
      { name: 'Av. Prolongación Fernando Wiesse', baseNum: 3600, step: 5800 },
      { name: 'Av. El Muelle', baseNum: 104, step: 740 },
      { name: 'Av. Principal de Jicamarca', baseNum: 210, step: 1650 },
      { name: 'Av. Valle Sagrado', baseNum: 102, step: 820 },
      { name: 'Pasaje Los Olivos', baseNum: 104, step: 280 },
      { name: 'Calle La Unión', baseNum: 102, step: 390 }
    ]
  }
];

function buildFullAddress(street, neighborhood) {
  const parts = [];
  if (street) parts.push(street);
  if (neighborhood && !street.toLowerCase().includes(neighborhood.toLowerCase())) {
    parts.push(neighborhood.startsWith('Urb.') ? neighborhood : `Urb. ${neighborhood}`);
  }
  parts.push('San Juan de Lurigancho');
  parts.push('Lima');
  parts.push('Lima');
  return parts.join(', ');
}

function calculateLocalSJLAddress(lat, lng) {
  let sector = SJL_SECTORS.find(
    s => lat >= s.minLat && lat <= s.maxLat && lng >= s.minLng && lng <= s.maxLng
  );

  if (!sector) {
    let minDist = Infinity;
    SJL_SECTORS.forEach(s => {
      const midLat = (s.minLat + s.maxLat) / 2;
      const midLng = (s.minLng + s.maxLng) / 2;
      const d = Math.hypot(lat - midLat, lng - midLng);
      if (d < minDist) {
        minDist = d;
        sector = s;
      }
    });
  }

  const latSpan = Math.abs(sector.maxLat - sector.minLat) || 0.01;
  const lngSpan = Math.abs(sector.maxLng - sector.minLng) || 0.01;

  const latProgress = Math.min(Math.max((lat - sector.minLat) / latSpan, 0), 1);
  const lngProgress = Math.min(Math.max((lng - sector.minLng) / lngSpan, 0), 1);

  const streetIdx = Math.floor((latProgress * 5 + lngProgress * 7)) % sector.streets.length;
  const street = sector.streets[streetIdx] || sector.streets[0];

  const factor = (latProgress + lngProgress) / 2;
  const numCalculado = Math.round(street.baseNum + factor * street.step);
  const numeroFinal = (numCalculado - (numCalculado % 10)) + 2;

  const streetPart = `${street.name} ${numeroFinal}`;
  return buildFullAddress(streetPart, sector.name);
}

function initOrUpdateMap() {
  const defaultCoords = [-11.9868, -77.0035]; // SJL Centro

  if (typeof L === 'undefined') return;

  try {
    const mapEl = document.getElementById('leaflet-map');
    if (!mapEl) return;

    if (!leafletMapInstance) {
      leafletMapInstance = L.map('leaflet-map', {
        center: defaultCoords,
        zoom: 15,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }).addTo(leafletMapInstance);

      leafletMarkerInstance = L.marker(defaultCoords, {
        draggable: true
      }).addTo(leafletMapInstance);

      updateExactAddress(defaultCoords[0], defaultCoords[1]);

      leafletMapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setMapPinLocation(lat, lng);
      });

      leafletMarkerInstance.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        setMapPinLocation(lat, lng);
      });
    } else {
      leafletMapInstance.invalidateSize();
      leafletMapInstance.setView([wizardState.lat, wizardState.lng], 15);
      leafletMarkerInstance.setLatLng([wizardState.lat, wizardState.lng]);
    }
  } catch (err) {
    console.error('Error mapa:', err);
  }
}

function setMapPinLocation(lat, lng) {
  wizardState.lat = lat;
  wizardState.lng = lng;
  if (leafletMarkerInstance) {
    leafletMarkerInstance.setLatLng([lat, lng]);
  }
  updateExactAddress(lat, lng);
}

function updateExactAddress(lat, lng) {
  const addressInput = document.getElementById('new-report-address');
  const statusText = document.getElementById('map-pin-status-text');

  if (statusText) statusText.textContent = 'Obteniendo dirección exacta...';
  if (addressInput) addressInput.placeholder = 'Identificando avenida, jirón o pasaje...';

  if (geocodeDebounceTimer) clearTimeout(geocodeDebounceTimer);

  geocodeDebounceTimer = setTimeout(async () => {
    let resolvedAddress = null;

    // 1. Nominatim OpenStreetMap (Zoom 18 para calle/pasaje exacto)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1600);

      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (osmData && osmData.address) {
          const a = osmData.address;
          const via = a.road || a.pedestrian || a.footway || a.path || a.residential || a.street || a.cycleway || a.service || a.track || a.alley;
          const num = a.house_number ? ` ${a.house_number}` : '';
          const barrio = a.neighbourhood || a.suburb || a.quarter || a.village || '';

          if (via) {
            resolvedAddress = buildFullAddress(`${via}${num}`, barrio);
          }
        }
      }
    } catch (e) {}

    // 2. Photon Komoot OSM API (Alta velocidad)
    if (!resolvedAddress) {
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 1200);

        const photonRes = await fetch(
          `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}&lang=es`,
          { signal: controller2.signal }
        );
        clearTimeout(timeoutId2);

        if (photonRes.ok) {
          const pData = await photonRes.json();
          const props = pData?.features?.[0]?.properties;
          if (props) {
            const via = props.street || (props.osm_key === 'highway' ? props.name : null);
            const num = props.housenumber ? ` ${props.housenumber}` : '';
            const barrio = props.district || props.locality || '';
            if (via) {
              resolvedAddress = buildFullAddress(`${via}${num}`, barrio);
            }
          }
        }
      } catch (e) {}
    }

    // 3. Motor Catastral Local de SJL (Garantiza siempre vía, número y urbanización real)
    if (!resolvedAddress) {
      resolvedAddress = calculateLocalSJLAddress(lat, lng);
    }

    if (addressInput) {
      addressInput.value = resolvedAddress;
      handleAddressInput();
    }

    if (statusText) {
      statusText.textContent = '📍 ' + resolvedAddress.split(',')[0];
    }
  }, 80);
}

function submitNewReport() {
  const submitBtn = document.getElementById('btn-step3-submit');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando...</span>`;
  }

  setTimeout(() => {
    const today = new Date().toISOString().split('T')[0];
    const newId = `SJL-${new Date().getFullYear()}-00${reportsData.length + 1}`;
    const finalCategory = wizardState.category === 'Otro' ? wizardState.customCategory : wizardState.category;

    const newReport = {
      id: newId,
      category: finalCategory,
      description: wizardState.description,
      address: wizardState.address,
      status: 'Pendiente',
      createdAt: today,
      updatedAt: today,
      citizenName: currentUserName || 'Vecino',
      citizenId: currentUserId || 'user',
      priority: 'Media',
      notes: []
    };

    reportsData.unshift(newReport);
    showToast(`Reporte enviado exitosamente • ID: ${newId}`);
    
    // Restaurar estado del botón antes de navegar
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>✓ Enviar Reporte</span>`;
    }

    navigateTo('citizen-dashboard');
  }, 700);
}

// detalle de reporte ciudadano
function renderCitizenReportDetail(reportId) {
  const report = reportsData.find(r => r.id === reportId);
  if (!report) return;

  const catCfg = CATEGORY_CONFIG[report.category] || { icon: '📌', class: 'bg-cat-otro' };
  const statusCfg = STATUS_CONFIG[report.status] || { class: 'status-pendiente' };

  const idEl = document.getElementById('detail-report-id');
  if (idEl) idEl.textContent = report.id;
  
  const catEl = document.getElementById('detail-cat-badge');
  if (catEl) {
    catEl.innerHTML = `
      <span class="badge-pill ${catCfg.class}">
        <span>${catCfg.icon}</span>
        <span>${escapeHtml(report.category)}</span>
      </span>
    `;
  }

  const statusEl = document.getElementById('detail-status-badge');
  if (statusEl) {
    statusEl.innerHTML = `
      <span class="badge-pill ${statusCfg.class}">
        <span class="status-dot"></span>
        <span>${report.status}</span>
      </span>
    `;
  }

  const descEl = document.getElementById('detail-description');
  if (descEl) descEl.textContent = report.description;

  const addrEl = document.getElementById('detail-address');
  if (addrEl) addrEl.textContent = report.address;

  const dateCreatedEl = document.getElementById('detail-date-created');
  if (dateCreatedEl) dateCreatedEl.textContent = formatDateLong(report.createdAt);

  const dateUpdatedEl = document.getElementById('detail-date-updated');
  if (dateUpdatedEl) dateUpdatedEl.textContent = formatDateLong(report.updatedAt);

  const steps = ['Pendiente', 'En Proceso', 'Resuelto'];
  const currentIdx = steps.indexOf(report.status);
  const timelineContainer = document.getElementById('detail-timeline-container');
  if (timelineContainer) {
    timelineContainer.innerHTML = '';
    steps.forEach((stepName, i) => {
      const isCompleted = i < currentIdx;
      const isActive = i === currentIdx;
      const isLast = i === steps.length - 1;

      let stepClass = '';
      if (isCompleted) stepClass = 'completed';
      else if (isActive) stepClass = 'active';

      const item = document.createElement('div');
      item.className = `timeline-step ${stepClass}`;
      item.innerHTML = `
        <div class="timeline-step-left">
          <div class="timeline-step-circle">${isCompleted ? '✓' : (i + 1)}</div>
          ${!isLast ? '<div class="timeline-step-line"></div>' : ''}
        </div>
        <div class="timeline-step-right">
          <div class="timeline-step-title">${stepName}</div>
          ${isActive ? '<div class="timeline-step-sub">Estado actual del reporte</div>' : ''}
        </div>
      `;
      timelineContainer.appendChild(item);
    });
  }

  const notesCard = document.getElementById('detail-notes-card');
  const notesList = document.getElementById('detail-notes-list');
  if (notesList && notesCard) {
    notesList.innerHTML = '';
    if (report.notes.length === 0) {
      notesCard.classList.add('hidden');
    } else {
      notesCard.classList.remove('hidden');
      report.notes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note-item';
        noteEl.innerHTML = `
          <div class="note-avatar">${note.author.charAt(0)}</div>
          <div class="note-bubble">
            <div class="note-header">
              <span class="note-author">${escapeHtml(note.author)}</span>
              <span class="note-date">${formatDate(note.date)}</span>
            </div>
            <p class="note-text">${escapeHtml(note.text)}</p>
          </div>
        `;
        notesList.appendChild(noteEl);
      });
    }
  }
}

// panel de empleado
function renderEmployeeDashboard() {
  const total = reportsData.length;
  const pending = reportsData.filter(r => r.status === 'Pendiente').length;
  const inProgress = reportsData.filter(r => r.status === 'En Proceso').length;
  const resolved = reportsData.filter(r => r.status === 'Resuelto').length;

  const totalEl = document.getElementById('emp-metric-total');
  const pendingEl = document.getElementById('emp-metric-pending');
  const progEl = document.getElementById('emp-metric-progress');
  const resEl = document.getElementById('emp-metric-resolved');

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (progEl) progEl.textContent = inProgress;
  if (resEl) resEl.textContent = resolved;

  const tabTodos = document.getElementById('tab-count-todos');
  const tabPending = document.getElementById('tab-count-pending');
  const tabProgress = document.getElementById('tab-count-progress');
  const tabResolved = document.getElementById('tab-count-resolved');

  if (tabTodos) tabTodos.textContent = `(${total})`;
  if (tabPending) tabPending.textContent = `(${pending})`;
  if (tabProgress) tabProgress.textContent = `(${inProgress})`;
  if (tabResolved) tabResolved.textContent = `(${resolved})`;

  renderEmployeeKanban();
  renderEmployeeTable();
}

function setEmployeeView(viewMode) {
  currentEmployeeView = viewMode;
  const btnKanban = document.getElementById('btn-view-kanban');
  const btnTable = document.getElementById('btn-view-table');
  const kanbanContainer = document.getElementById('employee-kanban-view');
  const tableContainer = document.getElementById('employee-table-view');

  if (viewMode === 'kanban') {
    if (btnKanban) btnKanban.classList.add('active');
    if (btnTable) btnTable.classList.remove('active');
    if (kanbanContainer) kanbanContainer.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
  } else {
    if (btnTable) btnTable.classList.add('active');
    if (btnKanban) btnKanban.classList.remove('active');
    if (kanbanContainer) kanbanContainer.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');
  }
}

function renderEmployeeKanban() {
  const pendingReports = reportsData.filter(r => r.status === 'Pendiente');
  const progressReports = reportsData.filter(r => r.status === 'En Proceso');
  const resolvedReports = reportsData.filter(r => r.status === 'Resuelto');

  const cPending = document.getElementById('count-kanban-pending');
  const cProgress = document.getElementById('count-kanban-progress');
  const cResolved = document.getElementById('count-kanban-resolved');

  if (cPending) cPending.textContent = pendingReports.length;
  if (cProgress) cProgress.textContent = progressReports.length;
  if (cResolved) cResolved.textContent = resolvedReports.length;

  renderKanbanCards('kanban-list-pending', pendingReports);
  renderKanbanCards('kanban-list-progress', progressReports);
  renderKanbanCards('kanban-list-resolved', resolvedReports);
}

function renderKanbanCards(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  list.forEach(report => {
    const catCfg = CATEGORY_CONFIG[report.category] || { icon: '📌', class: 'bg-cat-otro' };
    const priorityClass = PRIORITY_CONFIG[report.priority] || 'priority-media';

    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.onclick = () => {
      currentSelectedReportId = report.id;
      navigateTo('employee-incident');
    };

    card.innerHTML = `
      <div class="kanban-card-top">
        <span class="badge-code">${report.id}</span>
        <span class="badge-pill ${priorityClass}">${report.priority}</span>
      </div>
      <span class="badge-pill ${catCfg.class}">
        <span>${catCfg.icon}</span>
        <span>${escapeHtml(report.category)}</span>
      </span>
      <p class="kanban-card-desc">${escapeHtml(report.description)}</p>
      <div class="kanban-card-meta">
        <div>📍 ${escapeHtml(report.address.split(',')[0])}</div>
        <div style="margin-top: 4px;">📅 ${formatDate(report.updatedAt)} &bull; 👤 ${escapeHtml(report.citizenName)}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterEmployeeTable(filterStatus, btn) {
  currentEmployeeFilter = filterStatus;
  document.querySelectorAll('.tab-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderEmployeeTable();
}

function renderEmployeeTable() {
  const filtered = currentEmployeeFilter === 'Todos'
    ? reportsData
    : reportsData.filter(r => r.status === currentEmployeeFilter);

  const tbody = document.getElementById('employee-table-body');
  if (!tbody) return;
  tbody.innerHTML = '';

  filtered.forEach(report => {
    const catCfg = CATEGORY_CONFIG[report.category] || { icon: '📌', class: 'bg-cat-otro' };
    const statusCfg = STATUS_CONFIG[report.status] || { class: 'status-pendiente' };
    const priorityClass = PRIORITY_CONFIG[report.priority] || 'priority-media';

    const tr = document.createElement('tr');
    tr.onclick = () => {
      currentSelectedReportId = report.id;
      navigateTo('employee-incident');
    };

    tr.innerHTML = `
      <td><span class="badge-code font-bold">${report.id}</span></td>
      <td>
        <span class="badge-pill ${catCfg.class}">
          <span>${catCfg.icon}</span>
          <span>${escapeHtml(report.category)}</span>
        </span>
      </td>
      <td style="max-width: 220px;" class="truncate">${escapeHtml(report.description)}</td>
      <td style="max-width: 160px;" class="truncate">${escapeHtml(report.address.split(',')[0])}</td>
      <td>${escapeHtml(report.citizenName)}</td>
      <td>
        <span class="badge-pill ${statusCfg.class}">
          <span class="status-dot"></span>
          <span>${report.status}</span>
        </span>
      </td>
      <td><span class="badge-pill ${priorityClass}">${report.priority}</span></td>
      <td class="text-slate-400">${formatDate(report.createdAt)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// gestion de incidencias empleado
function renderEmployeeIncident(reportId) {
  const report = reportsData.find(r => r.id === reportId);
  if (!report) return;

  editIncidentState.status = report.status;
  editIncidentState.note = '';

  const catCfg = CATEGORY_CONFIG[report.category] || { icon: '📌', class: 'bg-cat-otro' };
  const statusCfg = STATUS_CONFIG[report.status] || { class: 'status-pendiente' };
  const priorityClass = PRIORITY_CONFIG[report.priority] || 'priority-media';

  const idEl = document.getElementById('emp-inc-id');
  if (idEl) idEl.textContent = report.id;
  
  const catEl = document.getElementById('emp-inc-cat-badge');
  if (catEl) {
    catEl.innerHTML = `
      <span class="badge-pill ${catCfg.class}">
        <span>${catCfg.icon}</span>
        <span>${escapeHtml(report.category)}</span>
      </span>
    `;
  }

  const statusEl = document.getElementById('emp-inc-status-badge');
  if (statusEl) {
    statusEl.innerHTML = `
      <span class="badge-pill ${statusCfg.class}">
        <span class="status-dot"></span>
        <span>${report.status}</span>
      </span>
    `;
  }

  const priorityEl = document.getElementById('emp-inc-priority-badge');
  if (priorityEl) {
    priorityEl.className = `badge-pill ${priorityClass}`;
    priorityEl.textContent = `Prioridad ${report.priority}`;
  }

  const descEl = document.getElementById('emp-inc-desc');
  if (descEl) descEl.textContent = report.description;

  const citEl = document.getElementById('emp-inc-citizen');
  if (citEl) citEl.textContent = report.citizenName;

  const dateEl = document.getElementById('emp-inc-date');
  if (dateEl) dateEl.textContent = formatDateLong(report.createdAt);

  const addrEl = document.getElementById('emp-inc-address');
  if (addrEl) addrEl.textContent = report.address;

  const notesCountEl = document.getElementById('emp-inc-notes-count');
  if (notesCountEl) notesCountEl.textContent = `HISTORIAL DE NOTAS (${report.notes.length})`;

  const notesStack = document.getElementById('emp-inc-notes-stack');
  if (notesStack) {
    notesStack.innerHTML = '';
    if (report.notes.length === 0) {
      notesStack.innerHTML = `<p class="text-slate-400 text-xs py-2 text-center">Sin notas internas aún.</p>`;
    } else {
      report.notes.forEach(note => {
        const noteEl = document.createElement('div');
        noteEl.className = 'note-item';
        noteEl.innerHTML = `
          <div class="note-avatar">${note.author.charAt(0)}</div>
          <div class="note-bubble">
            <div class="note-header">
              <span class="note-author">${escapeHtml(note.author)}</span>
              <span class="note-date">${formatDate(note.date)}</span>
            </div>
            <p class="note-text">${escapeHtml(note.text)}</p>
          </div>
        `;
        notesStack.appendChild(noteEl);
      });
    }
  }

  const noteInput = document.getElementById('emp-action-note');
  if (noteInput) noteInput.value = '';

  const curStatusLabel = document.getElementById('emp-current-status-label');
  if (curStatusLabel) curStatusLabel.textContent = report.status;

  updateStatusButtonsUI(report.status);
}

function selectIncidentStatus(status) {
  editIncidentState.status = status;
  updateStatusButtonsUI(status);
}

function updateStatusButtonsUI(activeStatus) {
  document.querySelectorAll('.status-option-btn').forEach(btn => {
    const s = btn.getAttribute('data-status');
    const check = btn.querySelector('.check-mark');
    if (s === activeStatus) {
      btn.classList.add('selected');
      if (check) check.classList.remove('hidden');
    } else {
      btn.classList.remove('selected');
      if (check) check.classList.add('hidden');
    }
  });
}

function saveIncidentChanges() {
  const noteInput = document.getElementById('emp-action-note');
  const noteText = noteInput ? noteInput.value.trim() : '';
  const report = reportsData.find(r => r.id === currentSelectedReportId);
  if (!report) return;

  const btnSave = document.getElementById('btn-save-incident');
  if (btnSave) {
    btnSave.disabled = true;
    btnSave.innerHTML = `<span>Guardando...</span>`;
  }

  setTimeout(() => {
    report.status = editIncidentState.status;
    report.updatedAt = new Date().toISOString().split('T')[0];

    if (noteText.length > 0) {
      report.notes.push({
        author: 'Téc. Municipal',
        text: noteText,
        date: report.updatedAt
      });
    }

    if (btnSave) {
      btnSave.disabled = false;
      btnSave.innerHTML = `<span>✓ Guardado exitosamente</span>`;
    }

    showToast(`Incidencia ${report.id} actualizada con éxito`);
    renderEmployeeIncident(report.id);

    setTimeout(() => {
      if (btnSave) btnSave.innerHTML = `<span>Guardar cambios</span>`;
    }, 2000);
  }, 600);
}

// utilidades fecha y textos
function formatDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateLong(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

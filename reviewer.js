/* ============================================================
   CONFERENCE ABSTRACT MANAGEMENT SYSTEM — CORE APP JS
   Data Store, Authentication, Utilities, Navigation
   ============================================================ */

'use strict';

/* ── In-Memory Data Store with Persistence ─────────────────── */
const Store = (function() {
  const STORAGE_KEY = 'confms_data';
  let _data = null;
  
  const DEFAULT_DATA = {
    currentUser: null,
    users: [
      { id: 'u1', role: 'admin', firstName: 'Sarah', lastName: 'Mitchell', email: 'admin@confms.org', password: 'Admin@2024', institution: 'Conference Organizing Committee', expertise: [], avatar: 'SM', joined: '2024-01-01T00:00:00Z' },
      { id: 'u2', role: 'author', firstName: 'James', lastName: 'Okafor', email: 'james.okafor@university.edu', password: 'Author@2024', institution: 'University of Lagos', country: 'Nigeria', expertise: ['Machine Learning', 'Data Science'], avatar: 'JO', joined: '2024-03-15T00:00:00Z' },
      { id: 'u3', role: 'author', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@iit.ac.in', password: 'Author@2024', institution: 'IIT Bombay', country: 'India', expertise: ['Bioinformatics', 'Genomics'], avatar: 'PS', joined: '2024-04-02T00:00:00Z' },
      { id: 'u4', role: 'reviewer', firstName: 'Dr. Marcus', lastName: 'Chen', email: 'marcus.chen@mit.edu', password: 'Review@2024', institution: 'MIT', country: 'USA', expertise: ['AI', 'Machine Learning', 'Neural Networks'], avatar: 'MC', joined: '2024-02-10T00:00:00Z', availability: true, maxLoad: 5, currentLoad: 3 },
      { id: 'u5', role: 'reviewer', firstName: 'Dr. Amara', lastName: 'Nwosu', email: 'amara.nwosu@oxford.ac.uk', password: 'Review@2024', institution: 'University of Oxford', country: 'UK', expertise: ['Bioinformatics', 'Computational Biology', 'Genomics'], avatar: 'AN', joined: '2024-02-15T00:00:00Z', availability: true, maxLoad: 5, currentLoad: 2 },
      { id: 'u6', role: 'reviewer', firstName: 'Prof. Elena', lastName: 'Vasquez', email: 'elena.vasquez@eth.ch', password: 'Review@2024', institution: 'ETH Zurich', country: 'Switzerland', expertise: ['Climate Science', 'Environmental Engineering', 'Data Science'], avatar: 'EV', joined: '2024-02-20T00:00:00Z', availability: true, maxLoad: 4, currentLoad: 4 },
      { id: 'u7', role: 'reviewer', firstName: 'Dr. Kenji', lastName: 'Tanaka', email: 'kenji.tanaka@tokyo.ac.jp', password: 'Review@2024', institution: 'University of Tokyo', country: 'Japan', expertise: ['Robotics', 'Computer Vision', 'AI'], avatar: 'KT', joined: '2024-03-01T00:00:00Z', availability: false, maxLoad: 5, currentLoad: 5 }
    ],
    abstracts: [],
    reviews: [],
    notifications: [],
    auditLog: [],
    tracks: [
      'Artificial Intelligence & Machine Learning',
      'Genomics & Precision Medicine',
      'Robotics & Autonomous Systems',
      'Environmental Science & Sustainability',
      'Quantum Computing & Information',
      'Neuroscience & Cognitive Science',
      'Biomedical Engineering',
      'Climate Science & Policy',
      'Data Science & Analytics',
      'Cybersecurity & Privacy'
    ]
  };
  
  const SAMPLE_ABSTRACTS = [
    { id: 'abs001', title: 'Deep Learning Approaches for Real-Time Medical Image Segmentation', body: 'This study presents a novel deep learning architecture combining transformer-based attention mechanisms with convolutional neural networks for real-time segmentation of medical images. Our approach achieves state-of-the-art performance on benchmark datasets including BraTS 2023 and ISIC 2023, with inference times suitable for clinical deployment. We demonstrate 94.2% Dice coefficient on brain tumor segmentation, representing a 3.1% improvement over previous methods.', keywords: ['Deep Learning', 'Medical Imaging', 'Image Segmentation'], track: 'Artificial Intelligence & Machine Learning', status: 'under-review', authorId: 'u2', coAuthors: [], submittedAt: '2024-11-15T10:30:00Z', updatedAt: '2024-11-20T14:00:00Z', reviewerIds: ['u4', 'u5'], fileAttachment: null, reviewDeadline: '2024-12-15T23:59:00Z' },
    { id: 'abs002', title: 'CRISPR-Cas9 Mediated Gene Editing for Sickle Cell Disease', body: 'We report outcomes from a Phase II clinical trial evaluating CRISPR-Cas9 gene editing therapy in 28 patients with severe sickle cell disease. At 24-month follow-up, 25 of 28 patients (89.3%) achieved transfusion independence. No serious adverse events attributable to the gene editing procedure were observed.', keywords: ['CRISPR', 'Gene Therapy', 'Sickle Cell Disease'], track: 'Genomics & Precision Medicine', status: 'accepted', authorId: 'u3', coAuthors: [], submittedAt: '2024-11-10T09:15:00Z', updatedAt: '2024-11-28T16:30:00Z', reviewerIds: ['u5', 'u6'], fileAttachment: null, reviewDeadline: '2024-12-10T23:59:00Z' }
  ];
  
  function loadData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        _data = JSON.parse(saved);
        if (!_data.abstracts) _data.abstracts = [];
        if (!_data.reviews) _data.reviews = [];
        if (!_data.notifications) _data.notifications = [];
        if (!_data.auditLog) _data.auditLog = [];
        if (!_data.tracks) _data.tracks = DEFAULT_DATA.tracks;
        if (_data.abstracts.length === 0) _data.abstracts.push(...SAMPLE_ABSTRACTS);
      } catch (e) {
        console.error('Failed to parse saved data', e);
        _data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        _data.abstracts.push(...SAMPLE_ABSTRACTS);
      }
    } else {
      _data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      _data.abstracts.push(...SAMPLE_ABSTRACTS);
      _data.reviews = [
        { id: 'rev001', abstractId: 'abs001', reviewerId: 'u4', scores: { originality: 8, scientificQuality: 9, relevance: 9, clarity: 7, methodology: 8 }, comments: {}, overallComment: 'Strong submission.', recommendation: 'accept', submittedAt: '2024-11-28T15:00:00Z', status: 'completed' }
      ];
    }
    return _data;
  }
  
  function saveData() {
    if (_data) localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
  }
  
  loadData();
  
  return {
    get: function(key) { return _data ? _data[key] : []; },
    set: function(key, val) { if (_data) { _data[key] = val; saveData(); } },
    getUser: function(id) { return _data ? _data.users.find(function(u) { return u.id === id; }) : null; },
    getAbstract: function(id) { return _data ? _data.abstracts.find(function(a) { return a.id === id; }) : null; },
    getReview: function(id) { return _data ? _data.reviews.find(function(r) { return r.id === id; }) : null; },
    getReviewsByAbstract: function(absId) { return _data ? _data.reviews.filter(function(r) { return r.abstractId === absId; }) : []; },
    getReviewsByReviewer: function(revId) { return _data ? _data.reviews.filter(function(r) { return r.reviewerId === revId; }) : []; },
    getAbstractsByAuthor: function(authorId) { return _data ? _data.abstracts.filter(function(a) { return a.authorId === authorId; }) : []; },
    getAbstractsByReviewer: function(revId) { return _data ? _data.abstracts.filter(function(a) { return a.reviewerIds && a.reviewerIds.includes(revId); }) : []; },
    getNotifications: function(userId) { return _data ? _data.notifications.filter(function(n) { return n.userId === userId; }) : []; },
    getUnreadCount: function(userId) { return _data ? _data.notifications.filter(function(n) { return n.userId === userId && !n.read; }).length : 0; },
    addAbstract: function(abs) { if (_data) { _data.abstracts.push(abs); saveData(); } },
    updateAbstract: function(id, updates) {
      if (_data) {
        var idx = _data.abstracts.findIndex(function(a) { return a.id === id; });
        if (idx !== -1) { Object.assign(_data.abstracts[idx], updates); saveData(); }
      }
    },
    addReview: function(rev) { if (_data) { _data.reviews.push(rev); saveData(); } },
    addAuditEntry: function(entry) { if (_data) { _data.auditLog.unshift(entry); saveData(); } },
    addUser: function(user) { if (_data) { _data.users.push(user); saveData(); } },
    updateUser: function(id, updates) {
      if (_data) {
        var idx = _data.users.findIndex(function(u) { return u.id === id; });
        if (idx !== -1) { Object.assign(_data.users[idx], updates); saveData(); }
      }
    },
    getReviewers: function() { return _data ? _data.users.filter(function(u) { return u.role === 'reviewer'; }) : []; },
    getAuthors: function() { return _data ? _data.users.filter(function(u) { return u.role === 'author'; }) : []; }
  };
})();

/* ── Auth Service ───────────────────────────────────────────── */
const Auth = {
  login: function(email, password) {
    var users = Store.get('users');
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === email.toLowerCase() && users[i].password === password) {
        user = users[i];
        break;
      }
    }
    if (user) {
      Store.set('currentUser', user);
      sessionStorage.setItem('cms_user', JSON.stringify({ id: user.id, role: user.role }));
      return { success: true, user: user };
    }
    return { success: false, error: 'Invalid email or password.' };
  },
  
  logout: function() {
    Store.set('currentUser', null);
    sessionStorage.removeItem('cms_user');
    Router.navigate('login');
    if (typeof UI !== 'undefined') UI.toast('Signed Out', 'You have been logged out.', 'info');
  },
  
  getCurrentUser: function() {
    var stored = Store.get('currentUser');
    if (stored) return stored;
    var session = sessionStorage.getItem('cms_user');
    if (session) {
      try {
        var data = JSON.parse(session);
        var user = Store.getUser(data.id);
        if (user) {
          Store.set('currentUser', user);
          return user;
        }
      } catch(e) {}
    }
    return null;
  },
  
  requireAuth: function() {
    var user = this.getCurrentUser();
    if (!user) { Router.navigate('login'); return null; }
    return user;
  },
  
  validatePassword: function(password) {
    var checks = {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    var score = 0;
    for (var key in checks) { if (checks[key]) score++; }
    var strengthMap = ['', 'weak', 'weak', 'fair', 'good', 'strong'];
    return { checks: checks, score: score, strength: strengthMap[score] || 'weak' };
  },
  
  register: function(data) {
    var users = Store.get('users');
    var existing = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === data.email.toLowerCase()) {
        existing = users[i];
        break;
      }
    }
    if (existing) return { success: false, error: 'An account with this email already exists.' };
    
    var newUser = {
      id: 'u' + Date.now(),
      role: 'author',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      institution: data.institution || '',
      country: data.country || '',
      expertise: [],
      avatar: (data.firstName[0] + data.lastName[0]).toUpperCase(),
      joined: new Date().toISOString()
    };
    Store.addUser(newUser);
    Store.set('currentUser', newUser);
    sessionStorage.setItem('cms_user', JSON.stringify({ id: newUser.id, role: newUser.role }));
    return { success: true, user: newUser };
  }
};

/* ── UI Utilities ───────────────────────────────────────────── */
const UI = {
  toast: function(title, message, type, duration) {
    type = type || 'default';
    duration = duration || 4000;
    var container = document.getElementById('toastContainer');
    if (!container) return;
    
    var icons = {
      success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
      error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
      warning: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
      info: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>',
      default: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    };
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = (icons[type] || icons.default) + 
      '<div class="toast-msg"><div class="toast-title">' + this.escapeHtml(title) + '</div>' +
      (message ? '<div class="toast-body">' + this.escapeHtml(message) + '</div>' : '') + '</div>' +
      '<button class="toast-close" onclick="this.parentElement.remove()">×</button>';
    container.appendChild(toast);
    
    setTimeout(function() { if (toast.parentElement) toast.remove(); }, duration);
  },
  
  openModal: function(id) {
    var overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeModal: function(id) {
    var overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },
  
  closeAllModals: function() {
    var modals = document.querySelectorAll('.modal-overlay.active');
    for (var i = 0; i < modals.length; i++) modals[i].classList.remove('active');
    document.body.style.overflow = '';
  },
  
  confirm: function(title, message, onConfirm, type) {
    type = type || 'danger';
    var modal = document.getElementById('confirmModal');
    if (!modal) return;
    modal.querySelector('.confirm-title').textContent = title;
    modal.querySelector('.confirm-message').textContent = message;
    var btn = modal.querySelector('.confirm-ok-btn');
    btn.className = 'btn btn-' + type;
    btn.textContent = type === 'danger' ? 'Confirm Delete' : 'Confirm';
    btn.onclick = function() { UI.closeModal('confirmModal'); onConfirm(); };
    this.openModal('confirmModal');
  },
  
  setLoading: function(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Processing...';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
      btn.disabled = false;
    }
  },
  
  formatDate: function(isoString) {
    if (!isoString) return '—';
    try {
      var d = new Date(isoString);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch(e) { return '—'; }
  },
  
  statusBadge: function(status) {
    var map = {
      'draft': ['badge-draft', 'Draft'],
      'submitted': ['badge-submitted', 'Submitted'],
      'under-screening': ['badge-screening', 'Under Screening'],
      'under-review': ['badge-review', 'Under Review'],
      'revision-requested': ['badge-revision', 'Revision Requested'],
      'accepted': ['badge-accepted', 'Accepted'],
      'rejected': ['badge-rejected', 'Rejected'],
      'scheduled': ['badge-scheduled', 'Scheduled']
    };
    var pair = map[status] || ['badge-draft', status];
    return '<span class="badge ' + pair[0] + '">' + pair[1] + '</span>';
  },
  
  escapeHtml: function(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  },
  
  truncate: function(str, len) {
    len = len || 80;
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  },
  
  generateId: function(prefix) {
    prefix = prefix || 'id';
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
  },
  
  updateNotifBadge: function(userId) {
    var count = Store.getUnreadCount(userId);
    var dot = document.getElementById('notifDot');
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  }
};

/* ── Validation ─────────────────────────────────────────────── */
const Validate = {
  required: function(val) { return (val && val.trim() !== '') ? null : 'This field is required.'; },
  email: function(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Please enter a valid email address.'; },
  minLength: function(min) {
    return function(val) { return val && val.length >= min ? null : 'Minimum ' + min + ' characters required.'; };
  },
  passwordMatch: function(pass) {
    return function(val) { return val === pass ? null : 'Passwords do not match.'; };
  },
  
  field: function(input) {
    var validators = Array.prototype.slice.call(arguments, 1);
    var val = input.value;
    for (var i = 0; i < validators.length; i++) {
      var err = validators[i](val);
      if (err) {
        this.showError(input, err);
        return false;
      }
    }
    this.clearError(input);
    return true;
  },
  
  showError: function(input, message) {
    input.classList.add('is-invalid');
    var errEl = input.parentElement.querySelector('.form-error');
    if (!errEl && input.parentElement) {
      errEl = document.createElement('div');
      errEl.className = 'form-error';
      input.parentElement.appendChild(errEl);
    }
    if (errEl) errEl.innerHTML = '<svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg> ' + message;
  },
  
  clearError: function(input) {
    input.classList.remove('is-invalid');
    var errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.remove();
  }
};

/* ── Router ─────────────────────────────────────────────────── */
const Router = {
  _pages: {},
  
  register: function(name, renderFn) { this._pages[name] = renderFn; },
  
  navigate: function(page, params) {
    params = params || {};
    var fn = this._pages[page];
    if (!fn) { console.warn('Unknown page:', page); return; }
    
    var views = document.querySelectorAll('.view');
    for (var i = 0; i < views.length; i++) views[i].classList.add('d-none');
    
    var navItems = document.querySelectorAll('.sidebar-nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].classList.toggle('active', navItems[i].dataset.page === page);
    }
    
    fn(params);
    window.scrollTo(0, 0);
  }
};

/* ── Simple Dashboard Placeholders ─────────────────────────── */
Router.register('admin-dashboard', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Admin Dashboard</div></div><div class="page-content"><h1>Welcome to Admin Dashboard</h1><p>Full admin functionality would load here.</p></div>';
});

Router.register('author-dashboard', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var user = Auth.getCurrentUser();
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Author Dashboard</div></div><div class="page-content"><h1>Welcome, ' + (user ? user.firstName : 'Author') + '!</h1><p>Your submissions dashboard would load here.</p><button class="btn btn-primary" onclick="Router.navigate(\'author-new\')">New Submission</button></div>';
});

Router.register('reviewer-dashboard', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Reviewer Dashboard</div></div><div class="page-content"><h1>Reviewer Dashboard</h1><p>Your review queue would load here.</p></div>';
});

Router.register('author-new', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">New Submission</div><button class="btn btn-ghost" onclick="Router.navigate(\'author-dashboard\')">Cancel</button></div><div class="page-content"><div class="card"><div class="card-header"><div class="card-title">Submission Form</div></div><div class="card-body"><p>Full submission wizard would load here.</p></div></div></div>';
});

Router.register('login', function() {
  if (typeof showAuthView === 'function') showAuthView('login');
});

/* ── Global Functions for Onclick Handlers ─────────────────── */
window.Store = Store;
window.Auth = Auth;
window.UI = UI;
window.Validate = Validate;
window.Router = Router;

/* ── Initialize App ────────────────────────────────────────── */
function initApp() {
  var user = Auth.getCurrentUser();
  var authView = document.getElementById('authView');
  var appView = document.getElementById('appView');
  
  if (!user) {
    if (authView) authView.classList.remove('d-none');
    if (appView) appView.classList.add('d-none');
    if (typeof renderLoginPage === 'function') renderLoginPage();
    else if (typeof showAuthView === 'function') showAuthView('login');
  } else {
    if (authView) authView.classList.add('d-none');
    if (appView) appView.classList.remove('d-none');
    
    // Build sidebar
    var sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav && typeof buildSidebar === 'function') buildSidebar(user);
    else if (sidebarNav) {
      sidebarNav.innerHTML = '<div class="sidebar-section-label">Menu</div><button class="sidebar-nav-item" onclick="Router.navigate(\'' + user.role + '-dashboard\')">Dashboard</button>';
    }
    
    var defaults = { admin: 'admin-dashboard', author: 'author-dashboard', reviewer: 'reviewer-dashboard' };
    Router.navigate(defaults[user.role] || 'author-dashboard');
  }
}

// Make initApp global
window.initApp = initApp;

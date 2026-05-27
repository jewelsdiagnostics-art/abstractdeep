/* ============================================================
   AUTHENTICATION PAGES — Login, Register, Forgot Password
   ============================================================ */

function renderLoginPage() {
  var authContent = document.getElementById('authContent');
  if (!authContent) return;
  
  authContent.innerHTML = `
    <div class="auth-layout">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div class="auth-brand-text">
            <h1>ConfMS</h1>
            <p>Abstract Management System</p>
          </div>
        </div>
        <div class="auth-features">
          <div class="auth-feature">
            <div class="auth-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div class="auth-feature-text"><h4>Streamlined Submission</h4><p>Multi-step guided workflow with autosave and progress tracking.</p></div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
            <div class="auth-feature-text"><h4>Expert Review Panel</h4><p>Double-blind peer review with structured scoring rubrics.</p></div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg></div>
            <div class="auth-feature-text"><h4>Real-Time Analytics</h4><p>Comprehensive dashboards with submission trends and metrics.</p></div>
          </div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <div class="auth-form-header">
            <h2>Welcome back</h2>
            <p>Sign in to your account to continue</p>
          </div>
          <div id="loginAlert"></div>
          <form id="loginForm" novalidate>
            <div class="form-group">
              <label class="form-label">Email Address <span class="required">*</span></label>
              <input type="email" id="loginEmail" class="form-control" placeholder="you@institution.edu" autocomplete="email">
            </div>
            <div class="form-group">
              <label class="form-label" style="display:flex;justify-content:space-between;">
                Password <span class="required">*</span>
                <a href="#" onclick="showAuthView('forgot');return false;" class="text-sm text-primary">Forgot password?</a>
              </label>
              <div class="input-group">
                <input type="password" id="loginPassword" class="form-control" placeholder="Enter your password" autocomplete="current-password">
                <button type="button" class="btn btn-secondary" onclick="togglePasswordVisibility('loginPassword', this)" style="border-radius:0 var(--radius) var(--radius) 0;">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" id="rememberMe">
                <span class="form-check-label">Keep me signed in</span>
              </label>
            </div>
            <button type="submit" class="btn btn-primary w-full btn-lg" id="loginBtn">Sign In</button>
          </form>
          <div class="auth-divider">or sign in as demo user</div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--space-3);">
            <button class="btn btn-secondary btn-sm" onclick="demoLogin('admin')">👑 Admin</button>
            <button class="btn btn-secondary btn-sm" onclick="demoLogin('author')">✍️ Author</button>
            <button class="btn btn-secondary btn-sm" onclick="demoLogin('reviewer')">⭐ Reviewer</button>
          </div>
          <p class="text-center text-sm text-muted mt-6">
            Don't have an account? <a href="#" onclick="showAuthView('register');return false;">Create account</a>
          </p>
        </div>
      </div>
    </div>
  `;
  
  var loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
  e.preventDefault();
  var email = document.getElementById('loginEmail');
  var password = document.getElementById('loginPassword');
  var alertEl = document.getElementById('loginAlert');
  var btn = document.getElementById('loginBtn');
  
  var valid = true;
  if (!Validate.field(email, Validate.required, Validate.email)) valid = false;
  if (!Validate.field(password, Validate.required)) valid = false;
  if (!valid) return;
  
  UI.setLoading(btn, true);
  setTimeout(function() {
    var result = Auth.login(email.value, password.value);
    UI.setLoading(btn, false);
    if (result.success) {
      if (alertEl) alertEl.innerHTML = '';
      if (typeof initApp === 'function') initApp();
      else if (typeof showAppView === 'function') showAppView(result.user);
    } else if (alertEl) {
      alertEl.innerHTML = '<div class="alert alert-danger">' + result.error + '</div>';
    }
  }, 500);
}

function demoLogin(role) {
  var demos = {
    admin: { email: 'admin@confms.org', password: 'Admin@2024' },
    author: { email: 'james.okafor@university.edu', password: 'Author@2024' },
    reviewer: { email: 'marcus.chen@mit.edu', password: 'Review@2024' }
  };
  var creds = demos[role];
  var emailInput = document.getElementById('loginEmail');
  var passwordInput = document.getElementById('loginPassword');
  if (emailInput) emailInput.value = creds.email;
  if (passwordInput) passwordInput.value = creds.password;
  var loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.dispatchEvent(new Event('submit'));
}

function togglePasswordVisibility(inputId, btn) {
  var input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>';
  }
}

function renderRegisterPage() {
  var authContent = document.getElementById('authContent');
  if (!authContent) return;
  
  authContent.innerHTML = `
    <div class="auth-layout">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          <div class="auth-brand-text"><h1>ConfMS</h1><p>Abstract Management System</p></div>
        </div>
        <div class="auth-features">
          <div class="auth-feature"><div class="auth-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div><div class="auth-feature-text"><h4>Secure & Private</h4><p>Your data is protected with encryption.</p></div></div>
          <div class="auth-feature"><div class="auth-feature-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg></div><div class="auth-feature-text"><h4>Real-Time Updates</h4><p>Instant notifications on review progress.</p></div></div>
        </div>
      </div>
      <div class="auth-right" style="overflow-y:auto;">
        <div class="auth-form-container" style="padding: var(--space-8) 0;">
          <div class="auth-form-header"><h2>Create your account</h2><p>Join as an author to submit your research</p></div>
          <div id="registerAlert"></div>
          <form id="registerForm" novalidate>
            <div class="form-row">
              <div class="form-group"><label class="form-label">First Name <span class="required">*</span></label><input type="text" id="regFirstName" class="form-control" placeholder="First name"></div>
              <div class="form-group"><label class="form-label">Last Name <span class="required">*</span></label><input type="text" id="regLastName" class="form-control" placeholder="Last name"></div>
            </div>
            <div class="form-group"><label class="form-label">Email Address <span class="required">*</span></label><input type="email" id="regEmail" class="form-control" placeholder="you@institution.edu"></div>
            <div class="form-group"><label class="form-label">Institution <span class="required">*</span></label><input type="text" id="regInstitution" class="form-control" placeholder="University or organization"></div>
            <div class="form-group"><label class="form-label">Country</label><select id="regCountry" class="form-control"><option value="">Select country</option><option>United States</option><option>United Kingdom</option><option>Germany</option><option>India</option><option>Other</option></select></div>
            <div class="form-group"><label class="form-label">Password <span class="required">*</span></label><div class="input-group"><input type="password" id="regPassword" class="form-control" placeholder="Create a strong password" oninput="updatePasswordStrength(this.value)"><button type="button" class="btn btn-secondary" onclick="togglePasswordVisibility('regPassword', this)" style="border-radius:0 var(--radius) var(--radius) 0;"><svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg></button></div><div class="password-strength mt-2"><div class="strength-bars"><div class="strength-bar" id="sb1"></div><div class="strength-bar" id="sb2"></div><div class="strength-bar" id="sb3"></div><div class="strength-bar" id="sb4"></div><div class="strength-bar" id="sb5"></div></div><div class="strength-label" id="strengthLabel">Enter a password</div></div></div>
            <div class="form-group"><label class="form-label">Confirm Password <span class="required">*</span></label><input type="password" id="regConfirmPassword" class="form-control" placeholder="Repeat your password"></div>
            <div class="form-group"><label class="form-check"><input type="checkbox" class="form-check-input" id="agreeTerms"><span class="form-check-label">I agree to the Terms of Service</span></label></div>
            <button type="submit" class="btn btn-primary w-full btn-lg" id="registerBtn">Create Account</button>
          </form>
          <p class="text-center text-sm text-muted mt-6">Already have an account? <a href="#" onclick="showAuthView('login');return false;">Sign in</a></p>
        </div>
      </div>
    </div>
  `;
  
  var registerForm = document.getElementById('registerForm');
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

function updatePasswordStrength(password) {
  var result = Auth.validatePassword(password);
  var bars = ['sb1', 'sb2', 'sb3', 'sb4', 'sb5'];
  for (var i = 0; i < bars.length; i++) {
    var bar = document.getElementById(bars[i]);
    if (bar) bar.className = 'strength-bar ' + (i < result.score ? result.strength : '');
  }
  var label = document.getElementById('strengthLabel');
  if (label) {
    var labels = { '': 'Enter a password', weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };
    label.textContent = labels[result.strength] || 'Enter a password';
  }
}

function handleRegister(e) {
  e.preventDefault();
  var firstName = document.getElementById('regFirstName');
  var lastName = document.getElementById('regLastName');
  var email = document.getElementById('regEmail');
  var institution = document.getElementById('regInstitution');
  var password = document.getElementById('regPassword');
  var confirmPassword = document.getElementById('regConfirmPassword');
  var agreeTerms = document.getElementById('agreeTerms');
  var alertEl = document.getElementById('registerAlert');
  var btn = document.getElementById('registerBtn');
  
  var valid = true;
  if (!Validate.field(firstName, Validate.required)) valid = false;
  if (!Validate.field(lastName, Validate.required)) valid = false;
  if (!Validate.field(email, Validate.required, Validate.email)) valid = false;
  if (!Validate.field(institution, Validate.required)) valid = false;
  if (!Validate.field(password, Validate.required, Validate.minLength(8))) valid = false;
  if (!Validate.field(confirmPassword, Validate.required, Validate.passwordMatch(password.value))) valid = false;
  
  if (!agreeTerms.checked && alertEl) {
    alertEl.innerHTML = '<div class="alert alert-warning">You must agree to the Terms of Service to continue.</div>';
    valid = false;
  }
  
  if (!valid) return;
  
  UI.setLoading(btn, true);
  setTimeout(function() {
    var result = Auth.register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      institution: institution.value,
      country: document.getElementById('regCountry').value,
      password: password.value
    });
    UI.setLoading(btn, false);
    if (result.success && alertEl) {
      if (typeof initApp === 'function') initApp();
      UI.toast('Welcome!', 'Your account has been created successfully.', 'success');
    } else if (alertEl) {
      alertEl.innerHTML = '<div class="alert alert-danger">' + result.error + '</div>';
    }
  }, 1000);
}

function renderForgotPage() {
  var authContent = document.getElementById('authContent');
  if (!authContent) return;
  
  authContent.innerHTML = `
    <div class="auth-layout">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="auth-brand-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
          <div class="auth-brand-text"><h1>ConfMS</h1><p>Abstract Management System</p></div>
        </div>
      </div>
      <div class="auth-right">
        <div class="auth-form-container">
          <div class="auth-form-header"><h2>Reset your password</h2><p>Enter your email and we'll send you a reset link</p></div>
          <div id="forgotAlert"></div>
          <form id="forgotForm" novalidate>
            <div class="form-group"><label class="form-label">Email Address <span class="required">*</span></label><input type="email" id="forgotEmail" class="form-control" placeholder="you@institution.edu"></div>
            <button type="submit" class="btn btn-primary w-full btn-lg" id="forgotBtn">Send Reset Link</button>
          </form>
          <p class="text-center text-sm text-muted mt-6"><a href="#" onclick="showAuthView('login');return false;">← Back to sign in</a></p>
        </div>
      </div>
    </div>
  `;
  
  var forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('forgotEmail');
      var alertEl = document.getElementById('forgotAlert');
      var btn = document.getElementById('forgotBtn');
      if (!Validate.field(email, Validate.required, Validate.email)) return;
      UI.setLoading(btn, true);
      setTimeout(function() {
        UI.setLoading(btn, false);
        if (alertEl) {
          alertEl.innerHTML = '<div class="alert alert-success">If an account exists for <strong>' + UI.escapeHtml(email.value) + '</strong>, a password reset link has been sent.</div>';
        }
      }, 1000);
    });
  }
}

function showAuthView(view) {
  var authView = document.getElementById('authView');
  var appView = document.getElementById('appView');
  if (authView) authView.classList.remove('d-none');
  if (appView) appView.classList.add('d-none');
  
  if (view === 'login') renderLoginPage();
  else if (view === 'register') renderRegisterPage();
  else if (view === 'forgot') renderForgotPage();
}

// Make functions global
window.showAuthView = showAuthView;
window.demoLogin = demoLogin;
window.togglePasswordVisibility = togglePasswordVisibility;
window.updatePasswordStrength = updatePasswordStrength;
window.renderLoginPage = renderLoginPage;
window.renderRegisterPage = renderRegisterPage;
window.renderForgotPage = renderForgotPage;

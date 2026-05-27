/* ============================================================
   ADMIN PORTAL — Dashboard, Abstract Management, Analytics
   ============================================================ */

Router.register('admin-analytics', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var abstracts = Store.get('abstracts');
  var submitted = abstracts.filter(function(a) { return a.status !== 'draft'; }).length;
  
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Analytics & Reports</div></div><div class="page-content"><div class="page-header"><h1>Analytics Dashboard</h1></div><div class="stat-grid"><div class="stat-card"><div class="stat-icon stat-icon-blue">📊</div><div class="stat-info"><div class="stat-value">' + submitted + '</div><div class="stat-label">Total Submissions</div></div></div></div><div class="card"><div class="card-header"><div class="card-title">Coming Soon</div></div><div class="card-body"><p>Full analytics dashboard with charts and export features will be available in the next update.</p></div></div></div>';
});

Router.register('admin-abstracts', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var abstracts = Store.get('abstracts').filter(function(a) { return a.status !== 'draft'; });
  
  var html = '<div class="topbar"><div class="topbar-title">All Abstracts</div><div class="topbar-actions"><button class="btn btn-secondary" onclick="alert(\'Export CSV feature coming soon\')">📥 Export</button></div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Abstract Management</h1><p>View and manage all submitted abstracts.</p></div>';
  html += '<div class="card"><div class="table-wrapper"><table class="table"><thead><tr><th>Title</th><th>Author</th><th>Track</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
  
  for (var i = 0; i < abstracts.length; i++) {
    var abs = abstracts[i];
    var author = Store.getUser(abs.authorId);
    html += '<tr><td>' + UI.truncate(abs.title, 50) + '</td><td>' + (author ? author.firstName + ' ' + author.lastName : '—') + '</td><td>' + abs.track + '</td><td>' + UI.statusBadge(abs.status) + '</td>';
    html += '<td><button class="btn btn-ghost btn-sm" onclick="alert(\'View ' + abs.id + '\')">👁️ View</button>';
    html += ' <button class="btn btn-ghost btn-sm" onclick="alert(\'Change status for ' + abs.id + '\')">✏️ Status</button></td></tr>';
  }
  html += '</tbody></table></div></div></div>';
  view.innerHTML = html;
});

Router.register('admin-screening', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var screening = Store.get('abstracts').filter(function(a) { return a.status === 'submitted' || a.status === 'under-screening'; });
  
  var html = '<div class="topbar"><div class="topbar-title">Screening Queue</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Screening Queue</h1><p>Review submitted abstracts for basic eligibility.</p></div>';
  
  if (screening.length === 0) {
    html += '<div class="card"><div class="empty-state"><div class="empty-state-icon">✅</div><h3>Queue is empty</h3></div></div>';
  } else {
    for (var i = 0; i < screening.length; i++) {
      var abs = screening[i];
      html += '<div class="card mb-4"><div class="card-header"><div class="card-title">' + UI.truncate(abs.title, 60) + '</div><div><button class="btn btn-success btn-sm" onclick="alert(\'Approve ' + abs.id + '\')">✓ Approve</button> <button class="btn btn-danger btn-sm" onclick="alert(\'Reject ' + abs.id + '\')">✗ Reject</button></div></div>';
      html += '<div class="card-body"><p>' + UI.truncate(abs.body, 300) + '</p></div></div>';
    }
  }
  html += '</div>';
  view.innerHTML = html;
});

Router.register('admin-reviewers', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var reviewers = Store.getReviewers();
  
  var html = '<div class="topbar"><div class="topbar-title">Reviewer Management</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Reviewer Management</h1><p>Manage reviewer assignments and workload.</p></div>';
  html += '<div class="card"><div class="table-wrapper"><table class="table"><thead><tr><th>Reviewer</th><th>Institution</th><th>Expertise</th><th>Status</th></tr></thead><tbody>';
  
  for (var i = 0; i < reviewers.length; i++) {
    var r = reviewers[i];
    html += '<tr><td>' + r.firstName + ' ' + r.lastName + '</td><td>' + r.institution + '</td><td>' + (r.expertise || []).slice(0, 2).join(', ') + '</td><td>' + (r.availability ? '🟢 Available' : '🔴 Unavailable') + '</td></tr>';
  }
  html += '</tbody></table></div></div></div>';
  view.innerHTML = html;
});

Router.register('admin-assignments', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Assignment Management</div></div><div class="page-content"><div class="card"><div class="card-body"><p>Reviewer assignment interface would load here.</p><button class="btn btn-primary" onclick="alert(\'Auto-assign feature coming soon\')">Auto-Assign All</button></div></div></div>';
});

Router.register('admin-users', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var users = Store.get('users');
  
  var html = '<div class="topbar"><div class="topbar-title">User Management</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>User Accounts</h1><p>Manage all registered users.</p></div>';
  html += '<div class="card"><div class="table-wrapper"><table class="table"><thead><tr><th>User</th><th>Role</th><th>Email</th></tr></thead><tbody>';
  
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    html += '<tr><td>' + u.firstName + ' ' + u.lastName + '</td><td>' + u.role + '</td><td>' + u.email + '</td></tr>';
  }
  html += '</tbody></table></div></div></div>';
  view.innerHTML = html;
});

Router.register('admin-audit', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var auditLog = Store.get('auditLog');
  
  var html = '<div class="topbar"><div class="topbar-title">Audit Trail</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Audit Trail</h1><p>Complete log of all system actions.</p></div>';
  html += '<div class="card"><div class="card-body">';
  
  if (auditLog.length === 0) {
    html += '<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No audit entries</h3></div>';
  } else {
    for (var i = 0; i < Math.min(auditLog.length, 20); i++) {
      var entry = auditLog[i];
      html += '<div class="audit-item"><div class="audit-timeline"><div class="audit-dot"></div></div><div class="audit-content"><div class="audit-action">' + entry.action + '</div><div class="audit-meta">' + entry.detail + '</div><div class="audit-meta">' + entry.user + ' · ' + entry.time + '</div></div></div>';
    }
  }
  html += '</div></div></div>';
  view.innerHTML = html;
});

Router.register('admin-settings', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Settings</div></div><div class="page-content"><div class="card"><div class="card-header"><div class="card-title">Conference Settings</div></div><div class="card-body"><p>System configuration options would appear here.</p><button class="btn btn-primary" onclick="alert(\'Settings saved\')">Save Settings</button></div></div></div>';
});

/* ============================================================
   AUTHOR PORTAL — Dashboard, Submission Wizard, Tracking
   ============================================================ */

// This file would contain the full author portal implementation
// For now, provide minimal functionality

function buildSidebar(user) {
  var sidebarNav = document.getElementById('sidebarNav');
  if (!sidebarNav) return;
  
  var navItems = [
    { page: 'author-dashboard', label: 'Dashboard', icon: '📊' },
    { page: 'author-submissions', label: 'My Submissions', icon: '📄' },
    { page: 'author-new', label: 'New Submission', icon: '➕' },
    { page: 'author-profile', label: 'My Profile', icon: '👤' }
  ];
  
  var html = '<div class="sidebar-section-label">My Work</div>';
  for (var i = 0; i < navItems.length; i++) {
    html += '<button class="sidebar-nav-item" data-page="' + navItems[i].page + '" onclick="Router.navigate(\'' + navItems[i].page + '\')">' +
            '<span style="width:20px;display:inline-block;">' + navItems[i].icon + '</span> ' + navItems[i].label + '</button>';
  }
  sidebarNav.innerHTML = html;
}

Router.register('author-submissions', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var user = Auth.getCurrentUser();
  var abstracts = Store.getAbstractsByAuthor(user.id);
  
  var html = '<div class="topbar"><div class="topbar-title">My Submissions</div><div class="topbar-actions"><button class="btn btn-primary" onclick="Router.navigate(\'author-new\')">➕ New Submission</button></div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>My Submissions</h1><p>Manage and track all your abstract submissions.</p></div>';
  
  if (abstracts.length === 0) {
    html += '<div class="card"><div class="empty-state"><div class="empty-state-icon">📄</div><h3>No submissions yet</h3><p>Start by creating your first abstract submission.</p><button class="btn btn-primary" onclick="Router.navigate(\'author-new\')">➕ New Submission</button></div></div>';
  } else {
    html += '<div class="card"><div class="table-wrapper"><table class="table"><thead><tr><th>Title</th><th>Track</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < abstracts.length; i++) {
      var abs = abstracts[i];
      html += '<tr><td>' + UI.truncate(abs.title, 50) + '</td><td>' + abs.track + '</td><td>' + UI.statusBadge(abs.status) + '</td>';
      html += '<td><button class="btn btn-ghost btn-sm" onclick="alert(\'View details for ' + abs.id + '\')">👁️ View</button>';
      if (abs.status === 'draft') html += ' <button class="btn btn-ghost btn-sm" onclick="Router.navigate(\'author-new\')">✏️ Edit</button>';
      html += '</td></tr>';
    }
    html += '</tbody></table></div></div>';
  }
  html += '</div>';
  view.innerHTML = html;
});

Router.register('author-profile', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var user = Auth.getCurrentUser();
  view.innerHTML = '<div class="topbar"><div class="topbar-title">My Profile</div></div><div class="page-content"><div class="card"><div class="card-body"><h3>' + user.firstName + ' ' + user.lastName + '</h3><p>Email: ' + user.email + '</p><p>Institution: ' + (user.institution || '—') + '</p><button class="btn btn-primary" onclick="alert(\'Profile update feature coming soon\')">Edit Profile</button></div></div></div>';
});

window.buildSidebar = buildSidebar;

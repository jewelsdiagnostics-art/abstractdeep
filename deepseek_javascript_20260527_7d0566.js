/* ============================================================
   REVIEWER PORTAL — Dashboard, Queue, Scoring Rubric
   ============================================================ */

Router.register('reviewer-queue', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var user = Auth.getCurrentUser();
  var assigned = Store.getAbstractsByReviewer(user.id);
  var pending = assigned.filter(function(a) {
    var reviews = Store.getReviewsByAbstract(a.id);
    return !reviews.some(function(r) { return r.reviewerId === user.id; });
  });
  
  var html = '<div class="topbar"><div class="topbar-title">Review Queue</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Review Queue</h1><p>Abstracts assigned to you for peer review.</p></div>';
  
  if (pending.length === 0) {
    html += '<div class="card"><div class="empty-state"><div class="empty-state-icon">✅</div><h3>Queue is empty</h3><p>You have completed all assigned reviews.</p></div></div>';
  } else {
    for (var i = 0; i < pending.length; i++) {
      var abs = pending[i];
      html += '<div class="card mb-4"><div class="card-header"><div class="card-title">' + UI.truncate(abs.title, 60) + '</div><button class="btn btn-primary" onclick="alert(\'Review form for ' + abs.id + '\')">Start Review</button></div>';
      html += '<div class="card-body"><p>' + UI.truncate(abs.body, 200) + '</p><div class="mt-2">' + abs.keywords.map(function(k) { return '<span class="badge badge-info">' + k + '</span>'; }).join('') + '</div></div></div>';
    }
  }
  html += '</div>';
  view.innerHTML = html;
});

Router.register('reviewer-completed', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  var user = Auth.getCurrentUser();
  var myReviews = Store.getReviewsByReviewer(user.id);
  
  var html = '<div class="topbar"><div class="topbar-title">Completed Reviews</div></div>';
  html += '<div class="page-content"><div class="page-header"><h1>Completed Reviews</h1><p>History of your submitted reviews.</p></div>';
  
  if (myReviews.length === 0) {
    html += '<div class="card"><div class="empty-state"><div class="empty-state-icon">📋</div><h3>No completed reviews</h3></div></div>';
  } else {
    html += '<div class="card"><div class="table-wrapper"><table class="table"><thead><tr><th>Abstract</th><th>Recommendation</th><th>Submitted</th></tr></thead><tbody>';
    for (var i = 0; i < myReviews.length; i++) {
      var rev = myReviews[i];
      var abs = Store.getAbstract(rev.abstractId);
      html += '<tr><td>' + (abs ? UI.truncate(abs.title, 50) : 'Unknown') + '</td><td>' + UI.recommendationBadge(rev.recommendation) + '</td><td>' + UI.formatDate(rev.submittedAt) + '</td></tr>';
    }
    html += '</tbody></table></div></div>';
  }
  html += '</div>';
  view.innerHTML = html;
});

Router.register('reviewer-guidance', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Review Guidelines</div></div><div class="page-content"><div class="guidance-card"><h3>Reviewer Guidelines</h3><p>Review abstracts objectively based on scientific merit, originality, clarity, and relevance to the conference.</p></div><div class="card"><div class="card-body"><h4>Scoring Criteria</h4><ul><li>Originality & Novelty (1-10)</li><li>Scientific Quality (1-10)</li><li>Relevance (1-10)</li><li>Clarity (1-10)</li><li>Methodology (1-10)</li></ul></div></div></div>';
});

Router.register('reviewer-profile', function() {
  var user = Auth.getCurrentUser();
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Reviewer Profile</div></div><div class="page-content"><div class="card"><div class="card-body"><h3>' + user.firstName + ' ' + user.lastName + '</h3><p>Email: ' + user.email + '</p><p>Institution: ' + (user.institution || '—') + '</p><p>Expertise: ' + (user.expertise || []).join(', ') + '</p></div></div></div>';
});

Router.register('reviewer-notifications', function() {
  var view = document.getElementById('mainView');
  if (!view) return;
  view.innerHTML = '<div class="topbar"><div class="topbar-title">Notifications</div></div><div class="page-content"><div class="card"><div class="empty-state"><div class="empty-state-icon">🔔</div><h3>No new notifications</h3></div></div></div>';
});

// Add recommendationBadge to UI if not present
if (!UI.recommendationBadge) {
  UI.recommendationBadge = function(rec) {
    var map = { 'accept': '✅ Accept', 'minor-revision': '📝 Minor Revision', 'major-revision': '✏️ Major Revision', 'reject': '❌ Reject' };
    return '<span class="badge badge-info">' + (map[rec] || rec) + '</span>';
  };
}
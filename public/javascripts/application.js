$(document).ready(function() {
  
  // $('.issue-item').draggable({opacity: 0.7, helper: 'clone'});
  // $('#backlog_ic, #current_ic, #completed_ic, #icebox_ic').droppable({
  //   drop: function(e, ui) {
  //     tgt = $(ui.draggable);
  //     tgt.appendTo($(this));
  //     applyVisualLabel(tgt, $(this).attr('id'));
  //     if ($(this).attr('id') == 'completed_ic') {
  //       applyGithubLabel(tgt, $(this).attr('id'), 'closed');
  //     } else {
  //       applyGithubLabel(tgt, $(this).attr('id'), 'open');
  //     }
  //   }
  // });
  $('.statecolumn').sortable({
    helper: 'clone',
    forcePlaceholderSize: true,
    connectWith: '.statecolumn',
    update: function(evt, ui) {
      tgt = $(ui.item);
      els = tgt.parent().find('.issue-item');
      els.each(function(i) {
        console.log(i);
        $(this).attr('data-position', i);
        console.log($(this).data('position'));
      });
    },
    receive: function(evt, ui) {
      tgt = $(ui.item);
      applyVisualLabel(tgt, $(this).attr('id'));
      console.log(tgt.data('position'))
      if ($(this).attr('id') == 'completed_ic') {
        applyGithubLabel(tgt, $(this).attr('id'), 'closed');
      } else {
        applyGithubLabel(tgt, $(this).attr('id'), 'open');
      }
    }
  }).disableSelection();;
  $('#new-issue').click(function(evt) {
    var m = ich.newissue();
    $('body').append(m);
    $(m).modal('show');
  })
  
});

var applyGithubLabel = function(tgt, id, state) {
  var url = '/issue/'+tgt.data('issue')+'/update/'+id;
  if (typeof(state) != undefined) url = url+'/state/'+state;
  $.get(url, function(r) {
    console.log('updated state');
  });
}

var closeIssue = function(tgt) {
  $.get('/issue/close/'+window.ICEY.user+'/'+window.ICEY.repo+'/'+tgt.data('issue')+'/'+window.ICEY.key, function(r) {
    console.log(r)
  });
}

var applyVisualLabel = function(tgt, id) {
  tgt.find('.item-label').remove();
  label = tgt.append('<span class="item-label label"></div>');
  if (id == 'backlog_ic') {
    tgt.find('.item-label').html('BACKLOG');
    tgt.find('.item-label').addClass('label-info');
  } else if (id == 'icebox_ic') {
    tgt.find('.item-label').html('ICEBOX');
  } else if (id == 'current_ic') {
    tgt.find('.item-label').html('STARTED');
    tgt.find('.item-label').addClass('label-success');
  } else {
    tgt.find('.item-label').html('CLOSED');
    tgt.find('.item-label').addClass('label-important');
  }
};
$(document).ready(function() {
	$('#signup-username').blur(function(e) {
    	$.ajax({
      		type: 'GET',
        	url: '/api/user/' + $('#signup-username').val()
    	}).done(function(found) {
      		if (found == '0') {
        		$('#signup-username').parent().addClass('has-success').removeClass('has-error');
        		$('#signup-username').siblings().children().html(' <span class="glyphicon glyphicon-ok"></span>');
			} else {
				$('#signup-username').parent().addClass('has-error').removeClass('has-success');
				$('#signup-username').siblings().children().text(' That username has already been taken');
			} 
		});
	});

  $("#signup-password").blur(function() {
    var p1 = $(this);
    p1.parent().addClass('has-error');
    $("#signup-password2").keyup(function() {
      var p2 = $(this);
      if(p1.val() === p2.val()) {
        p1.parent().addClass('has-success').removeClass('has-error');
        p1.siblings().children().html(' <span class="glyphicon glyphicon-ok"></span>');
        p2.parent().addClass('has-success').removeClass('has-error');
        p2.siblings().children().html(' <span class="glyphicon glyphicon-ok"></span>');
        $('#signup-submit').removeClass('disabled').attr('disabled', false);
      } else {
        p1.parent().addClass('has-error').removeClass('has-success');
        p1.siblings().children().html('');
        p2.parent().addClass('has-error').removeClass('has-success');
        p2.siblings().children().html('');
        $('#signup-submit').addClass('disabled').attr('disabled', true);
      }
    });
  });
});
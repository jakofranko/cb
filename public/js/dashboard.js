$(document).ready(function() {
	// For updating the user's email address
	$('#update-email').click(function() {
		var email = $('#new-email').val();
		var data = { email: email };
		$.post('/dashboard/updateEmail', data).done(function( results ) {
			console.log(results);
			$('#update-group').fadeOut(function() {
				$('#new-email').val(null);
				$('#user-email').html(results.email + "<br/>");
			});
		});
	});

	$('#update').click(function() {
		$('#update-group').fadeIn();
	});

	// For updating the user's password
	$('#new-password').blur(function() {
		// canChange needs to == 2 in order to enable the change password button
		var p1 = $(this);
    	p1.parent().addClass('has-error');
		$('#new-password2').keyup(function() {
			var p2 = $(this);
			p2.parent().addClass('has-error');
		    if(p1.val() === p2.val()) {
		      p1.parent().addClass('has-success').removeClass('has-error');
		      p2.parent().addClass('has-success').removeClass('has-error');
		      $('#update-password').prop('disabled', false);
		    } else {
		      p1.parent().addClass('has-error').removeClass('has-success');
		      p2.parent().addClass('has-error').removeClass('has-success');
		      $('#update-password').prop('disabled', true);
			}
		});

		$('#update-password').click(function() {
			var password = $('#current-password').val();
			var data = { password: password };
			$.post('/dashboard/authenticate', data).done(function( results ) {
				if(results == 'false') $('#password-status').addClass('text-danger').removeClass('text-success').html('Incorrect Password');
				else {
					$.post('/dashboard/updatePassword', data).done(function( results ) {
						$('#password-status').addClass('text-success').removeClass('text-error').html('<span class="glyphicon glyphicon-ok"></span> Password<br>successfully<br>changed!');	
					});
				}
			});
		});
	});
});
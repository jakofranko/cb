$(document).ready(function() {
	$('#skilltype').change(function() {
		var skilltype = $(this).val();
		var categories = $('#' + skilltype);

		if(categories.length > 0) {

			if($('.active').length > 0) {

				$('.active').fadeOut(400, function() {
					categories.fadeIn().addClass('active');
				}).removeClass('active');

			} else {

				categories.fadeIn().addClass('active');

			}

		} else {

			$('.active').fadeOut().removeClass('active');

		}
	});

	$('.category').change(function() {
		var category = $(this);

		if(category.prop('checked')) {

			category.parents('.categories').find('.subcategory').each(function() {
				$(this).prop('checked', true);
			});

		}
	});
});
function calculateCost() {
	var cost = 0;
	$(':checked:visible').add(':selected').each(function() {
		cost += $(this).data().cost;
	});

	var bonusToRoll = $('[name=bonusToRoll]:visible');
	if(bonusToRoll.length !== 0)
		cost += (bonusToRoll.val() * bonusToRoll.data().cost);

	$('#talent-cost').text(cost);
	$('[name=cost]').val(cost);
}
$(document).ready(function() {
	$('#talentID').change(function() {
		var talent = $(this).children(':selected').text();
		$('.bonus-to-roll').add('.adders').each(function() {
			var data = $(this).data();
			if(data.talent == talent)
				$(this).fadeIn().find('input').prop('disabled', false);
			else if($(this).filter(':visible').length > 0)
				$(this).fadeOut(function() {
					calculateCost();
				}).find('input').prop('disabled', true);
		});

		calculateCost();
	});

	$('input').change(function() {
		calculateCost();
	});
});
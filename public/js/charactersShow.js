$(document).ready(function() {
	var skills = $('#skills').find('.row').not('.row:first');
	$('#skills').find('.row').not('.row:first').each(function(i, elem) {
		$(this).remove();
	});

	// Remove the +1's to put them at the end
	var plusOnes = [];
	var otherSkills = [];
	skills.each(function(i, elem) {
		if(elem) {
			if($(elem).find('.col-xs-6:first').text().match(/^\+\d (to)?/)) {
				plusOnes.push(elem);
			} else {
				otherSkills.push(elem);
			}
		} 
	});

	function sortByText(x, y) {
		var xText = $(x).find('.col-xs-6').length > 1 ? $(x).find('.col-xs-6:first').text().toLowerCase() : $(x).find('.col-xs-6').text().toLowerCase();
		var yText = $(y).find('.col-xs-6').length > 1 ? $(y).find('.col-xs-6:first').text().toLowerCase() : $(y).find('.col-xs-6').text().toLowerCase();

		if(String(xText) > String(yText)) {
			return 1;
		} 

		if(String(xText) < String(yText)) {
			return -1;
		} 

		return 0;	
	}

	// Sort by skill name
	plusOnes.sort(sortByText);
	otherSkills.sort(sortByText);

	for(i = 0; i < otherSkills.length; i++) {
		$('#skills').append(otherSkills[i]);
	};
	
	for(i = 0; i < plusOnes.length; i++) {
		$('#skills').append(plusOnes[i]);
	}
});
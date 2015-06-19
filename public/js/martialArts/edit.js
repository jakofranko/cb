$(document).ready(function() {
	var maneuvers = $('#maneuvers');
	var art		  = $('#art');

	$('.add-maneuver').click(function() {
		var points = 0;
		var selected = maneuvers.find(':selected');
		selected.each(function(i, el) {
			var data = $(el).data();
			points += data.cost;
		});
		selected.appendTo(art);
		art.find('option').prop('selected', true);
		updateSpentPoints(points);
		scafoldMartialArt();
	});

	$('.remove-maneuver').click(function() {
		var points = 0;
		var selected = art.find(':selected');
		selected.each(function(i, el) {
			var data = $(el).data();
			points += data.cost;
		});
		selected.appendTo(maneuvers);
		art.find('option').prop('selected', true);
		updateSpentPoints(-points);
		scafoldMartialArt();
	});
});

function scafoldMartialArt() {
	var newArt = $('#art');
	
	newArt.find('option').prop('selected', true);
	var data = newArt.val();
	$.post('/martialManeuvers/newArt/', {mms: data}, function(response) {
		$("#newArt").html(response);
	});
}

function updateSpentPoints(points) {
	var remainingPoints = $("#remaining-points");
	var oldPoints = Number(remainingPoints.text());
	remainingPoints.text(oldPoints - points);
}
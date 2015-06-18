$(document).ready(function() {
	var maneuvers = $('#maneuvers');
	var art		  = $('#art');

	$('.add-maneuver').click(function() {
		var selected = maneuvers.find(':selected');
		selected.appendTo(art);
		art.find('option').prop('selected', true);
		scafoldMartialArt();
	});

	$('.remove-maneuver').click(function() {
		var selected = art.find(':selected');
		selected.appendTo(maneuvers);
		art.find('option').prop('selected', true);
		scafoldMartialArt();
	});
});

function scafoldMartialArt() {
	var newArt = $('#art');
	
	newArt.find('option').prop('selected', true);
	var data = newArt.val();
	console.log(data); 
	$.post('/martialManeuvers/newArt/', {mms: data}, function(response) {
		$("#newArt").html(response);
	});
}
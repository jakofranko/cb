// Script taken from Dudley Storey @dudleystorey and improved by me, Jake Franklin
// http://demosthenes.info/blog/864/Auto-Generate-Marks-on-HTML5-Range-Sliders-with-JavaScript
function ticks(element) {
	if (element.hasAttribute('list') && element.hasAttribute('min') && element.hasAttribute('max') && element.hasAttribute('step')) {
		var dataListId = element.getAttribute('list');
		$('#' + dataListId).remove();
		var datalist = document.createElement('datalist'),
		minimum = parseInt(element.getAttribute('min')),
		step = parseInt(element.getAttribute('step')),
		maximum = parseInt(element.getAttribute('max'));
		datalist.id = element.getAttribute('list');
		for (var i = minimum; i < maximum+step; i = i + step) {
			datalist.innerHTML +="<option value="+i+"></option>";
		}
		element.parentNode.insertBefore(datalist, element.nextSibling);
	}
}

function handleInput(optionData) {
	var input = $('#perk-value');
	if(optionData.mincost < optionData.maxcost) {
		input.attr('type', 'range').attr('min', optionData.mincost).attr('max', optionData.maxcost).val(optionData.mincost).removeClass('form-control').prop('readonly', false);
		$('#min-cost').text(optionData.mincost);
		$('#max-cost').text(optionData.maxcost);
	} else if(optionData.mincost == optionData.maxcost) {
		input.attr('type', 'number').addClass('form-control').prop('readonly', true).val(optionData.mincost);
		$('#min-cost').text(null);
		$('#max-cost').text(null);
	} else {
		input.attr('type', 'number').attr('min', optionData.mincost).attr('max', null).val(optionData.mincost).addClass('form-control').prop('readonly', false);
		$('#min-cost').text(null);
		$('#max-cost').text(null);
	}
	ticks(input[0]);
	calculateCost(skillEnhancers);
}

$(document).ready(function() {
	calculateCost(skillEnhancers);
	$("#x2Multiplier input").change(function() {
		var multiplier = $(this).val();
		var current = Number($("#numMultiplier").text());
		if(current == 0 || multiplier == 0) {
			$("#numMultiplier").text(1);
			$("#pluralType").text(null);
		} else {
			var total = 1;
			for(i = 0; i < multiplier; i++)
				total *= 2;
			$("#numMultiplier").text(total);
			$("#pluralType").text("s");
		}
		calculateCost(skillEnhancers);
	});

	$("#basePoints input").change(function() {
		calculateCost(skillEnhancers);
	});

	$('#perk-value').add("#contactBonusToRoll").add("#reputationLevels").add("[data-cost]").change(function() {
		calculateCost(skillEnhancers);
	});
});
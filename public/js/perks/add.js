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

// Used mainly to toggle one set of options off, and then pass in the function to toggle the other set on. Will calculate the cost only once a callback isn't passed, indicating that there are no more options that need to be faded in and out.
function toggleContactOptions(state, callback, callbackParam) {
	var state = (state) ? true : false;
	if(state === true) {
		$("#contactBonusToRoll").fadeIn();
		$("#contact-options").fadeIn(function() {
			$('.contact-control').prop('disabled', false);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost(skillEnhancers);
			}
		});
	} else {
		$("#contactBonusToRoll").fadeOut();
		$("#contact-options").fadeOut(function() {
			$('.contact-control').prop('disabled', true);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost(skillEnhancers);
			}
		});
	}	
}

function toggleReputationOptions(state, callback, callbackParam) {
	var state = (state) ? true : false;
	if(state === true) {
		$("#reputationLevels").fadeIn();
		$("#reputation-options").fadeIn(function() {
			$('.reputation-control').prop('disabled', false);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost(skillEnhancers);
			}
		});
	} else {
		$("#reputationLevels").fadeOut();
		$("#reputation-options").fadeOut(function() {
			$('.reputation-control').prop('disabled', true);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost(skillEnhancers);
			}
		});
	}
}

$(document).ready(function() {
	$('#perk-type').change(function() {
		var perkSelection = $(this).find(':selected').text();
		if(perkSelection == 'Contact') {
			$("#perk-value").parent().fadeOut(function() {
				toggleReputationOptions(false, toggleContactOptions, true);
				$("#x2Multiplier input").add("#basePoints input").prop("disabled", true);
				$("#x2Multiplier").add("#basePoints").fadeOut();
			});
		} else if(perkSelection == 'Reputation') {
			$("#perk-value").parent().fadeOut(function() {
				toggleContactOptions(false, toggleReputationOptions, true);
				$("#x2Multiplier input").add("#basePoints input").prop("disabled", true);
				$("#x2Multiplier").add("#basePoints").fadeOut();
			});
		} else {
			toggleReputationOptions(false, function() {
				toggleContactOptions(false, function() {
					if(perkSelection == "Follower" || perkSelection == "Vehicle") {
						$("#perk-value").parent().fadeOut(function() {
							$("#x2Multiplier input").add("#basePoints input").prop("disabled", false);
							$("#x2Multiplier").add("#basePoints").fadeIn();
							$("#typeMultiplier").text(perkSelection)	
						});
					} else {
						$("#x2Multiplier input").add("#basePoints input").prop("disabled", true);
						$("#x2Multiplier").add("#basePoints").fadeOut();
						$("#perk-value").parent().fadeIn();
					}
					calculateCost(skillEnhancers);
				});
			});
		}
		handleInput($(this).find(':selected').data());
		// $('#perk-value').trigger('change');
	});

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
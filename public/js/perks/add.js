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
	var input = $('#perk-cost');
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
}

// Used mainly to toggle one set of options off, and then pass in the function to toggle the other set on. Will calculate the cost only once a callback isn't passed, indicating that there are no more options that need to be faded in and out.
function toggleContactOptions(state, callback, callbackParam) {
	var state = (state) ? true : false;
	console.log("contact state: ", state, callback);
	if(state === true) {
		$("#contactBonusToRoll").fadeIn();
		$("#contact-options").fadeIn(function() {
			$('.contact-control').prop('disabled', false);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost();
			}
		});
	} else {
		$("#contactBonusToRoll").fadeOut();
		$("#contact-options").fadeOut(function() {
			$('.contact-control').prop('disabled', true);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost();
			}
		});
	}

	
}

function toggleReputationOptions(state, callback, callbackParam) {
	var state = (state) ? true : false;
	console.log("reputation state: ", state, callback);
	if(state === true) {
		$("#reputationLevels").fadeIn();
		$("#reputation-options").fadeIn(function() {
			$('.reputation-control').prop('disabled', false);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost();
			}
		});
	} else {
		$("#reputationLevels").fadeOut();
		$("#reputation-options").fadeOut(function() {
			$('.reputation-control').prop('disabled', true);
			if(typeof callback === "function") {
				callback(callbackParam);
			} else {
				calculateCost();
			}
		});
	}

	
}

function calculateCost() {
	console.log($('#perk-cost').add('[data-cost]').add('#contactBonusToRoll').add('#reputationLevels').filter(':visible'));
}

$(document).ready(function() {
	$('#perk-type').change(function() {
		var perkSelection = $(this).find(':selected').text();
		if(perkSelection == 'Contact') {
			$("#perk-cost").parent().fadeOut(function() {
				toggleReputationOptions(false, toggleContactOptions, true);
			});
		} else if(perkSelection == 'Reputation') {
			$("#perk-cost").parent().fadeOut(function() {
				toggleContactOptions(false, toggleReputationOptions, true);
			});
		} else {
			toggleReputationOptions(false, function() {
				toggleContactOptions(false, function() {
					$("#perk-cost").parent().fadeIn(function() {
						calculateCost();
					});	
				});
			});
		}
		handleInput($(this).find(':selected').data());
		$('#perk-cost').trigger('change');
	});

	$('#perk-cost').change(function() {
		$('#perk-total').text(this.value);
	});
});
function calculateCost(skillEnhancers) {
	var totalCost = 0;
	var perkValue = $('#perk-value:visible').val();
	var perkType = $('#perk-type').val() || $('[name=perk-type]').val();
	var contactBonusToRoll = $("#contactBonusToRoll input:visible").val();
	var reputationLevels = $("#reputationLevels input:visible").val();
	var x2Multiplier = $("#x2Multiplier input:visible").val();
	var basePoints = $("#basePoints input:visible").val();

	$('[data-cost]').filter(':visible').each(function(i, el) {
		var costMod = $(el).attr("data-cost");
		if($(el).prop("checked") === true) {
			if(match = costMod.match(/([x+-])(\d)/)) {
				switch(match[1]) {
					case "+":
						totalCost += Number(match[2]);
						break;
					case "-":
						totalCost -= Number(match[2]);
						break;
					case "x":
						totalCost *= Number(match[2]);
						break;
					default:
						return false;
				}
			} else {
				totalCost += Number(costMod);
			}
		}	
	});
	if(perkValue != undefined) totalCost += Number(perkValue);
	if(contactBonusToRoll != undefined) totalCost += Number(contactBonusToRoll);
	if(reputationLevels != undefined) totalCost += Number(reputationLevels);
	if(x2Multiplier != undefined) totalCost += x2Multiplier * 5;
	if(basePoints != undefined) totalCost += Math.round(basePoints / 5);

	if(skillEnhancers) {
		console.log(skillEnhancers, perkType);
		var numFav = $("[name='perkOptions[numberOfFavors]']");
		if(numFav.length > 0)
			numFav.remove();

		switch(perkType) {
			case "Contact":
				if(skillEnhancers.indexOf("Well-Connected") != -1)
					totalCost -= 1;
				break;
			case "Favor":
				if(skillEnhancers.indexOf("Well-Connected") != -1) {
					var numFav = $("[name='perkOptions[numberOfFavors]']");
					if(numFav.length <= 0) {
						var input = document.createElement("input");
						input.type = "hidden";
						input.name = "perkOptions[numberOfFavors]";
						input.value = 2;
						$("form").append(input);
					}
				}
				break;
		}
	}

	// Minimum cost of a perk is 1 pt.
	if(totalCost <= 0) totalCost = 1;
	$("#perk-total").text(totalCost);
	$("[name=perk-cost]").val(totalCost);
}
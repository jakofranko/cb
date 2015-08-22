function calculateSkillCost(skill, skillEnhancers) {
		console.log(skill, skillEnhancers);
		var cost = 0;
		var rollMod = $('#modifier').val();
		var familiarity = $('#familiarity').prop('checked');
		var background = ($('#characteristicBased').prop('checked') == true || $('#characteristicBased').filter(':visible').length == 0) ? false : true;
		var literate = ($('[name=literate]').prop('checked') == false || $('[name=literate]').filter(':visible').length == 0) ? false : true;
		var subcategories = false;
		var numberOfSLs = $('[name=numberOfSkillLevels]:visible').val();
		
		if(skill.categories.length > 0) {
			// Check to see if selected skill has any sub categories
			for(i = 0; i < skill.categories.length; i++) {
				if(skill.categories[i].subcategories.length > 0) {
					subcategories = true;
					break;
				}
			}

			// Increment cost per category
			$('.category').filter(':visible').filter(':checked').each(function(i) {
				// If there are no subcategories, then only the first category is 2 points,
				// and subsequent categories are 1 point. Otherwise, 2 points per category, 1 point per subcategory
				if(subcategories == false && i != 0) {
					cost += 1;
				} else if(familiarity) {
					cost += 1;
				} else {
					cost += skill.baseCost;
				}
			});

			// Increment cost per subcategory
			if(subcategories) {
				$('.subcategory').filter(':visible').filter(':checked').each(function() {
					if($(this).parents('.categories').find('.category').prop('checked') == false || $(this).parents('.categories').find('.category').length == 0) {
						cost += 1;
					}
				});
			}

		} else if(familiarity) {	// If there are no categories, add the price of the skill only once
			cost += 1;
		} else if(background) {
			cost += 2;
		} else {
			cost += skill.baseCost;

			// Add one if literacy is checked
			if(literate) {
				cost += 1
			}
		}
		
		// If there is a base +1 to roll cost set, adds that price to the cost.
		if(skill.basePlusOne && skill.basePlusOne != '' && skill.basePlusOne != null) {
			cost += Number(rollMod * skill.basePlusOne);
		}

		// If the skill is a Skill level of some kind, then multiply the cost by the number of skill levels
		if(numberOfSLs !== undefined) {
			cost *= numberOfSLs;
		}

		if(skillEnhancers) {
			switch(skill.name) {
				case "Professional Skill":
					if(skillEnhancers.indexOf("Jack of All Trades") != -1)
						cost -= 1;
					break;
				case "Language (Basic Conversation)":
				case "Language (Fluent Conversation)":
				case "Language (Completely Fluent, with Accent)":
				case "Language (Idiomatic, native accent)":
				case "Language (Imitate Dialects)":
				// minimum cost of a skill is 1 with SE's
					if(skillEnhancers.indexOf("Linguist") != -1 && cost >= 2)
						cost -= 1;
					break;
				case "Science Skill":
					if(skillEnhancers.indexOf("Scientist") != -1 && cost >= 2)
						cost -= 1;
					break;
				case "Knowledge Skill":
					var type = $('[name=knowledgeSkillType]').val();
					var visited = $('[name=visited]').prop('checked');
					if(skillEnhancers.indexOf("Scholar") != -1 && (type == "People" || type == "Things"))
						cost -= 1;
					else if(skillEnhancers.indexOf("Traveler") != -1 && (type != "People" && type != "Things" && visited))
						cost -= 1;
					break;
			}
		}

		$('#skillCost').text(cost);
	}
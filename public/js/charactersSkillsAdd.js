$(document).ready(function() {
	var character;
	var skill;
	$.ajax({
		async: true,
	  	url: '/api/character/' + $('#characterID').val(),
	  	success: function( data ) { 
			character = data
		},
		error: function() {
			character = null;
		}
	});

	// Functions
	// --------------------------------------
	function switchOptions(selectedOptionDiv, backgroundSkill) {
		if(selectedOptionDiv) {
			if($('.activeOption').length > 0) {
				$('.activeOption')
					.removeClass('activeOption')
					.fadeOut(200, function() { 
						$(selectedOptionDiv)
							.fadeIn()
							.addClass('activeOption'); 
					});
			} else {
				$(selectedOptionDiv)
					.fadeIn()
					.addClass('activeOption'); 
			}
		} else {
			$('.activeOption').fadeOut();
		}
		if(backgroundSkill == true) {
			$('#backgroundSkill').fadeIn();
		} else {
			$('#backgroundSkill').fadeOut();
		}
		if(selectedOptionDiv == "#powerOption" || selectedOptionDiv == "#professionalOption") {
			$('#associatedCharacteristicOptions').fadeIn();
		} else {
			$('#associatedCharacteristicOptions').fadeOut();
		}
	}

	// TODO: Need to update the skill cost
	//		-> For Background and Familiarity
	//		-> Per Category
	function calculateSkillCost(skill) {
		var cost = 0;
		var rollMod = $('#modifier').val();
		var familiarity = $('#familiarity').prop('checked');
		var background = ($('#characteristicBased').prop('checked') == true || $('#characteristicBased').filter(':visible').length == 0) ? false : true;
		var subcateories = false;
		if(skill.categories.length > 0) {
			console.log("has categories");
			// Check to see if selected skill has any sub categories
			for(i = 0; i < skill.categories.length; i++) {
				if(skill.categories[i].subcategories.length > 0) {
					subcateories = true;
					break;
				}
			}

			// Increment cost per category
			$('.category').filter(':visible').filter(':checked').each(function(i) {
				// If there are no subcategories, then only the first category is 2 points,
				// and subsequent categories are 1 point. Otherwise, 2 points per category, 1 point per subcategory
				if(subcateories == false && i != 0) {
					cost += 1;
				} else if(familiarity) {
					cost += 1;
				} else {
					cost += skill.baseCost;
				}
			});
			console.log(cost);

			// Increment cost per subcategory
			if(subcateories) {
				console.log("has subcategories");
				$('.subcategory').filter(':visible').filter(':checked').each(function() {
					if($(this).parents('.categories').find('.category').prop('checked') == false || $(this).parents('.categories').find('.category').length == 0) {
						console.log("has cost");
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
		}
		
		// If there is a base +1 to roll cost set, adds that price to the cost. Otherwise, the skill has a static cost.
		if(skill.basePlusOne && skill.basePlusOne != '' && skill.basePlusOne != null) {
			cost += Number(rollMod * skill.basePlusOne);
		}

		console.log(cost, rollMod, subcateories);
		$('#skillCost').text(cost);
	}

	function calculateSkillRoll(character, skill) {
		var rollSpan = $('#roll');
		var familiarity = ($('#familiarity').prop('checked') && !$('#familiarity').attr('disabled')) ? true : false;
		var backgroundSkill = ($('#characteristicBased').prop('checked') == false && $('#backgroundSkill:visible').length > 0) ? true : false;
		var rollMod = Number($('#modifier').val());

		// If there is an associated characterisitic, it sets the associated characterisitic. If the associated char. is 'varies', and the 
		// dropdown is visible, it sets the roll to the characteristic selected.
		var associatedCharacteristic;
		if(skill.associatedCharacteristic == "varies" && $('#associatedCharacteristic').filter(':visible').length > 0) {
			associatedCharacteristic = $('#associatedCharacteristic').val();
		} else if(skill.associatedCharacteristic && skill.associatedCharacteristic != "none") {
			associatedCharacteristic = skill.associatedCharacteristic;
		} else {
			associatedCharacteristic = false;
		}
		
		// if the skill passed to this function has an associated characterstic, and that characteristic isn't "none",
		// then it will set the variable characterCharacterstic to be the character object's characterstic plus the characteristic's mod. 
		var characterCharacteristic;
		if(associatedCharacteristic && associatedCharacteristic != "none") {
			characterCharacteristic = character[associatedCharacteristic] + character[associatedCharacteristic + "mod"];	
		} else {
			characterCharacteristic = false;
		}

		if(familiarity && associatedCharacteristic) {
			rollSpan.text(8);
		} else if(backgroundSkill) {
			rollSpan.text(11 + rollMod);
		} else if(associatedCharacteristic && characterCharacteristic) {
			rollSpan.text(Math.round(Number(9 + (characterCharacteristic/5))) + rollMod);
		} else {
			rollSpan.text(null);
		}

	}

	$('#skilltype').change(function() {
		var skilltype = $(this).val();
		var skilltypeName = $(this).children('option:selected').text();
		$.ajax({
			async: false,
		  	url: '/api/skill/' + skilltype,
		  	success: function( data ) { 
		  	skill = data
		  }
		});

		// Show Options
		// --------------------------------------
		switchOptions(); // Should toggle off any activeOptions

		// CSLs ----------------------------
		if(skilltypeName == 'Combat Skill Level (2-point)') {
			switchOptions('#2pointCSLOption', false);
		}
		if(skilltypeName == 'Combat Skill Level (3-point)') {
			switchOptions('#3pointCSLOption', false);
		}
		if(skilltypeName == 'Combat Skill Level (5-point)') {
			switchOptions('#5pointCSLOption', false);
		}

		// Language ------------------------
		if(skilltypeName == 'Language (Basic Conversation)' || skilltypeName == 'Language (Fluent Conversation)' || skilltypeName == 'Language (Completely Fluent, with Accent)' || skilltypeName == 'Language (Idiomatic, native accent)' || skilltypeName == 'Language (Imitate Dialects)') {
			switchOptions('#languageOption', false);
		}

		// Knowledge Skill -----------------
		if(skilltypeName == 'Knowledge Skill') {
			switchOptions('#knowledgeSkillOption', true);
		}

		// TODO: Martial Art Builder

		// Penalty Skill Levels
		if(skilltypeName == 'Penalty Skill Level (1.5-point)') {
			switchOptions('#onePointFivePSLOption', false);
		}
		if(skilltypeName == 'Penalty Skill Level (2-point)') {
			switchOptions('#2pointPSLOption', false);
		}

		// Power Option
		if(skilltypeName == 'Power') {
			$('#associatedCharacteristic').attr('disabled', false);
			switchOptions('#powerOption', false);
		}

		// Professional Skill
		if(skilltypeName == 'Professional Skill') {
			switchOptions('#professionalOption', true);
		}

		// Rapid Fire
		if(skilltypeName == 'Rapid Attack') {
			switchOptions('#rapidAttackOption', false);
		}

		// Science Skill
		if(skilltypeName == 'Science Skill') {
			switchOptions('#scienceOption', true);
		}

		// Validation
		// --------------------------------------
		if(skill.basePlusOne) {
			$('#familiarity').attr('disabled', false);
			$('#modifier').attr('disabled', false);
		} else {
			$('#familiarity').attr('disabled', true);
			$('#modifier').attr('disabled', true);
		}


		// Show Categories
		// --------------------------------------
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

		// Calculate Price
		// --------------------------------------
		calculateSkillCost(skill);

		// Calculate Roll (needs to be last)
		// --------------------------------------
		calculateSkillRoll(character, skill);
	});

	$('#familiarity').change(function() {
		if($(this).prop('checked')) {
			$('#modifier').attr('disabled', true);
		} else {
			$('#modifier').attr('disabled', false);
		}
		calculateSkillCost(skill);
		calculateSkillRoll(character, skill);
	});

	$('#modifier').change(function() {
		calculateSkillCost(skill);
		calculateSkillRoll(character, skill);
	});

	$('#characteristicBased').change(function() {
		if($(this).prop('checked')) {
			$('#familiarity').attr('disabled', true);
			$('#associatedCharacteristic').attr('disabled', false);
		} else {
			$('#familiarity').attr('disabled', false);
			$('#associatedCharacteristic').attr('disabled', true);
		}
		calculateSkillCost(skill);
		calculateSkillRoll(character, skill);
	});

	$('#associatedCharacteristic').change(function() {
		calculateSkillCost(skill);
		calculateSkillRoll(character, skill);
	});

	$('.category').change(function() {
		var category = $(this);

		if(category.prop('checked')) {

			category.parents('.categories').find('.subcategory').each(function() {
				$(this).prop('checked', true);
			});

		}
		calculateSkillCost(skill);
	});

	$('.subcategory').change(function() {
		console.log("clicked");
		if($(this).parents('.categories').find('.category').prop('checked')) {
			$(this).parents('.categories').find('.category').prop('checked', false);
		}
		calculateSkillCost(skill);
	});

	
	// TODO: Process and then post data when the add skill buton is clicked
	// TODO: Validation
	//		-> Weapon and Transport familiarity restrictions
	//		-> required fields
	
	// TODO: Add in a skill description box

});
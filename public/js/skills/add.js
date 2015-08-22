$(document).ready(function() {
	$('#addSkillForm').validate();

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
	function switchOptions() {
		var selectedOptionDiv = arguments[0];
		var backgroundSkill = arguments[1];
		var skillLevel = arguments[2];
		
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

		if(skillLevel) {
			$('#numberOfSLs').fadeIn(function() {
				if(skill) {
					calculateSkillCost(skill, skillEnhancers);
				}
			});
		} else {
			$('#numberOfSLs').fadeOut(function() {
				if(skill) {
					calculateSkillCost(skill, skillEnhancers);
				}
			});
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
		} else if(backgroundSkill && skill.associatedCharacteristic != 'none') {
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
			switchOptions('#2pointCSLOption', false, true);
		}
		if(skilltypeName == 'Combat Skill Level (3-point)') {
			switchOptions('#3pointCSLOption', false, true);
		}
		if(skilltypeName == 'Combat Skill Level (5-point)') {
			switchOptions('#5pointCSLOption', false, true);
		}
		if(skilltypeName == 'Combat Skill Level (8-point)') {
			switchOptions(false, false, true);
		}

		// Fast Draw -----------------------
		if(skilltypeName == 'Fast Draw') {
			switchOptions('')
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
			switchOptions('#onePointFivePSLOption', false, true);
		}
		if(skilltypeName == 'Penalty Skill Level (2-point)') {
			switchOptions('#2pointPSLOption', false, true);
		}
		if(skilltypeName == 'Penalty Skill Level (3-point)') {
			switchOptions(false, false, true);
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

		// SLs -----------------------------
		if(skilltypeName == 'Skill Level (2-point)') {
			switchOptions('#2pointSLOption', false, true);
		}
		if(skilltypeName == 'Skill Level (3-point)') {
			switchOptions('#3pointSLOption', false, true);
		}
		if(skilltypeName == 'Skill Level (5-point)') {
			switchOptions('#5pointSLOption', false, true);
		}
		if(skilltypeName == 'Skill Level (8-point)') {
			switchOptions(false, false, true);
		}
		if(skilltypeName == 'Skill Level (10-point)') {
			switchOptions(false, false, true);
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

		} else if(skilltypeName == 'Fast Draw') {
			$('.category-group').find('h2').each(function() {
				if($(this).text() == 'Weapon Familiarity Categories') {
					$(this).parent().fadeIn().addClass('active');
				}
			});
		} else {

			$('.active').fadeOut().removeClass('active');

		}

		// Calculate Price
		// --------------------------------------
		calculateSkillCost(skill, skillEnhancers);

		// Calculate Roll (needs to be last)
		// --------------------------------------
		calculateSkillRoll(character, skill);
	});

	$('#familiarity').change(function() {
		if($(this).prop('checked')) {
			$('#modifier').val('0');
			$('#modifier').attr('disabled', true);
		} else {
			$('#modifier').attr('disabled', false);
		}
		calculateSkillCost(skill, skillEnhancers);
		calculateSkillRoll(character, skill);
	});

	$('#modifier').change(function() {
		calculateSkillCost(skill, skillEnhancers);
		calculateSkillRoll(character, skill);
	});

	$('#characteristicBased').change(function() {
		if($(this).prop('checked')) {
			$('#familiarity').prop('checked', false).attr('disabled', true).trigger('change');
			$('#associatedCharacteristic').attr('disabled', false);
		} else {
			$('#familiarity').attr('disabled', false);
			$('#associatedCharacteristic').attr('disabled', true);
		}
		calculateSkillCost(skill, skillEnhancers);
		calculateSkillRoll(character, skill);
	});

	$('#associatedCharacteristic').change(function() {
		calculateSkillCost(skill, skillEnhancers);
		calculateSkillRoll(character, skill);
	});

	$('[name=numberOfSkillLevels]').change(function() {
		calculateSkillCost(skill, skillEnhancers);
	});

	var threeAttacks = /attack\d{1}$/;
	var groupOfAttacks = /attacks$/;
	$('#3pointCSLOption').add('#2pointPSLOption').find('input').focus(function() {
		var inputID = $(this).attr('id');
		if(inputID.match(threeAttacks)) {
			$(this).parents('.form-group').siblings('.form-group').find('input').filter(function() {
				if($(this).attr('id').match(groupOfAttacks)) {
					$(this).prop('disabled', true);
				}
			});
		} else if(inputID.match(groupOfAttacks)) {
			$(this).parents('.form-group').siblings('.form-group').find('input').filter(function() {
				if($(this).attr('id').match(threeAttacks)) {
					$(this).prop('disabled', true);
				}
			});
		}
	});
	$('#3pointCSLOption').add('#2pointPSLOption').find('input').blur(function() {
		$(this).parents('.form-group').parent().find('input').prop('disabled', false);
	});

	$('#5pointCSLattacks').change(function() {
		if($(this).val() == 'Group of Attacks') {
			$('#5pointAttacksOption').fadeIn();
		} else {
			$('#5pointAttacksOption').fadeOut();
		}
	})


	$('.category').change(function() {
		var category = $(this);

		if(category.prop('checked')) {

			category.parents('.categories').find('.subcategory').each(function() {
				$(this).prop('checked', true);
			});

		}
		calculateSkillCost(skill, skillEnhancers);
	});

	$('.subcategory').change(function() {
			if($(this).parents('.categories').find('.category').prop('checked')) {
			$(this).parents('.categories').find('.category').prop('checked', false);
		}
		calculateSkillCost(skill, skillEnhancers);
	});

	$('[name=literate]').add('[name=knowledgeSkillType]').add('[name=visited]').change(function() {
		calculateSkillCost(skill, skillEnhancers);
	});

	
	// TODO: Process and then post data when the add skill buton is clicked
	$('#addSkill').click(function() {
		if($('#addSkillForm').valid()) {
			var characterID = $('#characterID').val();
			var options = {};
			var characteristicBased = true;
			var familiarity = false;
			var categories = [];
			var subcategories = [];
			var roll = Number($('#roll').text().replace("-", ""));
			var cost = Number($('#skillCost').text());

			$('#options').find('[name]').add('[name=numberOfSkillLevels]').filter(':visible').not(':disabled').each(function() {
				var key = String($(this).attr('name'));
				var value = $(this).val();
				if(value == 'on') {
					options[key] = $(this).prop('checked');
				} else if(value != null && value != undefined && value != "") {
					options[key] = value;	
				}
			});

			// If a category is checked, then it adds it, and all it's subcategories to the category list
			$('#categories').find('.category').filter(':visible').not(':disabled').each(function() {
				if($(this).prop('checked')) {
					var thisSubcategories = [];
					$(this).parents('.categories').find('.subcategory').each(function() {
						thisSubcategories.push($(this).attr('name'));
					});
					categories.push({ name: $(this).attr('name'), subcategories: thisSubcategories});
				}
			});

			// If a subcategory is checked, and it's parent is not checked, then it adds it to an array of subcategories
			$('#categories').find('.subcategory').filter(':visible').not(':disabled').each(function() {
				if($(this).prop('checked') && ($(this).parents('.categories').find('.category').prop('checked') == false || $(this).parents('.categories').find('.category').length == 0)) {
					subcategories.push($(this).attr('name'));
				}
			});

			if($('#backgroundSkill').filter(':visible').length > 0 && $('#characteristicBased').prop('checked') == false) {
				characteristicBased = false;
			}

			if($('#familiarity').prop('checked')) {
				familiarity = true;
			}
			
			var skillToSubmit = {
				characterID: characterID,
				skill: skill,
				roll: roll,
				categories: categories,
				subcategories: subcategories,
				characteristicBased: characteristicBased,
				familiarity: familiarity,
				skillOptions: options,
				cost: cost
			}
			$.post('/characters/addSkill', skillToSubmit).done(function() { $('#addAnother').modal('show'); });
		} else {
			alert('Please fill out all the required fields');
		}
	});
	
	$('#another').click(function() { location.reload(); });
	$('#done').click(function() { location.pathname = '/characters/skills/' + character._id });
	// TODO: Validation
	//		-> required fields
	
	// TODO: Add in a skill description box

});
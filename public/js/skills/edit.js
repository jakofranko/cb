$(document).ready(function() {
	$('#editSkillForm').validate();

	var character;
	
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

	var skill;
	var skilltypeID = $('#skilltypeID').val();
	$.ajax({
		async: false,
		url: '/api/skill/' + skilltypeID,
		success: function( data ) { 
			skill = data
		}
	});

	console.log(skill);

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


	$('#familiarity').change(function() {
		if($(this).prop('checked')) {
			$('#modifier').val('0');
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
		calculateSkillCost(skill);
	});

	$('.subcategory').change(function() {
		if($(this).parents('.categories').find('.category').prop('checked')) {
			$(this).parents('.categories').find('.category').prop('checked', false);
		}
		calculateSkillCost(skill);
	});

	$('[name=literate]').change(function() {
		calculateSkillCost(skill);
	});

	$('[name=numberOfSkillLevels]').change(function() {
		calculateSkillCost(skill);
	});

	
	// TODO: Process and then post data when the add skill buton is clicked
	$('#updateSkill').click(function() {
		if($('#editSkillForm').valid()) {
			var characterID = $('#characterID').val();
			var skillID = $('#skillID').val();
			var options = {};
			var characteristicBased = true;
			var familiarity = false;
			var categories = [];
			var subcategories = [];
			var roll = Number($('#roll').text().replace("-", ""));
			var cost = Number($('#skillCost').text());

			$('#options').find('[name]').add('[name=numberOfSkillLevels]').filter(':visible').not(':disabled').each(function() {
				var key = $(this).attr('name');
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
				skillID: skillID,
				skill: skill,
				roll: roll,
				categories: categories,
				subcategories: subcategories,
				characteristicBased: characteristicBased,
				familiarity: familiarity,
				skillOptions: options,
				cost: cost
			};

			$.post('/characters/updateSkill', skillToSubmit).done(function() { $('#addAnother').modal('show'); }).fail(function(data, status, error) { console.log(data, status, error); });
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
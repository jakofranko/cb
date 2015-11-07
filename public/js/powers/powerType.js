$(document).ready(function() {
	var variants = $('#variants');
	$('.add-variant').click(function() {
		var variantCount = $('.variant').length;
		var name = "variant[" + Number(variantCount) + "][name]";
		var cost = "variant[" + Number(variantCount) + "][cost]";
		var description = "variant[" + Number(variantCount) + "][description]";

		var variant = $('<div class="variant"></div>');
		var formGroup = $('<div class="form-group"></div>');
		var radioDiv = $('<div class="radio"></div>');
		var label = $('<label class="control-label"></label>');
		var input = $('<input/>');

		if(variantCount == 0) {
			var exclusiveGroup = formGroup.clone();
			var exclusiveLabel = label.clone().attr('class', null);
			var radio = input.clone().attr('type', 'radio').attr('name', 'exclusiveVariants');
			var exclusiveYes = radio.clone().attr('value', 'true');
			var exclusiveNo = radio.clone().attr('value', 'false');
			var radioYes = radioDiv.clone().append(exclusiveLabel.clone().append(exclusiveYes).append(' Yes'));
			var radioNo = radioDiv.clone().append(exclusiveLabel.clone().append(exclusiveNo).append(' No'));

			radioYes.appendTo(exclusiveGroup);
			radioNo.appendTo(exclusiveGroup);
			exclusiveGroup.prepend('<label class="control-label">Are Variants Exclusive?</label>');
			exclusiveGroup.append('<hr/>');
			exclusiveGroup.appendTo(variants);
		}

		var nameGroup = formGroup.clone();
		var nameLabel = label.clone().attr('for', name).addClass('control-label').text('Varient Name').appendTo(nameGroup);
		var nameInput = input.clone().attr('name', name).attr('id', name).attr('type', 'text').attr('placeholder', 'E.G., 50% Resistant').addClass('form-control').appendTo(nameGroup);
		nameGroup.appendTo(variant);

		var costGroup = formGroup.clone();
		var costLabel = label.clone().attr('for', cost).addClass('control-label').text('Varient Cost (optional)').appendTo(costGroup);
		var costInput = input.clone().attr('name', cost).attr('id', cost).attr('type', 'number').attr('placeholder', 'E.G., 5').addClass('form-control').appendTo(costGroup);
		costGroup.appendTo(variant);

		var descriptionGroup = formGroup.clone();
		var descriptionLabel = label.clone().attr('for', description).addClass('control-label').text('Varient Description (optional)').appendTo(descriptionGroup);
		var descriptionInput = input.clone().attr('name', description).attr('id', description).attr('type', 'text').attr('placeholder', 'E.G., Versus Energy Defenses').addClass('form-control').appendTo(descriptionGroup);
		descriptionGroup.appendTo(variant);

		var incrementalGroup = formGroup.clone();
		var incrementalLabel = label.clone().attr('class', null);
		var incrementalRadio = input.clone().attr('type', 'radio').attr('name', 'variant[' + Number(variantCount) + '][incremental]');
		var incrementalYes = incrementalRadio.clone().attr('value', 'true');
		var incrementalNo = incrementalRadio.clone().attr('value', 'false');
		var incrementalRadioYes = radioDiv.clone().append(incrementalLabel.clone().append(incrementalYes).append(' Yes'));
		var incrementalRadioNo = radioDiv.clone().append(incrementalLabel.clone().append(incrementalNo).append(' No'));

		incrementalRadioYes.appendTo(incrementalGroup);
		incrementalRadioNo.appendTo(incrementalGroup);
		incrementalGroup.prepend('<label class="control-label">Are Points Incremental?</label>');
		incrementalGroup.append('<hr/>');
		incrementalGroup.appendTo(variant);

		variant.append('<div class="options"></div>');
		variant.append('<button type="button" class="btn btn-primary btn-sm add-option"><span class="glyphcion glyphicon-plus"></span> Add Variant Option</button>');
		variant.append('<hr/>');

		variant.appendTo(variants);
	});

	$(document).on('click', '.add-option', function() {
		var variantCount = $('.variant').length;
		var parent = $(this).parents(".variant");
		var parentCount = parent.find('input').first().attr('name').match(/variant\[(\d*)\]/)[1];
		var optionCount = parent.find('.variant-option').length;
		var options = parent.find(".options");

		var name = "variant[" + Number(parentCount) + "][variantOptions][" + Number(optionCount) + "][name]";
		var cost = "variant[" + Number(parentCount) + "][variantOptions][" + Number(optionCount) + "][cost]";

		var option = $('<div class="variant-option"></div>');
		var formGroup = $('<div class="form-group"></div>');
		var label = $('<label class="control-label"></label>');
		var input = $('<input/>');
		var radioDiv = $('<div class="radio"></div>');

		if(optionCount == 0) {
			var exclusiveGroup = formGroup.clone();
			var exclusiveLabel = label.clone().attr('class', null);
			var radio = input.clone().attr('type', 'radio').attr('name', 'variant[' + Number(parentCount) + '][exclusiveOptions]');
			var exclusiveYes = radio.clone().attr('value', 'true');
			var exclusiveNo = radio.clone().attr('value', 'false');
			var radioYes = radioDiv.clone().append(exclusiveLabel.clone().append(exclusiveYes).append(' Yes'));
			var radioNo = radioDiv.clone().append(exclusiveLabel.clone().append(exclusiveNo).append(' No'));

			radioYes.appendTo(exclusiveGroup);
			radioNo.appendTo(exclusiveGroup);
			exclusiveGroup.prepend('<label class="control-label">Are Options Exclusive?</label>');
			exclusiveGroup.append('<hr/>');
			exclusiveGroup.appendTo(options);
		}

		var nameGroup = formGroup.clone();
		var nameLabel = label.clone().attr('for', name).addClass('control-label').text('Varient Option Name').appendTo(nameGroup);
		var nameInput = input.clone().attr('name', name).attr('id', name).attr('type', 'text').attr('placeholder', 'E.G., Single Sense').addClass('form-control input-sm').appendTo(nameGroup);
		nameGroup.appendTo(option);

		var costGroup = formGroup.clone();
		var costLabel = label.clone().attr('for', cost).addClass('control-label').text('Varient Option Cost (optional)').appendTo(costGroup);
		var costInput = input.clone().attr('name', cost).attr('id', cost).attr('type', 'number').attr('placeholder', 'E.G., 5').addClass('form-control input-sm').appendTo(costGroup);
		costGroup.appendTo(option);

		var incrementalGroup = formGroup.clone();
		var incrementalLabel = label.clone().attr('class', null);
		var incrementalRadio = input.clone().attr('type', 'radio').attr('name', 'variant[' + Number(parentCount) + '][variantOptions][' + Number(optionCount) + '][incremental]');
		var incrementalYes = incrementalRadio.clone().attr('value', 'true');
		var incrementalNo = incrementalRadio.clone().attr('value', 'false');
		var incrementalRadioYes = radioDiv.clone().append(incrementalLabel.clone().append(incrementalYes).append(' Yes'));
		var incrementalRadioNo = radioDiv.clone().append(incrementalLabel.clone().append(incrementalNo).append(' No'));

		incrementalRadioYes.appendTo(incrementalGroup);
		incrementalRadioNo.appendTo(incrementalGroup);
		incrementalGroup.prepend('<label class="control-label">Are Points Incremental?</label>');
		incrementalGroup.appendTo(option);

		option.append('<hr/>');
		option.appendTo(options);
	});
});
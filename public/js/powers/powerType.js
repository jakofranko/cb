$(document).ready(function() {
	var varients = $('#varients');
	$('.add-varient').click(function() {
		var varientCount = $('.varient').length;
		var name = "varient[" + Number(varientCount) + "][name]";
		var cost = "varient[" + Number(varientCount) + "][cost]";
		var description = "varient[" + Number(varientCount) + "][description]";

		var varient = $('<div class="varient"></div>');
		var formGroup = $('<div class="form-group"></div>');
		var label = $('<label class="control-label"></label>');
		var input = $('<input/>');

		var nameGroup = formGroup.clone();
		var nameLabel = label.clone().attr('for', name).addClass('control-label').text('Varient Name').appendTo(nameGroup);
		var nameInput = input.clone().attr('name', name).attr('id', name).attr('type', 'text').attr('placeholder', 'E.G., 50% Resistant').addClass('form-control').appendTo(nameGroup);
		nameGroup.appendTo(varient);

		var costGroup = formGroup.clone();
		var costLabel = label.clone().attr('for', cost).addClass('control-label').text('Varient Cost (optional)').appendTo(costGroup);
		var costInput = input.clone().attr('name', cost).attr('id', cost).attr('type', 'number').attr('placeholder', 'E.G., 5').addClass('form-control').appendTo(costGroup);
		costGroup.appendTo(varient);

		var descriptionGroup = formGroup.clone();
		var descriptionLabel = label.clone().attr('for', description).addClass('control-label').text('Varient Description (optional)').appendTo(descriptionGroup);
		var descriptionInput = input.clone().attr('name', description).attr('id', description).attr('type', 'text').attr('placeholder', 'E.G., Versus Energy Defenses').addClass('form-control').appendTo(descriptionGroup);
		descriptionGroup.appendTo(varient);

		varient.appendTo(varients);
	});
});
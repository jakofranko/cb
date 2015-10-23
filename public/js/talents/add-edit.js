$(document).ready(function() {
	var adders = $('#adders');
	$('.new-adder').click(function() {
		var adderNum = $('.adder').length;
		var formGroup = $('<div class="form-group"/>');
		var label = $('<label class="control-label"></label>');
		var input = $('<input class="form-control"/>');
		var adder = $('<div class="adder"/>');

		console.log(adderNum);
		formGroup.append(label).append(input);
		var name = formGroup.clone();
		var cost = formGroup.clone();
		var label = "adders[" + adderNum + "]";

		name.find('label').attr('for', label + '[name]').text("Adder Name")
		name.find('input').attr("placeholder", "Adder Name").attr("name", label + "[name]").attr("type", "text");

		cost.find('label').attr('for', label + '[cost]').text("Adder Cost")
		cost.find('input').attr("placeholder", "Adder Cost").attr("name", label + "[cost]").attr("type", "number");

		adder.append(name).append(cost).append('<hr/>').appendTo(adders);
	});

	$('.remove-adder').click(function() {
		$(this).parent().remove();
	});
});
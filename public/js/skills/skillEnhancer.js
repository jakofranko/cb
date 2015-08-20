$(document).ready(function() {
	var cost = 0;
	$("input[type=checkbox]").change(function() {
		if($(this).prop("checked") == true) cost += 3;
		else cost -= 3;
		$("#skillEnhancerCost").html(cost);
		$("[name=skillEnhancerCost]").val(cost);
	});
});
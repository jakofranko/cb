$(document).ready(function() {
	$('.add-category').click(function() {
		var categoryCount = $('.category').length;
		var html  = '<div class="form-group clearfix">';
			html +=		'<label class="control-label"></label>';
			html +=		'<div class="checkbox">';
			html +=			'<label>';
			html +=				'<input type="checkbox", name="category' + (categoryCount+1) + 'purchasable" checked/> purchasable as group?';
			html +=			'</label>';
			html +=		'</div>';
			html +=			'<div class="input-group">';
			html +=				'<span class="input-group-btn">';
			html +=					'<button type="button" class="btn btn-default del-category"><span class="glyphicon glyphicon-minus"></span></button>';
			html +=				'</span>';
			html +=			'<input type="text" name="category' + (categoryCount+1) + '" placeholder="Category Name" class="form-control category" />';
			html +=			'</div>';
			html +=		'<button type="button" class="btn btn-default pull-right add-sub">Add Sub-Category</button>';
			html += '</div>';

		var appendTo = $(".category").last().parents('.form-group');

		appendTo.after(html);
	});

	$(document).on('click', '.add-sub', function() {
		var parent = $(this).parent();
		var categoryCount = parent.find(".category").attr("name").split("category")[1];
		var subCount 	  = parent.find(".sub-category").length + 1;

		var html  = '<div class="row sub-group">';
			html += 	'<div class="col-sm-10 col-sm-offset-2">';
			html +=			'<div class="input-group">';
			html +=				'<span class="input-group-btn">';
			html +=					'<button type="button" class="btn btn-default del-sub"><span class="glyphicon glyphicon-minus"></span></button>';
			html +=				'</span>';
			html +=		 		'<input type="text" name="category' + categoryCount + 'sub' + subCount + '" class="form-control sub-category" placeholder="Sub-Category ' + subCount + '" />';
			html +=			'</div>';
			html +=		'</div>';
			html +=	'</div>';

		parent.find('.add-sub').before(html);
	});

	$(document).on('click', '.del-category', function() {
		var parent = $(this).parents('.form-group');
		var catNum = $('.category').length;
		if(catNum > 1) {
			parent.remove();
		} else {
			return false;
		}
	});

	$(document).on('click', '.del-sub', function() {
		var parent = $(this).parents('.sub-group');
		parent.remove();
	});
});
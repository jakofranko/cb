$(document).ready(function() {
	$('.add-category').click(function() {
		var categoryCount = $('.category').length;
		var html  = '<div class="form-group clearfix">';
			html +=		'<label class="control-label">Category ' + (categoryCount+1) + '</label>';
			html +=		'<input type="text" name="category' + (categoryCount+1) + '" placeholder="Category Name" class="form-control category" />';
			html +=		'<button type="button" class="btn btn-default pull-right add-sub">Add Sub-Category</button>';
			html += '</div>';

		var appendTo = $(".category").last().parent();

		appendTo.after(html);
	});

	$(document).on('click', '.add-sub', function() {
		var parent = $(this).parent();
		var categoryCount = parent.children(".category").attr("name").split("category")[1];
		var subCount 	  = parent.find(".sub-category").length + 1;
		console.log(categoryCount, subCount);

		var html  = '<div class="row">';
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
	})
});
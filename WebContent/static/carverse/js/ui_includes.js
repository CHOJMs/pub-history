$(function() {
	const includes = $('[data-include]');

	jQuery.each(includes, function(idx, el) {
		let files = `/web/html/includes/${$(this).data('include')}.html`;
		$(this).load(files);
	})
})



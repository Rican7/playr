$(document).ready(function() {
	$(window).scroll(function(){
		if ($(this).scrollTop() >= 130) {
			$('#hidden').fadeIn();
		} else {
			$('#hidden').fadeOut();
		}
	});
});
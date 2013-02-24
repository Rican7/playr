$(document).ready(function() {
	$(window).scroll(function(){
		if ($(this).scrollTop() >= 130) {
			$('#nav').addClass('sticky');
		} else {
			$('#nav').removeClass('sticky');
		}
	});
});

/*========= Dropdown menu helper =========*/

$(function () {

	$('html').click(function() {

		$(".custom-dropdown").prop('checked', false);

	 });

	 $('.custom-dropdown').click(function(event){

	 	$(".custom-dropdown").not(this).prop('checked', false);
	     event.stopPropagation();

	 });
	 $('.custom-dropdown+label').click(function(event){

	     event.stopPropagation();

	 });

	
});

/*========= Audio mediaElement player =========*/

$(document).ready(function() {
	if($('audio').length >0 )
	    $('audio').mediaelementplayer({
	        alwaysShowControls: true,
	        features: ['playpause','volume','progress'],
	        audioVolume: 'horizontal',
	        audioHeight: 60,
	    });
});

/*========= Filters for category =========*/

$(function () {

	$('.filter-helper').change(function(){

		var id = this.id
		var ids = [];

		$('.filter-helper').each(function(){

			if ($(this).is(':checked'))
				ids.push(this.id) 

		})

		if (ids.length === 0 )

			$('.filter-item').addClass('show-filter').removeClass('hide-filter')


		else

			$('.filter-item').each(function(){
				var exists = false;
				var filters = $(this).attr("data-filter").split(' ')
				for (var i = 0;i <= filters.length;i++)
					if ($.inArray(filters[i],ids) != -1)
						exists = true;
					
				if(exists === false)
					$(this).removeClass('show-filter').addClass('hide-filter')
				else
					$(this).removeClass('hide-filter').addClass('show-filter')
		
				
		})
	});

	for (var i = 0; i < 11; i++)

			if ($('.filter-item').hasClass('span' + i))

				var s = i;

	$('.switcher-helper').change(function(){

		if ($(this).is(':checked')){
			$('.filter-item').removeClass('span' + s).addClass('span12').resize();


		}
			

		else{
			$('.filter-item').removeClass('span12').addClass('span' + s).resize();
		}
			
	});
	
});

/*========= Sipwbox =========*/

$(function () {
	if ($(".show-image").length > 0)
		$(".show-image").swipebox();

});
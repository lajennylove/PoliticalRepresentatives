var district_name, photo_url, name, district_name, email;

function ParseData(data, pointer) {
	var container;
	for (var key in data) {
		if (data.hasOwnProperty(key)) {
			if ( key == pointer ) container = data[key];
			}
		}
	return container;
	}

function appendCard (district_name, photo_url, name, district_name, email) {
	var card;
	card  = '<div class="card image-representative subject float-left">';
	card += 	'<div class="card-divider mt-5">' + district_name + '</div>';
	card +=			'<img src="' + photo_url + '">';
	card +=			'<div class="card-section">';
	card +=				'<h4>' + name + '</h4>';
	card +=				'<p class="disclamer">' + email + '</p>';
	card +=			'</div>';
	card +=		'</div>';
	card +=	'</div>';
	
	$("#cards").append(card);
}

$(document).ready(function(){
	
	// Getting the postal code and turn it into uppercase
	$('#postal').keyup(function() {
    $(this).val($(this).val().toUpperCase());
	});

	$('#send').click(function(event){
		//Variable for postal code
		var postal = $('#postal').val();

		// Trimming the postal code before sending it
		postal = postal.replace(/\s/g, "");
		
		// Clean before querying something new
		$("#cards").empty();
		
		$.ajax({
				url: 'https://represent.opennorth.ca/postcodes/' + postal + '/',
				type: 'POST',
				data: {},
				dataType: "jsonp", // jsonp
			    type: "POST",
			    jsonpCallback: 'processJSONPResponse', // add this property
			    contentType: "application/json; charset=utf-8",
				cache: false,
				beforeSend: function(x) {
				},
				success: function(data){
					// Extracting Representatives
					var representatives = ParseData(data, "representatives_centroid");
					var representative;
					var i;
										
					for (i=0; i < representatives.length; i++ ) {
						representative = ParseData(representatives, i);						
						appendCard ( 
												ParseData(representative, "district_name"), 
												ParseData(representative, "photo_url"), 
												ParseData(representative, "name"),
												ParseData(representative, "district_name"), 
												ParseData(representative, "email")
												);	
					}
				},
				error: function(error) {
				},
				complete : function(jqXHR, status) {
				}
			});		
		
	});

});


var $animation_elements = $('.animation-element');
var $window = $(window);

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function() {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {
      $element.addClass('in-view');
    } else {
      $element.removeClass('in-view');
    }
  });
}

$window.on('scroll resize', check_if_in_view);
$window.trigger('scroll');
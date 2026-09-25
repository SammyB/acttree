jQuery(document).ready(function(){
	jQuery("#ajax-contact-form").submit(function(){
	var str = jQuery(this).serialize();

	   jQuery.ajax({
	   type: "POST",
	   url: "contact_form/contact.php",
	   data: str,
	   success: function(msg){
	   	jQuery("#note").ajaxComplete(function(event, request, settings){
		if(msg == 'OK') // Message Sent? Show the 'Thank You' message and hide the form
			{
				result = '<div class="notification_ok">Your message has been sent Succesfully. Thank you.</div>';
				jQuery("#fields").hide();
			}
			else {
				result = msg;
			}
			jQuery(this).hide();
			jQuery(this).html(result).slideDown("slow");
			jQuery(this).html(result);
		});
	   }
	});
	   return false;
	});
});
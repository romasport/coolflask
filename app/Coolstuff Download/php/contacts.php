<?php 
	/* SECTION I - CONFIGURATION */

$receiver_mail = 'example@example.com';
$mail_title = ( ! empty( $_POST[ 'name' ] )) ? ' from ' . $_POST[ 'name' ]  : ' from [WebSite]';

/* SECTION II - CODE */
$result = 'Nothing Happened';
if ( ! empty( $_POST[ 'name' ] ) && ! empty( $_POST [ 'email' ] ) && ! empty( $_POST [ 'mess' ] ) ) {
 $email = $_POST[ 'email' ];
 $message = $_POST[ 'mess' ];
 $message = wordwrap( $message, 70, "\r\n" );
 $subject = $mail_title;
 $header = 'From: ' . $_POST[ 'name' ] . "\r\n";
 $header .= 'Reply-To: ' . $email;
 if ( mail( $receiver_mail, $subject, $message, $header ) )
  $result = '<div class="alert success-alert">
				<h4>Well done! You successfully read this important alert message.</h4>
				<a href="#" class="close">X</a>
			</div>';
 else
  $result = '<div class="alert error-alert">
				<h4>Warning! Best check yoself, you’re not looking too good!</h4>
				<a href="#" class="close">X</a>
			</div>';
} else {
 $result = '<div class="alert error-alert">
				<h4>Warning! Best check yoself, you’re not looking too good!</h4>
				<a href="#" class="close">X</a>
			</div>';
}
echo $result;
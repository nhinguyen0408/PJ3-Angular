$(document).ready(function(){
  $('.nav-link').click(function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
    $(this).parent().addClass('active')
  });

});

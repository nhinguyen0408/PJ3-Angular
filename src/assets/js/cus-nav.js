$(document).ready(function(){
  $('.nav-link').click(function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active')
    $(this).parent().addClass('active')
  });



});

$('.product-image-thumb').click(function() {
  alert("asdaf");
  $('.product-image-thumb').removeClass('active');
  $(this).addClass('active')
});

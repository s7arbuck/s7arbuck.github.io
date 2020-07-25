window.addEventListener("load", showPage, false);
$('.hamburger').on("click", function() {
  $('.nav-links').toggle(function(){
    $("html").css({"overflow": "hidden"});
    $(this).animate({width: "100%"});
    $(".nav-links").children("span").each(function(index){
      $(this).delay(100*index).fadeIn();
    });
  });
});

$(window).scroll(function() {
  var windowBottom = $(this).scrollTop() + $(this).innerHeight();
  $(".card").each(function() {
    var objectBottom = $(this).offset().top + ($(this).innerHeight() / 2);
    if (objectBottom < windowBottom) {
      if ($(this).css("opacity") == 0) {
        $(this).fadeTo(500, 1);
      }
    }
  });
}).scroll();

function showPage() {
  $(".preload").css({"animation": "preloaderAnim 0.5s forwards"});
  setTimeout(function(){
    $(".preload").css({"display": "none"});
    document.body.classList.remove('js-loading');
    if ($(window).width() <= 751)
    setTimeout(function(){
      $(".left-content p").remove();
      $(".left-content h1").after("<span id=\"landingText\">Exclusive, all-in-one group with high-end brand information, the fleetest monitors, the most accurate early links, and thousands of raffle lists.</span>");
      $("#landingText").fadeIn(1000).css({"display": "block"});
    }, 500);
  }, 1000);
}

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}
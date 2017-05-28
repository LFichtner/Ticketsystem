$(document).ready(function() {
    var temp = $.get('../html/header.html');
    console.log($('.header'));
    $('.BSnavbar').append(temp);
//    $('.header').append($.get('../html/header.html'));
}); 
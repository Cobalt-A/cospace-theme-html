$(document).ready(function() {

    toggleMenu();
    menuHamburger();

    function toggleMenu() {
        var scrollPos = 0;

        $(window).scroll(function () {
            if ($(window).scrollTop() >= 500) {
                var st = $(this).scrollTop();
                if (st > scrollPos){
                    $('#header').addClass('is-hidden').addClass('is-fixed').removeClass('is-visible');
                    console.log('')
                } else {
                    $('#header').removeClass('is-hidden').addClass('is-visible');
                }
                scrollPos = st;
            } else {
                $('#header').removeClass('is-fixed').removeClass('is-hidden').removeClass('is-visible')
            }
        })
    }

    function menuHamburger() {
        document.querySelector('.hamburger').addEventListener('click', function () {
            document.querySelector('.hamburger').classList.toggle('is-active');
            document.querySelector('#nav').classList.toggle('nav-active');
        });
    }
});
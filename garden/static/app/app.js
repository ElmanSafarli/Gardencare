$(document).ready(function () {
    $('#toggle-btn').click(function () {
        toggleSidebar();
    });

    $('.dropdown-btn').click(function () {
        toggleDropdown($(this));
    });
});

function toggleSidebar() {
    const sidebar = $('.sidebar');
    const content = $('.content');

    if (sidebar.width() > 0) {
        sidebar.animate({ width: 0 }, 500);
        content.animate({ marginLeft: 0 }, 500);
    } else {
        sidebar.animate({ width: '60%' }, 500);
        content.animate({ marginLeft: '40%' }, 500);
    }


}
$.sidebarMenu = function (menu) {
    var animationSpeed = 300;

    $(menu).on('click', 'li a', function (e) {
        var $this = $(this);
        var checkElement = $this.next();

        if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
            checkElement.slideUp(animationSpeed, function () {
                checkElement.removeClass('menu-open');
            });
            checkElement.parent("li").removeClass("active");
        }

        //If the menu is not visible
        else if ((checkElement.is('.treeview-menu')) && (!checkElement.is(':visible'))) {
            //Get the parent menu
            var parent = $this.parents('ul').first();
            //Close all open menus within the parent
            var ul = parent.find('ul:visible').slideUp(animationSpeed);
            //Remove the menu-open class from the parent
            ul.removeClass('menu-open');
            //Get the parent li
            var parent_li = $this.parent("li");

            //Open the target menu and add the menu-open class
            checkElement.slideDown(animationSpeed, function () {
                //Add the class active to the parent li
                checkElement.addClass('menu-open');
                parent.find('li.active').removeClass('active');
                parent_li.addClass('active');
            });
        }
        //if this isn't a link, prevent the page from being redirected
        if (checkElement.is('.treeview-menu')) {
            e.preventDefault();
        }
    });
}

$.sidebarMenu($('.sidebar-menu'))

function toggleDropdown(clickedBtn) {
    const dropdownContent = clickedBtn.siblings('.dropdown-content');

    dropdownContent.slideToggle();
    clickedBtn.toggleClass('arrow-up');
}

$(document).ready(function () {
    $.cookie('counter', 0, { expires: 7 }); // expires in 7 days

    function incrementCounter() {
        var counterValue = parseInt($.cookie('counter'));

        $('#counter').text(counterValue);

        var incrementInterval = setInterval(function () {
            if (counterValue < 800) {
                counterValue++;
                $('#counter').text(counterValue);
                $.cookie('counter', counterValue, { expires: 7 });
            } else {
                clearInterval(incrementInterval);
            }
        }, 10);
    }

    incrementCounter();
});

$(document).ready(function () {
    $('.slider').slick({

        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        speed: 300,
        infinite: true,
        autoplaySpeed: 5000,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1001,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]

    });
});

$(document).ready(function () {
    // Show the initial block
    $('#navigate1').show();

    // Handle link clicks
    $('.navigateLink').on('click', function (e) {
        e.preventDefault();

        // Hide all blocks
        $('.whyweslider-navigate-value').hide();

        // Show the target block
        var targetBlockId = $(this).data('target');
        $('#' + targetBlockId).fadeIn();

        // You can add animations here
    });
});

const gallerySlider = new Swiper(".swiper.is-gallery", {
    loop: true,
    slidesPerView: 2,
    centeredSlides: true,
    speed: 300,
    grabCursor: true,
    parallax: true
});


$(document).ready(function () {
    $(window).scroll(function () {
        var windowHeight = $(window).height();
        var scroll = $(window).scrollTop();

        $('.animate-first').each(function () {
            var position = $(this).offset().top;

            if (scroll > position - windowHeight + 100) {
                $(this).addClass('animate');
            }
        });

        $('.fadeInImageFast').each(function () {
            var position = $(this).offset().top;

            if (scroll > position - windowHeight + 100) {
                $(this).addClass('fadeInImage-animate');
            }
        });
        $('.fadeInImageSlow').each(function () {
            var position = $(this).offset().top;

            if (scroll > position - windowHeight + 100) {
                $(this).addClass('fadeInImage-animate');
            }
        });
    });
});


$(document).ready(function () {
    // Show or hide the button based on scroll position
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#scrollToTopBtn').fadeIn();
        } else {
            $('#scrollToTopBtn').fadeOut();
        }
    });

    // Scroll to top when the button is clicked
    $('#scrollToTopBtn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    });
});

const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
let priceGap = 1000;

priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
        let minPrice = parseInt(priceInput[0].value),
            maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
            if (e.target.className === "input-min") {
                rangeInput[0].value = minPrice;
                range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
            } else {
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});


function contactBlock() {
    var block = document.getElementById('contactBoxRegister');
    block.style.display = block.style.display === 'none' ? 'block' : 'none';
}

function closeBlock() {
    var block = document.getElementById('popupBlock');
    block.style.display = 'none';
}
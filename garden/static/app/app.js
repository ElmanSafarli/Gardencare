
document.addEventListener('DOMContentLoaded', function () {
    var menuItems = [];

    // document.getElementById('cartSidebar').classList.remove('width-full');
    menuItems = Array.from(document.querySelectorAll('.shopBox')).map(function (menuItem) {
        return {
            id: menuItem.getAttribute('data-menu-item-id'),
            name: menuItem.querySelector('.shopBox-title').textContent,
            price: parseFloat(menuItem.querySelector('.shopBox-price').textContent),
            // subcategory: menuItem.getAttribute('data-subcategory'),
        };
    });

    // Initialize subcategories based on the first category
    // var initialCategoryButton = document.querySelector('.menuPage-category button');
    // var initialCategory = initialCategoryButton.getAttribute('data-category');


    function updateCartItemQuantity(itemId, quantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[itemId] = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(itemId, quantity) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        cart[itemId] = (cart[itemId] || 0) + quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        // console.log('Added to cart:', { itemId, quantity, cart });
        return cart;
    }

    function removeFromCart(itemId) {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        delete cart[itemId];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function loadCartData() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        updateCartCount();
        updateCartDisplay();
    }

    // Load cart data when the page is loaded
    loadCartData();

    function updateCartCount() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        var totalCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);
        var cartCountElement = document.getElementById('cartCount');
        if (cartCountElement) {
            cartCountElement.textContent = totalCount.toString();
        }
    }


    document.querySelectorAll('.incrementBtn, .decrementBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            var menuItemId = button.getAttribute('data-menu-item-id');
            var countElement = document.getElementById('count_' + menuItemId);
            if (!countElement) {
                console.error('Count element not found.');
                return;
            }
            var currentCount = parseInt(countElement.textContent) || 0;

            if (button.classList.contains('incrementBtn')) {
                currentCount += 1;
            } else {
                if (currentCount > 1) {
                    currentCount -= 1;
                }
            }

            countElement.textContent = currentCount;
            updateCartItemQuantity(menuItemId, currentCount);
            updateCartDisplay();
        });
    });

    document.querySelectorAll('.addToCartBtn').forEach(function (button) {
        button.addEventListener('click', function () {
            var menuItemId = button.getAttribute('data-menu-item');
            // var countElement = document.getElementById('count_' + menuItemId);
            // if (!countElement) {
            //     console.error('Count element not found.');
            //     return;
            // }
            var itemCount = 1;
            addToCart(menuItemId, itemCount);
            updateCartDisplay();
            updateCartItemQuantity(menuItemId, itemCount);
        });
    });

    document.querySelector('.shopping-cart').addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-cart-item-btn')) {
            var itemId = event.target.getAttribute('data-cart-item-id');
            removeFromCart(itemId);
            updateCartDisplay();
        }
    });

    document.querySelector('.cart-items-list').addEventListener('click', function (event) {
        var target = event.target;

        // Check if the clicked element is an increment or decrement button
        if (target.classList.contains('cart-increment-btn') || target.classList.contains('cart-decrement-btn')) {
            // Find the closest parent with the class 'quantity-container'
            var quantityContainer = target.closest('.quantity-container');
            if (!quantityContainer) {
                console.error('Quantity container not found.');
                return;
            }

            var itemId = target.getAttribute('data-cart-item-id');
            var countElement = document.getElementById('cartCount_' + itemId);

            if (!countElement) {
                console.error('Count element not found.');
                return;
            }

            var currentCount = parseInt(countElement.textContent) || 0;

            if (target.classList.contains('cart-increment-btn')) {
                currentCount += 1;
            } else {
                if (currentCount > 1) {
                    currentCount -= 1;
                }
            }

            countElement.textContent = currentCount;
            updateCartItemQuantity(itemId, currentCount);
            updateCartDisplay();
        }
    });

    document.getElementById('send-to-telegram-btn').addEventListener('click', function () {
        document.getElementById('contactForm').style.display = 'block';
    });

    document.getElementById('closeReviewForm').addEventListener('click', function () {
        document.getElementById('contactForm').style.display = 'none';
    });

    // Telegram send button animation
    $('.button-hold').on('click', function () {
        if (isDataValid()) {
            sendTelegramData();
        } else {
            alert('Lütfən, etibarlı məlumatları daxil edin və ya məhsul seçin.');
        }
    });

    function isDataValid() {
        var contactName = document.getElementById('contactName').value;
        var contactSurname = document.getElementById('contactSurname').value;
        var contactNumber = document.getElementById('contactNumber').value;
        var contactAddress = document.getElementById('contactAddress').value;

        return contactName.trim() !== '' && contactNumber.trim() !== '';
    }

    function sendTelegramData() {
        var contactName = document.getElementById('contactName').value;
        var contactSurname = document.getElementById('contactSurname').value;
        var contactNumber = document.getElementById('contactNumber').value;
        var contactAddress = document.getElementById('contactAddress').value;

        var contactDetails = {
            name: contactName,
            surname: contactSurname,
            number: contactNumber,
            address: contactAddress,
        };

        var csrfToken = getCookie('csrftoken');
        if (csrfToken) {
            var cart = JSON.parse(localStorage.getItem('cart')) || {};

            fetch('/send-to-telegram/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    contact: contactDetails,
                    cart: Object.keys(cart).map(itemId => ({ id: itemId, quantity: cart[itemId] })),
                }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('Sifarişiniz qəbul olunur! Menecerimiz tezliklə sizinlə əlaqə saxlayacaq :)');
                        window.location.href = data.url;
                    } else {
                        alert(`The order has not been sent. ${data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error sending your order :(');
                });

            localStorage.setItem('cart', JSON.stringify({}));
            updateCartDisplay();
        } else {
            console.error('CSRF token not found.');
        }
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }


    function updateCartDisplay() {
        var cart = JSON.parse(localStorage.getItem('cart')) || {};
        var cartItemsList = document.getElementById('cart-items');
        var totalPriceElement = document.getElementById('total-price');
        var totalPrice = 0;
        cartItemsList.innerHTML = '';
        for (var itemId in cart) {
            var menuItem = document.querySelector('.shopBox[data-menu-item-id="' + itemId + '"]');
            if (menuItem) {
                var itemName = menuItem.querySelector('.shopBox-title').textContent;
                var itemPrice = parseFloat(menuItem.querySelector('.shopBox-price').textContent);
                var itemTotalPrice = itemPrice * cart[itemId];
                var itemQuantity = cart[itemId];
                var cartItemElement = document.createElement('li');
                cartItemElement.classList.add('cart-item');
                var productDetails = document.createElement('div');
                productDetails.classList.add('product-details');
                var productImage = document.createElement('img');
                productImage.src = menuItem.querySelector('.shopBox-img img').src;
                productImage.alt = itemName;
                productDetails.appendChild(productImage);
                var productInfo = document.createElement('div');
                productInfo.classList.add('product-info');
                var productName = document.createElement('div');
                productName.classList.add('product-name');
                productName.textContent = itemName;
                var quantityContainer = document.createElement('div');
                quantityContainer.classList.add('quantity-container');
                var decrementButton = document.createElement('button');
                decrementButton.textContent = '-';
                decrementButton.classList.add('cart-decrement-btn');
                decrementButton.setAttribute('data-cart-item-id', itemId);
                var countElement = document.createElement('p');
                countElement.textContent = itemQuantity;
                countElement.classList.add('count');
                countElement.id = 'cartCount_' + itemId;
                var incrementButton = document.createElement('button');
                incrementButton.textContent = '+';
                incrementButton.classList.add('cart-increment-btn');
                incrementButton.setAttribute('data-cart-item-id', itemId);
                var itemPriceElement = document.createElement('div');
                itemPriceElement.classList.add('item-price');
                itemPriceElement.textContent = 'Qiymət: ' + itemTotalPrice + ' ₼';
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'x';
                deleteButton.classList.add('delete-cart-item-btn');
                deleteButton.setAttribute('data-cart-item-id', itemId);
                quantityContainer.appendChild(decrementButton);
                quantityContainer.appendChild(countElement);
                quantityContainer.appendChild(incrementButton);
                productInfo.appendChild(productName);
                productInfo.appendChild(quantityContainer);
                productInfo.appendChild(itemPriceElement);
                cartItemElement.appendChild(productDetails);
                cartItemElement.appendChild(productInfo);
                cartItemElement.appendChild(deleteButton);
                cartItemsList.appendChild(cartItemElement);
                totalPrice += itemTotalPrice;
            } else {
                console.error('Menu item not found for ID: ' + itemId);
            }
        }
        totalPriceElement.textContent = 'Yekun məbləğ: ' + totalPrice + ' ₼';
    }

    document.getElementById('showCartBtn').addEventListener('click', function () {
        document.getElementById('cartSidebar').classList.add('width-full');
    });

    document.getElementById('closeCartBtn').addEventListener('click', function () {
        document.getElementById('cartSidebar').classList.remove('width-full');
    });


    updateCartDisplay();
});

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
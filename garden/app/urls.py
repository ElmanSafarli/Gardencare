from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('about-us/', About.as_view(), name='about'),
    path('price/', PriceView.as_view(), name='price'),
    path('services/', ServicePage.as_view(), name='service'),
    path('contact/', ContactPage.as_view(), name='contact'),
    path("blog/", MovieView.as_view()),
    path("blog/<slug:slug>/", MovieDetailView.as_view(), name="movie_detail"),

    path("shop/", ProductView.as_view()),
    path("shop/<slug:slug>/", ProductDetailView.as_view(), name="product_detail"),
    path('product/<slug:slug>/order/', OrderProductView.as_view(), name='order_product'),
    # path("shop/<slug:slug>/add-to-cart/", AddToCartView.as_view(), name="add_to_cart"),
    # path("cart/", CartView.as_view(), name="cart"),
    # path('confirm-cart/', ConfirmCartView.as_view(), name='confirm_cart'),
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

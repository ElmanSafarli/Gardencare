from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import TemplateView, ListView, DetailView
from .models import PricingPackage, BlogPost, Product, Order
from .forms import OrderForm
from .telegram_bot import send_order_to_telegram
from django.views import View
from django.http import HttpResponse
import requests
class HomePageView(TemplateView):
    template_name = 'index.html'

class About(TemplateView):
    template_name = 'pages/about.html'
class ServicePage(TemplateView):
    template_name = 'pages/services.html'

class ContactPage(TemplateView):
    template_name = 'pages/contact.html'

    def post(self, request, *args, **kwargs):
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone_number = request.POST.get('phone_number')
        message_text = request.POST.get('message_text')

        # Send data to Telegram
        message = f'New contact form submission:\nName: {name}\nEmail: {email}\nPhone Number: {phone_number}\nMessage: {message_text}'
        send_to_telegram(message)

        # You can add additional logic here if needed

        return render(request, self.template_name, {'form_submitted': True})
class PriceView(TemplateView):
    template_name = 'pages/pricing.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['pricing_packages'] = PricingPackage.objects.all()
        return context


class MovieView(DetailView):
    def get(self, request):
        blogs = BlogPost.objects.all()
        return render(request, "pages/blog.html", {'blogs': blogs})

class MovieDetailView(DetailView):
    def get(self, request, slug):
        blog = BlogPost.objects.get(url=slug)
        blogs = BlogPost.objects.all()
        return render(request, "pages/blog_detail.html", {'blog': blog, 'blogs': blogs})

class ProductView(DetailView):
    def get(self, request):
        products = Product.objects.all()
        return render(request, "pages/shop.html", {'products': products})

class ProductDetailView(DetailView):

    def get(self, request, slug):
        product = Product.objects.get(url=slug)
        return render(request, "pages/shop_detail.html", {'product': product})

class OrderProductView(View):
    def post(self, request, slug):
        product = Product.objects.get(url=slug)
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        phone_number = request.POST.get('phone_number')

        # Create Order
        order = Order.objects.create(product=product, name=name, surname=surname, phone_number=phone_number)

        # Send data to Telegram
        message = f'New order:\nProduct: {product.title}\nName: {name}\nSurname: {surname}\nPhone Number: {phone_number}'
        send_to_telegram(message)

        return redirect('product_detail', slug=product.url)

def send_to_telegram(message):
    bot_token = '6593345007:AAFkEZnGwUWWvFX1g6K72lAY4PjQd6c5Q6I'
    chat_id = '1494087225'  # Replace with your channel username

    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': message,
    }

    response = requests.post(telegram_api_url, params=params)
    return response.json()



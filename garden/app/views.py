from django.shortcuts import render
from django.views.generic import TemplateView, DetailView
from .models import PricingPackage, BlogPost, Product, Order
from django.views import View
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from django.shortcuts import redirect
import os
from dotenv import load_dotenv

load_dotenv()

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
        send_to_telegram_contact(name, email, phone_number, message_text)

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
    template_name = 'pages/order_confirmation.html'

    def post(self, request, slug):
        product = Product.objects.get(url=slug)
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        phone_number = request.POST.get('phone_number')

        # Create Order
        order = Order.objects.create(product=product, name=name, surname=surname, phone_number=phone_number)

        # Send data to Telegram
        message = f'Yeni sifariş:\nProduct: {product.title}\nName: {name}\nSurname: {surname}\nPhone Number: {phone_number}'
        # send_to_telegram(message)

        return render(request, self.template_name)

def send_to_telegram_contact(name, email, phone_number, message_text):
    bot_token = os.getenv('BOT_TOKEN')
    chat_id = os.getenv('CHAT_ID')

    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': f'Yeni müştəri zənginizi gözləyir:\nName: {name}\nEmail: {email}\nPhone Number: {phone_number}\nMessage: {message_text}',
    }

    response = requests.post(telegram_api_url, params=params)
    return response.json()


@csrf_exempt
def send_to_telegram_view(request):
    if request.method == 'POST':
        try:
            received_data = json.loads(request.body.decode('utf-8'))
            cart_data = received_data.get('cart', [])
            contact_details = received_data.get('contact', {})
            csrf_token = request.headers.get('X-CSRFToken', '')
            print(csrf_token)

            # Prepare the message for Telegram
            message = f"Yeni sifariş:\n\nƏlaqə məlumatları:\nAd: {contact_details.get('name')}\nSoyad: {contact_details.get('surname')}\nƏlaqə nömrəsi: {contact_details.get('number')}\nÜnvan: {contact_details.get('address')}\n\nMəhsul haqqında:\n"
            total_price = 0

            for item in cart_data:
                item_id = item['id']
                quantity = item['quantity']

                # Fetch product details from your database based on item_id
                # Replace 'Product' with the actual name of your model
                menu_item = Product.objects.get(pk=item_id)

                # Update message and total price
                message += f"{menu_item.title} - Miqdar: {quantity}, Qiymət: {menu_item.price * int(quantity)} ₼\n"
                total_price += menu_item.price * int(quantity)

            # Add total price to the message
            message += f"\nYükun məbləg: {total_price} ₼"

            # Send message to Telegram
            send_to_telegram(message)

            # Clear the cart
            request.session['cart'] = {}

            return redirect('/')
        except Exception as e:

            return redirect('/')

    return redirect('/')


def send_to_telegram(message):
    bot_token = os.getenv('BOT_TOKEN')
    chat_id = os.getenv('CHAT_ID')

    telegram_api_url = f'https://api.telegram.org/bot{bot_token}/sendMessage'
    params = {
        'chat_id': chat_id,
        'text': message,
    }

    response = requests.post(telegram_api_url, params=params)

    if response.status_code != 200:
        print(f"Failed to send message to Telegram. Status code: {response.status_code}")



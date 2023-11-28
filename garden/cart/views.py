from django.shortcuts import render, redirect, get_object_or_404
from .models import CartItem
from .forms import AddToCartForm
from app.models import Product
from django.contrib.auth.decorators import login_required
from app.views import send_to_telegram

@login_required
def add_to_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == 'POST':
        form = AddToCartForm(request.POST)
        if form.is_valid():
            quantity = form.cleaned_data['quantity']

            # Check if the item is already in the cart
            cart_item, created = CartItem.objects.get_or_create(
                user=request.user,
                product=product
            )

            if not created:
                # If the item is already in the cart, update the quantity
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity

            cart_item.update_total_price()  # Update the total price

    return redirect('cart_view')

@login_required
def view_cart(request):
    cart_items = CartItem.objects.filter(user=request.user)
    total_price = sum(item.price for item in cart_items)

    product_details = "\n".join([f"{item.product.title}: {item.quantity}" for item in cart_items])

    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        phone_number = request.POST.get('phone_number')

        # Send data to Telegram
        message = 'Yeni sifariş et:'
        send_to_telegram(message, first_name, last_name, phone_number, product_details, total_price)

    return render(request, 'cart/cart.html', {'cart_items': cart_items, 'total_price': total_price})


@login_required
def update_cart(request, product_id):
    product = get_object_or_404(Product, pk=product_id)

    if request.method == 'GET':
        new_quantity = int(request.GET.get('quantity', 1))
        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product
        )
        cart_item.quantity = new_quantity
        cart_item.update_total_price()
        cart_item.save()

    return redirect('cart_view')

@login_required
def remove_from_cart(request, product_id):
    cart_item = get_object_or_404(CartItem, user=request.user, product_id=product_id)
    cart_item.delete()
    return redirect('cart_view')

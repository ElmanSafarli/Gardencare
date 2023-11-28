from django.contrib.auth.models import User
from django.db import models
from django.db.models import F


class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # If your app has user authentication
    product = models.ForeignKey('app.Product',
                                on_delete=models.CASCADE)  # Adjust 'yourapp' and 'Product' to match your product model
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f'{self.quantity} x {self.product.name}'

    def update_total_price(self):
        self.price = self.product.price * self.quantity
        self.save()

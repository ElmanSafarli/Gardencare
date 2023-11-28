from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User

class PricingPackage(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)

    def __str__(self):
        return self.title

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    pub_date = models.DateField()
    url = models.SlugField(max_length=160, unique=True)
    poster = models.ImageField("Poster", upload_to="blogs/")

    def get_absolute_url(self):
        return reverse("movie_detail", kwargs={"slug": self.url})


    def __str__(self):
        return self.title

class Product(models.Model):
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images/')
    url = models.SlugField(max_length=160, unique=True)

    def get_absolute_url(self):
        return reverse("product_detail", kwargs={"slug": self.url})

    def get_add_to_cart_url(self):
        return reverse("add_to_cart", kwargs={"slug": self.url})

    def __str__(self):
        return self.title

class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.name} {self.surname} - {self.product.title}"

# class Cart(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)
#
#     def subtotal(self):
#         return self.product.price * self.quantity
#
#     def __str__(self):
#         if self.user:
#             return f"{self.user.username}'s Cart - {self.product.title}"
#         else:
#             return f"Anonymous Cart - {self.product.title}"

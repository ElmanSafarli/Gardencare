from django.db import models
from django.urls import reverse

class PricingPackage(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50)
    link = models.URLField()

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

    def __str__(self):
        return self.title

class Order(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    surname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.name} {self.surname} - {self.product.title}"

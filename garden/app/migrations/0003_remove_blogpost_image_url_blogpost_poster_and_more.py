# Generated by Django 4.2.7 on 2023-11-20 21:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_blogpost'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='blogpost',
            name='image_url',
        ),
        migrations.AddField(
            model_name='blogpost',
            name='poster',
            field=models.ImageField(default=2, upload_to='blogs/', verbose_name='Poster'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='blogpost',
            name='url',
            field=models.SlugField(default=1, max_length=160, unique=True),
            preserve_default=False,
        ),
    ]
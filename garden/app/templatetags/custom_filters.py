# yourapp/templatetags/custom_filters.py

from django import template

register = template.Library()

@register.filter
def split_by_dot(value):
    return value.split('.')

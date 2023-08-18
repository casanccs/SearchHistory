from django.urls import path
from .views import *

urlpatterns = [
    path('update/', UpdateView.as_view())
]

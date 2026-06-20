from django.urls import path
from .views import ScanView, HistoryListView, ClearHistoryView

urlpatterns = [
    path('scan/', ScanView.as_view(), name='scan'),
    path('history/', HistoryListView.as_view(), name='history'),
    path('clear/', ClearHistoryView.as_view(), name='clear'),
]

from rest_framework import serializers
from .models import ScanHistory

class ScanHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanHistory
        fields = ['id', 'image', 'plant_name', 'disease_name', 'confidence', 'treatment', 'prevention', 'created_at']

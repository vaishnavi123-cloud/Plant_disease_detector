from django.db import models

class ScanHistory(models.Model):
    # Images will be uploaded to media/uploads/ folder
    image = models.ImageField(upload_to='uploads/')
    plant_name = models.CharField(max_length=100)
    disease_name = models.CharField(max_length=150)
    confidence = models.FloatField()
    treatment = models.TextField(blank=True, null=True)
    prevention = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.plant_name} - {self.disease_name} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

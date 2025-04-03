from django.db import models
from django.conf import settings

class LocationSearch(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mainapp_location_searches")  # ✅ FIX: added related_name
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.farmer.email} searched {self.latitude}, {self.longitude}"


class CropRecommendation(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="mainapp_crop_recommendations")  # ✅ FIX: added related_name
    location = models.ForeignKey(LocationSearch, on_delete=models.CASCADE)
    crop_name = models.CharField(max_length=100)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommended {self.crop_name} to {self.farmer.email} at {self.location}"

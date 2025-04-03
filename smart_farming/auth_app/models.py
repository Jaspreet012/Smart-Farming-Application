from django.contrib.auth.models import AbstractUser
from django.db import models

class FarmerUser(AbstractUser):  # Extends default Django User model
    email = models.EmailField(unique=True, primary_key=True)  # Candidate key

    # Fix related_name conflicts
    groups = models.ManyToManyField(
        "auth.Group",
        related_name="farmer_users",
        blank=True
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        related_name="farmer_users",
        blank=True
    )

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'auth_farmer_user'
        app_label = 'auth_app'  # Assigns this model to 'auth_db'

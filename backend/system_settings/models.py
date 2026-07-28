from django.db import models

class SiteSetting(models.Model):
    address = models.TextField(default="24, Jawahar St, opp.to municipal middle school, Adivaram, South Anna Nagar, Palani, Tamil Nadu 624601")
    maps_url = models.URLField(default="https://www.google.com/maps/search/?api=1&query=24,+Jawahar+St,+opp.to+municipal+middle+school,+Adivaram,+South+Anna+Nagar,+Palani,+Tamil+Nadu+624601")
    phone_number = models.CharField(max_length=20, default="+91 7010276853")
    
    # Legal Policies
    terms_conditions = models.TextField(default="Terms and conditions go here.", blank=True)
    privacy_policy = models.TextField(default="Privacy policy goes here.", blank=True)
    cancellation_policy = models.TextField(default="Cancellation and refund policy goes here.", blank=True)
    
    def save(self, *args, **kwargs):
        # Ensure only one instance exists
        if SiteSetting.objects.exists() and not self.pk:
            return SiteSetting.objects.first()
        return super(SiteSetting, self).save(*args, **kwargs)

    def __str__(self):
        return "Global Site Settings"

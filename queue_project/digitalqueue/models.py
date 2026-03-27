
# Create your models here.


from django.db import models
class Organization(models.Model):
    name = models.CharField(max_length=30)
    address = models.TextField()
    def __str__(self):
        return self.name
class Service(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    service_name = models.CharField(max_length=100)
    def __str__(self):
        return self.service_name
class Customer(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name
class Counter(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive')
    ]
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    counter_name = models.CharField(max_length=50)
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='active'
    )
    def __str__(self):
        return self.counter_name
class Token(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('serving', 'Serving'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE
    )
    token_number = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    counter = models.ForeignKey(
        Counter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='waiting'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    served_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.token_number} - {self.service.service_name}"
    class Meta:
        ordering = ['created_at']


# Create your models here.

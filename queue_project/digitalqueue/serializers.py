from rest_framework import serializers
from .models import Organization, Service, Customer, Counter, Token


# ---------------- ORGANIZATION ----------------
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'


# ---------------- SERVICE ----------------
class ServiceSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Service
        fields = '__all__'


# ---------------- CUSTOMER ----------------
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


# ---------------- COUNTER ----------------
class CounterSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="organization.name", read_only=True)

    class Meta:
        model = Counter
        fields = '__all__'


# ---------------- TOKEN ----------------
class TokenSerializer(serializers.ModelSerializer):

    # show readable names instead of IDs
    service_name = serializers.CharField(source="service.service_name", read_only=True)
    organization_name = serializers.CharField(source="organization.name", read_only=True)
    counter_name = serializers.CharField(source="counter.counter_name", read_only=True)

    # important for frontend filtering
    organization_id = serializers.IntegerField(source="organization.id", read_only=True)

    class Meta:
        model = Token
        fields = '__all__'
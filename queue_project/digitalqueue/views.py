from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from datetime import date
from .models import Organization, Service, Customer, Counter, Token
from .serializers import (OrganizationSerializer,ServiceSerializer, CustomerSerializer,
    TokenSerializer,CounterSerializer

)
class OrganizationList(APIView):
    def get(self, request):
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True )
        return Response( serializer.data, status=status.HTTP_200_OK )
class ServiceList(APIView):
    def get(self, request):
        organization_id = request.GET.get("organization")
        if not organization_id:
            return Response(
                {"error": "organization id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        services = Service.objects.filter(
            organization_id=organization_id
        )
        serializer = ServiceSerializer(  services,many=True  )
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
class RegisterCustomer(APIView):

    def post(self, request):

        serializer = CustomerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # save customer
        customer = serializer.save()

        service_id = request.data.get("service")

        if not service_id:
            return Response(
                {"error": "Service id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            service = Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            return Response(
                {"error": "Service not found"},
                status=status.HTTP_404_NOT_FOUND
            )

       # generate token number (corrected)
        token_count = Token.objects.filter(
        service=service,
        organization=service.organization   # ✅ FIX
        ).count() + 1

        prefix = service.service_name[:2].upper()

        token_number = f"{prefix}{token_count}"
        # create token
        token = Token.objects.create(
            token_number=token_number,
            
            customer=customer,
            service=service,
            organization=service.organization
        )

        return Response(
            {
                "message": "Token generated successfully",
                "token": token.token_number
            },
            status=status.HTTP_201_CREATED
        )
class QueueList(APIView):

    def get(self, request):

        organization_id = request.GET.get("organization")

        if not organization_id:
            return Response({"error": "Organization required"}, status=400)

        organization_id = int(organization_id)  # ✅ FIX

        serving = Token.objects.filter(
            status="serving",
            organization_id=organization_id
        ).order_by("served_at").first()

        waiting = Token.objects.filter(
            status="waiting",
            organization_id=organization_id
        ).order_by("created_at")

        return Response({
            "serving": TokenSerializer(serving).data if serving else None,
            "waiting": TokenSerializer(waiting, many=True).data
        })


class CallNextToken(APIView):

    def post(self, request):

        counter_id = request.data.get("counter")
        organization_id = request.data.get("organization")

        if not counter_id or not organization_id:
            return Response({"error": "Counter and Organization required"}, status=400)

        organization_id = int(organization_id)

        # check if counter already serving in SAME organization
        active = Token.objects.filter(
            counter_id=counter_id,
            organization_id=organization_id,
            status="serving"
        ).first()

        if active:
            return Response(
                {"message": "Finish current token first"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # get next token ONLY from same organization
        token = Token.objects.filter(
            status="waiting",
            organization_id=organization_id
        ).order_by("created_at").first()

        if not token:
            return Response(
                {"message": "No tokens waiting for this organization"},
                status=status.HTTP_404_NOT_FOUND
            )

        token.status = "serving"
        token.counter_id = counter_id
        token.served_at = timezone.now()
        token.save()

        return Response({
            "message": "Token called",
            "token": token.token_number,
            "counter": counter_id
        })
class CompleteToken(APIView):

    def post(self, request):

        token_id = request.data.get("token_id")
        token_number = request.data.get("token")

        # ✅ handle both cases
        if token_id:
            try:
                token = Token.objects.get(id=token_id)
            except Token.DoesNotExist:
                return Response(
                    {"error": "Token not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        elif token_number:
            try:
                token = Token.objects.get(token_number=token_number)
            except Token.DoesNotExist:
                return Response(
                    {"error": "Token not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        else:
            return Response(
                {"error": "Token ID or Token Number required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ update status
        token.status = "completed"
        token.completed_at = timezone.now()
        token.save()

        return Response(
            {"message": "Service completed"},
            status=status.HTTP_200_OK
        )
class CounterList(APIView):

    def get(self, request):

        org_id = request.GET.get("organization")

        if not org_id:
            return Response(
                {"error": "organization id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        counters = Counter.objects.filter(
            organization_id=org_id,
            status="active"
        )

        serializer = CounterSerializer(counters, many=True)

        return Response(serializer.data)
class AdminLogin(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is not None:
            return Response({
                "message": "Login successful",
                "username": user.username
            })

        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED
        )
class QueueTracking(APIView):

    def get(self, request):

        tokens = Token.objects.all().order_by("-created_at")

        serializer = TokenSerializer(tokens, many=True)

        return Response(serializer.data)
class TokenStats(APIView):

    def get(self, request):

        total = Token.objects.count()

        waiting = Token.objects.filter(status="waiting").count()

        serving = Token.objects.filter(status="serving").count()

        completed = Token.objects.filter(status="completed").count()

        return Response({
            "total_tokens": total,
            "waiting_tokens": waiting,
            "serving_tokens": serving,
            "completed_tokens": completed
        })
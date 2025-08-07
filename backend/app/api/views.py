from django.conf import settings
from django.contrib.auth import login, logout
from django.core.mail import send_mail
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import (
    Facility,
    IncidentTicket,
    IncidentType,
    Location,
    Profile,
    ScheduledEvent,
    ServiceTicket,
    Shift,
    TimeEntry,
    TimeOffRequest,
)
from .serializers import (
    FacilitySerializer,
    IncidentTicketSerializer,
    IncidentTypeSerializer,
    LocationSerializer,
    ProfileSerializer,
    ScheduledEventSerializer,
    ServiceTicketSerializer,
    ShiftSerializer,
    TimeEntrySerializer,
    TimeOffRequestSerializer,
    UserSerializer,
)


# Authentication endpoints
@api_view(["GET"])
def get_csrf_token(request):
    """
    Get a CSRF token for making authenticated requests
    """
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


@api_view(["POST"])
def login_view(request):
    """
    Authenticate a user with username and password
    """
    username = request.data.get("username")
    password = request.data.get("password")

    if username is None or password is None:
        return Response(
            {"error": "Please provide username and password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    from django.contrib.auth import authenticate

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(["POST"])
def logout_view(request):
    """
    Log out the current user
    """
    logout(request)
    return Response({"success": "Successfully logged out"})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_current_user(request):
    """
    Get the current authenticated user
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# Data endpoints as ViewSets
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
    permission_classes = [permissions.IsAuthenticated]


class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]


class IncidentTypeViewSet(viewsets.ModelViewSet):
    queryset = IncidentType.objects.all()
    serializer_class = IncidentTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class IncidentTicketViewSet(viewsets.ModelViewSet):
    queryset = IncidentTicket.objects.all()
    serializer_class = IncidentTicketSerializer
    permission_classes = [permissions.IsAuthenticated]


class ServiceTicketViewSet(viewsets.ModelViewSet):
    queryset = ServiceTicket.objects.all()
    serializer_class = ServiceTicketSerializer
    permission_classes = [permissions.IsAuthenticated]


class TimeEntryViewSet(viewsets.ModelViewSet):
    queryset = TimeEntry.objects.all()
    serializer_class = TimeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter time entries by user if requested"""
        queryset = TimeEntry.objects.all()
        user_id = self.request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class ScheduledEventViewSet(viewsets.ModelViewSet):
    queryset = ScheduledEvent.objects.all()
    serializer_class = ScheduledEventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter events by user or date range if requested"""
        queryset = ScheduledEvent.objects.all()

        user_id = self.request.query_params.get("user_id")
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if user_id:
            queryset = queryset.filter(users__id=user_id)

        if start_date and end_date:
            queryset = queryset.filter(
                start_time__gte=start_date, end_time__lte=end_date
            )

        return queryset


class TimeOffRequestViewSet(viewsets.ModelViewSet):
    queryset = TimeOffRequest.objects.all()
    serializer_class = TimeOffRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filter requests by user if requested"""
        queryset = TimeOffRequest.objects.all()
        user_id = self.request.query_params.get("user_id")
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


# Email sending endpoint
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def send_email_view(request):
    """
    Send an email
    """
    subject = request.data.get("subject")
    message = request.data.get("message")
    recipient_list = request.data.get("recipient_list", [])

    if not subject or not message or not recipient_list:
        return Response(
            {"error": "Please provide subject, message, and recipient_list"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            recipient_list,
            fail_silently=False,
        )
        return Response({"success": "Email sent successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

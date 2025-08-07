from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

# Create a router for our ViewSets
router = DefaultRouter()
router.register("profiles", views.ProfileViewSet)
router.register("locations", views.LocationViewSet)
router.register("facilities", views.FacilityViewSet)
router.register("shifts", views.ShiftViewSet)
router.register("incident-types", views.IncidentTypeViewSet)
router.register("incident-tickets", views.IncidentTicketViewSet)
router.register("service-tickets", views.ServiceTicketViewSet)
router.register("time-entries", views.TimeEntryViewSet)
router.register("scheduled-events", views.ScheduledEventViewSet)
router.register("time-off-requests", views.TimeOffRequestViewSet)

# URL patterns for our API
urlpatterns = [
    # Authentication endpoints
    path("csrf/", views.get_csrf_token, name="csrf"),
    path("auth/login/", views.login_view, name="login"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/user/", views.get_current_user, name="current_user"),
    # Email endpoint
    path("send-email/", views.send_email_view, name="send_email"),
    # Include all the ViewSet endpoints
    path("", include(router.urls)),
]

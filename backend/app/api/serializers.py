from django.contrib.auth.models import User
from rest_framework import serializers

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "is_staff"]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = [
            "id",
            "user",
            "job_title",
            "department",
            "phone_number",
            "hire_date",
            "is_active",
        ]


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            "id",
            "name",
            "address",
            "city",
            "state",
            "zip_code",
            "country",
            "is_active",
        ]


class FacilitySerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), write_only=True, source="location"
    )

    class Meta:
        model = Facility
        fields = [
            "id",
            "name",
            "location",
            "location_id",
            "facility_type",
            "capacity",
            "is_active",
        ]


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ["id", "name", "start_time", "end_time", "is_overnight", "is_active"]


class IncidentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IncidentType
        fields = ["id", "name", "description", "priority_level", "is_active"]


class IncidentTicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    incident_type = IncidentTypeSerializer(read_only=True)
    facility = FacilitySerializer(read_only=True)

    created_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="created_by"
    )
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source="assigned_to",
        required=False,
    )
    incident_type_id = serializers.PrimaryKeyRelatedField(
        queryset=IncidentType.objects.all(), write_only=True, source="incident_type"
    )
    facility_id = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(), write_only=True, source="facility"
    )

    class Meta:
        model = IncidentTicket
        fields = [
            "id",
            "title",
            "description",
            "created_by",
            "assigned_to",
            "incident_type",
            "facility",
            "status",
            "created_at",
            "updated_at",
            "resolved_at",
            "created_by_id",
            "assigned_to_id",
            "incident_type_id",
            "facility_id",
        ]


class ServiceTicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    facility = FacilitySerializer(read_only=True)

    created_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="created_by"
    )
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source="assigned_to",
        required=False,
    )
    facility_id = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(), write_only=True, source="facility"
    )

    class Meta:
        model = ServiceTicket
        fields = [
            "id",
            "title",
            "description",
            "created_by",
            "assigned_to",
            "facility",
            "status",
            "created_at",
            "updated_at",
            "completed_at",
            "created_by_id",
            "assigned_to_id",
            "facility_id",
        ]


class TimeEntrySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    location = LocationSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="user"
    )
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), write_only=True, source="location"
    )

    class Meta:
        model = TimeEntry
        fields = [
            "id",
            "user",
            "entry_type",
            "timestamp",
            "note",
            "location",
            "user_id",
            "location_id",
        ]


class ScheduledEventSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    facility = FacilitySerializer(read_only=True)

    user_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, many=True, source="users"
    )
    facility_id = serializers.PrimaryKeyRelatedField(
        queryset=Facility.objects.all(), write_only=True, source="facility"
    )

    class Meta:
        model = ScheduledEvent
        fields = [
            "id",
            "title",
            "event_type",
            "start_time",
            "end_time",
            "users",
            "facility",
            "is_recurring",
            "recurrence_pattern",
            "notes",
            "created_at",
            "updated_at",
            "user_ids",
            "facility_id",
        ]


class TimeOffRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reviewed_by = UserSerializer(read_only=True)

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="user"
    )
    reviewed_by_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        write_only=True,
        source="reviewed_by",
        required=False,
    )

    class Meta:
        model = TimeOffRequest
        fields = [
            "id",
            "user",
            "request_type",
            "start_date",
            "end_date",
            "status",
            "reason",
            "reviewed_by",
            "reviewed_at",
            "created_at",
            "updated_at",
            "user_id",
            "reviewed_by_id",
        ]

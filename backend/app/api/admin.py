from django.contrib import admin

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


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "job_title", "department", "is_active")
    list_filter = ("is_active", "department")
    search_fields = ("user__username", "user__email", "job_title", "department")


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ("name", "city", "state", "country", "is_active")
    list_filter = ("is_active", "state", "country")
    search_fields = ("name", "address", "city")


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "facility_type", "capacity", "is_active")
    list_filter = ("is_active", "facility_type", "location")
    search_fields = ("name", "facility_type")


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = ("name", "start_time", "end_time", "is_overnight", "is_active")
    list_filter = ("is_active", "is_overnight")
    search_fields = ("name",)


@admin.register(IncidentType)
class IncidentTypeAdmin(admin.ModelAdmin):
    list_display = ("name", "priority_level", "is_active")
    list_filter = ("is_active", "priority_level")
    search_fields = ("name", "description")


@admin.register(IncidentTicket)
class IncidentTicketAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_by",
        "assigned_to",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "incident_type", "facility")
    search_fields = (
        "title",
        "description",
        "created_by__username",
        "assigned_to__username",
    )
    date_hierarchy = "created_at"


@admin.register(ServiceTicket)
class ServiceTicketAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "created_by",
        "assigned_to",
        "status",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "facility")
    search_fields = (
        "title",
        "description",
        "created_by__username",
        "assigned_to__username",
    )
    date_hierarchy = "created_at"


@admin.register(TimeEntry)
class TimeEntryAdmin(admin.ModelAdmin):
    list_display = ("user", "entry_type", "timestamp", "location")
    list_filter = ("entry_type", "location")
    search_fields = ("user__username", "note")
    date_hierarchy = "timestamp"


@admin.register(ScheduledEvent)
class ScheduledEventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "event_type",
        "start_time",
        "end_time",
        "facility",
        "is_recurring",
    )
    list_filter = ("event_type", "facility", "is_recurring")
    search_fields = ("title", "notes")
    date_hierarchy = "start_time"
    filter_horizontal = ("users",)


@admin.register(TimeOffRequest)
class TimeOffRequestAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "request_type",
        "start_date",
        "end_date",
        "status",
        "created_at",
    )
    list_filter = ("request_type", "status")
    search_fields = ("user__username", "reason")
    date_hierarchy = "start_date"

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    job_title = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20, blank=True)
    hire_date = models.DateField(default=timezone.now)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Location(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="USA")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Facility(models.Model):
    name = models.CharField(max_length=100)
    location = models.ForeignKey(
        Location, on_delete=models.CASCADE, related_name="facilities"
    )
    facility_type = models.CharField(max_length=100)
    capacity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Shift(models.Model):
    name = models.CharField(max_length=100)
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_overnight = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class IncidentType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    priority_level = models.IntegerField(
        choices=[(1, "Low"), (2, "Medium"), (3, "High"), (4, "Critical")], default=2
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class IncidentTicket(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("in_progress", "In Progress"),
        ("on_hold", "On Hold"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_incidents"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_incidents",
    )
    incident_type = models.ForeignKey(IncidentType, on_delete=models.CASCADE)
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title


class ServiceTicket(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("rejected", "Rejected"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_services"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_services",
    )
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title


class TimeEntry(models.Model):
    ENTRY_TYPE_CHOICES = [
        ("clock_in", "Clock In"),
        ("clock_out", "Clock Out"),
        ("break_start", "Break Start"),
        ("break_end", "Break End"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="time_entries"
    )
    entry_type = models.CharField(max_length=20, choices=ENTRY_TYPE_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    note = models.TextField(blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.entry_type} - {self.timestamp}"


class ScheduledEvent(models.Model):
    EVENT_TYPE_CHOICES = [
        ("shift", "Regular Shift"),
        ("overtime", "Overtime"),
        ("meeting", "Meeting"),
        ("training", "Training"),
    ]

    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    users = models.ManyToManyField(User, related_name="scheduled_events")
    facility = models.ForeignKey(Facility, on_delete=models.CASCADE)
    is_recurring = models.BooleanField(default=False)
    recurrence_pattern = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class TimeOffRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("cancelled", "Cancelled"),
    ]

    REQUEST_TYPE_CHOICES = [
        ("vacation", "Vacation"),
        ("sick", "Sick Leave"),
        ("personal", "Personal Leave"),
        ("bereavement", "Bereavement"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="time_off_requests"
    )
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reason = models.TextField()
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviewed_time_off_requests",
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.request_type} - {self.start_date} to {self.end_date}"

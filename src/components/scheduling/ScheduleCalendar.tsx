import { Card, CardContent } from "@/components/ui/card";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { Clock, Edit, MapPin, Repeat, User } from "lucide-react";
import React, { useRef, useState } from "react";

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  type: "event" | "shift";
  isRecurring: boolean;
  shifts?: Shift[];
  color: string;
}

interface Shift {
  id: string;
  eventId?: string;
  title: string;
  startTime: string;
  endTime: string;
  facility: string;
  assignedStaff?: string[];
  isRecurring: boolean;
  color: string;
}

interface CalendarItem extends Event {
  itemType: "event";
  position: {
    top: number;
    height: number;
    startMinutes: number;
  };
  originalLayerIndex: number;
  calculatedLayer?: number;
  totalColumns?: number;
}

interface CalendarShiftItem extends Shift {
  itemType: "shift";
  position: {
    top: number;
    height: number;
    startMinutes: number;
  };
  originalLayerIndex: number;
  calculatedLayer?: number;
  totalColumns?: number;
}

type CalendarItemType = CalendarItem | CalendarShiftItem;

interface ScheduleCalendarProps {
  currentWeek: Date;
  mode: "schedule" | "rota";
  onEventEdit: (event: Event) => void;
  onShiftEdit: (shift: Shift) => void;
}

const ScheduleCalendar = ({
  currentWeek,
  mode,
  onEventEdit,
  onShiftEdit,
}: ScheduleCalendarProps) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 12 AM
  const HOUR_HEIGHT = 80; // Height of each hour slot in pixels

  const [draggedItem, setDraggedItem] = useState<CalendarItemType | null>(null);
  const [dragMode, setDragMode] = useState<
    "move" | "resize-start" | "resize-end" | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);

  // Mock data - in real app this would come from state management
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Morning Show",
      startTime: "08:00",
      endTime: "11:00",
      facility: "Studio A",
      type: "event",
      isRecurring: true,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      shifts: [
        {
          id: "s1",
          eventId: "1",
          title: "Show Host",
          startTime: "07:30",
          endTime: "11:30",
          facility: "Studio A",
          assignedStaff: ["John Doe"],
          isRecurring: true,
          color: "bg-green-100 text-green-800 border-green-200",
        },
      ],
    },
    {
      id: "2",
      title: "Evening News",
      startTime: "18:00",
      endTime: "19:00",
      facility: "Studio B",
      type: "event",
      isRecurring: true,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      shifts: [
        {
          id: "s2",
          eventId: "2",
          title: "News Anchor",
          startTime: "17:30",
          endTime: "19:30",
          facility: "Studio B",
          assignedStaff: ["Jane Smith"],
          isRecurring: true,
          color: "bg-orange-100 text-orange-800 border-orange-200",
        },
      ],
    },
  ]);

  const [standaloneShifts] = useState<Shift[]>([
    {
      id: "s3",
      title: "Technical Support",
      startTime: "09:00",
      endTime: "17:00",
      facility: "Control Room",
      assignedStaff: ["Mike Johnson"],
      isRecurring: false,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
  ]);

  const timeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  const calculateItemPosition = (startTime: string, endTime: string) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Calculate position from 6 AM
    const topOffset = ((startMinutes - 6 * 60) / 60) * HOUR_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;

    return {
      top: topOffset,
      height: height,
      startMinutes,
    };
  };

  const detectOverlaps = (items: CalendarItemType[]) => {
    // Sort items by start time first
    const sortedItems = [...items].sort(
      (a, b) => a.position.startMinutes - b.position.startMinutes,
    );

    // Group overlapping items into columns with more lenient overlap detection
    const columns: CalendarItemType[][] = [];

    sortedItems.forEach((item) => {
      const itemStart = item.position.startMinutes;
      const itemEnd =
        item.position.startMinutes + (item.position.height / HOUR_HEIGHT) * 60;

      // Find a column where this item has minimal overlap (allow 30 minutes of overlap)
      let placed = false;
      for (let i = 0; i < columns.length; i++) {
        const lastItemInColumn = columns[i][columns[i].length - 1];
        const lastItemEnd =
          lastItemInColumn.position.startMinutes +
          (lastItemInColumn.position.height / HOUR_HEIGHT) * 60;

        // Allow overlap of up to 30 minutes
        if (itemStart >= lastItemEnd - 30) {
          columns[i].push({ ...item, calculatedLayer: i, totalColumns: 0 });
          placed = true;
          break;
        }
      }

      // If not placed in existing column, create new column
      if (!placed) {
        columns.push([
          { ...item, calculatedLayer: columns.length, totalColumns: 0 },
        ]);
      }
    });

    // Update totalColumns for all items - limit to max 4 columns for better visibility
    const totalColumns = Math.min(columns.length, 4);
    const result = [];
    for (let i = 0; i < columns.length; i++) {
      for (const item of columns[i]) {
        // If we have more than 4 columns, compress later columns
        const adjustedLayer = i >= 4 ? 3 : i;
        result.push({ ...item, calculatedLayer: adjustedLayer, totalColumns });
      }
    }

    return result;
  };

  const getItemsForDay = (date: Date) => {
    const items = [];

    // Add events
    events.forEach((event) => {
      if (shouldShowOnDate(date, event.isRecurring)) {
        const position = calculateItemPosition(event.startTime, event.endTime);
        items.push({
          ...event,
          itemType: "event",
          position,
          originalLayerIndex: 0,
        });

        // Add event shifts if in schedule mode
        if (mode === "schedule" && event.shifts) {
          event.shifts.forEach((shift, index) => {
            const shiftPosition = calculateItemPosition(
              shift.startTime,
              shift.endTime,
            );
            items.push({
              ...shift,
              itemType: "shift",
              position: shiftPosition,
              originalLayerIndex: index + 1,
            });
          });
        }
      }
    });

    // Add standalone shifts
    standaloneShifts.forEach((shift) => {
      if (shouldShowOnDate(date, shift.isRecurring)) {
        const position = calculateItemPosition(shift.startTime, shift.endTime);
        items.push({
          ...shift,
          itemType: "shift",
          position,
          originalLayerIndex: 0,
        });
      }
    });

    // Detect overlaps and assign proper layers
    return detectOverlaps(items);
  };

  const shouldShowOnDate = (date: Date, isRecurring: boolean) => {
    // For demo, show recurring items on weekdays, non-recurring on specific days
    if (isRecurring) {
      return date.getDay() >= 1 && date.getDay() <= 5; // Monday to Friday
    }
    return isSameDay(date, weekDays[2]); // Wednesday for demo
  };

  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return "12 PM";
    return `${hour - 12} PM`;
  };

  const handleItemClick = (item: CalendarItemType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return; // Don't handle clicks during drag

    if (item.itemType === "event") {
      onEventEdit(item);
    } else {
      onShiftEdit(item);
    }
  };

  const getDropZoneFromPosition = (clientX: number, clientY: number) => {
    if (!calendarRef.current) return null;

    const calendarRect = calendarRef.current.getBoundingClientRect();
    const relativeX = clientX - calendarRect.left;
    const relativeY = clientY - calendarRect.top;

    // Calculate day (subtract time column width)
    const timeColumnWidth = calendarRect.width / 8;
    const dayWidth = timeColumnWidth;
    const dayIndex = Math.floor((relativeX - timeColumnWidth) / dayWidth);

    // Calculate hour (with 15-minute precision)
    const quarterHours = Math.round(relativeY / (HOUR_HEIGHT / 4));
    const minutes = quarterHours * 15 + 6 * 60; // 6 AM start

    if (
      dayIndex >= 0 &&
      dayIndex < 7 &&
      minutes >= 6 * 60 &&
      minutes < 24 * 60
    ) {
      return { dayIndex, minutes };
    }

    return null;
  };

  const handleMouseDown = (e: React.MouseEvent, item: CalendarItemType) => {
    if (item.itemType !== "event") return; // Only allow dragging events

    e.preventDefault();
    e.stopPropagation();

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const itemHeight = rect.height;

    // Determine drag mode based on where user clicked
    let mode: "move" | "resize-start" | "resize-end" = "move";
    if (relativeY < 15) {
      mode = "resize-start";
    } else if (relativeY > itemHeight - 15) {
      mode = "resize-end";
    }

    setDraggedItem(item);
    setDragMode(mode);
    setIsDragging(false);
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedItem || !dragMode) return;

    const distance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.current.x, 2) +
        Math.pow(e.clientY - dragStartPos.current.y, 2),
    );

    if (distance > 5 && !isDragging) {
      setIsDragging(true);
    }

    if (isDragging) {
      // Update cursor based on drag mode
      document.body.style.cursor =
        dragMode === "move" ? "grabbing" : "ns-resize";
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!draggedItem || !dragMode) return;

    if (isDragging) {
      const dropZone = getDropZoneFromPosition(e.clientX, e.clientY);

      if (dropZone) {
        if (dragMode === "move") {
          // Move entire event
          const duration =
            timeToMinutes(draggedItem.endTime) -
            timeToMinutes(draggedItem.startTime);
          const newStartMinutes = dropZone.minutes;
          const newEndMinutes = newStartMinutes + duration;

          // Update event
          setEvents((prev) =>
            prev.map((event) =>
              event.id === draggedItem.id
                ? {
                    ...event,
                    startTime: minutesToTime(newStartMinutes),
                    endTime: minutesToTime(newEndMinutes),
                  }
                : event,
            ),
          );

          console.log(
            `Moved event ${draggedItem.title} to day ${dropZone.dayIndex}, time ${minutesToTime(newStartMinutes)}-${minutesToTime(newEndMinutes)}`,
          );
        } else if (dragMode === "resize-start") {
          // Resize start time
          const endMinutes = timeToMinutes(draggedItem.endTime);

          if (dropZone.minutes < endMinutes) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === draggedItem.id
                  ? { ...event, startTime: minutesToTime(dropZone.minutes) }
                  : event,
              ),
            );
            console.log(
              `Resized event start to ${minutesToTime(dropZone.minutes)}`,
            );
          }
        } else if (dragMode === "resize-end") {
          // Resize end time
          const startMinutes = timeToMinutes(draggedItem.startTime);

          if (dropZone.minutes > startMinutes) {
            setEvents((prev) =>
              prev.map((event) =>
                event.id === draggedItem.id
                  ? { ...event, endTime: minutesToTime(dropZone.minutes) }
                  : event,
              ),
            );
            console.log(
              `Resized event end to ${minutesToTime(dropZone.minutes)}`,
            );
          }
        }
      }
    }

    // Cleanup
    setDraggedItem(null);
    setDragMode(null);
    setIsDragging(false);
    document.body.style.cursor = "default";

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 bg-gray-50 border-b">
              <div className="p-4 border-r font-medium text-gray-600">Time</div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="p-4 border-r font-medium text-center"
                >
                  <div className="text-sm text-gray-600">
                    {format(day, "EEE")}
                  </div>
                  <div className="text-lg font-semibold">
                    {format(day, "d MMM")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar Grid Container */}
            <div className="relative" ref={calendarRef}>
              {/* Time Slots Background */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-8 border-b hover:bg-gray-50"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  {/* Time Column */}
                  <div className="p-3 border-r bg-gray-50 font-medium text-sm text-gray-600 flex items-start">
                    {formatHour(hour)}
                  </div>

                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className="border-r relative"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    >
                      {/* Empty slot for background */}
                    </div>
                  ))}
                </div>
              ))}

              {/* Floating Items */}
              {weekDays.map((day, dayIndex) => {
                const dayItems = getItemsForDay(day);
                return dayItems.map((item, itemIndex) => {
                  const layer = item.calculatedLayer || 0;
                  const totalColumns = Math.max(item.totalColumns || 1, 1);

                  // Better layering calculation with more generous width
                  const baseWidth = 100 / 8; // Base column width (12.5%)
                  const itemWidth = Math.max(
                    (baseWidth * 0.85) / totalColumns,
                    baseWidth * 0.15,
                  ); // Min 1.875% width
                  const leftOffset =
                    baseWidth * (dayIndex + 1) + layer * itemWidth * 0.9; // Slight overlap

                  const isBeingDragged =
                    draggedItem && draggedItem.id === item.id && isDragging;
                  const isEvent = item.itemType === "event";

                  return (
                    <div
                      key={`${dayIndex}-${itemIndex}`}
                      className={`absolute text-xs p-2 rounded border transition-all select-none ${item.color} shadow-sm ${
                        isEvent
                          ? "cursor-grab hover:shadow-md"
                          : "cursor-pointer hover:opacity-80"
                      } ${isBeingDragged ? "opacity-50 cursor-grabbing z-50" : ""}`}
                      style={{
                        top: `${item.position.top}px`,
                        height: `${Math.max(item.position.height, 40)}px`,
                        left: `${leftOffset}%`,
                        width: `${itemWidth}%`,
                        zIndex: isBeingDragged ? 1000 : 20 + layer,
                        minHeight: "40px",
                      }}
                      onMouseDown={
                        isEvent ? (e) => handleMouseDown(e, item) : undefined
                      }
                      onClick={
                        !isEvent ? (e) => handleItemClick(item, e) : undefined
                      }
                    >
                      {/* Resize handle top - only visible for events */}
                      {isEvent && (
                        <div className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize opacity-0 hover:opacity-100 bg-gray-400 rounded-t transition-opacity" />
                      )}

                      <div className="flex items-center gap-1 mb-1">
                        {item.itemType === "event" ? (
                          <Clock className="h-3 w-3 flex-shrink-0" />
                        ) : (
                          <User className="h-3 w-3 flex-shrink-0" />
                        )}
                        <span className="font-medium truncate">
                          {item.title}
                        </span>
                        {item.isRecurring && (
                          <Repeat className="h-2 w-2 ml-auto flex-shrink-0" />
                        )}
                      </div>
                      {totalColumns <= 3 && (
                        <>
                          <div className="flex items-center gap-1 text-xs opacity-75 mb-1">
                            <MapPin className="h-2 w-2 flex-shrink-0" />
                            <span className="truncate">{item.facility}</span>
                          </div>
                          <div className="text-xs opacity-75 mb-1">
                            {item.startTime} - {item.endTime}
                          </div>
                          {mode === "rota" && item.assignedStaff && (
                            <div className="text-xs opacity-75">
                              Staff: {item.assignedStaff.join(", ")}
                            </div>
                          )}
                        </>
                      )}

                      {/* Resize handle bottom - only visible for events */}
                      {isEvent && (
                        <div className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize opacity-0 hover:opacity-100 bg-gray-400 rounded-b transition-opacity" />
                      )}
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Events (Draggable)</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Shifts</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span>Recurring</span>
            </div>
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Click top/bottom edge to resize, middle to move</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;

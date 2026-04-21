import { Typography } from "@/components/ui/Typography";
import { IconSymbol } from "@/components/ui/icon-symbol";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { BlurModal } from "../ui/BlurModal";

export type DatePreset = "week" | "month" | "thisMonth";

export interface DateRange {
  startDate: Dayjs;
  endDate: Dayjs;
  preset: DatePreset | "custom";
}

interface DateRangeModalProps {
  visible: boolean;
  dateRange: DateRange;
  onApply: (range: DateRange) => void;
  onClose: () => void;
}

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "week", label: "Last 7 Days" },
  { key: "month", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
];

function getPresetRange(preset: DatePreset): DateRange {
  const today = dayjs();
  switch (preset) {
    case "week":
      return { startDate: today.subtract(6, "day"), endDate: today, preset };
    case "month":
      return { startDate: today.subtract(29, "day"), endDate: today, preset };
    case "thisMonth":
      return { startDate: today.startOf("month"), endDate: today, preset };
  }
}

function getDaysInMonth(year: number, month: number): Dayjs[] {
  const first = dayjs().year(year).month(month).startOf("month");
  const daysInMonth = first.daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => first.date(i + 1));
}

function getLeadingBlanks(year: number, month: number): number {
  // 0=Sun, need 0-indexed
  return dayjs().year(year).month(month).startOf("month").day();
}

export function DateRangeModal({
  visible,
  dateRange,
  onApply,
  onClose,
}: DateRangeModalProps) {
  const [draft, setDraft] = useState<DateRange>(dateRange);
  const [calendarMonth, setCalendarMonth] = useState<{
    year: number;
    month: number;
  }>({
    year: dateRange.startDate.year(),
    month: dateRange.startDate.month(),
  });
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const days = getDaysInMonth(calendarMonth.year, calendarMonth.month);
  const leadingBlanks = getLeadingBlanks(
    calendarMonth.year,
    calendarMonth.month,
  );

  const monthLabel = dayjs()
    .year(calendarMonth.year)
    .month(calendarMonth.month)
    .format("MMMM YYYY");

  const prevMonth = () => {
    setCalendarMonth((c) => {
      const d = dayjs().year(c.year).month(c.month).subtract(1, "month");
      return { year: d.year(), month: d.month() };
    });
  };

  const today = dayjs();

  const nextMonth = () => {
    setCalendarMonth((c) => {
      const current = dayjs().year(c.year).month(c.month);
      // Don't navigate past the current month
      if (
        current.year() === today.year() &&
        current.month() === today.month()
      ) {
        return c;
      }
      const d = current.add(1, "month");
      return { year: d.year(), month: d.month() };
    });
  };

  const handleDayPress = (day: Dayjs) => {
    // Ignore taps on future dates
    if (day.isAfter(today, "day")) return;

    if (selecting === "start") {
      setDraft({ startDate: day, endDate: day, preset: "custom" });
      setSelecting("end");
    } else {
      if (day.isBefore(draft.startDate, "day")) {
        setDraft({
          startDate: day,
          endDate: draft.startDate,
          preset: "custom",
        });
      } else {
        setDraft((d) => ({ ...d, endDate: day, preset: "custom" }));
      }
      setSelecting("start");
    }
  };

  const handlePreset = (preset: DatePreset) => {
    const range = getPresetRange(preset);
    setDraft(range);
    setCalendarMonth({
      year: range.startDate.year(),
      month: range.startDate.month(),
    });
    setSelecting("start");
  };

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  const handleClose = () => {
    setDraft(dateRange);
    onClose();
  };

  const isInRange = (day: Dayjs) =>
    (day.isAfter(draft.startDate, "day") ||
      day.isSame(draft.startDate, "day")) &&
    (day.isBefore(draft.endDate, "day") || day.isSame(draft.endDate, "day"));

  const isStart = (day: Dayjs) => day.isSame(draft.startDate, "day");
  const isEnd = (day: Dayjs) => day.isSame(draft.endDate, "day");

  return (
    <BlurModal
      visible={visible}
      onDismiss={handleClose}
      showCloseButton={false}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(59,47,47,0.3)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 16,
            }}
          >
            <Typography
              variation="h4"
              style={{ fontSize: 17, color: "#3B2F2F" }}
            >
              Select Date Range
            </Typography>
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.7}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#F5F0EF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol name="xmark" size={16} color="#3B2F2F" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 0 }}
          >
            {/* Date Range Indicators */}
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                paddingHorizontal: 20,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => setSelecting("start")}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <Typography
                  variation="caption"
                  style={{
                    fontSize: 10,
                    color: "rgba(59,47,47,0.4)",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  Start Date
                </Typography>
                <View
                  style={{
                    backgroundColor: "#F5F0EF",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 1.5,
                    borderColor:
                      selecting === "start" ? "#3B2F2F" : "transparent",
                  }}
                >
                  <IconSymbol
                    name="calendar"
                    size={16}
                    color="rgba(59,47,47,0.6)"
                  />
                  <Typography
                    variation="body-sm"
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#3B2F2F",
                    }}
                  >
                    {draft.startDate.format("MMM D, YYYY")}
                  </Typography>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSelecting("end")}
                activeOpacity={0.8}
                style={{ flex: 1 }}
              >
                <Typography
                  variation="caption"
                  style={{
                    fontSize: 10,
                    color: "rgba(59,47,47,0.4)",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  End Date
                </Typography>
                <View
                  style={{
                    backgroundColor: "#F5F0EF",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    borderWidth: 1.5,
                    borderColor:
                      selecting === "end" ? "#3B2F2F" : "transparent",
                  }}
                >
                  <IconSymbol name="calendar" size={16} color="#3B2F2F" />
                  <Typography
                    variation="body-sm"
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#3B2F2F",
                    }}
                  >
                    {draft.endDate.format("MMM D, YYYY")}
                  </Typography>
                </View>
              </TouchableOpacity>
            </View>

            {/* Preset Pills */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              {PRESETS.map((p) => {
                const active = draft.preset === p.key;
                return (
                  <TouchableOpacity
                    key={p.key}
                    onPress={() => handlePreset(p.key)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 999,
                      backgroundColor: active
                        ? "#3B2F2F"
                        : "rgba(59,47,47,0.08)",
                    }}
                  >
                    <Typography
                      variation="label"
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: active ? "#FFFFFF" : "#3B2F2F",
                      }}
                    >
                      {p.label}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Calendar */}
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              {/* Month nav */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Typography
                  variation="h5"
                  style={{ fontSize: 15, color: "#3B2F2F" }}
                >
                  {monthLabel}
                </Typography>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  <TouchableOpacity onPress={prevMonth} activeOpacity={0.7}>
                    <IconSymbol
                      name="chevron.left"
                      size={18}
                      color="rgba(59,47,47,0.4)"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={nextMonth}
                    activeOpacity={0.7}
                    disabled={
                      calendarMonth.year === today.year() &&
                      calendarMonth.month === today.month()
                    }
                    style={{
                      opacity:
                        calendarMonth.year === today.year() &&
                        calendarMonth.month === today.month()
                          ? 0.2
                          : 1,
                    }}
                  >
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color="rgba(59,47,47,0.4)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day of week headers */}
              <View style={{ flexDirection: "row", marginBottom: 4 }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <View
                    key={i}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      paddingVertical: 6,
                    }}
                  >
                    <Typography
                      variation="caption"
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "rgba(59,47,47,0.35)",
                      }}
                    >
                      {d}
                    </Typography>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {/* Leading blanks */}
                {Array.from({ length: leadingBlanks }, (_, i) => (
                  <View
                    key={`blank-${i}`}
                    style={{ width: `${100 / 7}%`, height: 40 }}
                  />
                ))}

                {days.map((day) => {
                  const isFuture = day.isAfter(today, "day");
                  const start = isStart(day);
                  const end = isEnd(day);
                  const inRange = isInRange(day);
                  const isDayToday = day.isSame(today, "day");
                  const singleDay = draft.startDate.isSame(
                    draft.endDate,
                    "day",
                  );

                  return (
                    <TouchableOpacity
                      key={day.date()}
                      onPress={() => handleDayPress(day)}
                      activeOpacity={isFuture ? 1 : 0.7}
                      disabled={isFuture}
                      style={{
                        width: `${100 / 7}%`,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        opacity: isFuture ? 0.25 : 1,
                      }}
                    >
                      {/* Range background strip */}
                      {inRange && !singleDay && (
                        <View
                          style={{
                            position: "absolute",
                            top: 4,
                            bottom: 4,
                            left: start ? "50%" : 0,
                            right: end ? "50%" : 0,
                            backgroundColor: "rgba(59,47,47,0.08)",
                          }}
                        />
                      )}
                      {/* Circle for start/end */}
                      {(start || end) && (
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: "#3B2F2F",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variation="body-sm"
                            style={{
                              fontSize: 13,
                              fontWeight: "700",
                              color: "#FFFFFF",
                            }}
                          >
                            {day.date()}
                          </Typography>
                        </View>
                      )}
                      {/* Today ring (not start/end) */}
                      {!start && !end && isDayToday && (
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            borderWidth: 1.5,
                            borderColor: "rgba(59,47,47,0.3)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variation="body-sm"
                            style={{
                              fontSize: 13,
                              fontWeight: "600",
                              color: "#3B2F2F",
                            }}
                          >
                            {day.date()}
                          </Typography>
                        </View>
                      )}
                      {/* Normal day */}
                      {!start && !end && !isDayToday && (
                        <Typography
                          variation="body-sm"
                          style={{
                            fontSize: 13,
                            fontWeight: inRange ? "600" : "400",
                            color: inRange ? "#3B2F2F" : "rgba(59,47,47,0.7)",
                          }}
                        >
                          {day.date()}
                        </Typography>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingHorizontal: 20,
              paddingVertical: 16,
              backgroundColor: "#F5F0EF",
              borderTopWidth: 1,
              borderTopColor: "rgba(59,47,47,0.06)",
            }}
          >
            <TouchableOpacity
              onPress={handleClose}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(59,47,47,0.2)",
              }}
            >
              <Typography
                variation="label"
                style={{ fontSize: 14, fontWeight: "700", color: "#3B2F2F" }}
              >
                Cancel
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#3B2F2F",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#3B2F2F",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Typography
                variation="label"
                style={{ fontSize: 14, fontWeight: "700", color: "#FFFFFF" }}
              >
                Apply Range
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BlurModal>
  );
}

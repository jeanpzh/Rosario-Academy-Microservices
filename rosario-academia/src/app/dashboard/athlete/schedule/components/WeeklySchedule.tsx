"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleItem {
  weekday: string;
  start_time: string;
  end_time: string;
  schedule_name: string;
}

interface WeeklyScheduleProps {
  scheduleItems: ScheduleItem[];
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({ scheduleItems }) => {
  const [interval, setInterval] = useState<"30m" | "1h">("1h");

  const weekdays = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const generateTimeSlots = (intervl: "30m" | "1h") => {
    const slots = [];
    const start = 14 * 60;
    const end = 22 * 60;
    const step = intervl === "30m" ? 30 : 60;

    for (let i = start; i <= end; i += step) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      slots.push(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(interval);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const isWithinTimeSlot = (slotTime: string, itemStart: string, itemEnd: string) => {
    const slotMinutes = timeToMinutes(slotTime);
    const itemStartMinutes = timeToMinutes(itemStart);
    const itemEndMinutes = timeToMinutes(itemEnd);
    const slotEndMinutes = slotMinutes + (interval === "30m" ? 30 : 60);

    return itemStartMinutes < slotEndMinutes && itemEndMinutes > slotMinutes;
  };

  const getItemStyle = (slotTime: string, item: ScheduleItem) => {
    const slotMinutes = timeToMinutes(slotTime);
    const itemStartMinutes = timeToMinutes(item.start_time);
    const itemEndMinutes = timeToMinutes(item.end_time);
    const slotEndMinutes = slotMinutes + (interval === "30m" ? 30 : 60);

    const startOffset = Math.max(0, itemStartMinutes - slotMinutes);
    const endOffset = Math.min(slotEndMinutes, itemEndMinutes) - slotMinutes;
    const duration = endOffset - startOffset;

    return {
      top: `${(startOffset / (interval === "30m" ? 30 : 60)) * 100}%`,
      height: `${(duration / (interval === "30m" ? 30 : 60)) * 100}%`,
    };
  };

  return (
    <div className="flex h-screen flex-col p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Horario Semanal</h2>
        <Select value={interval} onValueChange={(value: "30m" | "1h") => setInterval(value)}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Intervalo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30m">30 min</SelectItem>
            <SelectItem value="1h">1 hora</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grow overflow-auto bg-gray-100 dark:bg-[#181818] ">
        <div className="grid h-full min-w-[800px] grid-cols-8 gap-px bg-gray-100 dark:bg-[#181818]">
          <div className="sticky top-0 z-10 bg-gray-100 p-2 font-semibold dark:bg-gray-800"></div>
          {weekdays.map((day) => (
            <div
              key={day}
              className="sticky top-0 z-10 bg-gray-100 p-2 text-center font-semibold dark:bg-gray-800"
            >
              {day}
            </div>
          ))}
          {timeSlots.map((time) => (
            <React.Fragment key={time}>
              <div className="sticky left-0 bg-white p-2 pr-4 text-right text-sm dark:bg-gray-900">
                {time}
              </div>
              {weekdays.map((day) => {
                const dayScheduleItems = scheduleItems.filter(
                  (item) =>
                    item.weekday === day && isWithinTimeSlot(time, item.start_time, item.end_time),
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className="relative dark:bg-[#181818]"
                    style={{ height: interval === "30m" ? "40px" : "80px" }}
                  >
                    {dayScheduleItems.map((item, index) => (
                      <div
                        key={index}
                        className="absolute inset-x-0 mx-1 overflow-hidden rounded bg-blue-200 p-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                        style={getItemStyle(time, item)}
                      >
                        <div className="truncate font-semibold">{item.schedule_name}</div>
                        <div className="truncate">{`${item.start_time} - ${item.end_time}`}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklySchedule;

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/components/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarDropdownProps {
  date?: Date;
  showCalendar?: boolean;
  onShow?: (show: boolean) => void;
  onSelect: (date: Date | undefined) => void;
}

export function CalendarDropdown({ date, showCalendar = false, onShow, onSelect }: CalendarDropdownProps) {
  return (
    <Popover open={showCalendar} onOpenChange={onShow}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <CalendarIcon className="w-4 h-4 text-white/90" />
          <span className="text-white/90 text-sm">
            {date ? format(date, "MMM d") : ""}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/90 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onSelect(date);
          }}
          initialFocus
          className="bg-black border-gray-800"
        />
      </PopoverContent>
    </Popover>
  );
}
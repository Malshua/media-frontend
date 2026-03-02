import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SelectDateTypes {
  selectedDate?: Date;
  onChange?: (date: Date | undefined) => void;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

function SelectDate({
  selectedDate,
  onChange,
  dateFormat = "PPP",
  minDate,
  maxDate,
  error,
  placeholder = "MM/DD/YYYY",
  disabled,
}: SelectDateTypes) {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-[48px] justify-between rounded-sm text-left font-normal py-2",
              !selectedDate && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedDate ? (
              format(selectedDate, dateFormat)
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onChange}
            fromDate={minDate}
            toDate={maxDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <div className="ml-1 mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
export default SelectDate;

import React from "react";
import { MultiplicationSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseDate } from "chrono-node";
import { format } from "date-fns";

import { Calendar } from "./ui/calendar";
import { Field, FieldLabel } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  value: Date | null | undefined;
  onValueChange: (date: Date | null | undefined) => void;
  label?: string;
  placeholder?: string;
  trigger:
    | React.ReactElement
    | ((value: Date | null | undefined) => React.ReactElement);
}

export function DatePicker({
  value,
  onValueChange,
  label = "Schedule Date",
  placeholder = "Try: May 2027, 05/20/2027, or next week",
  trigger,
}: DatePickerProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [previewDate, setPreviewDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const triggerElement =
    typeof trigger === "function" ? trigger(value) : trigger;

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "P"));
    } else {
      setInputValue("");
    }
  }, [value]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal="trap-focus">
      <PopoverTrigger
        data-empty={!value}
        className="data-[empty=true]:not-data-popup-open:not-hover:text-muted-foreground inline-flex"
        render={<span>{triggerElement}</span>}
      />
      <PopoverContent align="start" flush className="w-auto">
        <div className="border-border border-b p-4">
          <Field className="mx-auto max-w-xs">
            <FieldLabel
              htmlFor="date-input"
              className="text-micro-plus text-muted-foreground leading-none font-normal"
            >
              {label}
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                ref={inputRef}
                id="date-input"
                value={inputValue}
                autoComplete="off"
                className="text-xs! placeholder:text-xs"
                placeholder={placeholder}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const date = parseDate(e.target.value);
                  setPreviewDate(date ?? undefined);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && previewDate) {
                    e.preventDefault();
                    onValueChange(previewDate);
                    setInputValue("");
                    setPreviewDate(undefined);
                    setOpen(false);
                  }
                }}
              />
              {inputValue && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Clear"
                    title="Clear"
                    variant="secondary"
                    className="rounded-full"
                    size="icon-xs"
                    onClick={() => {
                      onValueChange(undefined);
                      setInputValue("");
                      setPreviewDate(undefined);
                    }}
                  >
                    <HugeiconsIcon
                      icon={MultiplicationSignCircleIcon}
                      strokeWidth={2}
                    />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          </Field>
        </div>
        <div className="p-4">
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(date) => {
              onValueChange(date);
              setOpen(false);
              setPreviewDate(undefined);
              setInputValue("");
            }}
            modifiers={{
              highlighted: previewDate ? [previewDate] : [],
            }}
            month={previewDate ?? value ?? undefined}
            showOutsideDays
            className="p-0"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

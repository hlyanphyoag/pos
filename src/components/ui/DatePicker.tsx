"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "./calendar"
import {
  endOfWeek,
  format,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  startOfDay,
  getMonth,
  getYear
} from "date-fns"
import { useNavigate } from "@tanstack/react-router"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  })
}

function formatDateRange(from: Date | undefined, to: Date | undefined) {
  if (!from) return ""
  if (!to || from.getTime() === to.getTime()) return formatDate(from)

  // Validate dates
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return ""

  const fromStr = format(from, "MMM dd")
  const toStr = format(to, "MMM dd, yyyy")
  return `${fromStr} - ${toStr}`
}

function getWeekRangeInMonth(year: number, month: number, weekNumber: number) {
  const monthStart = new Date(year, month, 1)
  const monthEnd = endOfMonth(monthStart)

  const startDay = (weekNumber - 1) * 7 + 1
  const weekStart = addDays(monthStart, startDay - 1)
  const weekEnd = addDays(weekStart, 6)

  return {
    from: weekStart > monthEnd ? monthStart : weekStart,
    to: weekEnd > monthEnd ? monthEnd : weekEnd
  }
}

function getWeeksInMonth(year: number, month: number) {
  const lastDay = endOfMonth(new Date(year, month, 1)).getDate()
  return Math.ceil(lastDay / 7)
}

export function Calendar28({ filterBy }: { filterBy: string }) {
  const [open, setOpen] = React.useState(false)
  const currentDate = new Date()

  const navigate = useNavigate()

  // Initialize state based on filterBy
  const getInitialDateRange = React.useCallback(() => {
    const today = new Date()
    if (filterBy === "Week") {
      const year = getYear(today)
      const month = getMonth(today)
      return getWeekRangeInMonth(year, month, 1)
    } else if (filterBy === "Month") {
      return { from: startOfMonth(today), to: endOfMonth(today) }
    } else {
      // Default to "Date" mode
      return { from: startOfDay(today), to: startOfDay(today) }
    }
  }, [filterBy])

  const [dateRange, setDateRange] = React.useState<any>(getInitialDateRange())
  const [currentDisplayMonth, setCurrentDisplayMonth] = React.useState(currentDate)
  const [selectedWeek, setSelectedWeek] = React.useState<string>("1")
  const [selectedMonth, setSelectedMonth] = React.useState<string>(String(getMonth(currentDate)))
  const [selectedYear, setSelectedYear] = React.useState<string>(String(getYear(currentDate)))

  console.log(dateRange)

  // Update URL when dateRange changes
  React.useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          startDate: format(dateRange.from, 'yyyy-MM-dd'),
          // format(new Date(addDays(serviceType?.date, 1)), 'yyyy-MM-dd')
          endDate: format(addDays(dateRange.to, 1),'yyyy-MM-dd')
        })
      })
    }
  }, [dateRange, navigate])

  // Reset date range when filterBy changes
  React.useEffect(() => {
    const newRange = getInitialDateRange()
    setDateRange(newRange)
    setCurrentDisplayMonth(newRange.from || new Date())
    setSelectedMonth(String(getMonth(newRange.from || new Date())))
    setSelectedYear(String(getYear(newRange.from || new Date())))
    setSelectedWeek("1")
  }, [filterBy, getInitialDateRange])

  // Generate years (current year ± 10 years)
  const years = React.useMemo(() => {
    const currentYear = getYear(new Date())
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
  }, [])

  // Get weeks for selected month/year
  const weeksCount = React.useMemo(() => {
    return getWeeksInMonth(parseInt(selectedYear), parseInt(selectedMonth))
  }, [selectedYear, selectedMonth])

  // Handle week change
  const handleWeekChange = (weekStr: string) => {
    setSelectedWeek(weekStr)
    const range = getWeekRangeInMonth(
      parseInt(selectedYear),
      parseInt(selectedMonth),
      parseInt(weekStr)
    )
    setDateRange(range)
  }

  // Handle month change
  const handleMonthChange = (monthStr: string) => {
    setSelectedMonth(monthStr)
    const displayDate = new Date(parseInt(selectedYear), parseInt(monthStr))
    setCurrentDisplayMonth(displayDate)

    if (filterBy === "Month") {
      setDateRange({
        from: startOfMonth(displayDate),
        to: endOfMonth(displayDate)
      })
    } else if (filterBy === "Week") {
      const newWeeksCount = getWeeksInMonth(parseInt(selectedYear), parseInt(monthStr))
      const currentWeek = parseInt(selectedWeek)

      if (currentWeek > newWeeksCount) {
        setSelectedWeek("1")
        const range = getWeekRangeInMonth(parseInt(selectedYear), parseInt(monthStr), 1)
        setDateRange(range)
      } else {
        const range = getWeekRangeInMonth(parseInt(selectedYear), parseInt(monthStr), currentWeek)
        setDateRange(range)
      }
    }
  }

  // Handle year change
  const handleYearChange = (yearStr: string) => {
    setSelectedYear(yearStr)
    const displayDate = new Date(parseInt(yearStr), parseInt(selectedMonth))
    setCurrentDisplayMonth(displayDate)

    if (filterBy === "Month") {
      setDateRange({
        from: startOfMonth(displayDate),
        to: endOfMonth(displayDate)
      })
    } else if (filterBy === "Week") {
      const range = getWeekRangeInMonth(parseInt(yearStr), parseInt(selectedMonth), parseInt(selectedWeek))
      setDateRange(range)
    }
  }

  // Handle calendar date selection
  const handleDateSelect = (selected: any) => {
    if (filterBy === "Date") {
      // For "Date" mode, selected is a single Date object
      if (selected) {
        setDateRange({ from: selected, to: selected })
        
        // Update the month/year selectors to match selected date
        setSelectedMonth(String(getMonth(selected)))
        setSelectedYear(String(getYear(selected)))
        setCurrentDisplayMonth(selected)
      }
    } else if (filterBy === "Week" || filterBy === "Month") {
      // For Week and Month modes, don't allow manual date selection
      // Users should only use the dropdowns
      return
    }
  }

  // Format display value
  const displayValue = React.useMemo(() => {
    if (!dateRange?.from) return ""

    if (filterBy === "Date") {
      const isToday = dateRange.from.toDateString() === new Date().toDateString()
      return isToday ? "Today" : formatDate(dateRange.from)
    } else {
      return formatDateRange(dateRange.from, dateRange.to)
    }
  }, [dateRange, filterBy])

  // Dropdown components
  const WeekDropdown = () => (
    <Select value={selectedWeek} onValueChange={handleWeekChange}>
      <SelectTrigger className="h-8 text-sm border-input w-[90px]">
        <SelectValue placeholder="Week" />
      </SelectTrigger>
      <SelectContent side="bottom">
        {Array.from({ length: weeksCount }, (_, i) => i + 1).map((week) => (
          <SelectItem key={week} value={String(week)}>
            Week {week}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const MonthDropdown = () => (
    <Select value={selectedMonth} onValueChange={handleMonthChange}>
      <SelectTrigger className="h-8 text-sm border-input w-[70px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent side="bottom">
        {months.map((monthName, index) => (
          <SelectItem key={index} value={String(index)}>
            {monthName.slice(0, 3)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const YearDropdown = () => (
    <Select value={selectedYear} onValueChange={handleYearChange}>
      <SelectTrigger className="h-8 text-sm border-input w-[80px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent side="bottom">
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={displayValue}
          placeholder="Select date..."
          className="bg-background pr-10 rounded-xl font-medium text-sm text-gray-700"
          readOnly
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarDays className="size-3.5 text-blue-500" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            avoidCollisions={false}
            className="w-auto p-0"
            align="end"
            side="bottom"
            alignOffset={-4}
            sideOffset={10}
          >
            <Calendar
              components={{
                MonthsDropdown: () => <></>,
                Dropdown: () => (
                  <div className="flex gap-1.5 items-center justify-center px-3 py-2 min-w-[240px]">
                    {filterBy === "Week" && <WeekDropdown />}
                    <MonthDropdown />
                    <YearDropdown />
                  </div>
                )
              }}
              mode={filterBy === "Date" ? "single" : "range"}
              month={currentDisplayMonth}
              onMonthChange={setCurrentDisplayMonth}
              selected={filterBy === "Date" ? dateRange?.from : dateRange}
              onSelect={handleDateSelect}
              numberOfMonths={1}
              className="shadow-sm w-70"
              captionLayout="dropdown"
              // disabled={filterBy === "Week" || filterBy === "Month"}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
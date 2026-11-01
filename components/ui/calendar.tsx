'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'relative flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
        month: 'space-y-4 w-full',
        month_caption: 'flex justify-center pt-1 relative items-center h-8',
        caption_label: 'text-sm font-semibold tracking-wide',
        nav: 'flex items-center justify-between w-full absolute inset-x-0 top-3 px-1 pointer-events-none z-10',
        button_previous: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-background/90 hover:bg-accent p-0 opacity-80 hover:opacity-100 pointer-events-auto shadow-xs',
        ),
        button_next: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-background/90 hover:bg-accent p-0 opacity-80 hover:opacity-100 pointer-events-auto shadow-xs',
        ),
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex w-full justify-between',
        weekday:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center',
        week: 'flex w-full mt-2 justify-between',
        day: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md',
        ),
        range_end: 'day-range-end',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent/80 text-accent-foreground font-semibold',
        outside:
          'day-outside text-muted-foreground/40 aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ className: btnClassName, ...btnProps }) => (
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-background/90 hover:bg-accent p-0 opacity-80 hover:opacity-100 flex items-center justify-center pointer-events-auto shadow-xs',
              btnClassName
            )}
            {...btnProps}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        ),
        NextMonthButton: ({ className: btnClassName, ...btnProps }) => (
          <button
            type="button"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-background/90 hover:bg-accent p-0 opacity-80 hover:opacity-100 flex items-center justify-center pointer-events-auto shadow-xs',
              btnClassName
            )}
            {...btnProps}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        ),
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }

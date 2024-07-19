'use client'

import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import React from 'react'
import { DateRange, Range, RangeKeyDict } from 'react-date-range';


interface CalendarProps {
    value: Range;
    disabledDates?: Date[];
    onChange: (value: RangeKeyDict) => void;
    number?: number
}

const Calendar: React.FC<CalendarProps> = ({
    value,
    disabledDates,
    onChange,
    number
}) => {
  return (
    <DateRange
      ranges={[value || { startDate: new Date(), endDate: new Date(), key: 'selection' }]}
      rangeColors={['#262626']}
      months={number}
      date={new Date()}
      onChange={onChange}
      direction='horizontal'
      showDateDisplay={false}
      minDate={new Date()}
      disabledDates={disabledDates}
      
    />  
  )
}

export default Calendar
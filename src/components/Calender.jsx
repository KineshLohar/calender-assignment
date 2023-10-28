import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import jsondata from '../data/mockdata.json';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeZone, setTimeZone] = useState('UTC-0');
  const [timeSlots, setTimeSlots] = useState([]);
  const [currentDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [startHour, setStartHour] = useState(8);
  const [endHour, setEndHour] = useState(23);

  console.log(timeZone)

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeZoneChange = (e) => {
    const currentTimeZone = e.target.value;
    setTimeZone(currentTimeZone);
    if(currentTimeZone === "UTC+9:30"){
      setStartHour(10);
      setEndHour(21);
    }
    else if(currentTimeZone === "UTC-8"){
      setStartHour(3);
      setEndHour(17);
    }else if(currentTimeZone === "UTC+5:30"){
      setStartHour(8);
      setEndHour(23);
    }
  };

  const goToNextWeek = () => {
    setSelectedDate(moment(selectedDate).add(1, 'week').toDate());
  };

  const goToPreviousWeek = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'week').toDate());
  };

  // Define a function to generate time slots from 8:00 AM to 11:00 PM with 30-minute intervals.
  const generateTimeSlots = () => {

    const timeSlots = [];
    let currentTime = moment().set({ hour: startHour, minute: 0, second: 0 });
    const endTime = moment().set({ hour: endHour, minute: 0, second: 0 });

    while (currentTime.isSameOrBefore(endTime)) {
      timeSlots.push(currentTime.format('HH:mm'));
      currentTime.add(30, 'minutes');
    }

    return timeSlots;
  };

  useEffect(() => {
    const filteredTimeSlots = generateTimeSlots();
    setTimeSlots(filteredTimeSlots);
    setData(jsondata);
  }, [timeZone]);

  return (
    <div>
      <div>
        <div className='h-[4rem] w-[100%] p-4 bg-slate-100 flex items-center justify-start'>
          <button onClick={goToPreviousWeek}>Previous Week</button>
          <DatePicker selected={selectedDate} onChange={handleDateChange} dateFormat="yyyy-MMM-dd" className='mx-6 p-2' />
          <button onClick={goToNextWeek} className=''>Next Week</button>
        </div>
        <div className='p-2 '>
          <h3 className=' text-lg font-semibold'>Timezone :</h3>
          <select value={timeZone} onChange={handleTimeZoneChange} className='w-[100%] p-2 border-2 border-gray-600'>
            <option value="UTC+5:30">[UTC+5:30] India Standard Time</option>
            <option value="UTC+9:30">[UTC+9:30] Australia Standard Time</option>
            <option value="UTC-8">[UTC-8] Pacific Standard Time</option>
          </select>
        </div>
      </div>
      <div>
        <div className="border-2">
          <div className='flex flex-col items-start justify-start'>
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const currentDateForDay = moment(selectedDate).add(dayIndex, 'days');
              const isPast = currentDateForDay < currentDate;
              return (
                <div className='flex w-[100%]' key={dayIndex}>
                  <div className="p-4 w-36 flex flex-col items-center justify-center bg-slate-200">
                    <h2 className=' text-red-600 font-medium'>{moment(currentDateForDay).format('ddd')}</h2>
                    <p>{moment(currentDateForDay).format('MMM D')}</p>
                  </div>
                  <div className="p-4 flex items-center justify-start flex-wrap">
                    {isPast ? (
                      <label className="bg-gray-300 p-2 rounded-md">Past</label>
                    ) : currentDateForDay.format('d') >= 6 || currentDateForDay.format('d') < 1  ? (
                      <label className="bg-red-300 p-2 rounded-md">Weekend</label>
                    ) : (
                      timeSlots.map((time, index) => {
                        const timeSlotId = `time-slot-${index}-${dayIndex}`;
                        const currentDateForDayFormatted = moment(currentDateForDay).format('YYYY-MM-DD');
                        const isChecked = data.some((item) => {
                          const dateMatches = moment(item.Date).isSame(currentDateForDayFormatted, 'day');
                          const timeMatches = item.Time === time;
                          return dateMatches && timeMatches;
                        });

                        return (
                          <div key={index} className='m-2'>
                            <div>
                              <input type="checkbox" id={timeSlotId} defaultChecked={isChecked} className='mx-2'/>
                              <label htmlFor={timeSlotId}>{time}</label>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

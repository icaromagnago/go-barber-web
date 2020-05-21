import React, { useState, useMemo, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTransition, useSpring, config, animated } from 'react-spring';
import {
  format,
  subDays,
  addDays,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
  isBefore,
  isEqual,
  parseISO,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import api from '~/services/api';

import { Container, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());
  const [forward, setForward] = useState(true);

  // const transition = useTransition(date, (d) => d, {
  //   config: config.slow,
  //   from: { opacity: 0, transform: 'translateX(-100%)' },
  //   enter: { opacity: 1, transform: 'translateX(0)' },
  //   leave: { display: 'none' },
  // });

  const dateFormatted = useMemo(
    () => format(date, "d 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      const response = await api.get('schedule', {
        params: { date },
      });

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = range.map((hour) => {
        const checkDate = setMilliseconds(
          setSeconds(setMinutes(setHours(date, hour), 0), 0),
          0
        );
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00h`,
          past: isBefore(compareDate, new Date()),
          appointment: response.data.find((a) =>
            isEqual(parseISO(a.date), compareDate)
          ),
        };
      });

      setSchedule(data);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
    setForward(false);
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
    setForward(true);
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#FFF" />
        </button>
        <strong>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#FFF" />
        </button>
      </header>
      <TransitionGroup>
        <CSSTransition
          key={dateFormatted}
          in
          appear
          timeout={500}
          classNames={forward ? 'slide-left' : 'slide-right'}
        >
          <ul>
            {schedule.map((time) => (
              <Time
                key={time.time}
                past={time.past}
                available={!time.appointment}
              >
                <strong>{time.time}</strong>
                <span>
                  {time.appointment ? time.appointment.user.name : 'Em aberto'}
                </span>
              </Time>
            ))}
          </ul>
        </CSSTransition>
      </TransitionGroup>

      {/* {transition.map(
        ({ item, key, props }) =>
          item && (
            <animated.ul key={key} style={props}>
              {schedule.map((time) => (
                <Time
                  key={time.time}
                  past={time.past}
                  available={!time.appointment}
                >
                  <strong>{time.time}</strong>
                  <span>
                    {time.appointment
                      ? time.appointment.user.name
                      : 'Em aberto'}
                  </span>
                </Time>
              ))}
            </animated.ul>
          )
      )} */}
    </Container>
  );
}

import dayjs from 'dayjs';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

const commonOption = {
  staleTime: 0, // 立即過期
  cacheTime: 1000 * 60 * 5, // 5分鐘
};

export function useAppointments(): UseAppointments {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  const [showAll, setShowAll] = useState(false);

  const { user } = useUser();

  const selectFn = useCallback(
    (data) => {
      return getAvailableAppointments(data, user);
    },
    [user],
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);

    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      commonOption,
    );
  }, [queryClient, monthYear]);

  const fallback = {};

  const { data: appointments = fallback } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      ...commonOption,
      select: showAll ? undefined : selectFn,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  );

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}

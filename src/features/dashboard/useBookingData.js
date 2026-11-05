import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import {
  getBookingsAfterDate,
  getStaysAfterDate,
  getStaysTodayActivity,
} from "../../services/apiBookings";

export function useBookingData() {
  const [searchParams] = useSearchParams();
  const numOfDays = !searchParams.get("last")
    ? 7
    : Number(searchParams.get("last"));
  const queryDate = subDays(new Date(), numOfDays).toISOString();

  // Get bookings data
  const { isLoading: isLoadingBookings, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["bookings", `last-${numOfDays}`],
  });

  //Get recent stays data
  const { isLoading: isLoadingStays, data: stays } = useQuery({
    queryFn: () => getStaysAfterDate(queryDate),
    queryKey: ["stays", `last-${numOfDays}`],
  });
  const confirmedStays = stays?.filter(
    (stay) => stay.status === "checked-n" || "checked-out",
  );

  // Get the day's activity
  const { data: todaysActivity, isLoading: isLoadingDaysActivity } = useQuery({
    queryFn: getStaysTodayActivity,
    queryKey: ["todays-activity"],
  });

  return {
    numOfDays,
    isLoadingBookings,
    isLoadingStays,
    isLoadingDaysActivity,
    bookings,
    confirmedStays,
    todaysActivity,
  };
}

import styled from "styled-components";
import { useBookingData } from "./useBookingData";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";
import { useCabinHooks } from "../cabins/useCabinHook";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  const {
    isLoadingBookings,
    isLoadingStays,
    confirmedStays,
    bookings,
    numOfDays,
  } = useBookingData();
  const { cabins, isLoading } = useCabinHooks();
  const cabinCount = cabins?.length;

  if (isLoading || isLoadingBookings || isLoadingStays) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        cabinCount={cabinCount}
        numDays={numOfDays}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numOfDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;

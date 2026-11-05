import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBooking,
  getBookings,
  deleteBooking as deleteBookingAPI,
} from "../../services/apiBookings";
import { useParams, useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import toast from "react-hot-toast";

export function useBookingHook() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // FILTER
  const filteredValue = searchParams.get("status");
  const filter =
    !filteredValue || filteredValue === "all"
      ? null
      : { field: "status", value: filteredValue };

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split("-");
  const sortBy = { field, direction };

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  // QUERY: Get ALL bookings
  const {
    isLoading: isLoadingAll,
    data: { bookings, count } = {}, //set the default value to empmty to avoid the undefinded error
    error: bookingsError,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE FETCHING
  const pageCount = Math.ceil(page / PAGE_SIZE);
  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  // QUERY: Get Booking
  const { bookingId } = useParams();
  const {
    isLoading: isLoadingOne,
    data: bookingDetails,
    error: bookingError,
  } = useQuery({
    queryKey: ["bookings", bookingId],
    queryFn: () => getBooking(bookingId),
    retry: false,
  });

  // Deletes a Booking
  const { isLoading: isDeleteing, mutate: deleteBooking } = useMutation({
    mutationFn: (id) => deleteBookingAPI(id),
    onSuccess: () => {
      toast.success(`Booking has been successfully deleted`);
      queryClient.invalidateQueries({
        active: true,
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    isLoadingAll,
    isLoadingOne,
    isDeleteing,
    bookings,
    bookingDetails,
    deleteBooking,
    count,
    bookingError,
    bookingsError,
  };
}

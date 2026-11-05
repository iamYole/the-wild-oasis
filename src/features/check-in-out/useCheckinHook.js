import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useCheckinHook() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check in
  const { mutate: checkIn, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        hasPaid: true,
        ...breakfast,
      }),
    onSuccess: (data) => {
      (toast.success(`Booking #${data.id} sucessfully checked in`),
        queryClient.invalidateQueries({ active: true }));
      navigate("/bookings");
    },
    onError: () => {
      toast.error("There was an error in checking in");
    },
  });

  // Check out
  const { mutate: checkOut, isLoading: isCheckingOut } = useMutation({
    mutationFn: (bookingId) =>
      updateBooking(bookingId, { status: "checked-out" }),
    onSuccess: (data) => {
      toast.success(`Bookiing #${data.id} sucessfully checked out`);
      queryClient.invalidateQueries({ active: true });
      navigate("/bookings");
    },
    onError: () => {
      toast.error("There was an error checking out user");
    },
  });

  return { checkIn, checkOut, isCheckingOut, isCheckingIn };
}

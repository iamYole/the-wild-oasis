import Button from "../../ui/Button";
import { useCheckinHook } from "./useCheckinHook";

function CheckoutButton({ bookingId }) {
  const { checkOut, isCheckingOut } = useCheckinHook();

  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkOut(bookingId)}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;

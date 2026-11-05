import { HiArrowRightOnRectangle } from "react-icons/hi2";
import Buttonicon from "../../ui/ButtonIcon";
import { useAuth } from "./useAuth";
import SpinnerMini from "../../ui/SpinnerMini";

function Logout() {
  const { logout, isLoggingOut } = useAuth();
  return (
    <Buttonicon onClick={logout} disabled={isLoggingOut}>
      {!isLoggingOut ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </Buttonicon>
  );
}

export default Logout;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUser,
  login as loginAPI,
  logout as logoutAPI,
  signUp as signUpAPI,
  updateCurrentUser,
} from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Sign up
  const { mutate: signUp, isLoading: isSigningUp } = useMutation({
    mutationFn: signUpAPI,
    onSuccess: () => {
      toast.success(
        "Account successfully created. Email has been sent to their registered email for activation ",
      );
    },
  });

  // Sign in fucntion
  const { mutate: login, isLoading: isLoggingIn } = useMutation({
    mutationFn: ({ email, password }) => loginAPI({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("Invalid username/password!");
    },
  });

  // Loading the authenticated User
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  // Logout
  const { mutate: logout, isLoading: isLoggingOut } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries();
      navigate("/login", { replace: true });
    },
  });

  // updateUser
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User updated successfully");
      queryClient.setQueryData(["user"], user);
      // queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("An error occured while uodating user");
    },
  });

  return {
    signUp,
    login,
    user,
    logout,
    updateUser,
    isAuthenticated: Boolean(user?.role === "authenticated"),
    isLoggingOut,
    isLoading,
    isLoggingIn,
    isSigningUp,
    isUpdating,
  };
}

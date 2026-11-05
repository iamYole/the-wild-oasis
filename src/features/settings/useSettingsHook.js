import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  updateSetting as updateSettingAPI,
} from "../../services/apiSettings";
import toast from "react-hot-toast";

export function useSettingsHook() {
  const queryClient = useQueryClient();
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingAPI,
    onSuccess: () => {
      toast.success("Setting  sucessfully deleted");
      queryClient.invalidateQueries({
        queryKey: ["settings"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  return { isLoading, isUpdating, error, settings, updateSetting };
}

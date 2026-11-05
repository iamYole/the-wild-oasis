import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCabin,
  editCabin,
  deleteCabin as deleteCabinAPI,
  getCabins,
} from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useCabinHooks() {
  const deleteQueryClient = useQueryClient();
  const createQueryClient = useQueryClient();
  const editQueryClient = useQueryClient();
  // const getAllQueryClient = useQueryClient();

  // Get the list of All Cabins
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: getCabins,
  });

  // Deletes a Cabin
  const { isLoading: isDeleteing, mutate: deleteCabin } = useMutation({
    mutationFn: (id) => deleteCabinAPI(id),
    onSuccess: () => {
      toast.success("Cabin sucessfully deleted");
      deleteQueryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  // Creates a new Cabin
  const { mutate: createCabin, isLoading: isCreating } = useMutation({
    mutationFn: addCabin,
    onSuccess: () => {
      toast.success("New Cabin has been successfully created");
      createQueryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  // Edits an exiting Cabin
  const { mutate: updateCabin, isLoading: isUpdating } = useMutation({
    mutationFn: ({ newCabinData, id }) => editCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin sucessfully deleted");
      editQueryClient.invalidateQueries({
        queryKey: ["cabins"],
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const isWorking = isCreating || isUpdating;

  return {
    isWorking,
    isLoading,
    isDeleteing,
    error,
    cabins,
    deleteCabin,
    createCabin,
    updateCabin,
  };
}

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BATCH_API } from "../../students/module.api";

export function useBatches() {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["batches"],
    queryFn: () => BATCH_API.getBatches(),
  });

  const batches = data?.data ?? [];

  const deleteBatch = async (id: string) => {
    setIsDeleting(true);
    try {
      await BATCH_API.deleteBatch(id);
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    batches,
    isLoading,
    isDeleting,
    deleteBatch,
    refetch,
  };
}

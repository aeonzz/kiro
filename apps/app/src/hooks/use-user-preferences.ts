import { setUserPreferencesFn } from "@/services/user/create";
import { SetUserPreferencesInput } from "@/services/user/schema";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

export function useUserPreferences() {
  const setUserPreferences = useServerFn(setUserPreferencesFn);

  const mutation = useMutation({
    mutationFn: (data: SetUserPreferencesInput) => setUserPreferences({ data }),
  });

  return mutation;
}

import { supabase } from "@/lib/supabase";

export const toggleAvailability = async (
  userId: string,
  current: boolean
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_available: !current,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};
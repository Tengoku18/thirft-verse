import { supabase } from "./supabase";

export const debugAuthStatus = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { session, user };
};

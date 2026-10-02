import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://glfaoyzekgkjieipmuce.supabase.co";

const supabasePublishableKey = "sb_publishable_2WGu7Qfn37RtQrml6HSk4A_dJVNT8JY";

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
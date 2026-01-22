import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = "https://qecszmxtmvafeqzqecaz.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlY3N6bXh0bXZhZmVxenFlY2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjE3NDcsImV4cCI6MjA4NDQzNzc0N30.B1FPVLTEYEstE3yQxOULPr6G8a324p4OS7FDqbvC9dM";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

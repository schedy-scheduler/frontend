import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type StoreHours = Database["public"]["Tables"]["store_hours"]["Row"];
type StoreHoursInsert = Database["public"]["Tables"]["store_hours"]["Insert"];
type StoreHoursUpdate = Database["public"]["Tables"]["store_hours"]["Update"];

export const storeHoursService = {
  async getAll(storeId: string) {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .select("*")
        .eq("store_id", storeId)
        .order("day_of_week", { ascending: true });

      if (error) {
        return { error: error.message };
      }

      return { data: data as StoreHours[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getByDay(storeId: string, dayOfWeek: number) {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .select("*")
        .eq("store_id", storeId)
        .eq("day_of_week", dayOfWeek)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as StoreHours };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async create(storeHours: StoreHoursInsert) {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .insert(storeHours)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as StoreHours };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async update(id: string, storeHours: StoreHoursUpdate) {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .update(storeHours)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as StoreHours };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from("store_hours")
        .delete()
        .eq("id", id);

      if (error) {
        return { error: error.message };
      }

      return { data: null };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async upsertDay(
    storeId: string,
    dayOfWeek: number,
    storeHours: Partial<StoreHoursInsert>,
  ) {
    try {
      const { data, error } = await supabase
        .from("store_hours")
        .upsert(
          {
            store_id: storeId,
            day_of_week: dayOfWeek,
            ...storeHours,
          },
          { onConflict: "store_id,day_of_week" },
        )
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as StoreHours };
    } catch (error) {
      return { error: String(error) };
    }
  },
};

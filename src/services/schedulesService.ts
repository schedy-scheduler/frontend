import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
type ScheduleInsert = Database["public"]["Tables"]["schedules"]["Insert"];
type ScheduleUpdate = Database["public"]["Tables"]["schedules"]["Update"];

export const schedulesService = {
  async getAll(storeId: string) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          customers(*),
          employees(*),
          services(*)
        `,
        )
        .eq("store_id", storeId)
        .order("scheduled_date", { ascending: false });

      if (error) {
        return { error: error.message };
      }

      // Ensure data is always an array
      const schedules = Array.isArray(data) ? data : data ? [data] : [];
      return { data: schedules as unknown[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getByDate(storeId: string, date: string) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          customers(*),
          employees(*),
          services(*)
        `,
        )
        .eq("store_id", storeId)
        .eq("scheduled_date", date)
        .order("scheduled_time", { ascending: true });

      if (error) {
        return { error: error.message };
      }

      return { data: (data || []) as unknown[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select(
          `
          *,
          customers(*),
          employees(*),
          services(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as unknown };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async create(schedule: ScheduleInsert) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .insert(schedule)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Schedule };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async update(id: string, schedule: ScheduleUpdate) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .update(schedule)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Schedule };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from("schedules").delete().eq("id", id);

      if (error) {
        return { error: error.message };
      }

      return { data: null };
    } catch (error) {
      return { error: String(error) };
    }
  },
};

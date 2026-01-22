import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export const servicesService = {
  async getAll(storeId: string) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

      if (error) {
        return { error: error.message };
      }

      return { data: data as Service[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Service };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async create(service: ServiceInsert) {
    try {
      const { data, error } = await supabase
        .from("services")
        .insert(service)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Service };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async update(id: string, service: ServiceUpdate) {
    try {
      const { data, error } = await supabase
        .from("services")
        .update(service)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Service };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) {
        return { error: error.message };
      }

      return { data: null };
    } catch (error) {
      return { error: String(error) };
    }
  },
};

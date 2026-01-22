import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Customer = Database["public"]["Tables"]["customers"]["Row"];
type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];

export const customersService = {
  async getAll(storeId: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

      if (error) {
        return { error: error.message };
      }

      return { data: data as Customer[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Customer };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async create(customer: CustomerInsert) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .insert(customer)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Customer };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async update(id: string, customer: CustomerUpdate) {
    try {
      const { data, error } = await supabase
        .from("customers")
        .update(customer)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Customer };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from("customers").delete().eq("id", id);

      if (error) {
        return { error: error.message };
      }

      return { data: null };
    } catch (error) {
      return { error: String(error) };
    }
  },
};

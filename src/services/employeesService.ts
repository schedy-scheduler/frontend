import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

type Employee = Database["public"]["Tables"]["employees"]["Row"];
type EmployeeInsert = Database["public"]["Tables"]["employees"]["Insert"];
type EmployeeUpdate = Database["public"]["Tables"]["employees"]["Update"];

export const employeesService = {
  async getAll(storeId: string) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("store_id", storeId)
        .order("created_at", { ascending: false });

      if (error) {
        return { error: error.message };
      }

      return { data: data as Employee[] };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Employee };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async create(employee: EmployeeInsert) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert(employee)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Employee };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async update(id: string, employee: EmployeeUpdate) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .update(employee)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error: error.message };
      }

      return { data: data as Employee };
    } catch (error) {
      return { error: String(error) };
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase.from("employees").delete().eq("id", id);

      if (error) {
        return { error: error.message };
      }

      return { data: null };
    } catch (error) {
      return { error: String(error) };
    }
  },
};

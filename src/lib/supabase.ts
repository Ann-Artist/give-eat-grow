import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  location: string | null;
  role: 'donor' | 'ngo' | 'volunteer' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  food_type: string;
  quantity: string;
  servings: number | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  expiry_hours: number;
  description: string | null;
  photo_url: string | null;
  status: 'available' | 'accepted' | 'completed' | 'cancelled';
  accepted_by: string | null;
  urgent: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export { supabase, type User, type Session };

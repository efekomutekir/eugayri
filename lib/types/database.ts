export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: "admin" | "editor";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "editor";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: "admin" | "editor";
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: number;
          site_name: string;
          logo_url: string | null;
          primary_color: string;
          background_color: string;
          header_background: string;
          footer_background: string;
          contact_phone: string | null;
          contact_email: string | null;
          contact_address: string | null;
          contact_whatsapp: string | null;
          hero_title: string | null;
          hero_subtitle: string | null;
          hero_cta_primary: string | null;
          hero_cta_secondary: string | null;
          cta_title: string | null;
          cta_button: string | null;
          neden_biz_title: string | null;
          neden_biz_1_title: string | null;
          neden_biz_1_text: string | null;
          neden_biz_2_title: string | null;
          neden_biz_2_text: string | null;
          neden_biz_3_title: string | null;
          neden_biz_3_text: string | null;
          stats_1_label: string | null;
          stats_2_label: string | null;
          stats_3_label: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          price: number;
          currency: string;
          property_type: "sale" | "rent";
          category_id: string | null;
          room_count: string | null;
          area_sqm: number | null;
          address: string | null;
          city: string | null;
          district: string | null;
          listing_number: string | null;
          heating_type: string | null;
          floor: number | null;
          total_floors: number | null;
          building_age: string | null;
          deed_status: string | null;
          bathroom_count: number | null;
          has_balcony: boolean;
          has_parking: boolean;
          has_storage: boolean;
          furnished: string | null;
          swap: boolean;
          front: string | null;
          video_url: string | null;
          contact_phone_override: string | null;
          contact_email_override: string | null;
          net_sqm: number | null;
          open_area_sqm: number | null;
          kitchen_type: string | null;
          usage_status: string | null;
          in_complex: boolean;
          complex_name: string | null;
          monthly_fee: number | null;
          loan_eligible: boolean;
          listed_by: string | null;
          is_featured: boolean;
          is_published: boolean;
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["properties"]["Row"]> & { title: string; price: number; property_type: "sale" | "rent" };
        Update: Partial<Database["public"]["Tables"]["properties"]["Row"]>;
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          property_id?: string;
          url?: string;
          sort_order?: number;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyImage = Database["public"]["Tables"]["property_images"]["Row"];

export type PropertyWithImages = Property & {
  property_images: PropertyImage[];
  categories: Category | null;
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      creators: {
        Row: {
          bio: string | null;
          created_at: string;
          focus_description: string | null;
          follower_count: number | null;
          handle: string | null;
          id: number;
          platform: string | null;
          tier: string | null;
          user_id: string | null;
          verified: boolean | null;
          verified_at: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          focus_description?: string | null;
          follower_count?: number | null;
          handle?: string | null;
          id?: number;
          platform?: string | null;
          tier?: string | null;
          user_id?: string | null;
          verified?: boolean | null;
          verified_at?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          focus_description?: string | null;
          follower_count?: number | null;
          handle?: string | null;
          id?: number;
          platform?: string | null;
          tier?: string | null;
          user_id?: string | null;
          verified?: boolean | null;
          verified_at?: string | null;
        };
        Relationships: [];
      };
      follows: {
        Row: {
          created_at: string;
          creator_id: number | null;
          followed_at: string | null;
          id: number;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          creator_id?: number | null;
          followed_at?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          creator_id?: number | null;
          followed_at?: string | null;
          id?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'follow_creator_id_fkey';
            columns: ['creator_id'];
            isOneToOne: false;
            referencedRelation: 'creators';
            referencedColumns: ['id'];
          },
        ];
      };
      linked_accounts: {
        Row: {
          provider: string;
          provider_user_id: string | null;
          user_id: string;
        };
        Insert: {
          provider: string;
          provider_user_id?: string | null;
          user_id?: string;
        };
        Update: {
          provider?: string;
          provider_user_id?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      pins: {
        Row: {
          created_at: string;
          id: number;
          note: string | null;
          photo_url: string | null;
          pinned_at: string | null;
          place_id: number | null;
          source_post_url: string | null;
          status: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          note?: string | null;
          photo_url?: string | null;
          pinned_at?: string | null;
          place_id?: number | null;
          source_post_url?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          note?: string | null;
          photo_url?: string | null;
          pinned_at?: string | null;
          place_id?: number | null;
          source_post_url?: string | null;
          status?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'pin_place_id_fkey';
            columns: ['place_id'];
            isOneToOne: false;
            referencedRelation: 'places';
            referencedColumns: ['id'];
          },
        ];
      };
      places: {
        Row: {
          category: string | null;
          city: string | null;
          created_at: string;
          google_place_id: string | null;
          id: number;
          lat: number | null;
          lng: number | null;
          name: string | null;
          neighbourhood: string | null;
        };
        Insert: {
          category?: string | null;
          city?: string | null;
          created_at?: string;
          google_place_id?: string | null;
          id?: number;
          lat?: number | null;
          lng?: number | null;
          name?: string | null;
          neighbourhood?: string | null;
        };
        Update: {
          category?: string | null;
          city?: string | null;
          created_at?: string;
          google_place_id?: string | null;
          id?: number;
          lat?: number | null;
          lng?: number | null;
          name?: string | null;
          neighbourhood?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          display_name: string | null;
          follower_count: number | null;
          onboarding_completed: boolean | null;
          phone: string | null;
          tier: string | null;
          user_id: string;
          user_type: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          follower_count?: number | null;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          tier?: string | null;
          user_id?: string;
          user_type?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          follower_count?: number | null;
          onboarding_completed?: boolean | null;
          phone?: string | null;
          tier?: string | null;
          user_id?: string;
          user_type?: string | null;
          username?: string | null;
        };
        Relationships: [];
      };
      saved_places: {
        Row: {
          id: number;
          pin_id: number | null;
          saved_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          pin_id?: number | null;
          saved_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          pin_id?: number | null;
          saved_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'saved_place_pin_id_fkey';
            columns: ['pin_id'];
            isOneToOne: false;
            referencedRelation: 'pins';
            referencedColumns: ['id'];
          },
        ];
      };
      submissions: {
        Row: {
          id: number;
          note: string | null;
          place_id: number | null;
          platform: string | null;
          post_url: string | null;
          status: string | null;
          submitted_at: string;
          user_id: string | null;
        };
        Insert: {
          id?: number;
          note?: string | null;
          place_id?: number | null;
          platform?: string | null;
          post_url?: string | null;
          status?: string | null;
          submitted_at?: string;
          user_id?: string | null;
        };
        Update: {
          id?: number;
          note?: string | null;
          place_id?: number | null;
          platform?: string | null;
          post_url?: string | null;
          status?: string | null;
          submitted_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'submission_place_id_fkey';
            columns: ['place_id'];
            isOneToOne: false;
            referencedRelation: 'places';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

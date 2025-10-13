export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  users: {
    Tables: {
      athletes: {
        Row: {
          athlete_id: string
          height: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          verification_id: string | null
          weight: string | null
        }
        Insert: {
          athlete_id: string
          height?: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          verification_id?: string | null
          weight?: string | null
        }
        Update: {
          athlete_id?: string
          height?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          verification_id?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'athletes_athlete_id_fkey'
            columns: ['athlete_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      employees: {
        Row: {
          employee_id: string
        }
        Insert: {
          employee_id: string
        }
        Update: {
          employee_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'employees_employee_id_fkey'
            columns: ['employee_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      enrollment_requests: {
        Row: {
          admin_assistant_id: string | null
          assigned_schedule_id: number | null
          athlete_id: string
          comments: string | null
          request_date: string | null
          request_id: number
          requested_plan_id: string | null
          requested_schedule_id: number
          status: 'pending' | 'approved' | 'rejected'
          subscription_id: string | null
        }
        Insert: {
          admin_assistant_id?: string | null
          assigned_schedule_id?: number | null
          athlete_id: string
          comments?: string | null
          request_date?: string | null
          request_id?: never
          requested_plan_id?: string | null
          requested_schedule_id: number
          status: 'pending' | 'approved' | 'rejected'
          subscription_id?: string | null
        }
        Update: {
          admin_assistant_id?: string | null
          assigned_schedule_id?: number | null
          athlete_id?: string
          comments?: string | null
          request_date?: string | null
          request_id?: never
          requested_plan_id?: string | null
          requested_schedule_id?: number
          status?: 'pending' | 'approved' | 'rejected'
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'enrollment_requests_admin_assistant_id_fkey'
            columns: ['admin_assistant_id']
            isOneToOne: false
            referencedRelation: 'employees'
            referencedColumns: ['employee_id']
          },
          {
            foreignKeyName: 'enrollment_requests_assigned_schedule_id_fkey'
            columns: ['assigned_schedule_id']
            isOneToOne: false
            referencedRelation: 'schedules'
            referencedColumns: ['schedule_id']
          },
          {
            foreignKeyName: 'enrollment_requests_athlete_id_fkey'
            columns: ['athlete_id']
            isOneToOne: false
            referencedRelation: 'athletes'
            referencedColumns: ['athlete_id']
          },
          {
            foreignKeyName: 'enrollment_requests_athlete_id_fkey'
            columns: ['athlete_id']
            isOneToOne: false
            referencedRelation: 'vw_athlete_payments_summary'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'enrollment_requests_requested_schedule_id_fkey'
            columns: ['requested_schedule_id']
            isOneToOne: false
            referencedRelation: 'schedules'
            referencedColumns: ['schedule_id']
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string
          created_at: string | null
          dni: string
          email: string
          first_name: string
          id: string
          last_avatar_change: string | null
          last_password_change: string | null
          last_profile_update: string | null
          maternal_last_name: string
          paternal_last_name: string
          phone: string
          role: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date: string
          created_at?: string | null
          dni: string
          email: string
          first_name: string
          id: string
          last_avatar_change?: string | null
          last_password_change?: string | null
          last_profile_update?: string | null
          maternal_last_name: string
          paternal_last_name: string
          phone: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string
          created_at?: string | null
          dni?: string
          email?: string
          first_name?: string
          id?: string
          last_avatar_change?: string | null
          last_password_change?: string | null
          last_profile_update?: string | null
          maternal_last_name?: string
          paternal_last_name?: string
          phone?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          available_spot: number | null
          end_time: string
          level: 'beginner' | 'intermediate' | 'advanced'
          schedule_id: number
          schedule_name: string
          start_time: string
        }
        Insert: {
          available_spot?: number | null
          end_time: string
          level: 'beginner' | 'intermediate' | 'advanced'
          schedule_id?: never
          schedule_name: string
          start_time: string
        }
        Update: {
          available_spot?: number | null
          end_time?: string
          level?: 'beginner' | 'intermediate' | 'advanced'
          schedule_id?: never
          schedule_name?: string
          start_time?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          max_capacity: number
          schedule_id: number
          shift_id: number
          weekday:
            | 'Lunes'
            | 'Martes'
            | 'Miercoles'
            | 'Jueves'
            | 'Viernes'
            | 'S├íbado'
            | null
        }
        Insert: {
          max_capacity: number
          schedule_id: number
          shift_id?: never
          weekday?:
            | 'Lunes'
            | 'Martes'
            | 'Miercoles'
            | 'Jueves'
            | 'Viernes'
            | 'S├íbado'
            | null
        }
        Update: {
          max_capacity?: number
          schedule_id?: number
          shift_id?: never
          weekday?:
            | 'Lunes'
            | 'Martes'
            | 'Miercoles'
            | 'Jueves'
            | 'Viernes'
            | 'S├íbado'
            | null
        }
        Relationships: [
          {
            foreignKeyName: 'shifts_schedule_id_fkey'
            columns: ['schedule_id']
            isOneToOne: false
            referencedRelation: 'schedules'
            referencedColumns: ['schedule_id']
          }
        ]
      }
    }
    Views: {
      vw_athlete_payments: {
        Row: {
          amount: number | null
          athlete_id: string | null
          avatar_url: string | null
          first_name: string | null
          maternal_last_name: string | null
          method_name: string | null
          paternal_last_name: string | null
          payment_date: string | null
        }
        Relationships: []
      }
      vw_athlete_payments_summary: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          id: string | null
          maternal_last_name: string | null
          paternal_last_name: string | null
          payments_count: number | null
          payments_sum_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'athletes_athlete_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Functions: {
      decrement_available_spot: {
        Args: { p_schedule_id: number }
        Returns: number
      }
      fn_get_athlete: {
        Args: { p_athlete_id: string }
        Returns: {
          athlete_id: string
          avatar_url: string
          birth_date: string
          created_at: string
          dni: string
          email: string
          first_name: string
          height: string
          id: string
          last_avatar_change: string
          last_password_change: string
          last_profile_update: string
          level: 'beginner' | 'intermediate' | 'advanced'
          maternal_last_name: string
          paternal_last_name: string
          phone: string
          role: string
          updated_at: string
          verification_id: string
          weight: string
        }[]
      }
      get_athlete_distribution: {
        Args: Record<PropertyKey, never>
        Returns: {
          level: string
          total: number
        }[]
      }
      get_athlete_schedule: {
        Args: { p_athlete_id: string }
        Returns: {
          end_time: string
          schedule_name: string
          start_time: string
          weekday: string
        }[]
      }
      get_athletes: {
        Args: Record<PropertyKey, never>
        Returns: {
          avatar_url: string
          birth_date: string
          dni: string
          email: string
          first_name: string
          id: string
          level: 'beginner' | 'intermediate' | 'advanced'
          maternal_last_name: string
          paternal_last_name: string
          phone: string
          role: string
          status: string
          updated_at: string
        }[]
      }
      process_new_user: {
        Args: { p_email: string; p_id: string; p_raw_user_meta_data: Json }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  users: {
    Enums: {}
  }
} as const

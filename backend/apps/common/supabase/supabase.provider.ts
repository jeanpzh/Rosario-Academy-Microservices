import { Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseConfig } from './supabase.config'

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT'

export const SupabaseProvider: Provider = {
  provide: SUPABASE_CLIENT,
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseConfig = configService.get<SupabaseConfig>('supabase')

    if (!supabaseConfig?.url || !supabaseConfig?.serviceRoleKey) {
      throw new Error('Supabase URL and Service Role Key must be provided')
    }

    return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey)
  },
  inject: [ConfigService]
}

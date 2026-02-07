import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
    const anonKey = this.configService.getOrThrow<string>('SUPABASE_ANON_KEY');
    const serviceRoleKey =
      this.configService.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');

    // Client with anon key (for user operations)
    this.supabase = createClient(supabaseUrl, anonKey);

    // Admin client (bypasses RLS when needed)
    this.supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  getAdminClient(): SupabaseClient {
    return this.supabaseAdmin;
  }

  // Get authenticated client for specific user
  getClientWithAuth(accessToken: string): SupabaseClient {
    return createClient(
      this.configService.getOrThrow<string>('SUPABASE_URL'),
      this.configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      },
    );
  }
}

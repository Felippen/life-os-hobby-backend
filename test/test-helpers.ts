import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

export async function createTestApp(): Promise<INestApplication> {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
  return app;
}

export interface TestUser {
  email: string;
  password: string;
  accessToken?: string;
  userId?: string;
}

// Helper to create a test user in Supabase via signUp (anon client)
// Requires: Authentication > Providers > Email > "Confirm email" disabled
export async function createTestUser(supabase: any): Promise<TestUser> {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      emailRedirectTo: undefined,
      data: {
        test_user: true,
      },
    },
  });

  if (error) {
    throw new Error(`Failed to create test user: ${error.message}`);
  }

  if (!data.session) {
    throw new Error(
      'No session returned. In Supabase: Authentication > Providers > Email > disable "Confirm email".',
    );
  }

  return {
    email: testEmail,
    password: testPassword,
    accessToken: data.session.access_token,
    userId: data.user.id,
  };
}

// Helper to clean up test user data
// Deletes conversations (messages cascade). Auth users accumulate - use a dedicated test project or periodic manual cleanup.
export async function cleanupTestUser(supabase: any, userId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.warn('Failed to cleanup test data:', error.message);
  }
}

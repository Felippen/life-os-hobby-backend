import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { SupabaseService } from '../src/supabase/supabase.service';
import {
  createTestApp,
  createTestUser,
  cleanupTestUser,
  TestUser,
} from './test-helpers';

describe('Messages (e2e)', () => {
  let app: INestApplication;
  let supabaseService: SupabaseService;
  let testUser: TestUser;
  let conversationId: string;

  beforeAll(async () => {
    app = await createTestApp();
    supabaseService = app.get<SupabaseService>(SupabaseService);

    // Create test user (anon client for signUp)
    testUser = await createTestUser(supabaseService.getClient());

    // Create a test conversation
    const response = await request(app.getHttpServer())
      .post('/conversations')
      .set('Authorization', `Bearer ${testUser.accessToken}`)
      .send({ title: 'Test Chat' });

    conversationId = response.body.id;
  });

  afterAll(async () => {
    if (testUser?.userId) {
      await cleanupTestUser(supabaseService.getAdminClient(), testUser.userId);
    }
    await app.close();
  });

  describe('POST /messages', () => {
    it('should send message and receive AI response', async () => {
      const response = await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          conversation_id: conversationId,
          content: 'Hello, this is a test message',
        })
        .expect(201);

      // Check user message
      expect(response.body).toHaveProperty('user_message');
      expect(response.body.user_message.role).toBe('user');
      expect(response.body.user_message.content).toBe(
        'Hello, this is a test message',
      );
      expect(response.body.user_message.conversation_id).toBe(conversationId);

      // Check assistant message
      expect(response.body).toHaveProperty('assistant_message');
      expect(response.body.assistant_message.role).toBe('assistant');
      expect(response.body.assistant_message.content).toBeTruthy();
      expect(response.body.assistant_message.conversation_id).toBe(
        conversationId,
      );
    }, 30000); // 30 second timeout for AI response

    it('should auto-generate title on first message', async () => {
      // Create new conversation
      const convResponse = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({});

      const newConvId = convResponse.body.id;

      // Send first message
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          conversation_id: newConvId,
          content: 'Help me plan a trip to Japan',
        })
        .expect(201);

      // Check conversation title was updated
      const getConvResponse = await request(app.getHttpServer())
        .get(`/conversations/${newConvId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`);

      expect(getConvResponse.body.title).not.toBe('New Chat');
    }, 30000);

    it('should reject invalid conversation_id', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({
          conversation_id: fakeId,
          content: 'Test message',
        })
        .expect(404);
    });

    it('should validate required fields', async () => {
      await request(app.getHttpServer())
        .post('/messages')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({})
        .expect(400);
    });
  });

  describe('GET /messages/conversation/:conversationId', () => {
    it('should retrieve all messages for a conversation', async () => {
      const response = await request(app.getHttpServer())
        .get(`/messages/conversation/${conversationId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);

      // Should have both user and assistant messages
      const roles = response.body.data.map((m: { role: string }) => m.role);
      expect(roles).toContain('user');
      expect(roles).toContain('assistant');
    });

    it('should support limit parameter', async () => {
      const response = await request(app.getHttpServer())
        .get(`/messages/conversation/${conversationId}?limit=1`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.data.length).toBeLessThanOrEqual(1);
    });
  });
});

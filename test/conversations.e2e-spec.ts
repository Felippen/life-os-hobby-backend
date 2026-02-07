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

describe('Conversations (e2e)', () => {
  let app: INestApplication;
  let supabaseService: SupabaseService;
  let testUser: TestUser;
  let conversationId: string;

  beforeAll(async () => {
    app = await createTestApp();
    supabaseService = app.get<SupabaseService>(SupabaseService);

    // Create a test user (anon client for signUp)
    testUser = await createTestUser(supabaseService.getClient());
  });

  afterAll(async () => {
    // Cleanup test user (this will cascade delete conversations and messages)
    if (testUser?.userId) {
      await cleanupTestUser(supabaseService.getAdminClient(), testUser.userId);
    }
    await app.close();
  });

  describe('POST /conversations', () => {
    it('should create a new conversation', async () => {
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ title: 'Test Conversation' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Conversation');
      expect(response.body.user_id).toBe(testUser.userId);

      // Save for later tests
      conversationId = response.body.id;
    });

    it('should create conversation with default title', async () => {
      const response = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({})
        .expect(201);

      expect(response.body.title).toBe('New Chat');
    });

    it('should reject unauthenticated requests', async () => {
      await request(app.getHttpServer())
        .post('/conversations')
        .send({ title: 'Test' })
        .expect(401);
    });
  });

  describe('GET /conversations', () => {
    it('should list user conversations', async () => {
      const response = await request(app.getHttpServer())
        .get('/conversations')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('total');
    });

    it('should support pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/conversations?limit=1&offset=0')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.limit).toBe(1);
      expect(response.body.offset).toBe(0);
    });
  });

  describe('GET /conversations/:id', () => {
    it('should get conversation with messages', async () => {
      const response = await request(app.getHttpServer())
        .get(`/conversations/${conversationId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(conversationId);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
    });

    it('should return 404 for non-existent conversation', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/conversations/${fakeId}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(404);
    });
  });

  describe('DELETE /conversations/:id', () => {
    it('should delete conversation', async () => {
      // Create a conversation to delete
      const createResponse = await request(app.getHttpServer())
        .post('/conversations')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ title: 'To Delete' })
        .expect(201);

      const idToDelete = createResponse.body.id;

      // Delete it
      await request(app.getHttpServer())
        .delete(`/conversations/${idToDelete}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(204);

      // Verify it's gone
      await request(app.getHttpServer())
        .get(`/conversations/${idToDelete}`)
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(404);
    });
  });
});

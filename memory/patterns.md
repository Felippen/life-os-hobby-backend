# Code Patterns & Conventions

## NestJS Module Pattern
Each feature follows: Module → Service → Controller → DTOs
- Module registered in AppModule imports array
- AuthGuard applied to all routes via @UseGuards(AuthGuard)
- @CurrentUser() decorator extracts user from JWT
- @AccessToken() decorator extracts raw token

## Supabase Service Pattern
- SupabaseModule is global (registered once in AppModule)
- SupabaseService provides three client types:
  - `getClient()` — anon client for public operations
  - `getAdminClient()` — service role for admin ops (tests only)
  - `getAuthClient(token)` — user-scoped client with RLS
- Always use auth client for user-facing operations

## Query Pattern
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', value)
  .order('created_at', { ascending: true });
if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
```

## Controller Pattern
```typescript
@Controller('resource')
@UseGuards(AuthGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  create(@CurrentUser() user, @Body() dto: CreateResourceDto) {
    return this.resourceService.create(user.id, dto);
  }
}
```

## DTO Pattern
Using class-validator decorators:
```typescript
export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

## Testing Pattern
- E2E tests with Jest + Supertest
- Test against local Supabase Docker instance
- test-helpers.ts provides:
  - Auth token generation for test users
  - Database cleanup between tests
  - Supabase client setup
- Each test suite manages its own test data

## File Structure
```
src/
├── main.ts
├── app.module.ts
├── supabase/
│   ├── supabase.module.ts
│   └── supabase.service.ts
├── auth/
│   ├── auth.module.ts
│   ├── auth.guard.ts
│   └── auth.decorator.ts
├── conversations/
│   ├── conversations.module.ts
│   ├── conversations.service.ts
│   ├── conversations.controller.ts
│   └── dto/
├── messages/
│   ├── messages.module.ts
│   ├── messages.service.ts
│   ├── messages.controller.ts
│   └── dto/
└── ai/
    ├── ai.module.ts
    └── ai.service.ts
```

## Naming Conventions
- Files: kebab-case (e.g., conversations.service.ts)
- Classes: PascalCase (e.g., ConversationsService)
- Variables/methods: camelCase
- Database: snake_case (e.g., user_id, created_at)
- Migrations: timestamp prefix (e.g., 20260207000000_initial_schema.sql)

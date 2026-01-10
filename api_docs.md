# API Documentation

## Base URL
The API is served at the root URL.

## Authentication
Routes protected by `JwtAuthGuard` require a Bearer Token in the `Authorization` header.
Example: `Authorization: Bearer <token>`

---

## Admin
**Base Path:** `/admin`
**Guards:** `JwtAuthGuard`, `AdminGuard`

### Users
- `GET /admin/users` - List users. Query params: `page`, `limit`, `q`.
- `GET /admin/users/:id` - Get user details.
- `POST /admin/users` - Create a new user. Body: `CreateAdminUserDto`.
- `PATCH /admin/users/:id` - Update a user. Body: `UpdateAdminUserDto`.
- `DELETE /admin/users/:id` - Delete a user.

### Invitations
- `GET /admin/invitations` - List invitations. Query params: `page`, `limit`, `q`.
- `GET /admin/invitations/:id` - Get invitation details.
- `PATCH /admin/invitations/:id` - Update invitation.
- `DELETE /admin/invitations/:id` - Delete invitation.

### Guests
- `GET /admin/guests` - List guests. Query params: `page`, `limit`, `q`.
- `GET /admin/guests/:id` - Get guest details.
- `PATCH /admin/guests/:id` - Update guest.
- `DELETE /admin/guests/:id` - Delete guest.

### Guest Messages
- `GET /admin/guest-messages` - List guest messages. Query params: `page`, `limit`, `q`.
- `DELETE /admin/guest-messages/:id` - Delete guest message.

### Template Designs
- `GET /admin/template-designs` - List template designs. Query params: `page`, `limit`, `q`.
- `GET /admin/template-designs/:id` - Get template design details.
- `POST /admin/template-designs` - Create template design. Body: `CreateTemplateDesignDto`.
- `PATCH /admin/template-designs/:id` - Update template design. Body: `UpdateTemplateDesignDto`.
- `DELETE /admin/template-designs/:id` - Delete template design.

### Sections
- `GET /admin/sections` - List sections.
- `POST /admin/sections` - Create section.
- `PATCH /admin/sections/:id` - Update section.
- `DELETE /admin/sections/:id` - Delete section.

### Audio
- `GET /admin/audio` - List audio files.
- `POST /admin/audio` - Create audio entry.
- `DELETE /admin/audio/:id` - Delete audio entry.

### Banks
- `GET /admin/banks` - List banks.
- `POST /admin/banks` - Create bank.
- `DELETE /admin/banks/:id` - Delete bank.

### Categories
**Base Path:** `/admin/categories`
- `GET /admin/categories` - List categories.
- `GET /admin/categories/:id` - Get category details.
- `POST /admin/categories` - Create category. Body: `CreateCategoryDto`.
- `PATCH /admin/categories/:id` - Update category. Body: `UpdateCategoryDto`.
- `DELETE /admin/categories/:id` - Delete category.

---

## Auth
**Base Path:** `/auth`

- `GET /auth/me` - Get current user profile. **Guard:** `JwtAuthGuard`.
- `POST /auth/register` - Register a new user. Body: `RegisterDto`.
- `POST /auth/login` - Login user. Body: `LoginDto`.
- `GET /auth/test-log` - Test logging.
- `GET /auth/google` - Initiate Google OAuth login. **Guard:** `AuthGuard('google')`.
- `GET /auth/google/redirect` - Google OAuth callback. **Guard:** `AuthGuard('google')`.

---

## Dashboard
**Base Path:** `/dashboard`
**Guards:** `JwtAuthGuard`

- `GET /dashboard/stats` - Get dashboard statistics.

---

## Guests
**Base Path:** `/guests`

- `POST /guests` - Create a guest manually. Body: `CreateGuestDto`.
- `GET /guests/invitation/:invitationId` - Get all guests for an invitation.
- `GET /guests/invitation/:invitationId/with-messages` - Get all guests with their last message and tracking info.
- `DELETE /guests/:id` - Delete a guest.
- `POST /guests/import` - Import guests from Excel. Expects `file` field in multipart/form-data.
- `GET /guests/:id/share` - Generate share link/WhatsApp deeplink for a guest.

---

## Guest Messages
**Base Path:** `/guest-messages`

- `POST /guest-messages` - Create a new guest message. Body: `CreateGuestMessageDto`.
- `GET /guest-messages/invitation/:invitationId` - Get messages for a specific invitation.
- `GET /guest-messages` - Get all guest messages.

---

## Invitation
**Base Path:** `/invitation`

- `POST /invitation` - Create a new invitation. Body: `CreateInvitationDto`. **Guard:** `JwtAuthGuard`.
- `GET /invitation` - List user's invitations. **Guard:** `JwtAuthGuard`.
- `GET /invitation/:id` - Get invitation by ID. **Guard:** `JwtAuthGuard`.
- `PATCH /invitation/:id` - Update invitation. Body: `UpdateInvitationDto`. **Guard:** `JwtAuthGuard`.
- `DELETE /invitation/:id` - Delete invitation. **Guard:** `JwtAuthGuard`.
- `GET /invitation/slug/:slug` - Get invitation by slug (public).
- `GET /invitation/slug/:invitationSlug/guest/:guestSlug` - Get invitation with specific guest details (public).
- `GET /invitation/categories` - Get invitation categories.

---

## Payment
**Base Path:** `/payment`

- `POST /payment/create` - Create a payment transaction (Snap). Body: `{ invitation_id: number }`.
- `GET /payment/success` - Webhook/Redirect for successful payment.
- `GET /payment/finish` - Webhook/Redirect for finished payment.
- `POST /payment/notification` - Handle Midtrans notification webhook.

---

## Template Design
**Base Path:** `/template-design`

- `POST /template-design` - Create a new template design. Body: `TemplateDesign`.
- `GET /template-design` - List template designs. Query param: `category` (optional).
- `GET /template-design/:id` - Get template design by ID.
- `PATCH /template-design/:id` - Update template design. Body: Partial `TemplateDesign`.
- `DELETE /template-design/:id` - Delete template design.

---

## Upload
**Base Path:** `/upload`

- `POST /upload` - Upload a file. Expects `file` field in multipart/form-data. Allowed types: `png, jpeg, jpg, pdf, mp3, mp4, mkv`.

---

## User
**Base Path:** `/user`
**Guards:** `JwtAuthGuard`

- `GET /user/me` - Get current user profile.
- `PATCH /user` - Update user profile. Body: `UpdateUserDto`.

---

## General
**Base Path:** `/`

- `GET /` - Health check / Hello message.

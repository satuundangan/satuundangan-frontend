# Backend Requirements & API Specifications

To support the "proper" functioning of the frontend application, the backend must implement or update the following endpoints and logic.

## 1. Public Access
- **Get Invitation by Slug**
  - **Endpoint:** `GET /invitations/slug/:slug`
  - **Response:**
    ```json
    {
      "id": "uuid",
      "title": "Wedding of A & B",
      "slug": "a-and-b",
      "template_slug": "dark-elegant",
      "content": { ... }, // The massive JSON blob from the creation form
      "is_premium": true,
      "is_active": true
    }
    ```
  - **Logic:** Must resolve the slug to the correct invitation and return the `template_slug` so the frontend knows which component to load.

## 2. User Dashboard
- **Dashboard Stats**
  - **Endpoint:** `GET /dashboard/stats`
  - **Response:**
    ```json
    {
      "total_invitations": 5,
      "active_invitations": 2,
      "total_responses": 150
    }
    ```
- **List User Invitations**
  - **Endpoint:** `GET /invitations`
  - **Query Params:** `page`, `limit`
  - **Response:** Paginated list of invitations belonging to the authenticated user.

## 3. Payment & Checkout
- **Initiate Payment**
  - **Endpoint:** `POST /payment/create`
  - **Body:** `{ "invitation_id": "uuid" }` (Don't trust client-side price amounts)
  - **Response:**
    ```json
    {
      "token": "midtrans-snap-token",
      "order_id": "order-123"
    }
    ```
  - **Logic:** Backend should calculate the price (e.g., Rp 49.000) based on the invitation type/status, *not* parameters sent from the frontend.

## 4. Admin Panel

### Invitations
- **Extended Invitation Details**
  - **Endpoint:** `GET /admin/invitations/:id`
  - **Purpose:** Allow admins to see full details of a specific invitation without needing to impersonate the user.
- **Update Invitation (Admin)**
  - **Endpoint:** `PATCH /admin/invitations/:id`
  - **Purpose:** Allow admins to toggle `is_active`, `is_premium`, or moderate content.

### Master Data Management
- **Master Sections (Fitur Undangan)**
  - **CRUD Endpoints:** `GET`, `POST`, `PATCH`, `DELETE` `/admin/sections`
  - **Data Structure:**
    ```json
    {
      "id": "uuid",
      "label": "Love Story",
      "key": "loveStory",
      "is_active": true
    }
    ```
  - **Usage:** Used to dynamically populate the "Section Options" checkboxes in the Template Management page.

- **Audio Management**
  - **CRUD Endpoints:** `GET`, `POST`, `DELETE` `/admin/audio`
  - **Data Structure:**
    ```json
    {
      "id": "uuid",
      "title": "Romantic Piano",
      "category": "romantic",
      "url": "https://bucket/song.mp3"
    }
    ```

- **Bank & Payment Methods**
  - **CRUD Endpoints:** `GET`, `POST`, `DELETE` `/admin/banks`
  - **Data Structure:**
    ```json
    {
      "id": "uuid",
      "name": "BCA",
      "code": "014",
      "logo": "https://bucket/bca.png"
    }
    ```

## 5. System
- **Profile Endpoint**
  - **Endpoint:** `GET /auth/me`
  - **Response:** Should return the latest user data, including `avatar` (if available), `role`, etc., to populate the sidebar/header.
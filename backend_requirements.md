# Backend Requirements & API Specifications

This document outlines the API endpoints and logic that *still need to be implemented or updated* in the backend to support the latest frontend features.

## Admin Panel

### Master Data: Categories (New)
- **Purpose:** To manage template categories with name and color attributes.
- **CRUD Endpoints:** `GET`, `POST`, `PATCH`, `DELETE` `/admin/categories`
- **Data Structure for Create/Update:**
  ```json
  {
    "name": "Elegant",      // String, unique category name
    "color": "#1e293b"      // String, Hex color code (e.g., #RRGGBB)
  }
  ```
- **Data Structure for Fetch/List:**
  ```json
  {
    "id": "uuid",           // Unique identifier for the category
    "name": "Elegant",
    "color": "#1e293b"
  }
  ```

### Template Designs (Updated)
- **Purpose:** To add `price` and `tags` fields to templates and use managed categories.
- **Update Endpoints:** `POST /admin/template-designs`, `PATCH /admin/template-designs/:id`
- **Updated Create/Update Payload:**
  The existing template payload needs to be extended with the following fields:
  ```json
  {
    // ... (existing template fields like name, slug, previewUrl, description, isActive, paletteColor, sectionOptions)
    "category": "Wedding",      // String, Name of the category (as selected from the new Categories master data)
    "price": 50000,             // Number, The price of the template
    "tags": ["wedding", "modern", "minimalist"] // Array of Strings, A list of descriptive tags for the template
  }
  ```
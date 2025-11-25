# T-Shirt Shop Backend

## Run locally
1. Copy `.env.example` to `.env` and adjust values if needed
2. Install deps: `npm install`
3. Start dev server: `npm run dev`

## API
- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Users: `GET /api/users/me`, `GET /api/users` (admin)
- Categories: CRUD under `/api/categories` (admin for write)
- Products: CRUD under `/api/products` (admin for write)
- Orders: `POST /api/orders` (customer) | `GET /api/orders` and `PUT /api/orders/:id` (admin)

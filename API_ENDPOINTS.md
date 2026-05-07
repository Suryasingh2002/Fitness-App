# Observed API Endpoints

Base URL:

```text
${REACT_APP_BACKEND_URL}/api
```

Authentication:

- `GET /auth/me`
- `POST /auth/login`
- `POST /auth/register`

Workouts:

- `GET /workouts`
- `GET /workouts?limit=100`
- `GET /workouts/:id`
- `POST /workouts/:id/bookmark`
- `DELETE /workouts/:id/bookmark`
- `GET /users/me/bookmarks`

Challenges:

- `GET /challenges`
- `GET /challenges/:id`
- `POST /challenges/:id/join`
- `POST /challenges/:id/progress`
- `GET /users/me/challenges`

Dashboard:

- `GET /users/me/stats`
- `GET /users/me/bookmarks`
- `GET /users/me/challenges`

Admin:

- `GET /admin/analytics`
- `GET /admin/users`
- `DELETE /admin/users/:id`
- `POST /admin/workouts`
- `PUT /admin/workouts/:id`
- `DELETE /admin/workouts/:id`

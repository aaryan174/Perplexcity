

=> Authentication ui path

src/features/auth/
├── components/
│   ├── animated-eyes.tsx          ← Pupil & EyeBall
│   ├── auth-layout.tsx            ← AnimatedCharactersPanel & AuthPageLayout
│   ├── animated-characters-login-page.tsx   ← Login form
│   └── animated-characters-register-page.tsx ← Register form
├── pages/
│   ├── Login.tsx                  ← imports from ../components/
│   └── Register.tsx               ← imports from ../components/
└── hooks/


using redux for better data centralization


<!-- for adding new feature -->
┌──────────────────────────────────────────────────────────────────────┐
│  LAYER 1: UI (components/)                                          │
│  animated-characters-login-page.jsx                                 │
│                                                                      │
│  ┌─────────────────────────┐                                        │
│  │ Input: "identifier"     │  ← User types email OR username        │
│  │ Input: "password"       │                                        │
│  └─────────┬───────────────┘                                        │
│            │ onSubmit → handleLogin({ identifier, password })       │
├────────────┼─────────────────────────────────────────────────────────┤
│  LAYER 2: HOOKS (hooks/)                                            │
│  useAuth.js                                                         │
│            │                                                         │
│            ├── dispatch(setLoading(true))                            │
│            ├── await login({ identifier, password })  ───────► L3   │
│            ├── dispatch(setUser(data.user))    ← on success         │
│            ├── navigate("/")                   ← redirect home      │
│            └── dispatch(setError(message))     ← on failure         │
├────────────┼─────────────────────────────────────────────────────────┤
│  LAYER 3: SERVICES (services/)                                      │
│  auth.api.js                                                        │
│            │                                                         │
│            └── POST /api/auth/login                                 │
│                Body: { identifier, password }  ───────► Backend     │
├────────────┼─────────────────────────────────────────────────────────┤
│  LAYER 4: STATE (Auth.slice.js + store.js)                          │
│                                                                      │
│  Redux Store: { auth: { user, loading, error } }                    │
│                                                                      │
│  ┌───────────┐  ┌────────────┐  ┌──────────┐  ┌────────────┐       │
│  │ setUser   │  │ setLoading │  │ setError │  │ clearError │       │
│  └───────────┘  └────────────┘  └──────────┘  └────────────┘       │
│       ▲                ▲              ▲              ▲               │
│       └────────── dispatched by useAuth hook ────────┘               │
└──────────────────────────────────────────────────────────────────────┘

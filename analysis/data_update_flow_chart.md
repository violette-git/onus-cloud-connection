# Data Update Flow Chart

```mermaid
graph TD;
    A[Local Database Update] --> B[Supabase Push];
    B --> C[Supabase Apply Migrations];
    C --> D[Supabase Pull Schema];
    D --> E[Verify Data];
    E --> F[Local Database Reflects Changes];
    G[Supabase Database Update] --> H[Supabase Push];
    H --> I[Supabase Apply Migrations];
    I --> J[Supabase Pull Schema];
    J --> K[Verify Data];
    K --> L[Local Database Reflects Changes];

# Arquitectura del Sistema de Árbol Binario Admin

## Diagrama de Flujo de Datos

```mermaid
graph TB
    A[Admin Usuario] --> B[/admin/binary-tree]
    B --> C[BinaryTreeAdminContent]
    C --> D{Server Actions}
    
    D --> E[getAllBinaryNodes]
    D --> F[getBinaryTreeStatistics]
    D --> G[searchBinaryTreeUsers]
    D --> H[getAdminBinaryTree]
    
    E --> I[(Supabase DB)]
    F --> I
    G --> I
    H --> I
    
    I --> J[binary_positions]
    I --> K[user_profiles]
    I --> L[memberships]
    I --> M[commissions]
    
    C --> N[BinaryTreeFlow]
    N --> O[ReactFlow Engine]
    
    O --> P[BinaryNodeCard x N]
    P --> Q[Click Event]
    
    Q --> R[AdminBinaryNodeDetailsModal]
    
    N --> S[Search/Filter Panel]
    N --> T[Statistics Panel]
    N --> U[Controls Panel]
```

## Estructura de Componentes

```mermaid
graph LR
    A[page.tsx] --> B[BinaryTreeAdminContent]
    B --> C[Statistics Cards]
    B --> D[Control Panel]
    B --> E[BinaryTreeFlow]
    B --> F[AdminBinaryNodeDetailsModal]
    
    E --> G[ReactFlow]
    G --> H[BinaryNodeCard 1]
    G --> I[BinaryNodeCard 2]
    G --> J[BinaryNodeCard N]
    
    E --> K[Search Input]
    E --> L[Filters]
    E --> M[MiniMap]
    E --> N[Controls]
```

## Flujo de Navegación

```mermaid
sequenceDiagram
    participant U as Usuario Admin
    participant P as Página
    participant C as Componente
    participant A as Server Action
    participant DB as Supabase
    
    U->>P: Accede a /admin/binary-tree
    P->>C: Renderiza BinaryTreeAdminContent
    C->>A: getAllBinaryNodes()
    A->>DB: SELECT binary_positions + profiles
    DB-->>A: Datos del árbol
    A-->>C: Array de AdminBinaryNode[]
    C->>C: Renderiza BinaryTreeFlow
    
    U->>C: Click en nodo
    C->>C: Abre modal con detalles
    
    U->>C: Busca "John"
    C->>A: searchBinaryTreeUsers("John")
    A->>DB: SELECT WHERE name LIKE '%John%'
    DB-->>A: Resultados filtrados
    A-->>C: Nodos que coinciden
    C->>C: Actualiza visualización
    
    U->>C: Click "Navegar a nodo"
    C->>A: getAllBinaryNodes(userId)
    A->>DB: SELECT WHERE path LIKE '%userId%'
    DB-->>A: Subárbol
    A-->>C: Nodos del subárbol
    C->>C: Renderiza vista filtrada
```

## Arquitectura de Datos

```mermaid
erDiagram
    BINARY_POSITIONS ||--|| USER_PROFILES : "user_id"
    BINARY_POSITIONS ||--o| BINARY_POSITIONS : "parent_id"
    BINARY_POSITIONS ||--o| BINARY_POSITIONS : "left_child_id"
    BINARY_POSITIONS ||--o| BINARY_POSITIONS : "right_child_id"
    BINARY_POSITIONS }o--|| USER_PROFILES : "sponsor_id"
    USER_PROFILES ||--o{ MEMBERSHIPS : "has"
    USER_PROFILES ||--o{ COMMISSIONS : "earns"
    
    BINARY_POSITIONS {
        bigint id PK
        uuid user_id FK
        varchar position_leg
        integer level
        decimal left_volume
        decimal right_volume
        bigint parent_id FK
        bigint left_child_id FK
        bigint right_child_id FK
        uuid sponsor_id FK
        varchar path
    }
    
    USER_PROFILES {
        uuid id PK
        varchar first_name
        varchar last_name
        varchar email
        boolean is_active
        decimal balance
        uuid sponsor_id FK
    }
    
    MEMBERSHIPS {
        uuid user_id FK
        decimal amount
        varchar level
        varchar status
    }
    
    COMMISSIONS {
        uuid user_id FK
        decimal amount
        varchar status
    }
```

## Stack Tecnológico

```mermaid
graph TB
    subgraph Frontend
        A[React 18]
        B[Next.js 15]
        C[TypeScript]
        D[Tailwind CSS]
        E[ReactFlow]
        F[Shadcn/UI]
    end
    
    subgraph Backend
        G[Next.js Server Actions]
        H[Supabase Client]
    end
    
    subgraph Database
        I[PostgreSQL]
        J[Supabase]
        K[RLS Policies]
    end
    
    subgraph State Management
        L[React useState]
        M[React useEffect]
        N[Server State]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    
    B --> G
    G --> H
    H --> J
    J --> I
    I --> K
    
    E --> L
    L --> M
    G --> N
```

## Optimizaciones Implementadas

```mermaid
graph LR
    A[Optimizaciones] --> B[Batch Queries]
    A --> C[Memoization]
    A --> D[Lazy Loading]
    A --> E[DB Indexes]
    A --> F[Depth Limiting]
    
    B --> B1[count_direct_referrals_batch]
    B --> B2[Single query for profiles]
    
    C --> C1[React.memo on cards]
    C --> C2[useMemo for filters]
    
    D --> D1[Suspense boundaries]
    D --> D2[Progressive loading]
    
    E --> E1[user_id index]
    E --> E2[parent_id index]
    E --> E3[path index]
    
    F --> F1[Max depth = 5]
    F --> F2[Configurable limit]
```

## Seguridad en Capas

```mermaid
graph TB
    A[Request] --> B{Auth Check}
    B -->|No Auth| C[401 Unauthorized]
    B -->|Authenticated| D{Role Check}
    
    D -->|Not Admin| E[403 Forbidden]
    D -->|Admin| F[Server Action]
    
    F --> G{RLS Policy}
    G -->|Denied| H[403 Forbidden]
    G -->|Allowed| I[Database Query]
    
    I --> J[Return Data]
    J --> K[Response]
```

## Características del Árbol Binario

```mermaid
graph TB
    A[Root Node] --> B[Left Branch]
    A --> C[Right Branch]
    
    B --> D[Left-Left]
    B --> E[Left-Right]
    
    C --> F[Right-Left]
    C --> G[Right-Right]
    
    style A fill:#9333ea
    style B fill:#10b981
    style C fill:#3b82f6
    style D fill:#10b981
    style E fill:#10b981
    style F fill:#3b82f6
    style G fill:#3b82f6
    
    D -.->|Volume| D1[Left Volume]
    E -.->|Volume| D1
    
    F -.->|Volume| C1[Right Volume]
    G -.->|Volume| C1
    
    D1 --> A1[Total Left Volume]
    C1 --> A2[Total Right Volume]
```

## Proceso de Renderizado

```mermaid
sequenceDiagram
    participant C as Component
    participant RF as ReactFlow
    participant L as Layout Engine
    participant N as Node Renderer
    
    C->>C: Filter nodes
    C->>L: Calculate positions
    L->>L: Apply layout algorithm
    L-->>C: Positioned nodes
    
    C->>RF: Set nodes & edges
    RF->>N: Render each node
    N->>N: Apply BinaryNodeCard
    N-->>RF: Rendered nodes
    RF-->>C: Complete tree
    
    Note over C,RF: Interactive controls
    C->>RF: Zoom/Pan/Filter
    RF-->>C: Update viewport
```

## Estados del Componente

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Loaded: Data fetched
    Loading --> Error: Fetch failed
    
    Loaded --> Searching: User searches
    Loaded --> Filtering: User filters
    Loaded --> Navigating: User navigates
    
    Searching --> Loaded: Results shown
    Filtering --> Loaded: Filters applied
    Navigating --> Loaded: New view loaded
    
    Loaded --> DetailView: Node clicked
    DetailView --> Loaded: Modal closed
    
    Error --> Loading: Retry
```

Esta arquitectura asegura:
- ✅ Separación de responsabilidades
- ✅ Optimización de rendimiento
- ✅ Seguridad en múltiples capas
- ✅ Escalabilidad
- ✅ Mantenibilidad

# Arquitectura de Software - Pinneacle Perfumería

## 📋 Índice

1. [Visión Arquitectónica](#visión-arquitectónica)
2. [Diagrama de Arquitectura General](#diagrama-de-arquitectura-general)
3. [Diagrama de Clases](#diagrama-de-clases)
4. [Diagrama de Secuencia](#diagrama-de-secuencia)
5. [Diagrama de Entidad-Relación](#diagrama-de-entidad-relación)
6. [Diagrama de Estados](#diagrama-de-estados)
7. [Diagrama de Componentes](#diagrama-de-componentes)
8. [Patrones de Diseño](#patrones-de-diseño)
9. [Flujo de Datos](#flujo-de-datos)

---

## Visión Arquitectónica

### Arquitectura General

Pinneacle Perfumería sigue una **arquitectura JAMstack (JavaScript, APIs, Markup)** con:

- **Frontend**: Next.js 15 con Server Components
- **Backend**: WooCommerce GraphQL API (Headless CMS)
- **State Management**: React Context + localStorage
- **Estilo**: Tailwind CSS 4
- **Tipo**: SPA con renderizado híbrido (Server + Client)

### Principios Arquitectónicos

1. **Separación de Responsabilidades**: Frontend y backend desacoplados
2. **Server-First**: Server Components por defecto, Client Components cuando es necesario
3. **Progressive Enhancement**: Funcionalidad básica sin JavaScript, mejorada con React
4. **Data Locality**: Los datos viven cerca de donde se usan
5. **Optimistic UI**: Actualizaciones inmediatas con validación posterior

---

## Diagrama de Arquitectura General

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[🌐 Navegador Web]
    end

    subgraph "Frontend Layer - Next.js 15"
        Router[Next.js App Router]
        ServerComponents[Server Components]
        ClientComponents[Client Components]
        APIRoutes[API Routes]
    end

    subgraph "State Management"
        Context[React Context]
        LocalStorage[(localStorage)]
    end

    subgraph "External APIs"
        Woo[WooCommerce GraphQL API]
        WhatsApp[WhatsApp API]
    end

    subgraph "CDN & Assets"
        Vercel[Vercel CDN]
        Images[Image Optimization]
    end

    Browser -->|HTTP Request| Router
    Router --> ServerComponents
    Router --> ClientComponents
    Router --> APIRoutes

    ServerComponents -->|GraphQL Query| Woo
    APIRoutes -->|GraphQL Query| Woo

    ClientComponents --> Context
    Context -->|Persist| LocalStorage

    APIRoutes -->|Checkout| WhatsApp

    Woo -->|Product Data| ServerComponents
    Vercel -->|Static Assets| Browser
    Images -->|Optimized Images| Browser

    style ServerComponents fill:#4CAF50
    style ClientComponents fill:#2196F3
    style APIRoutes fill:#FF9800
    style LocalStorage fill:#9C27B0
    style Woo fill:#00BCD4
```

---

## Diagrama de Clases

### Clases Principales del Sistema

```mermaid
classDiagram
    %% Entidades del Dominio
    class Product {
        +string id
        +string databaseId
        +string name
        +string slug
        +string price
        +string regularPrice
        +string salePrice
        +StockStatus stockStatus
        +ProductImage image
        +ProductAttribute[] attributes
        +ProductVariation[] variations
        +getDescription()
        +getPrice()
        +isInStock()
        +hasVariations()
    }

    class ProductVariation {
        +string id
        +string databaseId
        +string name
        +string price
        +StockStatus stockStatus
        +ProductAttribute[] attributes
        +getPrice()
        +isInStock()
    }

    class ProductImage {
        +string sourceUrl
        +string altText
        +number width
        +number height
    }

    class ProductAttribute {
        +string id
        +string name
        +string value
        +string[] options
    }

    class CartItem {
        +string id
        +number quantity
        +ProductSummary product
        +getTotal()
        +updateQuantity()
    }

    class Cart {
        +CartItem[] items
        +number totalItems
        +number subtotal
        +add()
        +remove()
        +update()
        +clear()
        +getSubtotal()
    }

    class CartContext {
        +CartState state
        +addToCart()
        +updateQuantity()
        +removeItem()
        +clearCart()
        +openCart()
        +closeCart()
    }

    class UserSession {
        +string userId
        +RecentlyViewed[] viewedProducts
        +addToViewed()
        +getViewed()
    }

    %% Relaciones
    Product "1" *-- "0..*" ProductVariation : has
    Product "1" *-- "1" ProductImage : has
    Product "1" *-- "0..*" ProductAttribute : has

    Cart "1" *-- "0..*" CartItem : contains
    CartItem "0..*" -- "1" Product : references

    CartContext --> Cart : manages
    UserSession --> Product : tracks

    %% Estilos
    class Product {
        style PrimaryColor #101828
    }
    class CartContext {
        style PrimaryColor #2196F3
    }
```

### Clases de Componentes React

```mermaid
classDiagram
    %% Componentes de Página
    class Page {
        <<interface>>
        +metadata
        +params
        +searchParams
    }

    class HomePage extends Page {
        +getFeaturedProducts()
        +getCategories()
    }

    class ProductPage extends Page {
        +getProduct()
        +getMetadata()
    }

    class CategoryPage extends Page {
        +getCategory()
        +getProductsByCategory()
    }

    %% Componentes de UI
    class Component {
        <<React Component>>
        +props
        +state
        +render()
    }

    class WooNavbar extends Component {
        +categories
        +isSticky
        +isScrolled
    }

    class ProductCard extends Component {
        +product
        +onAddToCart
    }

    class CartDrawer extends Component {
        +isOpen
        +items
        +subtotal
        +onCheckout
    }

    %% Relaciones
    Component <|-- WooNavbar : extends
    Component <|-- ProductCard : extends
    Component <|-- CartDrawer : extends

    Page <|-- HomePage : extends
    Page <|-- ProductPage : extends
    Page <|-- CategoryPage : extends

    HomePage --> WooNavbar : uses
    ProductPage --> ProductCard : uses
    WooNavbar --> CartDrawer : uses
```

---

## Diagrama de Secuencia

### Secuencia 1: Agregar Producto al Carrito

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant UI as 🎨 UI (ProductPage)
    participant Cart as 🛒 CartProvider
    participant LS as 💾 localStorage
    participant Toast as 🔔 Toast Notification
    participant Drawer as 📱 CartDrawer

    User->>UI: Click "Agregar al Carrito"
    activate UI

    UI->>UI: Validar variación
    alt Sin variación seleccionada
        UI-->>User: Alert "Selecciona variación"
    else Variación válida
        UI->>Cart: addToCart(id, qty, productData)
        activate Cart

        Cart->>Cart: Verificar si existe
        alt Producto ya existe
            Cart->>Cart: Incrementar cantidad
        else Nuevo producto
            Cart->>Cart: Agregar nuevo item
        end

        Cart->>Cart: Recalcular totales
        Cart->>LS: Guardar en localStorage
        activate LS
        LS-->>Cart: Confirmación
        deactivate LS

        Cart->>Cart: Actualizar estado
        Cart-->>UI: Success = true
        deactivate Cart

        UI->>Toast: Mostrar notificación
        activate Toast
        Toast-->>User: "Producto agregado"
        deactivate Toast

        UI->>Drawer: Abrir drawer
        activate Drawer
        Drawer-->>User: Mostrar carrito
        deactivate Drawer
    end

    deactivate UI
```

### Secuencia 2: Checkout por WhatsApp

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant Cart as 🛒 CartDrawer
    participant Service as 🔧 WhatsAppService
    participant API as 📱 WhatsApp API
    participant WA as 💬 WhatsApp App

    User->>Cart: Click "Finalizar Compra"
    activate Cart

    Cart->>Cart: Obtener items
    Cart->>Cart: Calcular subtotal

    alt Carrito vacío
        Cart-->>User: Error "Carrito vacío"
    else Carrito con items
        Cart->>Service: generateMessage(items, total)
        activate Service

        Service->>Service: Formatear productos
        Service->>Service: Calcular total
        Service->>Service: Generar texto del mensaje

        Service-->>Cart: message text
        deactivate Service

        Cart->>Service: createWhatsAppURL(message)
        activate Service
        Service->>Service: Codificar URL
        Service->>API: Generar enlace wa.me
        activate API
        API-->>Service: URL
        deactivate API
        Service-->>Cart: whatsapp:// URL
        deactivate Service

        Cart->>WA: window.location.href = URL
        activate WA
        WA-->>User: Abrir WhatsApp con mensaje
        deactivate WA

        Cart->>Cart: Limpiar carrito
        Cart->>Cart: Cerrar drawer
    end

    deactivate Cart
```

### Secuencia 3: Búsqueda AJAX

```mermaid
sequenceDiagram
    actor User as 👤 Usuario
    participant Search as 🔍 SearchInput
    participant Debouncer as ⏱️ DebounceTimer
    participant API as 🌐 /api/search
    participant Woo as 🛍️ WooCommerce API
    participant Results as 📋 ResultsDropdown

    User->>Search: Escribir "perf"
    activate Search

    Search->>Search: Actualizar estado
    Search->>Debouncer: Iniciar timer (300ms)
    activate Debouncer

    User->>Search: Escribir "perfu"
    Search->>Debouncer: Reiniciar timer
    Debouncer->>Debouncer: Cancelar anterior
    Debouncer->>Debouncer: Iniciar nuevo timer

    Debouncer->>Search: Timer completado
    deactivate Debouncer

    Search->>API: GET /api/search?q=perfu
    activate API

    API->>Woo: GraphQL Query
    activate Woo
    Woo-->>API: Productos
    deactivate Woo

    API->>API: Formatear precios CLP
    API->>API: Limitar a 8 resultados
    API-->>Search: JSON response
    deactivate API

    Search->>Results: Actualizar resultados
    activate Results
    Results-->>User: Mostrar dropdown
    deactivate Results

    User->>Results: Click producto
    Results->>Search: Cerrar dropdown
    Results-->>User: Navegar a /product/slug

    deactivate Search
```

---

## Diagrama de Entidad-Relación

### Modelo de Datos

```mermaid
erDiagram
    %% Productos
    PRODUCT {
        string id PK
        string databaseId UK
        string name
        string slug
        string description
        string shortDescription
        string price
        string regularPrice
        string salePrice
        string stockStatus
        datetime createdAt
        datetime updatedAt
    }

    %% Imágenes de Producto
    PRODUCT_IMAGE {
        string id PK
        string productId FK
        string sourceUrl
        string altText
        int width
        int height
        string position
    }

    %% Variaciones de Producto
    PRODUCT_VARIATION {
        string id PK
        string productId FK
        string name
        string price
        string stockStatus
        int stockQuantity
        datetime createdAt
    }

    %% Atributos de Producto
    PRODUCT_ATTRIBUTE {
        string id PK
        string productId FK
        string name
        string value
        string type
    }

    %% Atributos de Variación
    VARIATION_ATTRIBUTE {
        string id PK
        string variationId FK
        string name
        string value
    }

    %% Categorías
    CATEGORY {
        string id PK
        string name
        string slug
        string description
        string image
        int displayOrder
    }

    %% Productos en Categoría
    PRODUCT_CATEGORY {
        string productId FK
        string categoryId FK
        datetime createdAt
    }

    %% Carrito (localStorage)
    CART {
        string id PK
        datetime createdAt
        datetime updatedAt
        string sessionId
    }

    %% Items del Carrito
    CART_ITEM {
        string id PK
        string cartId FK
        string productId FK
        int quantity
        string price
        datetime createdAt
    }

    %% Productos Vistos (localStorage)
    RECENTLY_VIEWED {
        string id PK
        string productId FK
        datetime viewedAt
        string sessionId
    }

    %% Relaciones
    PRODUCT ||--o{ PRODUCT_IMAGE : has
    PRODUCT ||--o{ PRODUCT_VARIATION : has
    PRODUCT ||--o{ PRODUCT_ATTRIBUTE : has
    PRODUCT_VARIATION ||--o{ VARIATION_ATTRIBUTE : has
    PRODUCT }o--o{ CATEGORY : belongs_to
    PRODUCT }o--o{ CART_ITEM : in_cart
    PRODUCT }o--o{ RECENTLY_VIEWED : viewed
    CART ||--o{ CART_ITEM : contains
```

---

## Diagrama de Estados

### Estado del Carrito

```mermaid
stateDiagram-v2
    [*] --> Empty: Inicial

    Empty --> AddingItems: Agregar producto
    AddingItems --> AddingItems: Agregar más productos
    AddingItems --> UpdatingQuantity: Cambiar cantidad
    AddingItems --> RemovingItems: Eliminar producto

    UpdatingQuantity --> AddingItems: Confirmar
    UpdatingQuantity --> Empty: Eliminar todos
    UpdatingQuantity --> AddingItems: Cancelar

    RemovingItems --> AddingItems: Confirmar
    RemovingItems --> Empty: Eliminar todos

    AddingItems --> ReadyForCheckout: Producto agregado
    ReadyForCheckout --> AddingItems: Modificar carrito
    ReadyForCheckout --> CheckoutProcess: Iniciar checkout

    CheckoutProcess --> [*]: Completar (WhatsApp)
    CheckoutProcess --> ReadyForCheckout: Cancelar

    AddingItems --> Empty: Limpiar carrito
    ReadyForCheckout --> Empty: Limpiar carrito

    note right of Empty
        Carrito vacío
        localStorage = {}
        totalItems = 0
    end note

    note right of AddingItems
        Productos en carrito
        items.length > 0
        subtotal > 0
    end note

    note right of ReadyForCheckout
        Listo para checkout
        items.length > 0
        validado
    end note

    note right of CheckoutProcess
        Proceso de checkout
        Generar mensaje
        Abrir WhatsApp
    end note
```

### Estado de Productos

```mermaid
stateDiagram-v2
    [*] --> Loading: Fetch iniciado

    Loading --> Loaded: Éxito
    Loading --> Error: Fallo

    Loaded --> Updating: Actualizar
    Loaded --> Deleted: Eliminar

    Error --> Loading: Reintentar
    Error --> [*]: Abortar

    Updating --> Loaded: Éxito
    Updating --> Error: Fallo

    Deleted --> [*]: Completado

    note right of Loading
        Loading...
        Mostrar skeleton
    end note

    note right of Loaded
        Producto cargado
        Mostrar datos
    end note

    note right of Error
        Error
        Mostrar mensaje
        Reintentar
    end note
```

---

## Diagrama de Componentes

### Jerarquía de Componentes React

```mermaid
graph TB
    subgraph "App Root"
        Root[Root Layout]
    end

    subgraph "Layout Components"
        Navbar[WooNavbar]
        Footer[FooterCustom]
    end

    subgraph "Pages"
        HomePage[HomePage]
        ProductPage[ProductPage]
        CategoryPage[CategoryPage]
        SearchPage[SearchPage]
        CartPage[CartPage]
        CheckoutPage[CheckoutPage]
    end

    subgraph "Product Components"
        ProductCard[ProductCard]
        ProductDesc[ProductDescriptionWoo]
        ProductGrid[ProductGrid]
        RecentlyViewed[RecentlyViewedProducts]
    end

    subgraph "Cart Components"
        CartIcon[CartIcon]
        CartDrawer[CartDrawer]
        CartItem[CartItemComponent]
    end

    subgraph "UI Components"
        BannerCarousel[BannerCarousel]
        CategoryCard[CategoryCard]
        SearchBar[WooSearch]
        CategoryDropdown[CategoryDropdown]
    end

    subgraph "Providers"
        CartProvider[CartProvider]
        RecentlyViewedProvider[RecentlyViewedProvider]
    end

    %% Conexiones
    Root --> Navbar
    Root --> Footer
    Root --> HomePage

    Navbar --> SearchBar
    Navbar --> CategoryDropdown
    Navbar --> CartIcon

    HomePage --> BannerCarousel
    HomePage --> ProductGrid
    HomePage --> CategoryCard
    HomePage --> RecentlyViewed

    ProductPage --> ProductDesc
    ProductPage --> RecentlyViewed

    CategoryPage --> ProductGrid

    ProductGrid --> ProductCard

    CartDrawer --> CartItem

    %% Providers envuelven la app
    CartProvider -.-> Navbar
    CartProvider -.-> CartDrawer
    RecentlyViewedProvider -.-> RecentlyViewed

    %% Estilos
    classDef layout fill:#4CAF50,stroke:#2E7D32,color:#fff
    classDef page fill:#2196F3,stroke:#1565C0,color:#fff
    classDef component fill:#FF9800,stroke:#E65100,color:#fff
    classDef provider fill:#9C27B0,stroke:#6A1B9A,color:#fff

    class Navbar,Footer layout
    class HomePage,ProductPage,CategoryPage page
    class ProductCard,CartDrawer,BannerCarousel component
    class CartProvider,RecentlyViewedProvider provider
```

---

## Patrones de Diseño

### 1. Provider Pattern

**Uso**: Estado global del carrito y productos vistos

```typescript
// providers/CartProvider.tsx
export function CartProvider({ children }) {
  const [state, setState] = useState(initialState);

  const addToCart = async (id, quantity, product) => {
    // Lógica del carrito
  };

  return (
    <CartContext.Provider value={{ state, addToCart, ... }}>
      {children}
    </CartContext.Provider>
  );
}

// Uso en componentes
function Component() {
  const { addToCart } = useCart();
  // ...
}
```

### 2. Compound Component Pattern

**Uso**: Componentes con sub-componentes relacionados

```typescript
// Componente compuesto
export function Card({ children }) {
  return <div className="card">{children}</div>;
}

Card.Header = function Header({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function Body({ children }) {
  return <div className="card-body">{children}</div>;
};

// Uso
<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
</Card>
```

### 3. Container/Presenter Pattern

**Uso**: Separación de lógica y presentación

```typescript
// Container - maneja lógica
export function ProductContainer() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct().then(data => {
      setProduct(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ProductSkeleton />;
  return <ProductView product={product} />;
}

// Presenter - solo renderiza
export function ProductView({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.price}</p>
    </div>
  );
}
```

### 4. Custom Hook Pattern

**Uso**: Lógica reutilizable

```typescript
// hooks/useCart.ts
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// hooks/useRecentlyViewed.ts
export function useRecentlyViewed() {
  const [viewed, setViewed] = useState([]);

  const addViewed = (product) => {
    setViewed(prev => [product, ...prev].slice(0, 10));
  };

  return { viewed, addViewed };
}
```

### 5. Higher-Order Component (HOC) Pattern

**Uso**: withLoading, withErrorBoundary

```typescript
export function withLoading<P>(
  Component: React.ComponentType<P>
) {
  return (props: P & { loading?: boolean }) => {
    if (props.loading) {
      return <LoadingSkeleton />;
    }
    return <Component {...props} />;
  };
}

// Uso
const ProductCardWithLoading = withLoading(ProductCard);
```

### 6. Render Props Pattern

**Uso**: Componentes que necesitan flexibilidad en el renderizado

```typescript
export function DataFetcher({ render, url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url).then(setData);
  }, [url]);

  return render(data);
}

// Uso
<DataFetcher
  url="/api/products"
  render={(data) => <ProductGrid products={data} />}
/>
```

---

## Flujo de Datos

### Flujo de Datos Unidireccional

```mermaid
graph LR
    A[User Action] --> B[Event Handler]
    B --> C[State Update]
    C --> D[Re-render]
    D --> E[UI Update]

    style A fill:#E3F2FD
    style B fill:#BBDEFB
    style C fill:#90CAF9
    style D fill:#64B5F6
    style E fill:#42A5F5
```

### Flujo de Datos en el Carrito

```mermaid
graph TB
    A[Usuario Click] --> B{Validación}
    B -->|Error| C[Mostrar Error]
    B -->|OK| D[CartContext]
    D --> E[Actualizar Estado]
    E --> F[localStorage]
    F --> G[Confirmación]
    G --> H[Re-render UI]
    H --> I[CartDrawer Update]
    I --> J[CartIcon Update]
    J --> K[Toast Notification]

    style A fill:#E8F5E9
    style D fill:#C8E6C9
    style F fill:#A5D6A7
    style H fill:#81C784
    style K fill:#66BB6A
```

---

## Referencias

- [Next.js 15 Architecture](https://nextjs.org/docs/app/building-your-application/architecture)
- [React Patterns](https://reactpatterns.com/)
- [Mermaid Diagrams](https://mermaid.js.org/)
- [JAMstack Architecture](https://jamstack.org/)

**Fuentes consultadas**:
- [AI Architecture Capabilities - CSDN](https://blog.csdn.net/qq_38196449/article/details/157059998)
- [Next.js Markdown & Mermaid - CSDN](https://m.blog.csdn.net/gitblog_00786/article/details/152356939)
- [Your Next Store Architecture - CSDN](https://m.blog.csdn.net/gitblog_00161/article/details/152243773)

---

**Versión**: 1.0.0
**Última actualización**: Marzo 2026
**Autor**: Pinneacle Perfumería Tech Team

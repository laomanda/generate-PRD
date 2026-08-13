import { AppType } from '../types';

export interface AppTypeSpec {
  name: string;
  summary: string;
  problemStatement: string;
  goals: string[];
  targetUsers: { role: string; need: string }[];
  inScope: string[];
  outOfScope: string[];
  functionalRequirements: { feature: string; description: string; userStory: string; acceptanceCriteria: string[] }[];
  tables: {
    name: string;
    description: string;
    columns: { name: string; type: string; nullable: boolean; defaultVal?: string; key?: 'PK' | 'FK' | 'UNIQUE'; description: string }[];
  }[];
  mermaidRelationships: string[];
  userFlow: string[];
  kpis: string[];
}

export const APP_TYPE_SPECS: Record<AppType, AppTypeSpec> = {
  saas: {
    name: 'SaaS Multi-Tenant Platform',
    summary: 'Cloud-based multi-tenant software-as-a-service platform with subscription management, team workspaces, role-based access control, and API key management.',
    problemStatement: 'Modern businesses waste hundreds of engineering hours reinventing user authentication, subscription billing, organization management, and API access control for every new product.',
    goals: [
      'Provide self-service workspace provisioning for teams.',
      'Achieve 99.9% uptime SLA with automated subscription management.',
      'Deliver seamless onboarding experience with instant team invite workflows.',
    ],
    targetUsers: [
      { role: 'Workspace Owner / Admin', need: 'Manage team billing, seat allocations, member roles, and security audit logs.' },
      { role: 'Team Member', need: 'Collaborate within shared workspace resources without administrative overhead.' },
      { role: 'API Developer', need: 'Secure API key generation, rate limit monitoring, and webhook integration.' },
    ],
    inScope: [
      'Multi-tenant workspace isolation & team member invitations.',
      'Tiered subscription management & usage tracking.',
      'API Key generation and rate-limited HTTP access.',
      'Audit log auditing for administrative actions.',
    ],
    outOfScope: [
      'Legacy on-premise hardware installer packages.',
      'Manual invoice mailing & physical check processing.',
    ],
    functionalRequirements: [
      {
        feature: 'Authentication & Workspace Onboarding',
        description: 'Users can register, verify email, and automatically create or accept invites to team workspaces.',
        userStory: 'As a new user, I want to sign up and invite 3 team members so we can collaborate immediately.',
        acceptanceCriteria: [
          'Email validation must enforce valid RFC formats.',
          'Password strength meter requires minimum 8 characters with numbers and symbols.',
          'Workspace slug is automatically sanitized and verified for uniqueness.',
        ],
      },
      {
        feature: 'Role-Based Access Control (RBAC)',
        description: 'Enforces permissions across Admin, Member, and Viewer roles within workspaces.',
        userStory: 'As an Owner, I want to grant Read-Only access to contractors so they cannot alter billing settings.',
        acceptanceCriteria: [
          'Admin roles can invite, promote, or remove workspace members.',
          'Member roles can read and write shared project resources.',
          'Viewer roles cannot access billing settings or API key management.',
        ],
      },
      {
        feature: 'Subscription & Tiered Quota Tracking',
        description: 'Monitors resource usage against active subscription tier quotas.',
        userStory: 'As a system, I want to block API requests when a workspace exceeds its monthly tier threshold.',
        acceptanceCriteria: [
          'Usage counter increments synchronously on resource creation.',
          'Warning banner displays when quota reaches 85% capacity.',
          'HTTP 429 Too Many Requests returned upon quota breach.',
        ],
      },
    ],
    tables: [
      {
        name: 'users',
        description: 'Core user profile authentication records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Unique user identification number' },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Primary email address for login' },
          { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Bcrypt or Argon2 hashed password' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Display name of the user' },
          { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'URL to hosted profile image' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Registration timestamp' },
        ],
      },
      {
        name: 'workspaces',
        description: 'Multi-tenant organization boundary',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Workspace primary identifier' },
          { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Workspace name' },
          { name: 'slug', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'URL-safe workspace identifier' },
          { name: 'owner_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'plan_tier', type: 'VARCHAR(50)', nullable: false, defaultVal: "'free'", description: 'Active billing plan (free, pro, enterprise)' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
        ],
      },
      {
        name: 'workspace_members',
        description: 'Junction table mapping users to workspaces with RBAC roles',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Membership primary key' },
          { name: 'workspace_id', type: 'UUID', nullable: false, key: 'FK', description: 'References workspaces(id)' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'role', type: 'VARCHAR(30)', nullable: false, defaultVal: "'member'", description: 'Role (owner, admin, member, viewer)' },
          { name: 'joined_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Join timestamp' },
        ],
      },
      {
        name: 'api_keys',
        description: 'Developer API access keys with permissions and rate limit tracking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'API Key primary identifier' },
          { name: 'workspace_id', type: 'UUID', nullable: false, key: 'FK', description: 'References workspaces(id)' },
          { name: 'key_hash', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Hashed API token for verification' },
          { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Label for the key (e.g. Production Backend)' },
          { name: 'last_used_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: true, description: 'Timestamp of last authenticated request' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Key creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ WORKSPACES : owns',
      'WORKSPACES ||--o{ WORKSPACE_MEMBERS : contains',
      'WORKSPACES ||--o{ API_KEYS : issues',
    ],
    userFlow: [
      'User visits Landing Page -> Clicks Sign Up',
      'Fills Email/Password -> Verifies Email via OTP/Link',
      'Creates New Workspace (Name & Slug)',
      'Arrives at Workspace Dashboard -> Views Analytics & Quick Actions',
      'Invites Team Members via Email -> Members Accept & Join Workspace',
      'Generates API Key -> Integrates with External Service',
    ],
    kpis: ['Monthly Active Workspaces (MAW)', 'User Activation Rate (>65%)', 'API Error Rate (<0.05%)'],
  },

  'e-commerce': {
    name: 'Modern E-Commerce Storefront',
    summary: 'High-conversion online shopping platform featuring dynamic product catalog, inventory tracking, cart management, checkout workflow, and order fulfillment tracking.',
    problemStatement: 'E-commerce merchants struggle with slow page loads, complicated checkout flows, cart abandonment, and inventory sync errors across multiple devices.',
    goals: [
      'Achieve sub-500ms page load speed for product catalog pages.',
      'Reduce shopping cart abandonment rate below 30%.',
      'Provide real-time inventory updates during peak traffic events.',
    ],
    targetUsers: [
      { role: 'Customer / Buyer', need: 'Discover products effortlessly, search/filter items, and complete fast secure checkout.' },
      { role: 'Store Manager / Merchant', need: 'Manage product inventory, update prices, view order statuses, and process refunds.' },
    ],
    inScope: [
      'Interactive Product Catalog with search, categories, and faceted filtering.',
      'Persistent Shopping Cart & Guest/User Checkout flow.',
      'Order status tracking and fulfillment updates.',
      'Inventory quantity stock deduction on payment success.',
    ],
    outOfScope: [
      'In-person POS hardware terminal integration.',
      'Peer-to-peer auction bidding system.',
    ],
    functionalRequirements: [
      {
        feature: 'Product Search & Faceted Filtering',
        description: 'Instant search across product title, tags, category, and price range.',
        userStory: 'As a buyer, I want to filter products by category and price range so I can quickly find items within my budget.',
        acceptanceCriteria: [
          'Search results update within 150ms of input change.',
          'Filter counts update dynamically based on remaining available stock.',
          'Out-of-stock items display clear visual badge indicators.',
        ],
      },
      {
        feature: 'Cart & Checkout Pipeline',
        description: 'Manages items in cart with real-time tax, shipping, and total calculation.',
        userStory: 'As a customer, I want to enter my shipping details and complete payment seamlessly without losing cart items.',
        acceptanceCriteria: [
          'Cart state persists across page refreshes via browser local cache.',
          'Stock validation runs prior to payment gateway initialization.',
          'Order confirmation email fires instantly upon payment webhook payload receipt.',
        ],
      },
    ],
    tables: [
      {
        name: 'products',
        description: 'Core product item catalog entries',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Product primary identifier' },
          { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Product title name' },
          { name: 'slug', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'SEO friendly URL path' },
          { name: 'price', type: 'NUMERIC(10, 2)', nullable: false, description: 'Price in base currency' },
          { name: 'stock_quantity', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Available stock units' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Date added' },
        ],
      },
      {
        name: 'orders',
        description: 'Customer purchase transaction records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Order primary key' },
          { name: 'status', type: 'VARCHAR(50)', nullable: false, defaultVal: "'pending'", description: 'Order state (pending, paid, shipped, cancelled)' },
          { name: 'total_amount', type: 'NUMERIC(10, 2)', nullable: false, description: 'Final order total price' },
          { name: 'shipping_address', type: 'TEXT', nullable: false, description: 'Structured delivery address JSON/Text' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Order timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'PRODUCTS ||--o{ ORDERS : included_in',
    ],
    userFlow: [
      'Buyer browses Home / Catalog -> Searches for product keyword',
      'Views Product Details -> Selects variant & clicks "Add to Cart"',
      'Opens Cart Drawer -> Reviews item quantities & shipping estimate',
      'Proceeds to Checkout -> Enters Address & Selects Payment Method',
      'Completes Payment -> Redirects to Order Status & Summary Page',
    ],
    kpis: ['Checkout Conversion Rate (>4.2%)', 'Cart Abandonment Rate (<28%)', 'Page Load Time (<600ms)'],
  },

  dashboard: {
    name: 'Real-Time Analytics & Operations Dashboard',
    summary: 'Executive & operational metrics dashboard offering real-time data visualizers, customizable widget layouts, data grid export, and notification alerts.',
    problemStatement: 'Decision makers are overwhelmed by raw data streams scattered across disconnected tools, lacking a single unified dashboard to monitor KPIs in real time.',
    goals: [
      'Consolidate operational data streams into a unified real-time visual interface.',
      'Enable sub-second chart rendering for datasets up to 100,000 records.',
      'Support one-click data export to CSV/JSON format for audit reporting.',
    ],
    targetUsers: [
      { role: 'Executive / Operations Lead', need: 'Monitor high-level KPI trends, revenue graphs, and system health status.' },
      { role: 'Data Analyst', need: 'Filter metric dimensions, build custom reports, and export raw data tables.' },
    ],
    inScope: [
      'Interactive Chart Widgets (Line, Bar, Pie, Metric Cards).',
      'Customizable Date Range & Dimension Filters.',
      'Paginated Data Grid with sorting and CSV exporter.',
      'Real-time WebSocket or polling telemetry metrics.',
    ],
    outOfScope: [
      'Manual physical paper report print formatting.',
      'Direct machine-learning model training pipeline UI.',
    ],
    functionalRequirements: [
      {
        feature: 'Metric Visualization & Charting',
        description: 'Renders dynamic data series charts responsive to global time range filters.',
        userStory: 'As an executive, I want to filter sales data by "Last 30 Days" so I can track monthly growth curves.',
        acceptanceCriteria: [
          'Chart smooth transitions render within 200ms of filter change.',
          'Tooltips display exact date and quantitative values on cursor hover.',
          'Empty data states show clear helper messaging and reset filter actions.',
        ],
      },
    ],
    tables: [
      {
        name: 'analytics_events',
        description: 'Time-series telemetry metric event log',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Event record identifier' },
          { name: 'metric_name', type: 'VARCHAR(100)', nullable: false, description: 'Name of tracked metric' },
          { name: 'metric_value', type: 'NUMERIC(12, 4)', nullable: false, description: 'Numeric value payload' },
          { name: 'timestamp', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Event log timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'ANALYTICS_EVENTS ||--o{ METRIC_REPORTS : consolidates',
    ],
    userFlow: [
      'User logs into Dashboard -> Views Overview Metric Summary Cards',
      'Selects Date Range Picker (e.g., Last 7 Days)',
      'Charts & Data Grids refresh instantly with new series data',
      'Hovers over chart data points to inspect specific metric breakdowns',
      'Clicks "Export CSV" on Data Grid -> Downloads raw report file',
    ],
    kpis: ['Dashboard Render Latency (<300ms)', 'User Daily Engagement Time (>15 mins)', 'Export Generation Time (<1s)'],
  },

  mobile: {
    name: 'Mobile App Backend Service API',
    summary: 'Optimized REST/GraphQL API backend supporting push notifications, mobile auth tokens, offline sync capabilities, and low-latency payload responses.',
    problemStatement: 'Mobile applications require lightweight JSON responses, robust token refresh handling, and bandwidth-efficient media transfers under volatile network conditions.',
    goals: [
      'Keep API payload size under 15KB per endpoint response.',
      'Achieve sub-100ms API response latency for core endpoints.',
      'Support seamless background token refresh without user logouts.',
    ],
    targetUsers: [
      { role: 'Mobile App User (iOS / Android)', need: 'Fast responsive app experience with offline capability and instant push alerts.' },
      { role: 'Mobile Developer', need: 'Strict OpenAPI schemas, predictable error codes, and clear API docs.' },
    ],
    inScope: [
      'JWT / Refresh Token mobile auth flow.',
      'Push notification dispatch pipeline (FCM / APNS).',
      'Pagination with Cursor-based strategy for infinite scroll lists.',
      'Media upload presigned URL generation.',
    ],
    outOfScope: [
      'Desktop browser specific flash plugin fallbacks.',
    ],
    functionalRequirements: [
      {
        feature: 'Cursor Pagination for Mobile Feeds',
        description: 'Delivers infinite-scroll list items ordered by ID/timestamp cursors.',
        userStory: 'As a mobile app, I want to fetch 20 feed items at a time using cursors so scrolling is smooth.',
        acceptanceCriteria: [
          'API response includes `next_cursor` and `has_more` boolean keys.',
          'Response payloads contain strictly typed field fields without null clutter.',
        ],
      },
    ],
    tables: [
      {
        name: 'device_tokens',
        description: 'Mobile device push notification registration tokens',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Device registration primary key' },
          { name: 'push_token', type: 'TEXT', nullable: false, key: 'UNIQUE', description: 'FCM or APNS push token string' },
          { name: 'platform', type: 'VARCHAR(20)', nullable: false, description: 'Platform (ios, android)' },
          { name: 'last_active_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Last active ping' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ DEVICE_TOKENS : registers',
    ],
    userFlow: [
      'Mobile App launches -> Checks stored Refresh Token',
      'Sends Refresh Request -> Server validates & returns short-lived Access Token',
      'App requests Cursor Feed -> Renders list items in Native View',
      'User enables Push Notifications -> App sends FCM token to backend `/devices` endpoint',
    ],
    kpis: ['API Payload Size (<12KB)', 'P99 Latency (<120ms)', 'Push Delivery Rate (>98%)'],
  },

  api: {
    name: 'Developer REST / GraphQL API Platform',
    summary: 'Developer-centric API platform featuring strict versioning, OpenAPI specification docs, interactive sandbox explorer, rate-limiting, and webhook delivery.',
    problemStatement: 'Third-party developers struggle with poorly documented APIs, inconsistent error formats, and unannounced breaking changes.',
    goals: [
      'Provide 100% compliant OpenAPI 3.0 specs with interactive sandbox testing.',
      'Guarantee 0 unannounced breaking API changes via strict URI versioning.',
      'Achieve 99.99% webhook event delivery success rate with exponential backoff retries.',
    ],
    targetUsers: [
      { role: 'Third-Party Integration Engineer', need: 'Reliable API endpoints, clear sandbox testing tools, and predictable JSON payloads.' },
      { role: 'Developer Relations Manager', need: 'Monitor API endpoint traffic, error rate spikes, and developer registration.' },
    ],
    inScope: [
      'Bearer Token & OAuth2 client credentials authentication.',
      'Rate-limiting middleware (Token Bucket algorithm).',
      'Webhook subscription & event retry pipeline.',
      'Interactive Swagger / Redoc API sandbox documentation.',
    ],
    outOfScope: [
      'GUI drag-and-drop website page builder.',
    ],
    functionalRequirements: [
      {
        feature: 'Rate-Limiting & Header Feedback',
        description: 'Enforces request quotas per API key with standard HTTP rate limit headers.',
        userStory: 'As a third-party developer, I want to receive `X-RateLimit-Remaining` headers so I can pace my client requests.',
        acceptanceCriteria: [
          'Every API response includes `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.',
          'HTTP 429 payload includes standardized JSON RFC-7807 error format.',
        ],
      },
    ],
    tables: [
      {
        name: 'webhooks',
        description: 'Registered developer webhook event subscription endpoints',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Webhook record primary identifier' },
          { name: 'target_url', type: 'TEXT', nullable: false, description: 'HTTPS destination endpoint URL' },
          { name: 'secret_key', type: 'VARCHAR(255)', nullable: false, description: 'HMAC signature verification secret' },
          { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Active delivery flag' },
        ],
      },
    ],
    mermaidRelationships: [
      'DEVELOPERS ||--o{ WEBHOOKS : subscribes',
    ],
    userFlow: [
      'Developer registers on Developer Portal -> Obtains API Key & Webhook Secret',
      'Sends POST request to API Endpoint with `Authorization: Bearer <token>`',
      'Server processes payload -> Executes background worker -> Triggers Webhook to Developer Target URL',
      'Developer inspects Webhook Log History on portal dashboard',
    ],
    kpis: ['API Uptime (>99.95%)', 'Webhook Retry Delivery Rate (>99.9%)', 'Developer Time-to-First-200-OK (<5 mins)'],
  },

  custom: {
    name: 'Custom Web Application Solution',
    summary: 'Tailored high-performance web application designed around domain-specific user workflows, modular architecture, and deterministic state management.',
    problemStatement: 'Off-the-shelf software templates fail to meet unique business domain rules and require heavy customization that breeds technical debt.',
    goals: [
      'Deliver custom domain workflows aligned precisely with business operations.',
      'Maintain high modularity with zero tightly-coupled dependencies.',
      'Provide instant client-side state reactivity.',
    ],
    targetUsers: [
      { role: 'End User', need: 'Intuitive, fast, and reliable workflow execution without unnecessary UI friction.' },
      { role: 'Domain Administrator', need: 'Full control over system settings, data records, and operational logs.' },
    ],
    inScope: [
      'Tailored interactive user interfaces.',
      'Domain specific entity data management.',
      'Client-side state synchronization and local caching.',
    ],
    outOfScope: [
      'Generic uncustomized boilerplate templates.',
    ],
    functionalRequirements: [
      {
        feature: 'Custom Workflow Execution',
        description: 'Implements business logic rules specific to the application problem domain.',
        userStory: 'As a user, I want the system to guide me through step-by-step actions without data loss.',
        acceptanceCriteria: [
          'State updates immediately across active component subscribers.',
          'Input forms provide immediate validation error messages.',
        ],
      },
    ],
    tables: [
      {
        name: 'custom_records',
        description: 'Primary domain entity store',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Primary key identifier' },
          { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Entity title label' },
          { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ CUSTOM_RECORDS : owns',
    ],
    userFlow: [
      'User opens Application -> Renders Main Interactive Workspace',
      'Executes domain action -> State updates immediately in UI',
      'Saves workspace state -> Data persists locally in browser store',
    ],
    kpis: ['User Task Completion Rate (>95%)', 'State Reactivity Latency (<16ms)', 'System Error Rate (<0.01%)'],
  },
};

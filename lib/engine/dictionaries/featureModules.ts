/**
 * ============================================================================
 * FEATURE MODULES CONTENT BANK
 * ============================================================================
 * Each module represents a self-contained feature domain with:
 * - Database tables (with full column specs)
 * - Functional requirements (with user stories + acceptance criteria)
 * - User flow steps
 * - Problem statement fragments
 * - Goal fragments
 * - Security considerations
 * - API endpoint blueprints
 *
 * The Smart Composer (`composer.ts`) selects and merges these modules
 * based on user input (features[], description keywords).
 * Different feature selections = completely different documents.
 * ============================================================================
 */

export interface FeatureModuleTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    nullable: boolean;
    defaultVal?: string;
    key?: 'PK' | 'FK' | 'UNIQUE';
    description: string;
  }[];
}

export interface FeatureModuleRequirement {
  feature: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
}

export interface FeatureModule {
  id: string;
  name: string;
  keywords: string[];
  problemFragment: string;
  goals: string[];
  tables: FeatureModuleTable[];
  mermaidRelationships: string[];
  requirements: FeatureModuleRequirement[];
  userFlowSteps: string[];
  securityNotes: string[];
  apiEndpoints: string[];
  uiPages: string[];
}

export const FEATURE_MODULES: Record<string, FeatureModule> = {

  // ═══════════════════════════════════════════════════════════════════
  // 1. AUTHENTICATION & AUTHORIZATION
  // ═══════════════════════════════════════════════════════════════════
  'Authentication & Authorization': {
    id: 'auth',
    name: 'Authentication & Authorization',
    keywords: ['auth', 'login', 'register', 'signup', 'password', 'jwt', 'session', 'oauth', 'sso'],
    problemFragment: 'Users lack secure, frictionless authentication flows — leading to abandoned sign-ups, credential leaks, and unauthorized access to protected resources.',
    goals: [
      'Achieve sub-2s authentication round-trip latency including token issuance.',
      'Maintain zero plaintext password storage across all environments.',
      'Support multi-factor authentication (MFA) for high-security accounts.',
    ],
    tables: [
      {
        name: 'users',
        description: 'Core user identity and authentication records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Unique user identifier' },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Primary email for login and communication' },
          { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Argon2id or Bcrypt hashed password' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'User display name' },
          { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'URL to user profile image' },
          { name: 'email_verified_at', type: 'TIMESTAMP', nullable: true, description: 'Timestamp when email was verified' },
          { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Account active status flag' },
          { name: 'last_login_at', type: 'TIMESTAMP', nullable: true, description: 'Timestamp of last successful login' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Account creation timestamp' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Last profile update timestamp' },
        ],
      },
      {
        name: 'sessions',
        description: 'Active user login sessions with device tracking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Session identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'token_hash', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Hashed refresh token for session validation' },
          { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, description: 'Client IP address (IPv4/IPv6)' },
          { name: 'user_agent', type: 'TEXT', nullable: true, description: 'Browser/device user agent string' },
          { name: 'expires_at', type: 'TIMESTAMP', nullable: false, description: 'Session expiration timestamp' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Session start timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ SESSIONS : authenticates',
    ],
    requirements: [
      {
        feature: 'User Registration & Email Verification',
        description: 'New users register with email/password. System sends OTP or magic link for email verification before full account activation.',
        userStory: 'As a new user, I want to register with my email and verify it via a link so my account is securely activated.',
        acceptanceCriteria: [
          'Email format validated against RFC 5322 standard before submission.',
          'Password must be minimum 8 characters with at least 1 uppercase, 1 number, and 1 symbol.',
          'Verification link/OTP expires after 15 minutes.',
          'Duplicate email registration returns clear error message without exposing existing account details.',
        ],
      },
      {
        feature: 'Login & Session Management',
        description: 'Authenticated users receive JWT access tokens (short-lived) and refresh tokens (long-lived) stored as httpOnly cookies.',
        userStory: 'As a returning user, I want to log in securely and stay authenticated across browser tabs without re-entering credentials.',
        acceptanceCriteria: [
          'Access tokens expire within 15 minutes; refresh tokens within 7 days.',
          'Failed login attempts are rate-limited to 5 per minute per IP.',
          'Active sessions are visible in account settings with device/IP details.',
          'Users can revoke individual sessions from the settings page.',
        ],
      },
    ],
    userFlowSteps: [
      'User visits Registration Page → Fills email, password, full name',
      'System sends verification email → User clicks verify link',
      'Account activated → User redirected to Login Page',
      'User enters email/password → System validates credentials',
      'JWT access token issued → User lands on Dashboard',
    ],
    securityNotes: [
      'Passwords hashed with Argon2id (cost=12) or Bcrypt (rounds=12).',
      'Refresh tokens stored as httpOnly, Secure, SameSite=Strict cookies.',
      'Rate-limit login endpoint: max 5 attempts per minute per IP.',
      'Account lockout after 10 consecutive failed login attempts.',
    ],
    apiEndpoints: [
      'POST /api/auth/register — Create new user account',
      'POST /api/auth/login — Authenticate and issue tokens',
      'POST /api/auth/refresh — Refresh access token',
      'POST /api/auth/logout — Revoke session token',
      'GET /api/auth/verify?token=xxx — Verify email address',
    ],
    uiPages: ['Login Page', 'Registration Page', 'Email Verification Page', 'Account Settings (Sessions)'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 2. USER PROFILE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  'User Profile Management': {
    id: 'profile',
    name: 'User Profile Management',
    keywords: ['profile', 'account', 'settings', 'preferences', 'avatar', 'bio'],
    problemFragment: 'Users cannot personalize their accounts, manage preferences, or maintain an updated identity — reducing engagement and trust.',
    goals: [
      'Allow users to update profile information with instant UI feedback.',
      'Support avatar upload with automated image optimization and CDN delivery.',
    ],
    tables: [
      {
        name: 'user_profiles',
        description: 'Extended user profile data beyond authentication',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Profile record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'bio', type: 'TEXT', nullable: true, description: 'Short user biography (max 500 chars)' },
          { name: 'phone_number', type: 'VARCHAR(20)', nullable: true, description: 'Contact phone number' },
          { name: 'timezone', type: 'VARCHAR(50)', nullable: true, defaultVal: "'UTC'", description: 'User preferred timezone' },
          { name: 'language', type: 'VARCHAR(10)', nullable: true, defaultVal: "'en'", description: 'Preferred display language (ISO 639-1)' },
          { name: 'date_of_birth', type: 'DATE', nullable: true, description: 'User date of birth for age verification' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Last profile update timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--|| USER_PROFILES : has',
    ],
    requirements: [
      {
        feature: 'Profile Edit & Avatar Upload',
        description: 'Users can update display name, bio, timezone, language, and upload a profile photo that is automatically resized.',
        userStory: 'As a user, I want to update my profile picture and bio so my account reflects my identity.',
        acceptanceCriteria: [
          'Avatar accepts JPEG, PNG, WebP formats up to 5MB.',
          'Uploaded images are automatically resized to 256x256px and converted to WebP.',
          'Profile changes save optimistically with rollback on server error.',
          'Bio field enforces 500-character maximum with live counter.',
        ],
      },
    ],
    userFlowSteps: [
      'User navigates to Account Settings → Profile tab',
      'Edits bio, display name, timezone, language → Changes auto-save',
      'Clicks avatar upload → Selects image → Preview shown → Confirms upload',
    ],
    securityNotes: [
      'Sanitize all text inputs to prevent XSS injection.',
      'Validate file MIME type server-side before processing uploads.',
    ],
    apiEndpoints: [
      'GET /api/users/me — Fetch current user profile',
      'PATCH /api/users/me — Update profile fields',
      'POST /api/users/me/avatar — Upload profile avatar',
    ],
    uiPages: ['Profile Settings Page', 'Avatar Upload Modal'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 3. PAYMENT & BILLING
  // ═══════════════════════════════════════════════════════════════════
  'Payment & Billing': {
    id: 'payment',
    name: 'Payment & Billing',
    keywords: ['payment', 'billing', 'subscription', 'stripe', 'invoice', 'checkout', 'pricing', 'plan'],
    problemFragment: 'Revenue capture fails due to complex checkout friction, unclear pricing tiers, unhandled payment failures, and missing invoice records for compliance audits.',
    goals: [
      'Reduce payment checkout abandonment rate below 15% with streamlined 2-step payment flow.',
      'Support recurring subscription billing with automated invoice generation.',
      'Handle payment webhook failures with exponential backoff retry (up to 3 attempts).',
    ],
    tables: [
      {
        name: 'subscriptions',
        description: 'User or workspace subscription plans with billing cycle tracking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Subscription record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — subscription owner' },
          { name: 'plan_id', type: 'VARCHAR(50)', nullable: false, description: 'Plan tier identifier (free, pro, enterprise)' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'active'", description: 'Subscription state (active, canceled, past_due, trialing)' },
          { name: 'current_period_start', type: 'TIMESTAMP', nullable: false, description: 'Current billing period start date' },
          { name: 'current_period_end', type: 'TIMESTAMP', nullable: false, description: 'Current billing period end date' },
          { name: 'stripe_subscription_id', type: 'VARCHAR(255)', nullable: true, key: 'UNIQUE', description: 'External Stripe subscription reference ID' },
          { name: 'canceled_at', type: 'TIMESTAMP', nullable: true, description: 'Timestamp when subscription was canceled' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Subscription creation timestamp' },
        ],
      },
      {
        name: 'invoices',
        description: 'Payment transaction invoice records for compliance and receipt',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Invoice record identifier' },
          { name: 'subscription_id', type: 'UUID', nullable: false, key: 'FK', description: 'References subscriptions(id)' },
          { name: 'amount_cents', type: 'INTEGER', nullable: false, description: 'Invoice amount in smallest currency unit (cents)' },
          { name: 'currency', type: 'VARCHAR(3)', nullable: false, defaultVal: "'usd'", description: 'ISO 4217 currency code' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'pending'", description: 'Invoice state (pending, paid, failed, refunded)' },
          { name: 'stripe_invoice_id', type: 'VARCHAR(255)', nullable: true, key: 'UNIQUE', description: 'External Stripe invoice reference' },
          { name: 'paid_at', type: 'TIMESTAMP', nullable: true, description: 'Payment success timestamp' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Invoice creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ SUBSCRIPTIONS : subscribes',
      'SUBSCRIPTIONS ||--o{ INVOICES : generates',
    ],
    requirements: [
      {
        feature: 'Subscription Plan Selection & Checkout',
        description: 'Users browse available pricing tiers, select a plan, and complete payment via integrated payment gateway (Stripe/Midtrans).',
        userStory: 'As a user, I want to upgrade to Pro plan and pay with my credit card so I can unlock premium features immediately.',
        acceptanceCriteria: [
          'Pricing page displays all tiers with feature comparison table.',
          'Checkout redirects to Stripe Checkout or renders embedded payment form.',
          'Successful payment activates subscription within 3 seconds of webhook receipt.',
          'Failed payment displays clear error with retry option.',
        ],
      },
      {
        feature: 'Invoice History & Receipt Download',
        description: 'Users can view all past invoices in billing settings and download PDF receipts for each transaction.',
        userStory: 'As an account admin, I want to download invoice PDFs so I can submit expense reports to my finance team.',
        acceptanceCriteria: [
          'Invoice list shows date, amount, status, and download action.',
          'PDF receipts include company name, invoice number, tax details, and line items.',
          'Invoices paginated with 20 items per page.',
        ],
      },
    ],
    userFlowSteps: [
      'User navigates to Pricing Page → Compares plan tiers',
      'Selects desired plan → Clicks "Upgrade" or "Subscribe"',
      'Redirected to Checkout → Enters payment details',
      'Payment processed → Webhook confirms → Subscription activated',
      'User views invoice in Billing Settings → Downloads PDF receipt',
    ],
    securityNotes: [
      'Never store raw credit card numbers — use tokenized payment gateway.',
      'Validate webhook signatures using Stripe signing secret.',
      'Log all billing events for financial audit trail compliance.',
    ],
    apiEndpoints: [
      'GET /api/billing/plans — List available subscription tiers',
      'POST /api/billing/checkout — Create checkout session',
      'POST /api/billing/webhook — Handle payment gateway webhook',
      'GET /api/billing/invoices — List user invoices',
      'GET /api/billing/invoices/:id/pdf — Download invoice PDF',
    ],
    uiPages: ['Pricing Page', 'Checkout Page', 'Billing Settings', 'Invoice Detail Modal'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 4. NOTIFICATION SYSTEM
  // ═══════════════════════════════════════════════════════════════════
  'Notification System': {
    id: 'notification',
    name: 'Notification System',
    keywords: ['notification', 'alert', 'push', 'email', 'bell', 'inbox', 'real-time', 'notify'],
    problemFragment: 'Critical system events, user actions, and status changes go unnoticed — causing delayed responses, missed deadlines, and poor user engagement.',
    goals: [
      'Deliver in-app notifications within 500ms of triggering event.',
      'Support notification preferences allowing users to opt-in/out per channel (in-app, email, push).',
      'Achieve >98% email delivery rate with properly configured SPF/DKIM/DMARC records.',
    ],
    tables: [
      {
        name: 'notifications',
        description: 'In-app notification log with read/unread tracking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Notification record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — notification recipient' },
          { name: 'type', type: 'VARCHAR(50)', nullable: false, description: 'Notification category (system, billing, social, security)' },
          { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Notification headline text' },
          { name: 'body', type: 'TEXT', nullable: false, description: 'Notification detail message body' },
          { name: 'action_url', type: 'TEXT', nullable: true, description: 'Deep link URL for notification click-through' },
          { name: 'is_read', type: 'BOOLEAN', nullable: false, defaultVal: 'false', description: 'Read/unread status flag' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Notification creation timestamp' },
        ],
      },
      {
        name: 'notification_preferences',
        description: 'User-specific notification channel opt-in/opt-out settings',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Preference record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'channel', type: 'VARCHAR(20)', nullable: false, description: 'Notification channel (in_app, email, push)' },
          { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'Notification category filter' },
          { name: 'is_enabled', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Opt-in/opt-out toggle' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ NOTIFICATIONS : receives',
      'USERS ||--o{ NOTIFICATION_PREFERENCES : configures',
    ],
    requirements: [
      {
        feature: 'In-App Notification Center',
        description: 'Bell icon in navbar shows unread count badge. Clicking opens a dropdown listing recent notifications with mark-as-read and mark-all-read actions.',
        userStory: 'As a user, I want to see a notification bell with unread count so I never miss important system updates.',
        acceptanceCriteria: [
          'Unread badge displays count up to 99+.',
          'Notification dropdown shows last 20 notifications sorted by newest first.',
          'Clicking a notification marks it as read and navigates to action_url.',
          'Mark All Read button clears all unread badges in one action.',
        ],
      },
    ],
    userFlowSteps: [
      'System event triggers → Notification record created in database',
      'User sees unread badge count update in real-time on bell icon',
      'User clicks bell → Notification dropdown expands with recent items',
      'User clicks notification → Marked as read → Navigates to relevant page',
    ],
    securityNotes: [
      'Notifications scoped to authenticated user — no cross-user data leakage.',
      'Sanitize notification body content to prevent stored XSS.',
    ],
    apiEndpoints: [
      'GET /api/notifications — List user notifications (paginated)',
      'PATCH /api/notifications/:id/read — Mark single notification as read',
      'PATCH /api/notifications/read-all — Mark all notifications as read',
      'GET /api/notifications/preferences — Get user notification preferences',
      'PUT /api/notifications/preferences — Update notification preferences',
    ],
    uiPages: ['Notification Dropdown', 'Notification Preferences Page'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 5. FILE UPLOAD & MEDIA STORAGE
  // ═══════════════════════════════════════════════════════════════════
  'File Upload & Media': {
    id: 'file-upload',
    name: 'File Upload & Media Storage',
    keywords: ['upload', 'file', 'media', 'image', 'storage', 's3', 'cdn', 'attachment', 'document'],
    problemFragment: 'File uploads are unreliable, lack validation, consume excessive server memory with synchronous processing, and have no organized media library for asset reuse.',
    goals: [
      'Support direct-to-cloud presigned URL uploads bypassing server memory limits.',
      'Enforce strict file type and size validation (server-side MIME check).',
      'Auto-generate responsive image variants (thumbnail, medium, original) on upload.',
    ],
    tables: [
      {
        name: 'media_files',
        description: 'Uploaded media/file asset registry with metadata',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Media file identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — file uploader' },
          { name: 'filename', type: 'VARCHAR(255)', nullable: false, description: 'Original file name' },
          { name: 'mime_type', type: 'VARCHAR(100)', nullable: false, description: 'File MIME type (image/png, application/pdf, etc.)' },
          { name: 'file_size_bytes', type: 'BIGINT', nullable: false, description: 'File size in bytes' },
          { name: 'storage_path', type: 'TEXT', nullable: false, description: 'Cloud storage bucket path' },
          { name: 'public_url', type: 'TEXT', nullable: false, description: 'CDN-accessible public URL' },
          { name: 'thumbnail_url', type: 'TEXT', nullable: true, description: 'Auto-generated thumbnail URL (images only)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Upload timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ MEDIA_FILES : uploads',
    ],
    requirements: [
      {
        feature: 'File Upload with Progress & Validation',
        description: 'Drag-and-drop or click-to-upload interface with real-time progress bar, file type validation, and automatic thumbnail generation for images.',
        userStory: 'As a user, I want to drag files into the upload zone and see progress so I know when my upload completes.',
        acceptanceCriteria: [
          'Upload zone accepts drag-and-drop and click-to-browse.',
          'Progress bar shows real-time percentage during upload.',
          'File type whitelist enforced: JPEG, PNG, WebP, PDF, CSV (configurable).',
          'Maximum single file size: 50MB. Rejects larger files with clear error.',
          'Image uploads auto-generate thumbnail (200x200) within 5 seconds.',
        ],
      },
    ],
    userFlowSteps: [
      'User clicks upload button or drags files into drop zone',
      'Client validates file type and size → Requests presigned upload URL from server',
      'File uploads directly to cloud storage → Progress bar updates in real-time',
      'Server confirms upload → Generates thumbnail (if image) → Stores media record',
      'File appears in media library with preview, download, and delete options',
    ],
    securityNotes: [
      'Validate MIME type server-side — do not trust client Content-Type header.',
      'Scan uploads for malware using ClamAV or equivalent before serving.',
      'Use presigned URLs with short expiration (5 minutes) for upload authorization.',
    ],
    apiEndpoints: [
      'POST /api/media/presign — Generate presigned upload URL',
      'POST /api/media/confirm — Confirm upload and create media record',
      'GET /api/media — List user media files (paginated)',
      'DELETE /api/media/:id — Delete media file and cloud storage object',
    ],
    uiPages: ['Media Library Page', 'Upload Modal/Dropzone', 'File Preview Lightbox'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 6. ANALYTICS & REPORTING DASHBOARD
  // ═══════════════════════════════════════════════════════════════════
  'Analytics & Reporting': {
    id: 'analytics',
    name: 'Analytics & Reporting Dashboard',
    keywords: ['analytics', 'dashboard', 'report', 'chart', 'metrics', 'kpi', 'statistics', 'graph', 'insight'],
    problemFragment: 'Key business metrics are scattered across multiple tools, lack real-time visibility, and require manual spreadsheet aggregation — delaying data-driven decisions.',
    goals: [
      'Render interactive dashboard charts within 300ms of page load.',
      'Support date range filtering with preset shortcuts (Today, 7D, 30D, 90D, 1Y).',
      'Enable one-click CSV/JSON export for any data table or chart dataset.',
    ],
    tables: [
      {
        name: 'analytics_events',
        description: 'Time-series event tracking for metrics and KPI aggregation',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Event record identifier' },
          { name: 'event_name', type: 'VARCHAR(100)', nullable: false, description: 'Event type identifier (page_view, purchase, signup, etc.)' },
          { name: 'event_value', type: 'NUMERIC(12,4)', nullable: true, description: 'Numeric metric value (revenue, count, duration)' },
          { name: 'dimensions', type: 'JSONB', nullable: true, description: 'Key-value dimension attributes for filtering and grouping' },
          { name: 'user_id', type: 'UUID', nullable: true, key: 'FK', description: 'References users(id) — event source user (nullable for anonymous)' },
          { name: 'session_id', type: 'VARCHAR(100)', nullable: true, description: 'Session grouping identifier' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Event timestamp' },
        ],
      },
      {
        name: 'metric_snapshots',
        description: 'Pre-aggregated daily/hourly metric snapshots for fast dashboard queries',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Snapshot identifier' },
          { name: 'metric_name', type: 'VARCHAR(100)', nullable: false, description: 'Metric key (total_users, revenue, active_sessions)' },
          { name: 'metric_value', type: 'NUMERIC(12,4)', nullable: false, description: 'Aggregated numeric value' },
          { name: 'granularity', type: 'VARCHAR(10)', nullable: false, description: 'Aggregation window (hourly, daily, weekly)' },
          { name: 'snapshot_date', type: 'DATE', nullable: false, description: 'Snapshot date bucket' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Record creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ ANALYTICS_EVENTS : generates',
      'ANALYTICS_EVENTS }o--|| METRIC_SNAPSHOTS : aggregates_into',
    ],
    requirements: [
      {
        feature: 'Interactive Dashboard with Date Filtering',
        description: 'Real-time dashboard with line/bar/pie charts that respond to global date range selector. Supports drill-down into specific metrics.',
        userStory: 'As a product owner, I want to filter analytics by "Last 30 Days" and see revenue trends on a line chart so I can track monthly growth.',
        acceptanceCriteria: [
          'Charts render within 300ms of page load with cached snapshot data.',
          'Date range picker supports presets: Today, Last 7D, Last 30D, Last 90D, Custom Range.',
          'Hover tooltips show exact date and value for each data point.',
          'Empty states display clear messaging with "No data for selected range" helper text.',
        ],
      },
      {
        feature: 'Data Export (CSV/JSON)',
        description: 'Any data table or chart dataset can be exported as CSV or JSON file via download button.',
        userStory: 'As a data analyst, I want to export user activity data as CSV so I can analyze it in Excel.',
        acceptanceCriteria: [
          'Export button visible on every data table and chart widget.',
          'CSV export includes column headers matching table display.',
          'Export respects current filters and date range selection.',
          'File generates client-side within 2 seconds for datasets up to 10,000 rows.',
        ],
      },
    ],
    userFlowSteps: [
      'User navigates to Analytics Dashboard → Summary cards load (Total Users, Revenue, Active)',
      'Selects date range from picker → All charts and tables re-render with filtered data',
      'Hovers over chart → Tooltip shows exact metric value for that date',
      'Clicks "Export CSV" on data table → Downloads filtered dataset as .csv file',
    ],
    securityNotes: [
      'Analytics data scoped to user/organization permissions — no cross-tenant leakage.',
      'Rate-limit analytics query endpoints to prevent data scraping.',
    ],
    apiEndpoints: [
      'GET /api/analytics/summary — Dashboard summary metric cards',
      'GET /api/analytics/timeseries?metric=xxx&range=30d — Time-series chart data',
      'GET /api/analytics/export?format=csv — Export filtered data',
    ],
    uiPages: ['Analytics Dashboard', 'Metric Detail Page', 'Export Download Modal'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 7. REAL-TIME CHAT / MESSAGING
  // ═══════════════════════════════════════════════════════════════════
  'Real-time Chat': {
    id: 'chat',
    name: 'Real-time Chat & Messaging',
    keywords: ['chat', 'messaging', 'real-time', 'websocket', 'conversation', 'direct message', 'dm'],
    problemFragment: 'Team communication relies on disconnected external tools — fragmenting context, losing project-specific conversations, and increasing context-switching overhead.',
    goals: [
      'Deliver messages within 100ms of send action using WebSocket connections.',
      'Support direct messages (1:1) and group channels with unlimited message history.',
      'Display real-time typing indicators and online/offline presence status.',
    ],
    tables: [
      {
        name: 'chat_channels',
        description: 'Chat rooms and direct message channel definitions',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Channel identifier' },
          { name: 'name', type: 'VARCHAR(100)', nullable: true, description: 'Channel display name (null for DMs)' },
          { name: 'type', type: 'VARCHAR(20)', nullable: false, defaultVal: "'group'", description: 'Channel type (group, direct)' },
          { name: 'created_by', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — channel creator' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Channel creation timestamp' },
        ],
      },
      {
        name: 'chat_messages',
        description: 'Individual chat message records with sender and content',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Message identifier' },
          { name: 'channel_id', type: 'UUID', nullable: false, key: 'FK', description: 'References chat_channels(id)' },
          { name: 'sender_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — message author' },
          { name: 'content', type: 'TEXT', nullable: false, description: 'Message text content' },
          { name: 'is_edited', type: 'BOOLEAN', nullable: false, defaultVal: 'false', description: 'Edit status flag' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Message send timestamp' },
        ],
      },
      {
        name: 'chat_members',
        description: 'Channel membership junction table',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Membership identifier' },
          { name: 'channel_id', type: 'UUID', nullable: false, key: 'FK', description: 'References chat_channels(id)' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'last_read_at', type: 'TIMESTAMP', nullable: true, description: 'Timestamp of last message read by this member' },
          { name: 'joined_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Join timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ CHAT_MEMBERS : joins',
      'CHAT_CHANNELS ||--o{ CHAT_MEMBERS : contains',
      'CHAT_CHANNELS ||--o{ CHAT_MESSAGES : holds',
      'USERS ||--o{ CHAT_MESSAGES : sends',
    ],
    requirements: [
      {
        feature: 'Real-time Message Send & Receive',
        description: 'Users send text messages in channels. Messages appear instantly for all channel members via WebSocket broadcast.',
        userStory: 'As a team member, I want to send a message and see it appear instantly for all team members in the channel.',
        acceptanceCriteria: [
          'Messages deliver within 100ms to all connected channel members.',
          'Typing indicator shows when another member is composing a message.',
          'Online/offline presence dots displayed next to member avatars.',
          'Messages persist in database — visible on page reload.',
        ],
      },
    ],
    userFlowSteps: [
      'User opens Chat sidebar → Sees list of channels and DMs',
      'Selects channel → Message history loads with infinite scroll',
      'Types message → Typing indicator broadcasts to other members',
      'Sends message → Appears instantly for all channel members via WebSocket',
    ],
    securityNotes: [
      'WebSocket connections authenticated via JWT token on handshake.',
      'Sanitize message content to prevent XSS and code injection.',
      'Rate-limit message sending: max 30 messages per minute per user.',
    ],
    apiEndpoints: [
      'GET /api/chat/channels — List user channels',
      'POST /api/chat/channels — Create new channel',
      'GET /api/chat/channels/:id/messages — Load message history',
      'WS /api/chat/ws — WebSocket connection for real-time messaging',
    ],
    uiPages: ['Chat Sidebar', 'Channel View', 'Direct Message View'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 8. BLOG / CMS CONTENT
  // ═══════════════════════════════════════════════════════════════════
  'Blog / CMS': {
    id: 'blog',
    name: 'Blog & CMS Content Management',
    keywords: ['blog', 'cms', 'article', 'post', 'content', 'editor', 'publish', 'draft', 'category', 'tag'],
    problemFragment: 'Content creation is bottlenecked by clunky editor interfaces, missing draft/publish workflows, broken SEO metadata, and no scheduled publishing capability.',
    goals: [
      'Provide rich text editor with real-time preview for content authors.',
      'Support draft → review → published lifecycle with scheduled publishing.',
      'Auto-generate SEO metadata (title, description, OG tags) from content body.',
    ],
    tables: [
      {
        name: 'posts',
        description: 'Blog/CMS article content records with publishing lifecycle',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Post identifier' },
          { name: 'author_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — post author' },
          { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Article title' },
          { name: 'slug', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'URL-friendly slug for SEO' },
          { name: 'excerpt', type: 'TEXT', nullable: true, description: 'Short summary for previews and SEO description' },
          { name: 'body', type: 'TEXT', nullable: false, description: 'Full article content (Markdown or HTML)' },
          { name: 'cover_image_url', type: 'TEXT', nullable: true, description: 'Hero/cover image URL' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'draft'", description: 'Publishing status (draft, review, published, archived)' },
          { name: 'published_at', type: 'TIMESTAMP', nullable: true, description: 'Date when article was/will be published' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Creation timestamp' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Last edit timestamp' },
        ],
      },
      {
        name: 'categories',
        description: 'Content categories for article organization',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Category identifier' },
          { name: 'name', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'Category name' },
          { name: 'slug', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'URL-friendly category slug' },
          { name: 'description', type: 'TEXT', nullable: true, description: 'Category description' },
        ],
      },
      {
        name: 'post_categories',
        description: 'Many-to-many junction between posts and categories',
        columns: [
          { name: 'post_id', type: 'UUID', nullable: false, key: 'FK', description: 'References posts(id)' },
          { name: 'category_id', type: 'UUID', nullable: false, key: 'FK', description: 'References categories(id)' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ POSTS : authors',
      'POSTS }o--o{ CATEGORIES : categorized_in',
    ],
    requirements: [
      {
        feature: 'Rich Text Editor with Draft/Publish Workflow',
        description: 'WYSIWYG or Markdown editor with live preview. Posts follow draft → review → published lifecycle. Supports scheduled future publishing.',
        userStory: 'As a content author, I want to write articles in a rich editor and schedule them for future publication.',
        acceptanceCriteria: [
          'Editor supports headings, bold, italic, links, images, code blocks, and lists.',
          'Auto-save draft every 30 seconds to prevent content loss.',
          'Scheduled posts auto-publish at specified timestamp via background job.',
          'SEO metadata (title, description, OG image) auto-populated from article content.',
        ],
      },
    ],
    userFlowSteps: [
      'Author clicks "New Post" → Rich editor opens with empty canvas',
      'Writes content → Editor auto-saves draft periodically',
      'Sets category, cover image, SEO metadata → Clicks "Publish" or "Schedule"',
      'Published post appears on public blog page with SEO-optimized URL',
    ],
    securityNotes: [
      'Sanitize HTML content to prevent stored XSS attacks.',
      'Only authorized authors and admins can edit/delete published content.',
    ],
    apiEndpoints: [
      'GET /api/posts — List posts (filterable by status, category)',
      'POST /api/posts — Create new post',
      'PUT /api/posts/:id — Update post content and metadata',
      'PATCH /api/posts/:id/publish — Publish or schedule post',
      'DELETE /api/posts/:id — Soft-delete post',
    ],
    uiPages: ['Post Editor Page', 'Blog List/Grid Page', 'Post Detail Page', 'Category Manager'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 9. INVENTORY & STOCK MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  'Inventory Management': {
    id: 'inventory',
    name: 'Inventory & Stock Management',
    keywords: ['inventory', 'stock', 'warehouse', 'product', 'sku', 'variant', 'quantity', 'restock'],
    problemFragment: 'Stock levels are tracked manually in spreadsheets, causing overselling, phantom inventory, and delayed restocking that harms customer trust and revenue.',
    goals: [
      'Maintain real-time stock accuracy with atomic quantity deduction on each sale.',
      'Trigger automated low-stock alerts when inventory drops below configurable threshold.',
      'Support product variants (size, color) with independent stock tracking per SKU.',
    ],
    tables: [
      {
        name: 'products',
        description: 'Product catalog with pricing and metadata',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Product identifier' },
          { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Product display name' },
          { name: 'slug', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'URL-safe product slug' },
          { name: 'description', type: 'TEXT', nullable: true, description: 'Product detailed description' },
          { name: 'base_price', type: 'NUMERIC(10,2)', nullable: false, description: 'Base product price in primary currency' },
          { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Product visibility flag' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Product creation timestamp' },
        ],
      },
      {
        name: 'product_variants',
        description: 'Product SKU variants (size, color, etc.) with independent stock',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Variant identifier' },
          { name: 'product_id', type: 'UUID', nullable: false, key: 'FK', description: 'References products(id)' },
          { name: 'sku', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'Stock Keeping Unit code' },
          { name: 'variant_name', type: 'VARCHAR(100)', nullable: false, description: 'Variant label (e.g., "Red / XL")' },
          { name: 'price_override', type: 'NUMERIC(10,2)', nullable: true, description: 'Price override for this variant (null = use base_price)' },
          { name: 'stock_quantity', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Available stock count' },
          { name: 'low_stock_threshold', type: 'INTEGER', nullable: false, defaultVal: '10', description: 'Threshold to trigger low-stock alert' },
        ],
      },
      {
        name: 'stock_movements',
        description: 'Audit log of all stock quantity changes (additions, deductions, adjustments)',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Movement record identifier' },
          { name: 'variant_id', type: 'UUID', nullable: false, key: 'FK', description: 'References product_variants(id)' },
          { name: 'quantity_change', type: 'INTEGER', nullable: false, description: 'Quantity delta (+restock, -sale, +/-adjustment)' },
          { name: 'reason', type: 'VARCHAR(50)', nullable: false, description: 'Movement reason (sale, restock, adjustment, return)' },
          { name: 'reference_id', type: 'UUID', nullable: true, description: 'Reference to source record (order_id, restock_id)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Movement timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'PRODUCTS ||--o{ PRODUCT_VARIANTS : has_variants',
      'PRODUCT_VARIANTS ||--o{ STOCK_MOVEMENTS : tracks',
    ],
    requirements: [
      {
        feature: 'Real-time Stock Tracking with Low-Stock Alerts',
        description: 'Stock quantities update atomically on sale or restock. System sends alert notification when stock drops below configured threshold.',
        userStory: 'As a store manager, I want to receive alerts when product stock falls below threshold so I can reorder before running out.',
        acceptanceCriteria: [
          'Stock deduction uses database-level atomic operation (SELECT FOR UPDATE or transaction).',
          'Low-stock alert fires when quantity reaches threshold (configurable per variant).',
          'Stock movement audit log records every quantity change with reason and reference.',
          'Dashboard shows real-time stock levels with color-coded status (green/yellow/red).',
        ],
      },
    ],
    userFlowSteps: [
      'Manager opens Inventory Dashboard → Views all products with stock levels',
      'Clicks product → Sees variant breakdown with stock per SKU',
      'Receives low-stock alert → Clicks "Restock" → Enters restock quantity',
      'Stock movement logged → Quantity updated → Alert cleared',
    ],
    securityNotes: [
      'Stock mutations require admin or manager role authorization.',
      'Atomic stock operations prevent race condition overselling.',
    ],
    apiEndpoints: [
      'GET /api/products — List products with stock summary',
      'GET /api/products/:id/variants — List product variants with stock',
      'POST /api/inventory/restock — Add stock to variant',
      'GET /api/inventory/movements — View stock movement audit log',
    ],
    uiPages: ['Inventory Dashboard', 'Product Detail (Stock)', 'Restock Form', 'Movement History Log'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 10. BOOKING & SCHEDULING
  // ═══════════════════════════════════════════════════════════════════
  'Booking & Scheduling': {
    id: 'booking',
    name: 'Booking & Scheduling System',
    keywords: ['booking', 'schedule', 'appointment', 'calendar', 'reservation', 'slot', 'availability'],
    problemFragment: 'Appointment scheduling relies on manual back-and-forth communication, causing double bookings, missed slots, timezone confusion, and poor customer experience.',
    goals: [
      'Prevent double-booking with server-side slot availability validation.',
      'Support timezone-aware scheduling for global users.',
      'Send automated booking confirmation and reminder emails/notifications.',
    ],
    tables: [
      {
        name: 'available_slots',
        description: 'Provider availability time slots for booking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Slot identifier' },
          { name: 'provider_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — service provider' },
          { name: 'start_time', type: 'TIMESTAMP', nullable: false, description: 'Slot start time (stored in UTC)' },
          { name: 'end_time', type: 'TIMESTAMP', nullable: false, description: 'Slot end time (stored in UTC)' },
          { name: 'is_available', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Slot availability flag (false when booked)' },
        ],
      },
      {
        name: 'bookings',
        description: 'Customer booking/reservation records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Booking identifier' },
          { name: 'slot_id', type: 'UUID', nullable: false, key: 'FK', description: 'References available_slots(id)' },
          { name: 'customer_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — booking customer' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'confirmed'", description: 'Booking status (confirmed, canceled, completed, no_show)' },
          { name: 'notes', type: 'TEXT', nullable: true, description: 'Customer notes for the appointment' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Booking creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ AVAILABLE_SLOTS : provides',
      'AVAILABLE_SLOTS ||--o| BOOKINGS : reserved_by',
      'USERS ||--o{ BOOKINGS : books',
    ],
    requirements: [
      {
        feature: 'Calendar-based Slot Selection & Booking',
        description: 'Interactive calendar UI showing available time slots. Users select a slot and confirm booking instantly.',
        userStory: 'As a customer, I want to see available time slots on a calendar and book an appointment with one click.',
        acceptanceCriteria: [
          'Calendar displays available slots in user\'s local timezone.',
          'Booked slots are visually grayed out and unselectable.',
          'Double-booking prevented by server-side slot locking (SELECT FOR UPDATE).',
          'Booking confirmation email sent within 30 seconds of successful booking.',
          'Users can cancel bookings up to 24 hours before the scheduled time.',
        ],
      },
    ],
    userFlowSteps: [
      'Customer opens Booking Page → Selects date on calendar',
      'Available time slots displayed → Customer selects preferred slot',
      'Enters optional notes → Clicks "Confirm Booking"',
      'Server validates slot availability → Creates booking → Marks slot as unavailable',
      'Confirmation email and in-app notification sent to both parties',
    ],
    securityNotes: [
      'Slot locking uses database transaction to prevent race condition double-booking.',
      'Booking cancellation enforces 24-hour minimum notice policy.',
    ],
    apiEndpoints: [
      'GET /api/slots?provider=xxx&date=yyyy-mm-dd — Available slots for date',
      'POST /api/bookings — Create new booking',
      'PATCH /api/bookings/:id/cancel — Cancel booking',
      'GET /api/bookings — List user bookings',
    ],
    uiPages: ['Booking Calendar Page', 'Booking Confirmation Page', 'My Bookings List'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 11. SOCIAL FEATURES (Feeds, Likes, Comments)
  // ═══════════════════════════════════════════════════════════════════
  'Social Features': {
    id: 'social',
    name: 'Social Features (Feeds, Likes, Comments)',
    keywords: ['social', 'feed', 'like', 'comment', 'follow', 'share', 'timeline', 'reaction'],
    problemFragment: 'User engagement plateaus without social interaction features — users consume content passively without feedback loops, community building, or viral sharing mechanisms.',
    goals: [
      'Render personalized activity feed within 500ms of page load.',
      'Support reactions (like, love, celebrate) with optimistic UI updates.',
      'Display threaded comments with nested replies up to 3 levels deep.',
    ],
    tables: [
      {
        name: 'comments',
        description: 'User comments on entities with threading support',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Comment identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — comment author' },
          { name: 'entity_type', type: 'VARCHAR(50)', nullable: false, description: 'Target entity type (post, product, task, etc.)' },
          { name: 'entity_id', type: 'UUID', nullable: false, description: 'Target entity identifier' },
          { name: 'parent_id', type: 'UUID', nullable: true, key: 'FK', description: 'Self-referencing FK for threaded replies' },
          { name: 'body', type: 'TEXT', nullable: false, description: 'Comment text content' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Comment timestamp' },
        ],
      },
      {
        name: 'reactions',
        description: 'User reactions (like, love, celebrate) on any entity',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Reaction identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — reactor' },
          { name: 'entity_type', type: 'VARCHAR(50)', nullable: false, description: 'Target entity type' },
          { name: 'entity_id', type: 'UUID', nullable: false, description: 'Target entity identifier' },
          { name: 'reaction_type', type: 'VARCHAR(20)', nullable: false, defaultVal: "'like'", description: 'Reaction variant (like, love, celebrate, insightful)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Reaction timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ COMMENTS : writes',
      'USERS ||--o{ REACTIONS : reacts',
      'COMMENTS ||--o{ COMMENTS : replies_to',
    ],
    requirements: [
      {
        feature: 'Comments & Threaded Replies',
        description: 'Users can post comments on any entity. Comments support threaded replies up to 3 levels deep.',
        userStory: 'As a user, I want to comment on a post and reply to other comments so I can participate in discussions.',
        acceptanceCriteria: [
          'Comments render with author avatar, name, and relative timestamp.',
          'Reply button on each comment opens inline reply composer.',
          'Threaded replies indent up to 3 levels — deeper replies flatten.',
          'Comment deletion soft-deletes and shows "[deleted]" placeholder.',
        ],
      },
    ],
    userFlowSteps: [
      'User views content item → Scrolls to comments section',
      'Types comment → Clicks "Post Comment" → Comment appears instantly (optimistic)',
      'Other user replies to comment → Threaded reply indented below parent',
      'User clicks reaction button → Count increments with animation',
    ],
    securityNotes: [
      'Rate-limit comments: max 10 per minute per user.',
      'Sanitize comment body to prevent XSS injection.',
      'Users can only delete their own comments unless admin role.',
    ],
    apiEndpoints: [
      'GET /api/comments?entity_type=xxx&entity_id=xxx — List comments',
      'POST /api/comments — Create comment',
      'DELETE /api/comments/:id — Delete comment',
      'POST /api/reactions — Toggle reaction',
    ],
    uiPages: ['Comment Thread Section', 'Reaction Button Component'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 12. EMAIL MARKETING & CAMPAIGNS
  // ═══════════════════════════════════════════════════════════════════
  'Email Marketing': {
    id: 'email-marketing',
    name: 'Email Marketing & Campaign Management',
    keywords: ['email', 'campaign', 'newsletter', 'marketing', 'subscriber', 'mailchimp', 'blast'],
    problemFragment: 'Email campaigns are sent blindly without segmentation, A/B testing, or open/click tracking — resulting in low engagement, high unsubscribe rates, and wasted marketing budget.',
    goals: [
      'Segment subscriber lists based on behavior and attributes for targeted campaigns.',
      'Track email open rates and click-through rates per campaign.',
      'Provide easy one-click unsubscribe compliant with CAN-SPAM and GDPR.',
    ],
    tables: [
      {
        name: 'subscribers',
        description: 'Email subscriber list with segmentation tags',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Subscriber identifier' },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Subscriber email address' },
          { name: 'first_name', type: 'VARCHAR(100)', nullable: true, description: 'Subscriber first name for personalization' },
          { name: 'tags', type: 'TEXT', nullable: true, description: 'Comma-separated segmentation tags' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'active'", description: 'Subscription status (active, unsubscribed, bounced)' },
          { name: 'subscribed_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Subscription timestamp' },
        ],
      },
      {
        name: 'email_campaigns',
        description: 'Email campaign definitions with content and scheduling',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Campaign identifier' },
          { name: 'subject', type: 'VARCHAR(255)', nullable: false, description: 'Email subject line' },
          { name: 'body_html', type: 'TEXT', nullable: false, description: 'Email HTML body content' },
          { name: 'segment_tags', type: 'TEXT', nullable: true, description: 'Target subscriber tags filter' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'draft'", description: 'Campaign status (draft, scheduled, sent)' },
          { name: 'sent_at', type: 'TIMESTAMP', nullable: true, description: 'Campaign send timestamp' },
          { name: 'open_count', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Total email opens tracked' },
          { name: 'click_count', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Total link clicks tracked' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Campaign creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'EMAIL_CAMPAIGNS ||--o{ SUBSCRIBERS : targets',
    ],
    requirements: [
      {
        feature: 'Campaign Builder & Subscriber Segmentation',
        description: 'Create email campaigns with HTML editor, target specific subscriber segments via tags, and schedule send times.',
        userStory: 'As a marketer, I want to create an email campaign targeting "premium" subscribers and schedule it for next Tuesday.',
        acceptanceCriteria: [
          'Campaign editor supports rich HTML email content with preview.',
          'Subscriber list filterable by tags for targeted segments.',
          'Scheduled campaigns auto-send at specified timestamp.',
          'Open/click tracking pixels embedded automatically in sent emails.',
        ],
      },
    ],
    userFlowSteps: [
      'Marketer creates new campaign → Writes subject and HTML body',
      'Selects target segment (by tags) → Previews email rendering',
      'Clicks "Send Now" or "Schedule" → Campaign queued for delivery',
      'After delivery → Dashboard shows open rate, click rate, unsubscribes',
    ],
    securityNotes: [
      'Include one-click unsubscribe header per CAN-SPAM and GDPR.',
      'Never share subscriber lists with third parties.',
    ],
    apiEndpoints: [
      'GET /api/subscribers — List subscribers (paginated, filterable)',
      'POST /api/campaigns — Create campaign',
      'POST /api/campaigns/:id/send — Send or schedule campaign',
      'GET /api/campaigns/:id/stats — Campaign analytics',
    ],
    uiPages: ['Campaign Builder', 'Subscriber List', 'Campaign Analytics Dashboard'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 13. API & WEBHOOKS
  // ═══════════════════════════════════════════════════════════════════
  'API & Webhooks': {
    id: 'api-webhooks',
    name: 'API Key Management & Webhook Delivery',
    keywords: ['api', 'webhook', 'key', 'token', 'rate-limit', 'integration', 'developer', 'openapi'],
    problemFragment: 'Third-party integrations break silently due to unstable API keys, missing webhook retries, absent rate limiting, and zero delivery monitoring.',
    goals: [
      'Provide self-service API key generation with granular scope permissions.',
      'Achieve 99.9% webhook delivery reliability with exponential backoff retries.',
      'Enforce per-key rate limiting with standard HTTP rate limit headers.',
    ],
    tables: [
      {
        name: 'api_keys',
        description: 'Developer API key credentials with scope permissions',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'API key record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — key owner' },
          { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Human-readable key label (e.g., "Production Backend")' },
          { name: 'key_prefix', type: 'VARCHAR(8)', nullable: false, description: 'First 8 chars of key for identification (dk_live_xxxx)' },
          { name: 'key_hash', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'SHA-256 hashed full API key' },
          { name: 'scopes', type: 'TEXT', nullable: true, description: 'Comma-separated permission scopes (read, write, admin)' },
          { name: 'rate_limit', type: 'INTEGER', nullable: false, defaultVal: '1000', description: 'Requests per hour limit' },
          { name: 'last_used_at', type: 'TIMESTAMP', nullable: true, description: 'Last authenticated request timestamp' },
          { name: 'expires_at', type: 'TIMESTAMP', nullable: true, description: 'Key expiration date (null = no expiry)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Key creation timestamp' },
        ],
      },
      {
        name: 'webhooks',
        description: 'Registered webhook endpoints for event delivery',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Webhook record identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — webhook owner' },
          { name: 'target_url', type: 'TEXT', nullable: false, description: 'HTTPS destination endpoint URL' },
          { name: 'secret', type: 'VARCHAR(255)', nullable: false, description: 'HMAC-SHA256 signing secret' },
          { name: 'events', type: 'TEXT', nullable: false, description: 'Comma-separated subscribed event types' },
          { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Active delivery flag' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Webhook creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ API_KEYS : generates',
      'USERS ||--o{ WEBHOOKS : registers',
    ],
    requirements: [
      {
        feature: 'API Key Lifecycle Management',
        description: 'Users generate, view, rotate, and revoke API keys from the developer settings page. Keys shown once on creation and never displayed again.',
        userStory: 'As a developer, I want to generate API keys with specific scopes so I can integrate securely with limited permissions.',
        acceptanceCriteria: [
          'Full API key displayed exactly once at creation — stored only as hash after.',
          'Key list shows prefix, name, scopes, last used, and expiry.',
          'Rotate action generates new key and invalidates old one atomically.',
          'Revoked keys return HTTP 401 Unauthorized immediately.',
        ],
      },
    ],
    userFlowSteps: [
      'Developer navigates to API Settings → Clicks "Generate New Key"',
      'Selects scopes (read, write) and optional expiry → Key generated',
      'Copies full key (shown once) → Stores securely in environment variables',
      'Registers webhook URL → Selects events to subscribe → Saves',
    ],
    securityNotes: [
      'API keys stored as SHA-256 hashes — never as plaintext.',
      'Webhook payloads signed with HMAC-SHA256 for receiver verification.',
      'Rate limiting enforced per-key with token bucket algorithm.',
    ],
    apiEndpoints: [
      'POST /api/keys — Generate new API key',
      'GET /api/keys — List user API keys (hashed, prefix only)',
      'DELETE /api/keys/:id — Revoke API key',
      'POST /api/webhooks — Register webhook endpoint',
      'GET /api/webhooks — List webhooks',
    ],
    uiPages: ['API Key Management Page', 'Webhook Configuration Page', 'API Documentation Page'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 14. SEARCH & FILTERING
  // ═══════════════════════════════════════════════════════════════════
  'Search & Filtering': {
    id: 'search',
    name: 'Search & Advanced Filtering',
    keywords: ['search', 'filter', 'sort', 'query', 'full-text', 'facet', 'autocomplete'],
    problemFragment: 'Users cannot find what they need — poor search returns irrelevant results, filtering is limited to basic dropdowns, and there is no autocomplete or faceted navigation.',
    goals: [
      'Return search results within 150ms of keystroke using indexed full-text search.',
      'Support faceted filtering (category, price range, status, tags) with dynamic count updates.',
      'Implement typeahead autocomplete suggestions for search input.',
    ],
    tables: [
      {
        name: 'search_index',
        description: 'Denormalized full-text search index for fast queries',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Index entry identifier' },
          { name: 'entity_type', type: 'VARCHAR(50)', nullable: false, description: 'Source entity type (product, post, user)' },
          { name: 'entity_id', type: 'UUID', nullable: false, description: 'Source entity identifier' },
          { name: 'title', type: 'VARCHAR(255)', nullable: false, description: 'Searchable title text' },
          { name: 'body', type: 'TEXT', nullable: true, description: 'Searchable body content' },
          { name: 'tags', type: 'TEXT', nullable: true, description: 'Searchable tags and metadata' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Index last refresh timestamp' },
        ],
      },
    ],
    mermaidRelationships: [],
    requirements: [
      {
        feature: 'Full-text Search with Autocomplete',
        description: 'Search bar with real-time autocomplete suggestions and full-text search across multiple entity types.',
        userStory: 'As a user, I want to type a keyword and see instant suggestions so I can find content quickly.',
        acceptanceCriteria: [
          'Autocomplete suggestions appear within 150ms of input.',
          'Results highlight matched keywords in title and body.',
          'Search supports "exact phrase" matching with quotes.',
          'Empty results show helpful suggestions and "no results found" messaging.',
        ],
      },
    ],
    userFlowSteps: [
      'User clicks search bar → Focus expands search input',
      'Types keyword → Autocomplete dropdown shows top 5 suggestions',
      'Selects suggestion or presses Enter → Full results page renders',
      'Applies faceted filters (category, date range) → Results refine dynamically',
    ],
    securityNotes: [
      'Search queries sanitized to prevent SQL/NoSQL injection.',
      'Search results respect user permissions — no unauthorized data exposure.',
    ],
    apiEndpoints: [
      'GET /api/search?q=xxx — Full-text search',
      'GET /api/search/suggest?q=xxx — Autocomplete suggestions',
    ],
    uiPages: ['Search Bar Component', 'Search Results Page', 'Faceted Filter Sidebar'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 15. MULTI-LANGUAGE / i18n
  // ═══════════════════════════════════════════════════════════════════
  'Multi-language (i18n)': {
    id: 'i18n',
    name: 'Multi-language & Internationalization',
    keywords: ['i18n', 'internationalization', 'language', 'translation', 'locale', 'multi-language', 'rtl'],
    problemFragment: 'The application only serves a single language audience, excluding international users and missing opportunities in non-English-speaking markets.',
    goals: [
      'Support dynamic language switching without page reload.',
      'Maintain translation keys organized in structured JSON locale files.',
      'Handle RTL (Right-to-Left) layout for Arabic, Hebrew, and similar languages.',
    ],
    tables: [
      {
        name: 'translations',
        description: 'Key-value translation storage for dynamic content',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Translation record identifier' },
          { name: 'locale', type: 'VARCHAR(10)', nullable: false, description: 'Language/locale code (en, id, ja, ar)' },
          { name: 'namespace', type: 'VARCHAR(50)', nullable: false, description: 'Translation namespace/group (common, auth, dashboard)' },
          { name: 'key', type: 'VARCHAR(255)', nullable: false, description: 'Translation key identifier' },
          { name: 'value', type: 'TEXT', nullable: false, description: 'Translated text value' },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Last edit timestamp' },
        ],
      },
    ],
    mermaidRelationships: [],
    requirements: [
      {
        feature: 'Dynamic Language Switching',
        description: 'Language selector in UI header allows instant locale switch. All text content re-renders in selected language without page reload.',
        userStory: 'As a non-English user, I want to switch the app language to Indonesian so I can use the interface in my native language.',
        acceptanceCriteria: [
          'Language selector available in header/settings with flag icons.',
          'Switching language re-renders all UI text instantly (no full page reload).',
          'Selected locale persisted in user preferences and localStorage.',
          'Fallback to English for missing translations.',
          'RTL layout automatically applied for Arabic/Hebrew locales.',
        ],
      },
    ],
    userFlowSteps: [
      'User clicks language selector in header → Dropdown shows available languages',
      'Selects "Bahasa Indonesia" → All UI text re-renders in Indonesian',
      'Preference saved → Next visit loads in selected language automatically',
    ],
    securityNotes: [
      'Translation values sanitized to prevent XSS through translated strings.',
      'Locale parameter validated against allowed locale list.',
    ],
    apiEndpoints: [
      'GET /api/i18n/:locale — Fetch all translations for locale',
      'GET /api/i18n/locales — List available locales',
    ],
    uiPages: ['Language Selector Component', 'Translation Management (Admin)'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 16. ROLE-BASED ACCESS CONTROL (RBAC)
  // ═══════════════════════════════════════════════════════════════════
  'Role-Based Access (RBAC)': {
    id: 'rbac',
    name: 'Role-Based Access Control (RBAC)',
    keywords: ['rbac', 'role', 'permission', 'access', 'admin', 'member', 'viewer', 'authorization', 'guard'],
    problemFragment: 'All users have identical access levels — sensitive admin operations are unprotected, and there is no granular permission system to differentiate user roles.',
    goals: [
      'Enforce role-based middleware on every protected route and API endpoint.',
      'Support hierarchical roles: Super Admin > Admin > Manager > Member > Viewer.',
      'Provide admin panel to manage user roles without code deployments.',
    ],
    tables: [
      {
        name: 'roles',
        description: 'System role definitions with hierarchy level',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Role identifier' },
          { name: 'name', type: 'VARCHAR(50)', nullable: false, key: 'UNIQUE', description: 'Role name (super_admin, admin, manager, member, viewer)' },
          { name: 'display_name', type: 'VARCHAR(100)', nullable: false, description: 'Human-readable role label' },
          { name: 'hierarchy_level', type: 'INTEGER', nullable: false, description: 'Numeric level for role comparison (higher = more access)' },
        ],
      },
      {
        name: 'user_roles',
        description: 'User-to-role assignment junction table',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Assignment identifier' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'role_id', type: 'UUID', nullable: false, key: 'FK', description: 'References roles(id)' },
          { name: 'assigned_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Role assignment timestamp' },
        ],
      },
      {
        name: 'permissions',
        description: 'Granular permission definitions mapped to roles',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Permission identifier' },
          { name: 'role_id', type: 'UUID', nullable: false, key: 'FK', description: 'References roles(id)' },
          { name: 'resource', type: 'VARCHAR(100)', nullable: false, description: 'Protected resource name (users, posts, settings)' },
          { name: 'action', type: 'VARCHAR(20)', nullable: false, description: 'Permitted action (create, read, update, delete)' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ USER_ROLES : assigned',
      'ROLES ||--o{ USER_ROLES : defines',
      'ROLES ||--o{ PERMISSIONS : grants',
    ],
    requirements: [
      {
        feature: 'Role Assignment & Permission Enforcement',
        description: 'Admin users can assign roles to team members. Middleware enforces role-based access on all protected routes and API endpoints.',
        userStory: 'As an admin, I want to assign "Viewer" role to a contractor so they can only read data but not modify anything.',
        acceptanceCriteria: [
          'Role selector dropdown available on user management page.',
          'API middleware checks role permissions before executing protected operations.',
          'Unauthorized access returns HTTP 403 Forbidden with clear error message.',
          'Role changes take effect immediately without requiring re-login.',
        ],
      },
    ],
    userFlowSteps: [
      'Admin opens User Management → Views user list with current roles',
      'Clicks user → Selects new role from dropdown → Saves',
      'System updates role assignment → Permissions enforced immediately',
      'User with restricted role attempts admin action → Receives 403 Forbidden',
    ],
    securityNotes: [
      'Role changes require admin-level permission.',
      'Super Admin role cannot be self-assigned or removed by non-super-admins.',
      'All role changes logged in audit trail.',
    ],
    apiEndpoints: [
      'GET /api/roles — List available roles',
      'GET /api/users/:id/roles — Get user roles',
      'PUT /api/users/:id/roles — Assign/update user role',
      'GET /api/permissions — List role permissions matrix',
    ],
    uiPages: ['User Management Page', 'Role Assignment Modal', 'Permissions Matrix View'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // 17. WORKSPACE / TEAM MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════
  'Workspace & Teams': {
    id: 'workspace',
    name: 'Workspace & Team Management',
    keywords: ['workspace', 'team', 'organization', 'org', 'tenant', 'multi-tenant', 'invite', 'member'],
    problemFragment: 'There is no organizational boundary — all data is shared globally, teams cannot collaborate in isolated workspaces, and member management requires direct database access.',
    goals: [
      'Support multi-tenant workspace isolation with zero data leakage between tenants.',
      'Enable self-service team invite via email with customizable role assignment.',
      'Track workspace-level usage and billing per organization.',
    ],
    tables: [
      {
        name: 'workspaces',
        description: 'Multi-tenant organizational boundary with billing',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Workspace identifier' },
          { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Workspace display name' },
          { name: 'slug', type: 'VARCHAR(100)', nullable: false, key: 'UNIQUE', description: 'URL-safe workspace identifier' },
          { name: 'owner_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id) — workspace creator/owner' },
          { name: 'plan', type: 'VARCHAR(50)', nullable: false, defaultVal: "'free'", description: 'Active billing plan tier' },
          { name: 'logo_url', type: 'TEXT', nullable: true, description: 'Workspace brand logo image URL' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Workspace creation timestamp' },
        ],
      },
      {
        name: 'workspace_members',
        description: 'Workspace membership with role assignments',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Membership identifier' },
          { name: 'workspace_id', type: 'UUID', nullable: false, key: 'FK', description: 'References workspaces(id)' },
          { name: 'user_id', type: 'UUID', nullable: false, key: 'FK', description: 'References users(id)' },
          { name: 'role', type: 'VARCHAR(30)', nullable: false, defaultVal: "'member'", description: 'Member role within workspace (owner, admin, member, viewer)' },
          { name: 'invited_by', type: 'UUID', nullable: true, key: 'FK', description: 'References users(id) — who sent the invite' },
          { name: 'joined_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Join timestamp' },
        ],
      },
      {
        name: 'workspace_invites',
        description: 'Pending team invitation records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Invite identifier' },
          { name: 'workspace_id', type: 'UUID', nullable: false, key: 'FK', description: 'References workspaces(id)' },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Invited user email address' },
          { name: 'role', type: 'VARCHAR(30)', nullable: false, defaultVal: "'member'", description: 'Assigned role for invitee' },
          { name: 'token', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Unique invite acceptance token' },
          { name: 'expires_at', type: 'TIMESTAMP', nullable: false, description: 'Invite expiration timestamp' },
          { name: 'accepted_at', type: 'TIMESTAMP', nullable: true, description: 'Acceptance timestamp (null = pending)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Invite creation timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'USERS ||--o{ WORKSPACES : owns',
      'WORKSPACES ||--o{ WORKSPACE_MEMBERS : contains',
      'WORKSPACES ||--o{ WORKSPACE_INVITES : sends',
      'USERS ||--o{ WORKSPACE_MEMBERS : joins',
    ],
    requirements: [
      {
        feature: 'Workspace Creation & Team Invites',
        description: 'Users create workspaces with unique slug. Invite team members via email with role assignment. Invited users accept via secure token link.',
        userStory: 'As a team lead, I want to create a workspace and invite 5 team members with different roles so we can collaborate in an isolated environment.',
        acceptanceCriteria: [
          'Workspace name auto-generates URL-safe slug (editable).',
          'Invite email contains secure acceptance link with 7-day expiry.',
          'Accepting invite adds user to workspace with assigned role.',
          'Workspace members list shows avatar, name, role, and join date.',
          'Workspace data isolated — queries always filter by workspace_id.',
        ],
      },
    ],
    userFlowSteps: [
      'User clicks "Create Workspace" → Enters name → Slug auto-generated',
      'Workspace created → User redirected to new workspace dashboard',
      'Clicks "Invite Member" → Enters email and selects role → Invite sent',
      'Invited user receives email → Clicks accept link → Joins workspace',
    ],
    securityNotes: [
      'All database queries scoped to workspace_id — enforced at middleware level.',
      'Invite tokens are single-use and expire after 7 days.',
      'Workspace deletion soft-deletes and requires owner confirmation.',
    ],
    apiEndpoints: [
      'POST /api/workspaces — Create workspace',
      'GET /api/workspaces — List user workspaces',
      'POST /api/workspaces/:id/invite — Send team invite',
      'POST /api/workspaces/accept-invite — Accept invite token',
      'GET /api/workspaces/:id/members — List workspace members',
    ],
    uiPages: ['Create Workspace Modal', 'Workspace Dashboard', 'Member Management Page', 'Invite Acceptance Page'],
  },
};

/**
 * Ordered list of feature module names for UI display.
 * Controls the order checkboxes appear in the WizardForm.
 */
export const FEATURE_MODULE_LIST: string[] = Object.keys(FEATURE_MODULES);

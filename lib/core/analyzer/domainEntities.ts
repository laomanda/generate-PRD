import { ProjectModel, DomainEntityModel } from '../project-model/schemas';

export function deriveDomainEntities(project: Pick<ProjectModel, 'features' | 'projectName'> & { domain: { domainName: string; primaryEntityNames: string[] } }): DomainEntityModel[] {
  const entities: DomainEntityModel[] = [];

  // Core Entity 1: User Account
  entities.push({
    name: 'User',
    tableName: 'users',
    description: 'System user authentication accounts and global identity records.',
    attributes: [
      { name: 'id', type: 'UUID', isPk: true, description: 'Primary key UUID' },
      { name: 'email', type: 'VARCHAR(255)', description: 'Unique login email address' },
      { name: 'password_hash', type: 'VARCHAR(255)', description: 'Argon2id password hash' },
      { name: 'role', type: 'VARCHAR(50)', description: 'Assigned system authorization role' },
      { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Account creation timestamp' },
    ],
    relationships: [],
    constraints: ['NOT NULL (email, password_hash, role)', 'UNIQUE (email)'],
    indexes: ['idx_users_email (email)', 'idx_users_role (role)'],
    lifecycleStates: ['pending_activation', 'active', 'suspended', 'archived'],
  });

  const featureText = (project.features || []).join(' ').toLowerCase();
  const domainName = (project.domain.domainName || '').toLowerCase();

  // Healthcare / Hospital domain entities
  if (domainName.includes('health') || domainName.includes('hospital') || featureText.includes('patient') || featureText.includes('doctor') || featureText.includes('medical')) {
    entities.push({
      name: 'Patient',
      tableName: 'patients',
      description: 'Registered hospital patient demographic and insurance profiles.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Patient record UUID' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'Foreign key to users table' },
        { name: 'medical_record_number', type: 'VARCHAR(50)', description: 'Unique MRN identifier' },
        { name: 'dob', type: 'DATE', description: 'Patient date of birth' },
        { name: 'blood_type', type: 'VARCHAR(10)', description: 'Patient blood type' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:1', foreignKey: 'user_id', description: 'Owned by user account' }],
      constraints: ['NOT NULL (medical_record_number, dob)', 'UNIQUE (medical_record_number)'],
      indexes: ['idx_patients_mrn (medical_record_number)', 'idx_patients_user_id (user_id)'],
      lifecycleStates: ['registered', 'admitted', 'discharged'],
    });

    entities.push({
      name: 'Appointment',
      tableName: 'appointments',
      description: 'Scheduled consultations between patients and doctors.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Appointment ID' },
        { name: 'patient_id', type: 'UUID', isFk: true, description: 'Foreign key to patients' },
        { name: 'doctor_id', type: 'UUID', isFk: true, description: 'Foreign key to doctors/users' },
        { name: 'scheduled_time', type: 'TIMESTAMP WITH TIME ZONE', description: 'Scheduled appointment timestamp' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Appointment status' },
      ],
      relationships: [{ targetEntity: 'Patient', type: '1:N', foreignKey: 'patient_id', description: 'Belongs to patient' }, { targetEntity: 'User', type: '1:N', foreignKey: 'doctor_id', description: 'Doctor assigned' }],
      constraints: ['NOT NULL (patient_id, doctor_id, scheduled_time)'],
      indexes: ['idx_appointments_patient (patient_id)', 'idx_appointments_time (scheduled_time)'],
      lifecycleStates: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    });

    entities.push({
      name: 'MedicalRecord',
      tableName: 'medical_records',
      description: 'Clinical consultation notes, diagnoses, and medical histories.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Record ID' },
        { name: 'patient_id', type: 'UUID', isFk: true, description: 'Foreign key to patients' },
        { name: 'diagnosis', type: 'TEXT', description: 'Clinical diagnosis description' },
        { name: 'treatment_plan', type: 'TEXT', description: 'Prescribed treatment plan' },
      ],
      relationships: [{ targetEntity: 'Patient', type: '1:N', foreignKey: 'patient_id', description: 'Belongs to patient' }],
      constraints: ['NOT NULL (patient_id, diagnosis)'],
      indexes: ['idx_medical_records_patient (patient_id)'],
    });
    
    entities.push({
      name: 'Prescription',
      tableName: 'prescriptions',
      description: 'Medical prescriptions given to patients during appointments.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Prescription ID' },
        { name: 'appointment_id', type: 'UUID', isFk: true, description: 'Appointment reference' },
        { name: 'medication_name', type: 'VARCHAR(255)', description: 'Medication name' },
        { name: 'dosage', type: 'VARCHAR(100)', description: 'Dosage instructions' },
      ],
      relationships: [{ targetEntity: 'Appointment', type: '1:N', foreignKey: 'appointment_id', description: 'Issued during appointment' }],
      constraints: ['NOT NULL (appointment_id, medication_name)'],
      indexes: ['idx_prescriptions_appt (appointment_id)'],
    });
  }

  // Ticketing / Event domain entities
  else if (domainName.includes('event') || featureText.includes('ticket') || featureText.includes('attendee') || featureText.includes('check-in') || featureText.includes('organizer')) {
    entities.push({
      name: 'Event',
      tableName: 'events',
      description: 'Organized events, venues, schedule dates, and seat capacities.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Event ID' },
        { name: 'organizer_id', type: 'UUID', isFk: true, description: 'Foreign key to organizer user' },
        { name: 'title', type: 'VARCHAR(255)', description: 'Event title' },
        { name: 'capacity', type: 'INTEGER', description: 'Maximum venue seat capacity' },
        { name: 'event_date', type: 'TIMESTAMP WITH TIME ZONE', description: 'Scheduled event timestamp' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:N', foreignKey: 'organizer_id', description: 'Created by organizer' }],
      constraints: ['NOT NULL (title, capacity, event_date)', 'CHECK (capacity > 0)'],
      indexes: ['idx_events_organizer (organizer_id)', 'idx_events_date (event_date)'],
      lifecycleStates: ['draft', 'published', 'sold_out', 'completed', 'cancelled'],
    });

    entities.push({
      name: 'Ticket',
      tableName: 'tickets',
      description: 'Purchased event admission tickets with unique QR code hashes.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Ticket ID' },
        { name: 'event_id', type: 'UUID', isFk: true, description: 'Foreign key to events' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'Foreign key to user/attendee' },
        { name: 'qr_code_hash', type: 'VARCHAR(255)', description: 'Unique QR verification code hash' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Ticket status' },
      ],
      relationships: [
        { targetEntity: 'Event', type: '1:N', foreignKey: 'event_id', description: 'Valid for event' },
        { targetEntity: 'User', type: '1:N', foreignKey: 'user_id', description: 'Owned by attendee' },
      ],
      constraints: ['NOT NULL (event_id, user_id, qr_code_hash)', 'UNIQUE (qr_code_hash)'],
      indexes: ['idx_tickets_event (event_id)', 'idx_tickets_qr (qr_code_hash)'],
      lifecycleStates: ['issued', 'valid', 'checked_in', 'cancelled', 'refunded'],
    });
    
    entities.push({
      name: 'CheckIn',
      tableName: 'check_ins',
      description: 'Records of ticket check-ins at the event venue.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Check-in ID' },
        { name: 'ticket_id', type: 'UUID', isFk: true, description: 'Ticket reference' },
        { name: 'scanned_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Scan timestamp' },
        { name: 'scanner_id', type: 'UUID', isFk: true, description: 'Staff who scanned' },
      ],
      relationships: [
        { targetEntity: 'Ticket', type: '1:1', foreignKey: 'ticket_id', description: 'Associated ticket' },
        { targetEntity: 'User', type: '1:N', foreignKey: 'scanner_id', description: 'Scanned by staff' }
      ],
      constraints: ['NOT NULL (ticket_id, scanned_at)'],
      indexes: ['idx_check_ins_ticket (ticket_id)'],
    });
  }

  // Ecommerce domain entities
  else if (domainName.includes('e-commerce') || domainName.includes('ecommerce') || domainName.includes('store') || featureText.includes('cart') || featureText.includes('product') || featureText.includes('order')) {
    entities.push({
      name: 'Product',
      tableName: 'products',
      description: 'Catalog products, SKUs, pricing, and available inventory stock.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Product ID' },
        { name: 'sku', type: 'VARCHAR(100)', description: 'Unique SKU identifier' },
        { name: 'title', type: 'VARCHAR(255)', description: 'Product title' },
        { name: 'price_cents', type: 'INTEGER', description: 'Product price in cents' },
        { name: 'stock_quantity', type: 'INTEGER', description: 'Available warehouse inventory count' },
      ],
      relationships: [],
      constraints: ['NOT NULL (sku, title, price_cents, stock_quantity)', 'UNIQUE (sku)', 'CHECK (price_cents >= 0)'],
      indexes: ['idx_products_sku (sku)', 'idx_products_price (price_cents)'],
      lifecycleStates: ['draft', 'active', 'out_of_stock', 'archived'],
    });

    entities.push({
      name: 'Order',
      tableName: 'orders',
      description: 'Customer product purchases, payment status, and shipping fulfillment state.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Order ID' },
        { name: 'customer_id', type: 'UUID', isFk: true, description: 'Foreign key to customer user' },
        { name: 'total_amount_cents', type: 'INTEGER', description: 'Order total amount in cents' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Fulfillment and payment status' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:N', foreignKey: 'customer_id', description: 'Placed by customer' }],
      constraints: ['NOT NULL (customer_id, total_amount_cents, status)'],
      indexes: ['idx_orders_customer (customer_id)', 'idx_orders_status (status)'],
      lifecycleStates: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    });
    
    entities.push({
      name: 'OrderItem',
      tableName: 'order_items',
      description: 'Individual products purchased within an order.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Order Item ID' },
        { name: 'order_id', type: 'UUID', isFk: true, description: 'Order reference' },
        { name: 'product_id', type: 'UUID', isFk: true, description: 'Product reference' },
        { name: 'quantity', type: 'INTEGER', description: 'Quantity purchased' },
        { name: 'unit_price_cents', type: 'INTEGER', description: 'Price at time of purchase' },
      ],
      relationships: [
        { targetEntity: 'Order', type: '1:N', foreignKey: 'order_id', description: 'Belongs to order' },
        { targetEntity: 'Product', type: '1:N', foreignKey: 'product_id', description: 'References product' }
      ],
      constraints: ['NOT NULL (order_id, product_id, quantity)'],
      indexes: ['idx_order_items_order (order_id)'],
    });

    entities.push({
      name: 'Payment',
      tableName: 'payments',
      description: 'Financial transactions associated with orders.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Payment ID' },
        { name: 'order_id', type: 'UUID', isFk: true, description: 'Order reference' },
        { name: 'provider', type: 'VARCHAR(50)', description: 'Payment gateway provider' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Transaction status' },
      ],
      relationships: [{ targetEntity: 'Order', type: '1:1', foreignKey: 'order_id', description: 'Pays for order' }],
      constraints: ['NOT NULL (order_id, provider, status)'],
      indexes: ['idx_payments_order (order_id)'],
    });
  }
  
  // Social Network domain entities
  else if (domainName.includes('social') || featureText.includes('post') || featureText.includes('follower') || featureText.includes('feed')) {
    entities.push({
      name: 'Profile',
      tableName: 'profiles',
      description: 'Extended user profiles with bio, avatar, and social stats.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Profile ID' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'User reference' },
        { name: 'bio', type: 'TEXT', description: 'User biography' },
        { name: 'avatar_url', type: 'VARCHAR(255)', description: 'Avatar image URL' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:1', foreignKey: 'user_id', description: 'Extends user' }],
      constraints: ['NOT NULL (user_id)', 'UNIQUE (user_id)'],
      indexes: ['idx_profiles_user (user_id)'],
    });

    entities.push({
      name: 'Post',
      tableName: 'posts',
      description: 'User generated content posts for the social feed.',
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Post ID' },
        { name: 'author_id', type: 'UUID', isFk: true, description: 'User author reference' },
        { name: 'content', type: 'TEXT', description: 'Post text content' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Publish time' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:N', foreignKey: 'author_id', description: 'Authored by user' }],
      constraints: ['NOT NULL (author_id, content)'],
      indexes: ['idx_posts_author (author_id)', 'idx_posts_created (created_at)'],
    });
    
    entities.push({
      name: 'Follow',
      tableName: 'follows',
      description: 'Social graph connections between users.',
      attributes: [
        { name: 'follower_id', type: 'UUID', isFk: true, description: 'User following' },
        { name: 'following_id', type: 'UUID', isFk: true, description: 'User being followed' },
        { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE', description: 'Follow time' },
      ],
      relationships: [
        { targetEntity: 'User', type: '1:N', foreignKey: 'follower_id', description: 'Follower' },
        { targetEntity: 'User', type: '1:N', foreignKey: 'following_id', description: 'Following' }
      ],
      constraints: ['NOT NULL (follower_id, following_id)', 'UNIQUE (follower_id, following_id)'],
      indexes: ['idx_follows_follower (follower_id)', 'idx_follows_following (following_id)'],
    });
  }

  // Fallback primary entity if no domain entities matched
  else {
    const primary = project.domain.primaryEntityNames[0] || 'DomainRecord';
    const tableName = `${primary.toLowerCase().replace(/[^a-z0-9]/g, '_')}s`;
    entities.push({
      name: primary,
      tableName,
      description: `Primary domain entity records for ${project.projectName}.`,
      attributes: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Primary key UUID' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'Foreign key to users table' },
        { name: 'title', type: 'VARCHAR(255)', description: 'Entity title identifier' },
        { name: 'status', type: 'VARCHAR(50)', description: 'Entity lifecycle status' },
      ],
      relationships: [{ targetEntity: 'User', type: '1:N', foreignKey: 'user_id', description: 'Owned by user' }],
      constraints: ['NOT NULL (title, status)'],
      indexes: [`idx_${tableName}_user (user_id)`],
      lifecycleStates: ['active', 'archived'],
    });
  }

  return entities;
}

/**
 * ============================================================================
 * DOMAIN BLUEPRINTS & DYNAMIC ENTITY SYNTHESIZER
 * ============================================================================
 * When users type custom project names (e.g. "website sekolah 1", "aplikasi rumah sakit",
 * "kasir restoran", "rental mobil", "sistem peternakan"), this dictionary matches
 * the domain and synthesizes exact, realistic database tables and specs instead of
 * falling back to a generic SaaS template.
 * ============================================================================
 */

export interface DomainTable {
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

export interface DomainRequirement {
  feature: string;
  description: string;
  userStory: string;
  acceptanceCriteria: string[];
}

export interface DomainBlueprint {
  id: string;
  name: string;
  keywords: string[];
  problemStatement: string;
  goals: string[];
  targetUsers: { role: string; need: string }[];
  tables: DomainTable[];
  mermaidRelationships: string[];
  requirements: DomainRequirement[];
  userFlowSteps: string[];
  kpis: string[];
}

export const DOMAIN_BLUEPRINTS: Record<string, DomainBlueprint> = {
  // 🎓 1. EDUCATION / SCHOOL
  school: {
    id: 'school',
    name: 'School & Academic Management System',
    keywords: ['sekolah', 'school', 'siswa', 'student', 'guru', 'teacher', 'kelas', 'class', 'akademik', 'lms', 'kursus', 'pelajaran'],
    problemStatement: 'Educational institutions suffer from fragmented student records, manual grade recording, delayed attendance tracking, and poor communication between teachers, students, and parents.',
    goals: [
      'Digitalize student academic records and attendance tracking.',
      'Provide real-time grade calculation and report card generation.',
      'Enable seamless parent-teacher-student communication portal.',
    ],
    targetUsers: [
      { role: 'School Administrator', need: 'Manage student admissions, teacher assignments, and academic schedules.' },
      { role: 'Teacher', need: 'Record daily attendance, input exam grades, and publish class announcements.' },
      { role: 'Student', need: 'View class schedules, submitted assignments, and exam results.' },
      { role: 'Parent', need: 'Monitor child attendance, academic progress, and tuition payments.' },
    ],
    tables: [
      {
        name: 'students',
        description: 'Student academic profiles and enrollment records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Student identifier' },
          { name: 'nisn', type: 'VARCHAR(20)', nullable: false, key: 'UNIQUE', description: 'National Student Identification Number' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Student full legal name' },
          { name: 'gender', type: 'VARCHAR(10)', nullable: false, description: 'Student gender' },
          { name: 'date_of_birth', type: 'DATE', nullable: false, description: 'Student birth date' },
          { name: 'class_id', type: 'UUID', nullable: false, key: 'FK', description: 'References classes(id)' },
          { name: 'guardian_name', type: 'VARCHAR(150)', nullable: true, description: 'Parent/guardian name' },
          { name: 'guardian_phone', type: 'VARCHAR(20)', nullable: true, description: 'Parent contact phone' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Enrollment timestamp' },
        ],
      },
      {
        name: 'teachers',
        description: 'Faculty teacher profiles and subject specializations',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Teacher identifier' },
          { name: 'nip', type: 'VARCHAR(30)', nullable: false, key: 'UNIQUE', description: 'Teacher employee registration ID' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Teacher full name' },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, key: 'UNIQUE', description: 'Academic email' },
          { name: 'phone', type: 'VARCHAR(20)', nullable: true, description: 'Contact phone' },
          { name: 'specialization', type: 'VARCHAR(100)', nullable: false, description: 'Primary subject field (e.g. Mathematics)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Hire timestamp' },
        ],
      },
      {
        name: 'classes',
        description: 'Academic classrooms and grade levels',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Classroom identifier' },
          { name: 'class_name', type: 'VARCHAR(50)', nullable: false, description: 'Class label (e.g. 10-IPA-1)' },
          { name: 'grade_level', type: 'INTEGER', nullable: false, description: 'Grade level number (10, 11, 12)' },
          { name: 'homeroom_teacher_id', type: 'UUID', nullable: true, key: 'FK', description: 'References teachers(id)' },
          { name: 'academic_year', type: 'VARCHAR(20)', nullable: false, description: 'Academic year (e.g. 2025/2026)' },
        ],
      },
      {
        name: 'subjects',
        description: 'Curriculum course subject definitions',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Subject identifier' },
          { name: 'code', type: 'VARCHAR(20)', nullable: false, key: 'UNIQUE', description: 'Subject code (MATH101, ENG201)' },
          { name: 'name', type: 'VARCHAR(100)', nullable: false, description: 'Subject title' },
          { name: 'credit_hours', type: 'INTEGER', nullable: false, defaultVal: '2', description: 'Weekly credit hours' },
        ],
      },
      {
        name: 'grades',
        description: 'Student academic exam and assignment evaluation scores',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Grade record identifier' },
          { name: 'student_id', type: 'UUID', nullable: false, key: 'FK', description: 'References students(id)' },
          { name: 'subject_id', type: 'UUID', nullable: false, key: 'FK', description: 'References subjects(id)' },
          { name: 'teacher_id', type: 'UUID', nullable: false, key: 'FK', description: 'References teachers(id)' },
          { name: 'score', type: 'NUMERIC(5,2)', nullable: false, description: 'Evaluation score (0.00 - 100.00)' },
          { name: 'eval_type', type: 'VARCHAR(30)', nullable: false, description: 'Evaluation category (midterm, final, assignment, quiz)' },
          { name: 'semester', type: 'VARCHAR(10)', nullable: false, description: 'Semester (odd, even)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Grading timestamp' },
        ],
      },
      {
        name: 'attendances',
        description: 'Daily student attendance log',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Attendance record identifier' },
          { name: 'student_id', type: 'UUID', nullable: false, key: 'FK', description: 'References students(id)' },
          { name: 'date', type: 'DATE', nullable: false, description: 'Attendance date' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'present'", description: 'Attendance status (present, sick, excused, absent)' },
          { name: 'notes', type: 'TEXT', nullable: true, description: 'Optional absence reason notes' },
        ],
      },
    ],
    mermaidRelationships: [
      'CLASSES ||--o{ STUDENTS : contains',
      'TEACHERS ||--o| CLASSES : homeroom_for',
      'STUDENTS ||--o{ GRADINGS : receives',
      'SUBJECTS ||--o{ GRADINGS : evaluates',
      'STUDENTS ||--o{ ATTENDANCES : logged_in',
    ],
    requirements: [
      {
        feature: 'Student Information & Class Assignment',
        description: 'Administrators register students with NISN, assign them to classrooms, and link parent contact info.',
        userStory: 'As an admin, I want to register new students and assign them to 10-IPA-1 so their class roster is updated.',
        acceptanceCriteria: [
          'NISN must be 10 digits and unique across the school system.',
          'Class roster updates in real-time when student is assigned.',
          'Export class roster to PDF/Excel with one click.',
        ],
      },
      {
        feature: 'Teacher Gradebook & Report Card Generation',
        description: 'Teachers input student scores per subject. System calculates GPA and generates printable digital report cards.',
        userStory: 'As a teacher, I want to submit final exam scores so final report cards are auto-generated.',
        acceptanceCriteria: [
          'Grade input validates numeric scores between 0 and 100.',
          'Final report card computes weighted average automatically.',
          'Report card PDF downloadable by parents and students.',
        ],
      },
    ],
    userFlowSteps: [
      'Admin logs into School Portal → Registers new academic year & class rosters',
      'Teacher opens Gradebook → Selects class and subject → Inputs exam scores',
      'Student/Parent logs in → Views report card, attendance history, and school notices',
    ],
    kpis: ['Gradebook Completion Rate (100% before report release)', 'Daily Attendance Logging Time (<10 mins)', 'Parent Portal Activation Rate (>85%)'],
  },

  // 🏥 2. HEALTHCARE / HOSPITAL
  hospital: {
    id: 'hospital',
    name: 'Hospital & Clinical Information System',
    keywords: ['rumah sakit', 'klinik', 'hospital', 'pasien', 'patient', 'dokter', 'doctor', 'obat', 'resep', 'rekam medis', 'medical', 'kesehatan'],
    problemStatement: 'Healthcare facilities suffer from long patient wait times, misplaced medical records, prescription errors, and billing discrepancies between departments.',
    goals: [
      'Centralize Electronic Health Records (EHR) with strict HIPAA/privacy compliance.',
      'Reduce patient check-in to consultation wait time under 15 minutes.',
      'Digitalize pharmacy prescription fulfillment and medical billing.',
    ],
    targetUsers: [
      { role: 'Hospital Receptionist', need: 'Check in patients, verify insurance, and assign to doctor queues.' },
      { role: 'Physician / Doctor', need: 'Access patient medical history, record diagnoses, and issue e-prescriptions.' },
      { role: 'Pharmacist', need: 'Receive electronic prescriptions, check medicine stock, and dispense medications.' },
      { role: 'Patient', need: 'View medical appointment schedule, lab test results, and medical invoices.' },
    ],
    tables: [
      {
        name: 'patients',
        description: 'Patient medical registration and demographic profiles',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Patient identifier' },
          { name: 'nik', type: 'VARCHAR(20)', nullable: false, key: 'UNIQUE', description: 'National Identification Number' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Patient full name' },
          { name: 'gender', type: 'VARCHAR(10)', nullable: false, description: 'Gender (male, female)' },
          { name: 'date_of_birth', type: 'DATE', nullable: false, description: 'Date of birth' },
          { name: 'blood_type', type: 'VARCHAR(5)', nullable: true, description: 'Blood group (A+, O-, etc.)' },
          { name: 'address', type: 'TEXT', nullable: false, description: 'Residential address' },
          { name: 'phone', type: 'VARCHAR(20)', nullable: false, description: 'Contact phone' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Registration timestamp' },
        ],
      },
      {
        name: 'doctors',
        description: 'Medical staff physicians and specialization departments',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Doctor identifier' },
          { name: 'sip_number', type: 'VARCHAR(50)', nullable: false, key: 'UNIQUE', description: 'Medical License Practice Number (SIP)' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Doctor full name with titles' },
          { name: 'department', type: 'VARCHAR(100)', nullable: false, description: 'Specialist department (Cardiology, Pediatrics, etc.)' },
          { name: 'consultation_fee', type: 'NUMERIC(10,2)', nullable: false, description: 'Standard consultation fee' },
        ],
      },
      {
        name: 'appointments',
        description: 'Patient consultation booking records and queue tracking',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Appointment identifier' },
          { name: 'patient_id', type: 'UUID', nullable: false, key: 'FK', description: 'References patients(id)' },
          { name: 'doctor_id', type: 'UUID', nullable: false, key: 'FK', description: 'References doctors(id)' },
          { name: 'appointment_date', type: 'TIMESTAMP', nullable: false, description: 'Scheduled date and time' },
          { name: 'queue_number', type: 'INTEGER', nullable: false, description: 'Daily queue sequence number' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'scheduled'", description: 'Status (scheduled, waiting, in_consultation, completed, canceled)' },
        ],
      },
      {
        name: 'medical_records',
        description: 'Doctor examination notes, diagnoses, and medical histories',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Medical record identifier' },
          { name: 'patient_id', type: 'UUID', nullable: false, key: 'FK', description: 'References patients(id)' },
          { name: 'doctor_id', type: 'UUID', nullable: false, key: 'FK', description: 'References doctors(id)' },
          { name: 'appointment_id', type: 'UUID', nullable: false, key: 'FK', description: 'References appointments(id)' },
          { name: 'symptoms', type: 'TEXT', nullable: false, description: 'Patient reported symptoms' },
          { name: 'diagnosis', type: 'TEXT', nullable: false, description: 'Doctor medical diagnosis' },
          { name: 'treatment_notes', type: 'TEXT', nullable: true, description: 'Treatment & follow-up instructions' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Record creation timestamp' },
        ],
      },
      {
        name: 'prescriptions',
        description: 'Doctor medication prescriptions and pharmacy fulfillment',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Prescription identifier' },
          { name: 'medical_record_id', type: 'UUID', nullable: false, key: 'FK', description: 'References medical_records(id)' },
          { name: 'medicine_name', type: 'VARCHAR(150)', nullable: false, description: 'Medication name & dosage' },
          { name: 'dosage_instructions', type: 'TEXT', nullable: false, description: 'Dosage frequency (e.g. 3x1 after meal)' },
          { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Total units prescribed' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'pending'", description: 'Fulfillment status (pending, dispensed)' },
        ],
      },
    ],
    mermaidRelationships: [
      'PATIENTS ||--o{ APPOINTMENTS : books',
      'DOCTORS ||--o{ APPOINTMENTS : attends',
      'PATIENTS ||--o{ MEDICAL_RECORDS : holds',
      'DOCTORS ||--o{ MEDICAL_RECORDS : writes',
      'MEDICAL_RECORDS ||--o{ PRESCRIPTIONS : generates',
    ],
    requirements: [
      {
        feature: 'Patient Registration & Doctor Queue System',
        description: 'Receptionist registers patients, selects specialist doctor, and issues daily sequential queue number.',
        userStory: 'As a receptionist, I want to queue a patient for Cardiology so Dr. Smith sees them in sequence.',
        acceptanceCriteria: [
          'Queue number auto-increments per doctor per day.',
          'Queue display updates in real-time in waiting area TV display.',
        ],
      },
      {
        feature: 'Electronic Health Record (EHR) & E-Prescription',
        description: 'Doctors view patient history during consultation, record diagnosis, and dispatch e-prescription to pharmacy.',
        userStory: 'As a doctor, I want to input diagnosis and issue an e-prescription so the pharmacy prepares medicine immediately.',
        acceptanceCriteria: [
          'Medical records locked for editing 24 hours after consultation.',
          'Pharmacy receives instant alert when e-prescription is submitted.',
        ],
      },
    ],
    userFlowSteps: [
      'Patient arrives at Hospital → Receptionist registers/checks in patient → Queue ticket issued',
      'Doctor calls queue number → Reviews EHR history → Performs consultation → Inputs diagnosis & e-prescription',
      'Pharmacy dispenses medication → Cashier collects consultation & drug payment → Receipt issued',
    ],
    kpis: ['Average Patient Wait Time (<15 mins)', 'EHR Access Latency (<200ms)', 'E-Prescription Accuracy Rate (100%)'],
  },

  // 🍔 3. RESTAURANT / CAFE / POS
  restaurant: {
    id: 'restaurant',
    name: 'Restaurant POS & Table Order Management System',
    keywords: ['restoran', 'restaurant', 'cafe', 'kasir', 'pos', 'makanan', 'food', 'menu', 'meja', 'pesanan', 'order', 'dapur', 'kitchen'],
    problemStatement: 'Restaurants suffer from lost paper order tickets, slow kitchen dispatch, table order confusion during peak hours, and stock calculation errors at end of day.',
    goals: [
      'Process table order to kitchen display within 2 seconds.',
      'Support QR code self-ordering by customers directly from tables.',
      'Automate daily cashier revenue closing and payment settlement.',
    ],
    targetUsers: [
      { role: 'Cashier', need: 'Process order payments, print receipts, and accept cash/QRIS/card payments.' },
      { role: 'Waiter / Server', need: 'Take table orders on tablet and send items directly to kitchen.' },
      { role: 'Kitchen Staff', need: 'View incoming order tickets on Kitchen Display System (KDS) and mark items ready.' },
      { role: 'Restaurant Owner', need: 'Monitor real-time sales, best-selling menu items, and daily revenue.' },
    ],
    tables: [
      {
        name: 'menus',
        description: 'Food and beverage menu catalog with prices and stock status',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Menu item identifier' },
          { name: 'name', type: 'VARCHAR(150)', nullable: false, description: 'Menu item display name' },
          { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'Category (food, beverage, dessert, snack)' },
          { name: 'price', type: 'NUMERIC(10,2)', nullable: false, description: 'Price in local currency' },
          { name: 'image_url', type: 'TEXT', nullable: true, description: 'Food photo URL' },
          { name: 'is_available', type: 'BOOLEAN', nullable: false, defaultVal: 'true', description: 'Availability flag' },
        ],
      },
      {
        name: 'restaurant_tables',
        description: 'Physical table layout and real-time occupancy status',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Table identifier' },
          { name: 'table_number', type: 'VARCHAR(20)', nullable: false, key: 'UNIQUE', description: 'Table label (Table 01, VIP 02)' },
          { name: 'capacity', type: 'INTEGER', nullable: false, defaultVal: '4', description: 'Seat capacity' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'vacant'", description: 'Occupancy state (vacant, occupied, reserved)' },
        ],
      },
      {
        name: 'orders',
        description: 'Customer dining order transaction header',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Order record identifier' },
          { name: 'table_id', type: 'UUID', nullable: true, key: 'FK', description: 'References restaurant_tables(id)' },
          { name: 'order_type', type: 'VARCHAR(20)', nullable: false, defaultVal: "'dine_in'", description: 'Order type (dine_in, takeaway, delivery)' },
          { name: 'total_amount', type: 'NUMERIC(10,2)', nullable: false, defaultVal: '0.00', description: 'Grand total bill amount' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'pending'", description: 'Order status (pending, cooking, served, paid, canceled)' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Order creation timestamp' },
        ],
      },
      {
        name: 'order_items',
        description: 'Individual menu items included in dining order',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Item line identifier' },
          { name: 'order_id', type: 'UUID', nullable: false, key: 'FK', description: 'References orders(id)' },
          { name: 'menu_id', type: 'UUID', nullable: false, key: 'FK', description: 'References menus(id)' },
          { name: 'quantity', type: 'INTEGER', nullable: false, defaultVal: '1', description: 'Unit quantity ordered' },
          { name: 'unit_price', type: 'NUMERIC(10,2)', nullable: false, description: 'Price per unit at time of order' },
          { name: 'subtotal', type: 'NUMERIC(10,2)', nullable: false, description: 'Quantity * unit_price' },
          { name: 'special_instructions', type: 'TEXT', nullable: true, description: 'Custom note (e.g., "extra spicy, no ice")' },
        ],
      },
      {
        name: 'payments',
        description: 'Cashier checkout payment transactions',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Payment identifier' },
          { name: 'order_id', type: 'UUID', nullable: false, key: 'FK', description: 'References orders(id)' },
          { name: 'payment_method', type: 'VARCHAR(30)', nullable: false, description: 'Payment method (cash, qris, debit_card, credit_card)' },
          { name: 'amount_paid', type: 'NUMERIC(10,2)', nullable: false, description: 'Total customer payment' },
          { name: 'change_given', type: 'NUMERIC(10,2)', nullable: false, defaultVal: '0.00', description: 'Change returned' },
          { name: 'paid_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Payment timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      'RESTAURANT_TABLES ||--o{ ORDERS : assigned_to',
      'ORDERS ||--o{ ORDER_ITEMS : contains',
      'MENUS ||--o{ ORDER_ITEMS : chosen_in',
      'ORDERS ||--o| PAYMENTS : settled_by',
    ],
    requirements: [
      {
        feature: 'POS Touchscreen & Table Order Dispatch',
        description: 'Waiter selects table, taps menu items with quantity/custom notes, and dispatches order to kitchen screen.',
        userStory: 'As a waiter, I want to tap Table 05 and add 2x Nasi Goreng (no spicy) so kitchen starts cooking immediately.',
        acceptanceCriteria: [
          'Kitchen Display System (KDS) receives new order ticket within 1 second.',
          'Table status automatically toggles from vacant to occupied.',
        ],
      },
      {
        feature: 'Cashier Checkout & QRIS Receipt Payment',
        description: 'Cashier selects table bill, processes cash/QRIS payment, prints receipt, and frees table status.',
        userStory: 'As a cashier, I want to scan QRIS payment for Table 05 so bill is paid and receipt prints automatically.',
        acceptanceCriteria: [
          'Calculates tax (10%) and service charge (5%) automatically.',
          'Table status resets to vacant immediately upon payment completion.',
        ],
      },
    ],
    userFlowSteps: [
      'Customer sits at Table 04 → Waiter opens POS tablet → Selects Table 04',
      'Taps menu items → Adds notes → Dispatches order → Kitchen screen alerts cook',
      'Kitchen prepares food → Marks items served → Customer finishes meal → Cashier settles payment & prints receipt',
    ],
    kpis: ['Order-to-Kitchen Latency (<1 sec)', 'Table Turnover Time Rate (-15%)', 'Daily Cash Reconciliation Error Rate (0%)'],
  },

  // 🚗 4. RENTAL / VEHICLE / LOGISTICS
  rental: {
    id: 'rental',
    name: 'Vehicle Rental & Booking Management System',
    keywords: ['rental', 'sewa', 'mobil', 'car', 'motor', 'kendaraan', 'vehicle', 'logistik', 'fleet', 'sopir', 'driver'],
    problemStatement: 'Rental businesses struggle with double booking vehicles, unverified customer identity documents, untracked vehicle maintenance, and delayed return penalties.',
    goals: [
      'Prevent vehicle double-booking with real-time availability calendar.',
      'Verify customer identity (KTP/SIM) prior to booking approval.',
      'Track vehicle mileage, maintenance service dates, and overdue penalties.',
    ],
    targetUsers: [
      { role: 'Rental Manager', need: 'Approve bookings, assign drivers, and monitor fleet status.' },
      { role: 'Customer / Renter', need: 'Browse available cars, select rental dates, and book with driver option.' },
      { role: 'Driver / Fleet Staff', need: 'Receive job dispatches, record vehicle pick-up/return condition and mileage.' },
    ],
    tables: [
      {
        name: 'vehicles',
        description: 'Fleet vehicle inventory records and condition',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Vehicle identifier' },
          { name: 'license_plate', type: 'VARCHAR(20)', nullable: false, key: 'UNIQUE', description: 'Vehicle license plate number' },
          { name: 'brand', type: 'VARCHAR(50)', nullable: false, description: 'Brand (Toyota, Honda, Mitsubishi)' },
          { name: 'model', type: 'VARCHAR(50)', nullable: false, description: 'Model name (Avanza, Innova, Pajero)' },
          { name: 'year', type: 'INTEGER', nullable: false, description: 'Manufacture year' },
          { name: 'daily_rate', type: 'NUMERIC(10,2)', nullable: false, description: 'Rental price per 24 hours' },
          { name: 'status', type: 'VARCHAR(20)', nullable: false, defaultVal: "'available'", description: 'Vehicle state (available, rented, maintenance)' },
        ],
      },
      {
        name: 'renters',
        description: 'Customer renter profiles and identification verification',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Renter identifier' },
          { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Full legal name' },
          { name: 'identity_number', type: 'VARCHAR(30)', nullable: false, key: 'UNIQUE', description: 'KTP / Passport number' },
          { name: 'driver_license_num', type: 'VARCHAR(30)', nullable: false, description: 'Driver license SIM A number' },
          { name: 'phone', type: 'VARCHAR(20)', nullable: false, description: 'Contact phone' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Registration timestamp' },
        ],
      },
      {
        name: 'rental_bookings',
        description: 'Vehicle reservation and rental contract records',
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Booking identifier' },
          { name: 'renter_id', type: 'UUID', nullable: false, key: 'FK', description: 'References renters(id)' },
          { name: 'vehicle_id', type: 'UUID', nullable: false, key: 'FK', description: 'References vehicles(id)' },
          { name: 'start_date', type: 'TIMESTAMP', nullable: false, description: 'Rental start date & time' },
          { name: 'end_date', type: 'TIMESTAMP', nullable: false, description: 'Scheduled return date & time' },
          { name: 'total_price', type: 'NUMERIC(10,2)', nullable: false, description: 'Calculated rental duration * daily_rate' },
          { name: 'deposit_amount', type: 'NUMERIC(10,2)', nullable: false, description: 'Security deposit held' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'confirmed'", description: 'Status (confirmed, active, completed, canceled, overdue)' },
        ],
      },
    ],
    mermaidRelationships: [
      'RENTERS ||--o{ RENTAL_BOOKINGS : reserves',
      'VEHICLES ||--o{ RENTAL_BOOKINGS : assigned_in',
    ],
    requirements: [
      {
        feature: 'Vehicle Availability & Online Booking',
        description: 'Customer picks rental start/end date. System checks fleet availability and calculates total cost.',
        userStory: 'As a customer, I want to select 3 days rental for Innova so I see exact price and book online.',
        acceptanceCriteria: [
          'Calendar filters out vehicles booked during selected dates.',
          'Requires deposit payment to confirm reservation.',
        ],
      },
    ],
    userFlowSteps: [
      'Renter selects start/end dates → Chooses vehicle model → Uploads SIM/KTP',
      'Manager approves reservation → Renter pays deposit → Vehicle assigned',
      'Renter picks up vehicle → Drives → Returns vehicle → Inspection OK → Deposit refunded',
    ],
    kpis: ['Fleet Utilization Rate (>75%)', 'Double-Booking Incidents (0)', 'Late Return Fine Collection (>95%)'],
  },
};

/**
 * Dynamic Entity Synthesizer:
 * Synthesizes domain tables when a user inputs a completely custom project name
 * that doesn't match predefined templates (e.g. "Sistem Peternakan Ayam", "Aplikasi Kasur").
 */
export function synthesizeCustomDomain(projectName: string, description: string): DomainBlueprint {
  const cleanName = projectName.trim();
  const lowerName = cleanName.toLowerCase();
  const detailDesc = description || `${cleanName} workflow automation and data tracking.`;
  
  // Extract key nouns from project name
  const words = cleanName.split(/\s+/).filter(w => w.length > 2);
  const baseEntity = words[words.length - 1] || 'item';
  const entitySingular = baseEntity.toLowerCase().replace(/[^a-z0-9]/g, '');
  const entityPlural = `${entitySingular}s`;

  return {
    id: `custom-${entitySingular}`,
    name: `${cleanName} Custom Blueprint`,
    keywords: [lowerName],
    problemStatement: `${cleanName} solves domain operational challenges: ${detailDesc}`,
    goals: [
      `Automate core ${cleanName} operational workflows and data records.`,
      `Deliver real-time dashboard monitoring for ${entityPlural}.`,
      `Maintain 100% data audit compliance for domain entities.`,
    ],
    targetUsers: [
      { role: `${cleanName} Administrator`, need: `Full control over ${entityPlural} records, system settings, and reports.` },
      { role: 'End User / Operator', need: `Execute daily ${entitySingular} tasks with clear visual feedback.` },
    ],
    tables: [
      {
        name: entityPlural,
        description: `Primary domain entity catalog for ${cleanName}`,
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Primary key identifier' },
          { name: 'name', type: 'VARCHAR(255)', nullable: false, description: 'Entity display name / title' },
          { name: 'code', type: 'VARCHAR(50)', nullable: false, key: 'UNIQUE', description: 'Unique code identifier' },
          { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Entity classification category' },
          { name: 'status', type: 'VARCHAR(30)', nullable: false, defaultVal: "'active'", description: 'Operational status flag' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Record creation timestamp' },
        ],
      },
      {
        name: `${entitySingular}_logs`,
        description: `Operational event tracking log for ${entitySingular} activities`,
        columns: [
          { name: 'id', type: 'UUID', nullable: false, key: 'PK', description: 'Log entry identifier' },
          { name: `${entitySingular}_id`, type: 'UUID', nullable: false, key: 'FK', description: `References ${entityPlural}(id)` },
          { name: 'action_type', type: 'VARCHAR(50)', nullable: false, description: 'Action performed' },
          { name: 'notes', type: 'TEXT', nullable: true, description: 'Event detail notes' },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Log timestamp' },
        ],
      },
    ],
    mermaidRelationships: [
      `${entityPlural.toUpperCase()} ||--o{ ${entitySingular.toUpperCase()}_LOGS : logs_activity`,
    ],
    requirements: [
      {
        feature: `${cleanName} Entity Management`,
        description: `Users can create, view, search, and manage ${entityPlural} records with instant validation.`,
        userStory: `As an operator, I want to add new ${entityPlural} so they are tracked in the system database.`,
        acceptanceCriteria: [
          `Unique code constraint enforced for each ${entitySingular}.`,
          `List view filterable by category and status.`,
        ],
      },
    ],
    userFlowSteps: [
      `Operator opens ${cleanName} Workspace → Navigates to ${entityPlural} management`,
      `Inputs new ${entitySingular} details → System validates code uniqueness → Saves record`,
      `Views activity history log → Exports operational report`,
    ],
    kpis: [`${entitySingular.toUpperCase()} Record Accuracy Rate (>99%)`, `Task Execution Latency (<100ms)`],
  };
}

// ─── localStorage helpers ──────────────────────────────────────────────────
const load = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
const save = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// ─── Default seed data ─────────────────────────────────────────────────────
const DEFAULT_COLLEGES = [
  { id: 1, name: 'MIT College of Engineering', email: 'admin@mit.edu', address: 'Pune, Maharashtra', phone: '+91 98765 43210' },
  { id: 2, name: 'IIT Bombay', email: 'admin@iitb.ac.in', address: 'Mumbai, Maharashtra', phone: '+91 22 2572 2545' },
  { id: 3, name: 'VIT University', email: 'admin@vit.ac.in', address: 'Vellore, Tamil Nadu', phone: '+91 416 220 2020' },
];

const DEFAULT_ADMINS = [
  { id: 1, name: 'Dr. Rajesh Kumar',   email: 'admin@mit.edu',    password: 'admin123', college_id: 1 },
  { id: 2, name: 'Prof. Anita Sharma', email: 'admin@iitb.ac.in', password: 'admin123', college_id: 2 },
  { id: 3, name: 'Dr. Suresh Menon',   email: 'admin@vit.ac.in',  password: 'admin123', college_id: 3 },
];

const DEFAULT_STUDENTS = [
  { id: 1, name: 'Arjun Mehta',  email: 'arjun@student.edu',  password: 'student123', roll_no: 'CS2024001', department: 'Computer Science', semester: 5, phone: '+91 98765 11111', address: 'Mumbai, MH',    college_id: 1 },
  { id: 2, name: 'Priya Patel',  email: 'priya@student.edu',  password: 'student123', roll_no: 'CS2024002', department: 'Computer Science', semester: 5, phone: '+91 98765 22222', address: 'Pune, MH',      college_id: 1 },
  { id: 3, name: 'Rahul Singh',  email: 'rahul@student.edu',  password: 'student123', roll_no: 'EC2024001', department: 'Electronics',      semester: 3, phone: '+91 98765 33333', address: 'Delhi',          college_id: 1 },
  { id: 4, name: 'Sneha Reddy',  email: 'sneha@student.edu',  password: 'student123', roll_no: 'ME2024001', department: 'Mechanical',       semester: 7, phone: '+91 98765 44444', address: 'Hyderabad, TS', college_id: 1 },
  { id: 5, name: 'Vikram Nair',  email: 'vikram@student.edu', password: 'student123', roll_no: 'CS2024003', department: 'Computer Science', semester: 5, phone: '+91 98765 55555', address: 'Kochi, KL',     college_id: 1 },
];

const DEFAULT_RESULTS = [
  { id: 1, student_id: 1, semester: 4, subject: 'Data Structures',    marks: 88, max_marks: 100, grade: 'A'  },
  { id: 2, student_id: 1, semester: 4, subject: 'Operating Systems',  marks: 76, max_marks: 100, grade: 'B+' },
  { id: 3, student_id: 1, semester: 4, subject: 'DBMS',               marks: 92, max_marks: 100, grade: 'A+' },
  { id: 4, student_id: 1, semester: 4, subject: 'Computer Networks',  marks: 81, max_marks: 100, grade: 'A'  },
  { id: 5, student_id: 1, semester: 3, subject: 'Mathematics III',    marks: 70, max_marks: 100, grade: 'B+' },
  { id: 6, student_id: 1, semester: 3, subject: 'Digital Electronics',marks: 85, max_marks: 100, grade: 'A'  },
  { id: 7, student_id: 2, semester: 4, subject: 'Data Structures',    marks: 95, max_marks: 100, grade: 'O'  },
  { id: 8, student_id: 2, semester: 4, subject: 'Operating Systems',  marks: 88, max_marks: 100, grade: 'A'  },
];

const DEFAULT_NOTICES = [
  { id: 1, title: 'Semester Exam Schedule Released',   description: 'The end semester examination schedule for all departments has been released. Students are advised to check the timetable and prepare accordingly. Hall tickets will be distributed one week before exams.', priority: 'high',   college_id: 1, created_at: '2024-11-20T10:00:00Z' },
  { id: 2, title: 'Annual Tech Fest - TechVerse 2024', description: 'The annual technical festival TechVerse 2024 will be held from December 15-17. Students can register for hackathons, coding competitions, and robotics challenges. Registration deadline is December 10.',    priority: 'medium', college_id: 1, created_at: '2024-11-18T09:00:00Z' },
  { id: 3, title: 'Library Timing Change',             description: 'The central library will now remain open from 8 AM to 10 PM on weekdays and 9 AM to 6 PM on weekends. Students are requested to carry their ID cards at all times.',                                           priority: 'low',    college_id: 1, created_at: '2024-11-15T08:00:00Z' },
  { id: 4, title: 'Placement Drive - Google & Microsoft', description: 'Google and Microsoft will be conducting campus placement drives on December 5th and 6th respectively. Eligible students (CGPA >= 7.5) must register by November 30th.',                                    priority: 'high',   college_id: 1, created_at: '2024-11-12T11:00:00Z' },
];

const DEFAULT_LEAVES = [
  { id: 1, student_id: 1, student_name: 'Arjun Mehta', roll_no: 'CS2024001', reason: 'Medical emergency - fever and hospitalization',    from_date: '2024-11-25', to_date: '2024-11-27', status: 'approved', admin_remark: 'Approved. Get well soon.',          created_at: '2024-11-24T10:00:00Z' },
  { id: 2, student_id: 2, student_name: 'Priya Patel', roll_no: 'CS2024002', reason: "Family function - sister's wedding ceremony",       from_date: '2024-12-01', to_date: '2024-12-03', status: 'pending',  admin_remark: '',                                  created_at: '2024-11-22T09:00:00Z' },
  { id: 3, student_id: 3, student_name: 'Rahul Singh', roll_no: 'EC2024001', reason: 'Attending national level coding competition',       from_date: '2024-11-28', to_date: '2024-11-29', status: 'approved', admin_remark: 'Approved for academic activity.',    created_at: '2024-11-20T08:00:00Z' },
  { id: 4, student_id: 4, student_name: 'Sneha Reddy', roll_no: 'ME2024001', reason: 'Personal work',                                    from_date: '2024-11-30', to_date: '2024-11-30', status: 'rejected', admin_remark: 'Insufficient reason provided.',       created_at: '2024-11-19T07:00:00Z' },
];

const DEFAULT_FEES = [
  { id: 1, student_id: 1, student_name: 'Arjun Mehta', roll_no: 'CS2024001', amount: 45000, description: 'Semester 5 Tuition Fee', status: 'paid',    due_date: '2024-11-30', paid_at: '2024-11-10T10:00:00Z', created_at: '2024-10-01T00:00:00Z' },
  { id: 2, student_id: 1, student_name: 'Arjun Mehta', roll_no: 'CS2024001', amount: 5000,  description: 'Library & Lab Fee',       status: 'pending', due_date: '2024-12-15', paid_at: null,                   created_at: '2024-10-01T00:00:00Z' },
  { id: 3, student_id: 2, student_name: 'Priya Patel', roll_no: 'CS2024002', amount: 45000, description: 'Semester 5 Tuition Fee', status: 'paid',    due_date: '2024-11-30', paid_at: '2024-11-08T10:00:00Z', created_at: '2024-10-01T00:00:00Z' },
  { id: 4, student_id: 3, student_name: 'Rahul Singh', roll_no: 'EC2024001', amount: 42000, description: 'Semester 3 Tuition Fee', status: 'pending', due_date: '2024-12-01', paid_at: null,                   created_at: '2024-10-01T00:00:00Z' },
  { id: 5, student_id: 4, student_name: 'Sneha Reddy', roll_no: 'ME2024001', amount: 40000, description: 'Semester 7 Tuition Fee', status: 'paid',    due_date: '2024-11-30', paid_at: '2024-11-05T10:00:00Z', created_at: '2024-10-01T00:00:00Z' },
];

const DEFAULT_PLACEMENTS = [
  { id: 1, company_name: 'Google',    role: 'Software Engineer', description: 'Full-stack development role on Google Cloud products.',          eligibility: 'CGPA >= 7.5, CS/IT branch, No active backlogs', package: '45 LPA',          deadline: '2024-12-05', college_id: 1, created_at: '2024-11-01T00:00:00Z' },
  { id: 2, company_name: 'Microsoft', role: 'SDE-1',             description: "Join Microsoft's Azure team to build scalable infrastructure.", eligibility: 'CGPA >= 7.0, All branches eligible',             package: '40 LPA',          deadline: '2024-12-06', college_id: 1, created_at: '2024-11-02T00:00:00Z' },
  { id: 3, company_name: 'Amazon',    role: 'SDE Intern',        description: '6-month internship with AWS. PPO for top performers.',          eligibility: 'CGPA >= 6.5, Pre-final year students',           package: '8 LPA (Stipend)', deadline: '2024-12-10', college_id: 1, created_at: '2024-11-03T00:00:00Z' },
  { id: 4, company_name: 'Infosys',   role: 'Systems Engineer',  description: 'Entry-level role with comprehensive training program.',         eligibility: 'CGPA >= 6.0, All branches',                      package: '6.5 LPA',         deadline: '2024-12-20', college_id: 1, created_at: '2024-11-04T00:00:00Z' },
  { id: 5, company_name: 'Flipkart',  role: 'Product Analyst',   description: "Data-driven product role at India's leading e-commerce.",       eligibility: 'CGPA >= 7.0, CS/IT/MBA',                         package: '18 LPA',          deadline: '2024-12-15', college_id: 1, created_at: '2024-11-05T00:00:00Z' },
];

// ─── Seed once ─────────────────────────────────────────────────────────────
if (!localStorage.getItem('erp_seeded')) {
  save('erp_colleges',   DEFAULT_COLLEGES);
  save('erp_admins',     DEFAULT_ADMINS);
  save('erp_students',   DEFAULT_STUDENTS);
  save('erp_results',    DEFAULT_RESULTS);
  save('erp_notices',    DEFAULT_NOTICES);
  save('erp_leaves',     DEFAULT_LEAVES);
  save('erp_fees',       DEFAULT_FEES);
  save('erp_placements', DEFAULT_PLACEMENTS);
  localStorage.setItem('erp_seeded', '1');
}

// ─── ID generator ──────────────────────────────────────────────────────────
export const getNextId = () => Date.now() + Math.floor(Math.random() * 1000);

// ─── Colleges ──────────────────────────────────────────────────────────────
export const getColleges = () => load('erp_colleges', DEFAULT_COLLEGES);

export const addCollege = ({ name, email, address, phone, adminName, password }) => {
  const list = getColleges();
  if (list.find(c => c.email === email))
    return { success: false, message: 'A college with this email already exists' };
  const newCollege = { id: getNextId(), name, email, address, phone };
  save('erp_colleges', [...list, newCollege]);
  // also create admin account for this college
  const admins = getAdmins();
  save('erp_admins', [...admins, { id: getNextId(), name: adminName || name, email, password, college_id: newCollege.id }]);
  return { success: true, college: newCollege };
};

// ─── Admins ────────────────────────────────────────────────────────────────
export const getAdmins   = () => load('erp_admins', DEFAULT_ADMINS);
export const saveAdmins  = (list) => save('erp_admins', list);

// ─── Students ──────────────────────────────────────────────────────────────
export const getStudents  = (college_id) => load('erp_students', DEFAULT_STUDENTS).filter(s => s.college_id === Number(college_id));
export const getAllStudents = () => load('erp_students', DEFAULT_STUDENTS);
export const saveStudents = (list) => save('erp_students', list);

export const addStudent = (data) => {
  const list = getAllStudents();
  if (list.find(s => s.email === data.email))
    return { success: false, message: 'Email already exists' };
  const student = { ...data, id: getNextId() };
  save('erp_students', [...list, student]);
  return { success: true, student };
};

export const updateStudent = (id, data) => {
  const list = getAllStudents();
  save('erp_students', list.map(s => s.id === Number(id) ? { ...s, ...data } : s));
};

export const deleteStudent = (id) => {
  save('erp_students', getAllStudents().filter(s => s.id !== Number(id)));
};

// ─── Results ───────────────────────────────────────────────────────────────
export const getResults    = (student_id) => load('erp_results', DEFAULT_RESULTS).filter(r => r.student_id === Number(student_id));
export const saveResults   = (list) => save('erp_results', list);

export const uploadResults = (student_id, semester, rows) => {
  const all = load('erp_results', DEFAULT_RESULTS).filter(r => !(r.student_id === Number(student_id) && r.semester === Number(semester)));
  const newRows = rows.map(r => ({ ...r, id: getNextId(), student_id: Number(student_id), semester: Number(semester) }));
  save('erp_results', [...all, ...newRows]);
};

// ─── Notices ───────────────────────────────────────────────────────────────
export const getNotices   = (college_id) => load('erp_notices', DEFAULT_NOTICES).filter(n => n.college_id === Number(college_id));
export const saveNotices  = (list) => save('erp_notices', list);

// ─── Leaves ────────────────────────────────────────────────────────────────
export const getLeaves    = () => load('erp_leaves', DEFAULT_LEAVES);
export const saveLeaves   = (list) => save('erp_leaves', list);

// ─── Fees ──────────────────────────────────────────────────────────────────
export const getFees      = () => load('erp_fees', DEFAULT_FEES);
export const saveFees     = (list) => save('erp_fees', list);

// ─── Placements ────────────────────────────────────────────────────────────
export const getPlacements  = (college_id) => load('erp_placements', DEFAULT_PLACEMENTS).filter(p => p.college_id === Number(college_id));
export const savePlacements = (list) => save('erp_placements', list);

// ─── Helpdesk Tickets ─────────────────────────────────────────────────────
const DEFAULT_TICKETS = [
  { id: 1, student_id: 1, student_name: 'Arjun Mehta', roll_no: 'CS2024001', college_id: 1, category: 'Academic', subject: 'Result not updated for Semester 3', description: 'My semester 3 results have not been updated on the portal even though exams were conducted 2 months ago. Please look into this.', status: 'resolved', priority: 'high', admin_reply: 'Results have been updated. Please refresh and check.', created_at: '2024-11-10T10:00:00Z', resolved_at: '2024-11-12T14:00:00Z' },
  { id: 2, student_id: 2, student_name: 'Priya Patel', roll_no: 'CS2024002', college_id: 1, category: 'Fees', subject: 'Fee receipt not generated after payment', description: 'I paid my semester 5 tuition fee 3 days ago but the receipt has not been generated. Transaction ID: TXN123456789.', status: 'open', priority: 'high', admin_reply: '', created_at: '2024-11-18T09:00:00Z', resolved_at: null },
  { id: 3, student_id: 3, student_name: 'Rahul Singh', roll_no: 'EC2024001', college_id: 1, category: 'Technical', subject: 'Unable to login to student portal', description: 'I am getting an invalid credentials error even though I am using the correct password. Please reset my account.', status: 'in-progress', priority: 'medium', admin_reply: 'We are looking into this. Will update shortly.', created_at: '2024-11-20T08:00:00Z', resolved_at: null },
];

export const getTickets = () => load('erp_tickets', DEFAULT_TICKETS);
export const saveTickets = (list) => save('erp_tickets', list);

export const addTicket = (data) => {
  const all = getTickets();
  const ticket = { ...data, id: getNextId(), status: 'open', admin_reply: '', created_at: new Date().toISOString(), resolved_at: null };
  save('erp_tickets', [ticket, ...all]);
  return ticket;
};

export const updateTicket = (id, updates) => {
  const all = getTickets();
  save('erp_tickets', all.map(t => t.id === Number(id) ? { ...t, ...updates } : t));
};

// ─── Password Reset Tokens ────────────────────────────────────────────────
export const createResetToken = (email) => {
  const students = getAllStudents();
  const student = students.find(s => s.email === email);
  if (!student) return { success: false, message: 'No student found with this email' };
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  const tokens = load('erp_reset_tokens', {});
  tokens[token] = { email, expiry, studentId: student.id };
  save('erp_reset_tokens', tokens);
  return { success: true, token, studentName: student.name, email };
};

export const validateResetToken = (token) => {
  const tokens = load('erp_reset_tokens', {});
  const data = tokens[token];
  if (!data) return { valid: false, message: 'Invalid or expired reset link' };
  if (Date.now() > data.expiry) return { valid: false, message: 'Reset link has expired. Please request a new one.' };
  return { valid: true, ...data };
};

export const resetPassword = (token, newPassword) => {
  const check = validateResetToken(token);
  if (!check.valid) return { success: false, message: check.message };
  const students = getAllStudents();
  save('erp_students', students.map(s => s.id === check.studentId ? { ...s, password: newPassword } : s));
  // invalidate token
  const tokens = load('erp_reset_tokens', {});
  delete tokens[token];
  save('erp_reset_tokens', tokens);
  // log the reset event for admin visibility
  const logs = load('erp_password_resets', []);
  const student = students.find(s => s.id === check.studentId);
  logs.unshift({ id: getNextId(), student_id: check.studentId, student_name: student?.name, email: check.email, reset_at: new Date().toISOString() });
  save('erp_password_resets', logs);
  return { success: true };
};

export const getPasswordResetLogs = () => load('erp_password_resets', []);

// ─── Chart data ────────────────────────────────────────────────────────────
export const chartData = [
  { month: 'Jan', students: 40, fees: 180000 },
  { month: 'Feb', students: 55, fees: 247500 },
  { month: 'Mar', students: 70, fees: 315000 },
  { month: 'Apr', students: 65, fees: 292500 },
  { month: 'May', students: 90, fees: 405000 },
  { month: 'Jun', students: 110, fees: 495000 },
];


import { Gift, Donor, Task } from './types';

// ... (Keep existing MOCK_DONORS, MOCK_GIFTS, FIELD_WORKERS, MOCK_TASKS as they are) ...

export const MOCK_DONORS: Donor[] = [
  { id: 'donor1', name: 'Alice Smith', email: 'alice@example.com' },
  { id: 'donor2', name: 'Bob Johnson', email: 'bob@example.com' },
  { id: 'donor3', name: 'Charlie Lee', email: 'charlie@example.com' },
  { id: 'donor4', name: 'Diana Prince', email: 'diana@example.com' },
  { id: 'donor5', name: 'Evan Wright', email: 'evan@example.com' },
];

export const MOCK_GIFTS: Gift[] = [
  {
    id: 'gift1',
    donorId: 'donor1',
    donorName: 'Alice Smith',
    date: '2023-11-15T10:30:00Z',
    amount: 250.00,
    status: 'succeeded',
    paymentMethod: 'online',
    paymentInstrument: 'card',
    paymentLabel: 'Visa •••• 4242',
    type: 'one-time',
    recurringInfo: undefined,
    failureReason: undefined,
  },
  {
    id: 'gift2',
    donorId: 'donor2',
    donorName: 'Bob Johnson',
    date: '2023-11-20T08:15:00Z',
    amount: 100.00,
    status: 'pending',
    paymentMethod: 'online',
    paymentInstrument: 'ach',
    paymentLabel: 'Bank Account',
    type: 'recurring',
    recurringInfo: {
      frequency: 'Monthly',
      startDate: '2023-01-01T00:00:00Z',
      nextPaymentDate: '2023-12-01T00:00:00Z'
    },
    failureReason: undefined,
  },
  {
    id: 'gift3',
    donorId: 'donor3',
    donorName: 'Charlie Lee',
    date: '2023-11-22T14:45:00Z',
    amount: 500.00,
    status: 'failed',
    paymentMethod: 'offline',
    paymentInstrument: 'check',
    paymentLabel: 'Check #1024',
    type: 'one-time',
    recurringInfo: undefined,
    failureReason: 'Insufficient Funds',
  },
  {
    id: 'gift4',
    donorId: 'donor1',
    donorName: 'Alice Smith',
    date: '2023-10-15T09:00:00Z',
    amount: 250.00,
    status: 'succeeded',
    paymentMethod: 'online',
    paymentInstrument: 'card',
    paymentLabel: 'Visa •••• 4242',
    type: 'one-time',
  },
  {
    id: 'gift5',
    donorId: 'donor4',
    donorName: 'Diana Prince',
    date: '2023-11-25T11:20:00Z',
    amount: 50.00,
    status: 'succeeded',
    paymentMethod: 'online',
    paymentInstrument: 'card',
    paymentLabel: 'Mastercard •••• 8888',
    type: 'recurring',
    recurringInfo: {
      frequency: 'Monthly',
      startDate: '2023-06-01T00:00:00Z',
      nextPaymentDate: '2023-12-25T00:00:00Z'
    }
  },
  {
    id: 'gift6',
    donorId: 'donor5',
    donorName: 'Evan Wright',
    date: '2023-11-26T16:00:00Z',
    amount: 1000.00,
    status: 'succeeded',
    paymentMethod: 'offline',
    paymentInstrument: 'check',
    paymentLabel: 'Check #5050',
    type: 'one-time',
  }
];

export interface FieldWorker {
  id: string;
  title: string;
  location: string;
  image: string;
  raised: number;
  goal: number;
  description: string;
  category: string;
}

export const FIELD_WORKERS: FieldWorker[] = [
  { 
    id: '1', 
    title: 'The Miller Family', 
    location: 'Chiang Mai, Thailand', 
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop', 
    raised: 28450, 
    goal: 35000, 
    category: 'Education',
    description: 'We are dedicated to providing educational resources and English language training to rural communities in Northern Thailand. Your support helps us run after-school programs and summer camps for over 200 children, bridging the gap for those who lack access to quality schooling.' 
  },
  { 
    id: '2', 
    title: 'Dr. Sarah Smith', 
    location: 'Nairobi, Kenya', 
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop',
    raised: 12200, 
    goal: 15000, 
    category: 'Medical',
    description: 'Serving as a lead nurse practitioner in community health clinics. My focus is on maternal health, vaccination drives, and preventative care for families in informal settlements who lack access to basic medical services.' 
  },
  { 
    id: '3', 
    title: 'The Santos Family', 
    location: 'São Paulo, Brazil', 
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2000&auto=format&fit=crop',
    raised: 18500, 
    goal: 20000, 
    category: 'Community Development',
    description: 'Partnering with local favela leaders to build sustainable water filtration systems and community gardens. We believe in empowering local residents to take ownership of their infrastructure and food sources.' 
  },
  { 
    id: '4', 
    title: 'David Chen', 
    location: 'Phnom Penh, Cambodia', 
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2000&auto=format&fit=crop',
    raised: 6500, 
    goal: 12000, 
    category: 'Technology',
    description: 'Teaching coding, robotics, and digital literacy skills to young adults. By equipping the next generation with tech skills, we help them break the cycle of poverty and find gainful employment in the growing Asian tech sector.' 
  },
  { 
    id: '5', 
    title: 'Elena & Marco Rossi', 
    location: 'Lesbos, Greece', 
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2000&auto=format&fit=crop',
    raised: 42000, 
    goal: 50000, 
    category: 'Refugee Aid',
    description: 'Providing emergency relief, legal aid, and trauma counseling to displaced families arriving in Europe. We run a community center that offers a safe haven, warm meals, and language classes for refugees navigating a new life.' 
  },
  { 
    id: '6', 
    title: 'Dr. Amina Osei', 
    location: 'Accra, Ghana', 
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=2000&auto=format&fit=crop',
    raised: 89000, 
    goal: 100000, 
    category: 'Clean Water',
    description: 'Leading the "Water for Life" initiative, drilling boreholes and installing solar-powered pumps in drought-affected regions. Clean water changes everything—health, education, and economic opportunity.' 
  },
  { 
    id: '7', 
    title: 'Project: Himalayan Hope', 
    location: 'Kathmandu, Nepal', 
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop',
    raised: 15000, 
    goal: 60000, 
    category: 'Disaster Relief',
    description: 'Rebuilding homes and schools in earthquake-affected remote villages. We focus on earthquake-resistant architecture and training local masons in sustainable building techniques.' 
  },
  { 
    id: '8', 
    title: 'The Anderson Team', 
    location: 'Antigua, Guatemala', 
    image: 'https://images.unsplash.com/photo-1625246333195-551e512346cd?q=80&w=2000&auto=format&fit=crop',
    raised: 31000, 
    goal: 45000, 
    category: 'Agriculture',
    description: 'Working with coffee farming cooperatives to fight coffee rust disease and improve crop yields. We provide fair trade market access and agricultural training to ensure farmers earn a living wage.' 
  },
  { 
    id: '9', 
    title: 'Maria Gonzalez', 
    location: 'Manila, Philippines', 
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2000&auto=format&fit=crop',
    raised: 18000, 
    goal: 25000, 
    category: 'Human Rights',
    description: 'Advocating for the rights of women and children in urban slums. We operate a safe house and vocational training center for survivors of trafficking, offering them a path to healing and independence.' 
  },
];

export const getFieldWorkers = () => FIELD_WORKERS;

export const getFieldWorkerById = (id: string) => FIELD_WORKERS.find(w => w.id === id);

export const MOCK_TASKS: Task[] = [
  { 
    id: "task-1", 
    title: "Call Alice Smith", 
    description: "Thank her for the recent $250 gift and ask about her family.", 
    status: "open", 
    priority: "high", 
    type: "call",
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    donorId: "donor1",
    createdAt: new Date().toISOString()
  },
  { 
    id: "task-2", 
    title: "Send End of Year Update", 
    description: "Draft the Q4 newsletter for all monthly partners.", 
    status: "open", 
    priority: "medium", 
    type: "email",
    dueDate: new Date().toISOString().split('T')[0], // Today
    createdAt: new Date().toISOString()
  },
  { 
    id: "task-3", 
    title: "Lunch with Bob Johnson", 
    description: "Discuss the upcoming building project funding.", 
    status: "open", 
    priority: "low", 
    type: "meeting",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // In 2 days
    donorId: "donor2",
    createdAt: new Date().toISOString()
  },
  { 
    id: "task-4", 
    title: "Update Payment Info for Charlie", 
    description: "Charlie's card failed. Call to get new details.", 
    status: "completed", 
    priority: "high", 
    type: "todo",
    dueDate: "2023-11-01", 
    donorId: "donor3",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-5",
    title: "Prepare Tax Receipts",
    description: "Generate and mail annual tax receipts for 2023.",
    status: "open", 
    priority: "high", 
    type: "todo",
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // In 5 days
    createdAt: new Date().toISOString()
  }
];

// --- Support Hub Mock Data ---

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  type: 'Chat' | 'Email';
  requestor: string;
  requestorEmail: string;
  requestorAvatar?: string;
  requestorLocation?: string;
  requestorHistory?: { date: string; action: string }[];
  date: string;
  lastUpdate: string;
  category: string;
  assignedTo?: string; // Agent ID or Name
  tags: string[];
  messages: {
    id: string;
    sender: string;
    senderAvatar?: string;
    text: string;
    timestamp: string;
    type: 'message' | 'note'; // Public message or Internal note
  }[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  views: number;
}

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TIC-4921",
    subject: "Donor unable to update credit card",
    status: "Open",
    priority: "High",
    type: 'Email',
    requestor: "Alice Johnson",
    requestorEmail: "alice.j@example.com",
    requestorLocation: "Denver, CO",
    requestorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80",
    requestorHistory: [
        { date: 'Oct 10, 2024', action: 'Donated $200' },
        { date: 'Sep 10, 2024', action: 'Donated $200' },
    ],
    date: "2024-10-24T10:00:00Z",
    lastUpdate: "2h ago",
    category: "Payment",
    tags: ["billing", "stripe", "urgent"],
    assignedTo: "Me",
    messages: [
      { 
        id: "m1", 
        sender: "Alice Johnson", 
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80",
        text: "I'm trying to update my Visa ending in 4242 but I keep getting a timeout error.", 
        timestamp: "10:00 AM", 
        type: 'message' 
      },
      {
        id: "m2",
        sender: "System",
        text: "Checked Stripe logs. Failed with 'Do Not Honor' code.",
        timestamp: "10:05 AM",
        type: 'note'
      }
    ]
  },
  {
    id: "TIC-4850",
    subject: "Question about Year-End Receipt",
    status: "Pending",
    priority: "Medium",
    type: 'Chat',
    requestor: "Robert Smith",
    requestorEmail: "bob.smith@example.com",
    requestorLocation: "Boulder, CO",
    requestorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80",
    date: "2024-10-23T14:30:00Z",
    lastUpdate: "1d ago",
    category: "Finance",
    tags: ["tax-receipt", "inquiry"],
    assignedTo: "Sarah",
    messages: [
      { id: "m1", sender: "Robert Smith", text: "When will the 2023 tax receipts be mailed out?", timestamp: "Oct 23, 2:30 PM", type: 'message' },
      { id: "m2", sender: "Sarah (Agent)", text: "Hi Robert, we will begin mailing them on Jan 15th.", timestamp: "Oct 23, 3:00 PM", type: 'message' }
    ]
  },
  {
    id: "TIC-4720",
    subject: "Bug in Email Studio template",
    status: "Resolved",
    priority: "Low",
    type: 'Email',
    requestor: "The Miller Family",
    requestorEmail: "millers@givehope.org",
    requestorLocation: "Thailand",
    requestorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=facearea&facepad=2&w=256&h=256&q=80",
    date: "2024-10-20T09:15:00Z",
    lastUpdate: "3d ago",
    category: "Technical",
    tags: ["bug", "email-studio"],
    assignedTo: "Dev Team",
    messages: [
      { id: "m1", sender: "Mark Miller", text: "The header image isn't aligning center on mobile.", timestamp: "Oct 20, 9:15 AM", type: 'message' }
    ]
  }
];

export const MOCK_ARTICLES: KnowledgeArticle[] = [
  { 
    id: "kb-1", 
    title: "How to process a refund in Stripe", 
    excerpt: "Step-by-step guide to issuing full or partial refunds directly from the dashboard.", 
    category: "Finance", 
    readTime: "3 min", 
    views: 1204,
    content: `
      <p>Refunding a donation is a sensitive process, but our dashboard makes it straightforward and secure.</p>
      <h3>Steps to Refund:</h3>
      <ol>
        <li>Navigate to the <strong>Contributions Hub</strong>.</li>
        <li>Locate the transaction using the search bar or filters.</li>
        <li>Click the "Actions" menu (three dots) on the transaction row.</li>
        <li>Select <strong>Issue Refund</strong>.</li>
        <li>Choose "Full Refund" or enter a partial amount.</li>
        <li>Click confirm. The donor will receive an email notification immediately.</li>
      </ol>
      <p><strong>Note:</strong> Refunds typically take 5-10 business days to appear on the donor's statement depending on their bank.</p>
    `
  },
  { 
    id: "kb-2", 
    title: "Setting up a new campaign page", 
    excerpt: "Learn how to use Web Studio to launch a fundraising landing page in minutes.", 
    category: "Web Studio", 
    readTime: "5 min", 
    views: 890,
    content: `
      <p>Web Studio allows you to create beautiful, high-converting donation pages without writing a single line of code.</p>
      <h3>Getting Started</h3>
      <p>Go to <strong>Web Studio</strong> in the sidebar and click "New Page". You can choose from 3 templates:</p>
      <ul>
        <li><strong>Emergency Response:</strong> Optimized for speed and urgency.</li>
        <li><strong>Project Funding:</strong> Best for specific initiatives with a goal bar.</li>
        <li><strong>General Giving:</strong> A clean, branded checkout experience.</li>
      </ul>
      <p>Once you select a template, use the visual editor to upload your hero image, write your story, and set your fundraising goal.</p>
    `
  },
  { 
    id: "kb-3", 
    title: "Troubleshooting email delivery", 
    excerpt: "Common reasons why donors might not be receiving your newsletters and how to fix DNS settings.", 
    category: "Technical", 
    readTime: "7 min", 
    views: 560,
    content: `
      <p>If your open rates are dropping, it might be a deliverability issue. Here are the most common culprits:</p>
      <h3>1. DKIM & SPF Records</h3>
      <p>Ensure your domain's DNS settings include our verification records. Go to <strong>Settings > Domains</strong> to check the status.</p>
      <h3>2. Spam Triggers</h3>
      <p>Avoid using excessive capitalization, too many exclamation marks, or words like "Free", "Cash", or "Urgent" in your subject lines.</p>
      <h3>3. List Hygiene</h3>
      <p>Regularly clean your list of inactive subscribers. We automatically suppress emails that bounce hard.</p>
    `
  },
  { 
    id: "kb-4", 
    title: "Managing user roles and permissions", 
    excerpt: "Best practices for assigning Admin vs Viewer roles to your team members.", 
    category: "Admin", 
    readTime: "4 min", 
    views: 320,
    content: `
      <p>Security is paramount. Follow the principle of least privilege when inviting new team members.</p>
      <h3>Role Definitions:</h3>
      <ul>
        <li><strong>Super Admin:</strong> Full access to everything, including billing and user management.</li>
        <li><strong>Editor:</strong> Can create content (Emails, Pages) and view CRM data, but cannot export data or change settings.</li>
        <li><strong>Viewer:</strong> Read-only access to dashboards and reports. Perfect for board members.</li>
        <li><strong>Finance:</strong> Access to Contributions Hub and Reports only.</li>
      </ul>
    `
  },
  { 
    id: "kb-5", 
    title: "Importing contacts from CSV", 
    excerpt: "Template and instructions for bulk importing donor data into the CRM.", 
    category: "CRM", 
    readTime: "6 min", 
    views: 1100,
    content: `
      <p>Migrating from another system? You can import thousands of contacts at once using our CSV importer.</p>
      <h3>Preparation</h3>
      <p>Download our <a href="#">CSV Template</a> to ensure your columns match our database fields.</p>
      <h3>Required Fields:</h3>
      <ul>
        <li>First Name</li>
        <li>Last Name</li>
        <li>Email Address</li>
      </ul>
      <p>Once your file is ready, go to <strong>CRM > Import</strong> and drag your file into the upload zone. The system will auto-map columns, but you should verify them before clicking "Start Import".</p>
    `
  },
];


import React, { useState, useRef, useEffect } from 'react';
import { 
  Monitor, Smartphone, Tablet, Undo, Redo, 
  Eye, EyeOff, Save, Download, Type, Image as ImageIcon, 
  MousePointer2, Columns, GripVertical, 
  Trash2, Video, Code, Minus, X,
  AlignLeft, AlignCenter, AlignRight,
  Layout,
  UserCheck, Grid, PieChart, QrCode, ListStart, FileDown, BadgeCheck, Users2,
  Copy, Plus, Move, CreditCard, AlertCircle, CheckCircle, Info, Target, Footprints, Calendar, Megaphone, Share2, Quote, User, ChevronDown, LayoutTemplate,
  Wand2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Slider } from '../ui/Slider';
import { cn } from '../../lib/utils';

// --- Types ---

type BlockType = 'text' | 'image' | 'button' | 'heading' | 'divider' | 'video' | 'html';

interface Block {
  id: string;
  type: BlockType;
  content: any;
  styles: React.CSSProperties;
}

interface Preset {
  id: string;
  label: string;
  icon: any;
  blocks: Omit<Block, 'id'>[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  blocks: Omit<Block, 'id'>[];
  bodyStyles: React.CSSProperties;
  color: string;
}

interface EditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  bodyStyles: React.CSSProperties & { linkColor?: string };
  device: 'desktop' | 'tablet' | 'mobile';
}

interface DragTarget {
  id: string;
  position: 'top' | 'bottom';
}

// --- Pre-made NGO Blocks (Presets) ---

const PRESETS: Preset[] = [
  {
    id: 'header_logo',
    label: 'Logo Header',
    icon: Layout,
    blocks: [
      { type: 'image', content: { url: 'https://via.placeholder.com/150x50?text=GIVEHOPE', alt: 'Logo' }, styles: { width: '150px', margin: '20px auto', display: 'block' } },
      { type: 'divider', content: {}, styles: { margin: '0', borderTop: '1px solid #e2e8f0', padding: '10px 0' } }
    ]
  },
  {
    id: 'hero',
    label: 'Mission Hero',
    icon: ImageIcon,
    blocks: [
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop', alt: 'Hero Image' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '20px', display: 'block' } },
      { type: 'heading', content: { text: 'Restoring Hope Together' }, styles: { fontSize: '32px', fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: '12px', lineHeight: '1.2' } },
      { type: 'text', content: { text: 'Your partnership enables us to provide clean water, education, and medical relief to those who need it most. Thank you for standing with us.' }, styles: { fontSize: '16px', color: '#475569', textAlign: 'center', lineHeight: '1.6', marginBottom: '24px' } },
      { type: 'button', content: { text: 'Support the Mission', url: '#' }, styles: { backgroundColor: '#2563eb', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', display: 'inline-block', fontWeight: '600', textDecoration: 'none', margin: '0 auto', textAlign: 'center' } }
    ]
  },
  {
    id: 'director_note',
    label: 'Director Note',
    icon: UserCheck,
    blocks: [
      { type: 'html', content: { html: `
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: flex-start; gap: 20px;">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Director" />
            <div>
              <h3 style="margin: 0 0 10px; font-family: serif; font-size: 20px; color: #1e293b;">A Note from Sarah</h3>
              <p style="margin: 0 0 15px; font-size: 15px; line-height: 1.6; color: #475569;">"I wanted to personally thank you for your generosity this month. Because of you, we were able to launch the new mobile clinic three weeks ahead of schedule. The impact is already visible on the faces of the families we serve."</p>
              <p style="margin: 5px 0 0; font-size: 12px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Executive Director</p>
            </div>
          </div>
        </div>
      ` }, styles: { padding: '10px 0' } }
    ]
  },
  {
    id: 'photo_mosaic',
    label: 'Photo Mosaic',
    icon: Grid,
    blocks: [
      { type: 'html', content: { html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="50%" style="padding: 5px;">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=300&fit=crop" style="width: 100%; border-radius: 6px; display: block;" />
            </td>
            <td width="50%" style="padding: 5px;">
              <img src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=400&h=300&fit=crop" style="width: 100%; border-radius: 6px; display: block;" />
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 5px;">
              <img src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&h=400&fit=crop" style="width: 100%; border-radius: 6px; display: block;" />
              <p style="text-align: center; font-size: 13px; color: #64748b; margin-top: 8px; font-style: italic;">Field operations in Kenya, October 2024</p>
            </td>
          </tr>
        </table>
      ` }, styles: { padding: '15px 0' } }
    ]
  },
  {
    id: 'story_feature',
    label: 'Feature Story',
    icon: Columns,
    blocks: [
      { type: 'html', content: { html: `
        <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px;">
            <img src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=600&auto=format&fit=crop" style="width: 100%; border-radius: 8px; display: block;" alt="Story" />
          </div>
          <div style="flex: 1; min-width: 250px;">
            <h3 style="margin: 0 0 10px 0; font-size: 20px; color: #1e293b; font-weight: bold;">A New Beginning</h3>
            <p style="margin: 0 0 15px 0; color: #475569; line-height: 1.6;">When we first met Sarah, she walked 5 miles daily for water. Today, thanks to the new well, she's in school and dreaming of becoming a doctor.</p>
            <a href="#" style="color: #2563eb; font-weight: 600; text-decoration: none;">Read her full story &rarr;</a>
          </div>
        </div>
      ` }, styles: { padding: '20px' } }
    ]
  },
  {
    id: 'financials',
    label: 'Financials',
    icon: PieChart,
    blocks: [
      { type: 'html', content: { html: `
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
          <h4 style="margin: 0 0 15px; font-size: 16px; font-weight: bold; color: #0f172a; text-align: center;">Where Your Dollar Goes</h4>
          
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 600; color: #334155;">
              <span>Program Services</span>
              <span>85%</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: 85%; background: #10b981; height: 100%;"></div>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 600; color: #334155;">
              <span>Fundraising</span>
              <span>10%</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: 10%; background: #64748b; height: 100%;"></div>
            </div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; font-weight: 600; color: #334155;">
              <span>Admin</span>
              <span>5%</span>
            </div>
            <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
              <div style="width: 5%; background: #94a3b8; height: 100%;"></div>
            </div>
          </div>
        </div>
      ` }, styles: { padding: '10px 20px' } }
    ]
  },
  {
    id: 'donation_grid',
    label: 'Donation Tiers',
    icon: CreditCard,
    blocks: [
      { type: 'heading', content: { text: 'Choose Your Impact' }, styles: { textAlign: 'center', fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '5px' } },
      { type: 'text', content: { text: 'Select an amount to give today.' }, styles: { textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' } },
      { type: 'html', content: { html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #f1f5f9; color: #0f172a; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">$50</a>
            </td>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #2563eb;">$100</a>
            </td>
            <td width="33%" style="padding: 5px;">
              <a href="#" style="display: block; background: #f1f5f9; color: #0f172a; text-decoration: none; padding: 15px 10px; border-radius: 6px; text-align: center; font-weight: bold; border: 1px solid #cbd5e1;">$250</a>
            </td>
          </tr>
        </table>
      ` }, styles: { padding: '0 10px 20px' } }
    ]
  },
  {
    id: 'scan_give',
    label: 'Scan to Give',
    icon: QrCode,
    blocks: [
      { type: 'html', content: { html: `
        <div style="text-align: center; padding: 30px; background-color: #0f172a; color: white; border-radius: 12px;">
          <h3 style="margin: 0 0 5px; font-size: 22px; font-weight: bold;">Scan to Give</h3>
          <p style="margin: 0 0 20px; font-size: 14px; opacity: 0.8;">Use your phone camera to donate instantly.</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://givehope.org/donate&color=000000&bgcolor=ffffff" style="display: block; margin: 0 auto; width: 120px; height: 120px; border: 4px solid white; border-radius: 8px;" alt="QR Code" />
          <p style="margin: 20px 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Secure & Fast Checkout</p>
        </div>
      ` }, styles: { padding: '20px' } }
    ]
  },
  {
    id: 'progress_bar',
    label: 'Campaign Goal',
    icon: Target,
    blocks: [
      { type: 'html', content: { html: `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; font-weight: bold; color: #334155;">
            <span>Raised: $45,000</span>
            <span>Goal: $50,000</span>
          </div>
          <div style="background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden;">
            <div style="background: #10b981; width: 90%; height: 100%;"></div>
          </div>
          <p style="margin: 10px 0 0 0; text-align: center; font-size: 13px; color: #64748b;">We are only <strong>$5,000</strong> away from fully funding the clinic!</p>
        </div>
      ` }, styles: { padding: '10px 20px' } }
    ]
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: ListStart,
    blocks: [
      { type: 'html', content: { html: `
        <div style="padding: 20px;">
          <h3 style="text-align: center; font-size: 18px; color: #0f172a; margin-bottom: 25px;">Project Roadmap</h3>
          <div style="border-left: 2px solid #cbd5e1; margin-left: 20px; padding-left: 25px; padding-bottom: 25px; position: relative;">
            <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #10b981; border: 2px solid #fff;"></div>
            <h4 style="margin: 0; font-size: 15px; color: #1e293b;">Phase 1: Groundbreaking</h4>
            <p style="margin: 5px 0 0; font-size: 13px; color: #64748b;">Completed in January. Land cleared and foundation laid.</p>
          </div>
          <div style="border-left: 2px solid #cbd5e1; margin-left: 20px; padding-left: 25px; padding-bottom: 25px; position: relative;">
            <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #3b82f6; border: 2px solid #fff;"></div>
            <h4 style="margin: 0; font-size: 15px; color: #1e293b;">Phase 2: Construction</h4>
            <p style="margin: 5px 0 0; font-size: 13px; color: #64748b;"><strong>Current Status.</strong> Walls are up, roof installation begins next week.</p>
          </div>
          <div style="border-left: 2px solid #e2e8f0; margin-left: 20px; padding-left: 25px; position: relative;">
            <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: #cbd5e1; border: 2px solid #fff;"></div>
            <h4 style="margin: 0; font-size: 15px; color: #94a3b8;">Phase 3: Opening</h4>
            <p style="margin: 5px 0 0; font-size: 13px; color: #94a3b8;">Scheduled for June. Staff hiring and community launch.</p>
          </div>
        </div>
      ` }, styles: { padding: '10px 0' } }
    ]
  },
  {
    id: 'impact_row',
    label: 'Impact Row',
    icon: CheckCircle,
    blocks: [
      { type: 'html', content: { html: `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="33%" valign="top" style="text-align: center; padding: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" width="40" height="40" alt="Water" style="display: block; margin: 0 auto 10px;" />
              <h4 style="margin: 0; font-size: 16px; color: #1e293b;">Clean Water</h4>
              <p style="margin: 5px 0 0; font-size: 12px; color: #64748b;">500 Wells Built</p>
            </td>
            <td width="33%" valign="top" style="text-align: center; padding: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2965/2965300.png" width="40" height="40" alt="Food" style="display: block; margin: 0 auto 10px;" />
              <h4 style="margin: 0; font-size: 16px; color: #1e293b;">Meals</h4>
              <p style="margin: 5px 0 0; font-size: 12px; color: #64748b;">1M+ Served</p>
            </td>
            <td width="33%" valign="top" style="text-align: center; padding: 10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/2382/2382461.png" width="40" height="40" alt="Health" style="display: block; margin: 0 auto 10px;" />
              <h4 style="margin: 0; font-size: 16px; color: #1e293b;">Medical</h4>
              <p style="margin: 5px 0 0; font-size: 12px; color: #64748b;">10k Treated</p>
            </td>
          </tr>
        </table>
      ` }, styles: { padding: '10px 0' } }
    ]
  },
  {
    id: 'sponsorship_card',
    label: 'Sponsorship',
    icon: BadgeCheck,
    blocks: [
      { type: 'html', content: { html: `
        <div style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; max-width: 320px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background-color: #f1f5f9; height: 160px; overflow: hidden; position: relative;">
             <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&fit=crop" style="width: 100%; height: 100%; object-fit: cover;" />
             <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; text-transform: uppercase;">Needs Sponsor</div>
          </div>
          <div style="padding: 20px; background: white; text-align: center;">
            <h3 style="margin: 0; font-size: 18px; color: #0f172a;">Mateo, 7</h3>
            <p style="margin: 5px 0 15px; color: #64748b; font-size: 14px;">📍 Guatemala City</p>
            <p style="font-size: 13px; line-height: 1.5; color: #334155; margin-bottom: 20px;">Mateo loves soccer and wants to be a teacher. Sponsorship covers school fees, books, and daily meals.</p>
            <a href="#" style="display: block; background: #2563eb; color: white; text-decoration: none; padding: 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">Sponsor for $35/mo</a>
          </div>
        </div>
      ` }, styles: { padding: '10px 0' } }
    ]
  },
  {
    id: 'beneficiary',
    label: 'Beneficiary',
    icon: User,
    blocks: [
      { type: 'html', content: { html: `
        <div style="text-align: center; padding: 20px;">
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" alt="Beneficiary" />
          <h3 style="margin: 15px 0 5px 0; color: #0f172a; font-size: 18px;">Meet David</h3>
          <p style="margin: 0 auto 15px; max-width: 400px; font-style: italic; color: #475569; font-size: 15px;">"The vocational training I received gave me the skills to open my own shop. Now I can support my entire family."</p>
          <a href="#" style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; color: #2563eb; text-decoration: none;">Read David's Story</a>
        </div>
      ` }, styles: { backgroundColor: '#f8fafc', margin: '20px 0', borderRadius: '8px' } }
    ]
  },
  {
    id: 'download',
    label: 'Download',
    icon: FileDown,
    blocks: [
      { type: 'html', content: { html: `
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; display: flex; align-items: center; gap: 15px;">
          <div style="background: white; border: 1px solid #e0f2fe; width: 50px; height: 70px; border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
             <span style="font-size: 24px;">📄</span>
          </div>
          <div style="flex: 1;">
            <h4 style="margin: 0 0 4px; color: #0c4a6e; font-size: 15px;">2024 Impact Report</h4>
            <p style="margin: 0 0 10px; font-size: 12px; color: #0284c7;">Read about what we've accomplished together.</p>
            <a href="#" style="font-size: 12px; font-weight: bold; text-decoration: underline; color: #0284c7;">Download PDF (4.5 MB)</a>
          </div>
        </div>
      ` }, styles: { padding: '10px 20px' } }
    ]
  },
  {
    id: 'urgent',
    label: 'Urgent Appeal',
    icon: AlertCircle,
    blocks: [
      { type: 'html', content: { html: '<div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 24px; text-align: center;"><h3 style="color: #991b1b; margin-top: 0; font-size: 20px; font-weight: bold;">URGENT NEED</h3><p style="color: #7f1d1d; margin-bottom: 20px;">We need to raise $5,000 by midnight to secure the matching grant.</p><a href="#" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">GIVE NOW</a></div>' }, styles: { padding: '10px' } }
    ]
  },
  {
    id: 'info_box',
    label: 'Info Callout',
    icon: Info,
    blocks: [
      { type: 'html', content: { html: `
        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
          <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.5;">
            <strong>Did you know?</strong> 100% of your donation to the clean water fund goes directly to project costs. We cover our admin fees separately.
          </p>
        </div>
      ` }, styles: { padding: '15px 20px' } }
    ]
  },
  {
    id: 'membership',
    label: 'The Circle',
    icon: Users2,
    blocks: [
      { type: 'html', content: { html: `
        <div style="background-color: #1e293b; color: white; padding: 30px; text-align: center; border-radius: 12px; background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0); background-size: 20px 20px;">
          <h3 style="margin: 0 0 10px; font-size: 24px; letter-spacing: -0.5px;">Join The Circle</h3>
          <p style="margin: 0 auto 25px; max-width: 400px; font-size: 15px; opacity: 0.9; line-height: 1.5;">Become a monthly partner and get exclusive field updates, a welcome kit, and invitations to our annual gala.</p>
          <a href="#" style="background: #fbbf24; color: #451a03; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Become a Partner</a>
        </div>
      ` }, styles: { padding: '20px 0' } }
    ]
  },
  {
    id: 'quote',
    label: 'Testimonial',
    icon: Quote,
    blocks: [
      { type: 'text', content: { text: '"Because of this program, my children can finally go to school instead of walking miles for water. You have given us our future back."' }, styles: { fontSize: '18px', color: '#334155', fontStyle: 'italic', textAlign: 'center', lineHeight: '1.6', borderLeft: '4px solid #cbd5e1', paddingLeft: '20px', margin: '20px 0' } },
      { type: 'text', content: { text: '- Sarah, Community Leader' }, styles: { fontSize: '14px', color: '#64748b', fontWeight: 'bold', textAlign: 'right', marginTop: '8px' } }
    ]
  },
  {
    id: 'event',
    label: 'Event Invite',
    icon: Calendar,
    blocks: [
      { type: 'divider', content: {}, styles: { margin: '20px 0', borderTop: '1px solid #e2e8f0' } },
      { type: 'heading', content: { text: 'Annual Charity Gala' }, styles: { fontSize: '24px', fontWeight: 'bold', color: '#0f172a', textAlign: 'center' } },
      { type: 'text', content: { text: 'Join us for an evening of celebration and vision.' }, styles: { fontSize: '16px', color: '#475569', textAlign: 'center', margin: '8px 0 16px' } },
      { type: 'button', content: { text: 'RSVP Today', url: '#' }, styles: { backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '4px', display: 'inline-block', fontWeight: '500', fontSize: '14px', margin: '0 auto' } },
      { type: 'divider', content: {}, styles: { margin: '20px 0', borderTop: '1px solid #e2e8f0' } }
    ]
  },
  {
    id: 'video',
    label: 'Video Story',
    icon: Video,
    blocks: [
      { type: 'image', content: { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop', alt: 'Video Thumbnail' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '10px', display: 'block', position: 'relative' } },
      { type: 'heading', content: { text: 'Watch: The Journey Home' }, styles: { fontSize: '20px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' } },
      { type: 'text', content: { text: 'See the impact of your latest contribution in this short 2-minute update from the field.' }, styles: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' } }
    ]
  },
  {
    id: 'social_follow',
    label: 'Social Links',
    icon: Share2,
    blocks: [
      { type: 'html', content: { html: `
        <div style="text-align: center; padding: 10px;">
          <p style="font-size: 12px; color: #64748b; margin-bottom: 10px; font-weight: bold; text-transform: uppercase;">Follow Our Journey</p>
          <a href="#" style="display: inline-block; margin: 0 5px; width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; line-height: 32px; color: #1e293b; text-decoration: none;">FB</a>
          <a href="#" style="display: inline-block; margin: 0 5px; width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; line-height: 32px; color: #1e293b; text-decoration: none;">IG</a>
          <a href="#" style="display: inline-block; margin: 0 5px; width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; line-height: 32px; color: #1e293b; text-decoration: none;">TW</a>
          <a href="#" style="display: inline-block; margin: 0 5px; width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; line-height: 32px; color: #1e293b; text-decoration: none;">YT</a>
        </div>
      ` }, styles: { padding: '10px 0' } }
    ]
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: Footprints,
    blocks: [
      { type: 'divider', content: {}, styles: { margin: '30px 0 20px', borderTop: '1px solid #e2e8f0' } },
      { type: 'text', content: { text: 'GiveHope Humanitarian • 123 Mission Way, San Francisco, CA' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', marginBottom: '4px' } },
      { type: 'text', content: { text: 'Unsubscribe  |  Privacy Policy' }, styles: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', textDecoration: 'underline' } }
    ]
  },
  {
    id: 'signature',
    label: 'Signature',
    icon: Megaphone,
    blocks: [
      { type: 'html', content: { html: '<table style="margin-top: 20px;"><tr><td style="vertical-align: middle; padding-right: 15px;"><img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" style="width: 50px; height: 50px; border-radius: 50%; display: block;" /></td><td style="vertical-align: middle;"><p style="margin: 0; font-weight: bold; color: #0f172a; font-size: 16px;">The Miller Family</p><p style="margin: 0; font-size: 13px; color: #64748b;">Field Partners, Thailand</p></td></tr></table>' }, styles: { padding: '10px 0' } }
    ]
  }
];

// --- Helper to safely clone preset blocks ---
const getPresetBlocks = (id: string) => {
    const preset = PRESETS.find(p => p.id === id);
    // Deep clone to ensure modifying the template doesn't affect the preset source definition
    return preset ? JSON.parse(JSON.stringify(preset.blocks)) : [];
};

// --- Templates (Full Layouts) ---

const SAVED_TEMPLATES: Template[] = [
  {
    id: 'newsletter_monthly',
    name: 'The Visionary',
    description: 'Monthly impact newsletter with stats and stories.',
    bodyStyles: { backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif', width: '600px', color: '#334155', fontSize: '16px', lineHeight: '1.5' },
    color: 'bg-emerald-50 text-emerald-700',
    blocks: [
        ...getPresetBlocks('header_logo'),
        ...getPresetBlocks('hero'),
        { type: 'heading', content: { text: 'October Vision Update' }, styles: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', margin: '20px 0 10px' } },
        { type: 'text', content: { text: 'Hi {{first_name}}, this month has been nothing short of miraculous. Thanks to your support, we broke ground on the new clinic.' }, styles: { fontSize: '16px', color: '#475569', lineHeight: '1.6', padding: '0 20px' } },
        ...getPresetBlocks('impact_row'),
        ...getPresetBlocks('story_feature'),
        ...getPresetBlocks('donation_grid'),
        ...getPresetBlocks('footer')
    ]
  },
  {
    id: 'crisis_appeal',
    name: 'Crisis Response',
    description: 'Urgent appeal layout for emergencies.',
    bodyStyles: { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif', width: '600px', color: '#1e293b', fontSize: '16px', lineHeight: '1.5' },
    color: 'bg-rose-50 text-rose-700',
    blocks: [
        ...getPresetBlocks('header_logo'),
        { type: 'heading', content: { text: 'URGENT: Flood Response' }, styles: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', color: '#dc2626', margin: '20px 0' } },
        { type: 'image', content: { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&fit=crop', alt: 'Disaster' }, styles: { width: '100%', borderRadius: '4px', marginBottom: '15px' } },
        { type: 'text', content: { text: 'Dear {{first_name}},\n\nHeavy rains have displaced thousands. We are on the ground providing emergency kits, but supplies are running low.' }, styles: { fontSize: '18px', color: '#334155', lineHeight: '1.6', padding: '0 20px' } },
        ...getPresetBlocks('urgent'),
        ...getPresetBlocks('donation_grid'),
        ...getPresetBlocks('footer')
    ]
  },
  {
    id: 'annual_report',
    name: 'Annual Report',
    description: 'Year-end summary with financials and transparency.',
    bodyStyles: { backgroundColor: '#f1f5f9', fontFamily: "'Georgia', serif", width: '640px', color: '#334155', fontSize: '16px', lineHeight: '1.6' },
    color: 'bg-blue-50 text-blue-700',
    blocks: [
        ...getPresetBlocks('header_logo'),
        { type: 'heading', content: { text: '2023 Year in Review' }, styles: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', margin: '30px 0 10px', fontFamily: "'Georgia', serif" } },
        ...getPresetBlocks('financials'),
        ...getPresetBlocks('timeline'),
        ...getPresetBlocks('quote'),
        ...getPresetBlocks('download'),
        ...getPresetBlocks('signature'),
        ...getPresetBlocks('footer')
    ]
  },
  {
    id: 'welcome_series',
    name: 'Welcome Series',
    description: 'Onboarding email for new donors.',
    bodyStyles: { backgroundColor: '#ffffff', fontFamily: 'Inter, sans-serif', width: '600px', color: '#334155', fontSize: '16px', lineHeight: '1.5' },
    color: 'bg-amber-50 text-amber-700',
    blocks: [
        ...getPresetBlocks('header_logo'),
        { type: 'image', content: { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&fit=crop', alt: 'Welcome' }, styles: { width: '100%', borderRadius: '8px', marginBottom: '20px' } },
        { type: 'heading', content: { text: 'Welcome to the Family!' }, styles: { fontSize: '26px', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', margin: '10px 0' } },
        { type: 'text', content: { text: 'Hi {{first_name}},\n\nThank you for joining us. You are now part of a global movement bringing hope to the hopeless. Here is what you can expect from us.' }, styles: { fontSize: '16px', color: '#475569', textAlign: 'center', lineHeight: '1.6', padding: '0 20px 20px' } },
        ...getPresetBlocks('video'),
        ...getPresetBlocks('social_follow'),
        { type: 'button', content: { text: 'Visit Donor Portal', url: '#' }, styles: { backgroundColor: '#0f172a', color: '#ffffff', padding: '14px 28px', borderRadius: '50px', display: 'inline-block', fontWeight: '600', textDecoration: 'none', margin: '20px auto', textAlign: 'center' } },
        ...getPresetBlocks('footer')
    ]
  }
];

const INITIAL_BLOCKS: Block[] = [
  {
    id: 'b1',
    type: 'heading',
    content: { text: 'Weekly Update' },
    styles: { textAlign: 'center', color: '#0f172a', padding: '20px 0 10px 0' }
  },
  {
    id: 'b2',
    type: 'text',
    content: { text: 'Dear Partner, thank you for your continued support. Here is what we have been up to this week.' },
    styles: { textAlign: 'left', color: '#475569', padding: '10px 20px', fontSize: '16px', lineHeight: '1.6' }
  },
  {
    id: 'b3',
    type: 'button',
    content: { text: 'Read Full Report', url: '#' },
    styles: { textAlign: 'center', padding: '20px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', display: 'inline-block', textDecoration: 'none', margin: '20px auto' }
  }
];

// --- Helper Components ---

const ToolButton = ({ icon: Icon, label, type, onDragStart }: { icon: any, label: string, type: string, onDragStart: (e: React.DragEvent, type: string) => void }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, type)}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group h-24"
  >
    <Icon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
    <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700">{label}</span>
  </div>
);

const PresetButton: React.FC<{ preset: Preset, onDragStart: (e: React.DragEvent, id: string) => void }> = ({ preset, onDragStart }) => (
  <div 
    draggable 
    onDragStart={(e) => onDragStart(e, preset.id)}
    className="flex flex-col items-center justify-center gap-2 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group h-24 text-center"
  >
    <preset.icon className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors" />
    <span className="text-[11px] font-medium text-slate-600 group-hover:text-blue-700 leading-tight">{preset.label}</span>
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value?: string, onChange: (val: string) => void }) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  
  useEffect(() => {
      if (value) setLocalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
      setLocalValue(val);
      onChange(val);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-slate-600 font-semibold">{label}</Label>
      <div className="flex gap-2 items-center border border-slate-300 p-1.5 rounded-md bg-white shadow-sm hover:border-slate-400 transition-colors">
        <div 
          className="w-6 h-6 rounded border border-slate-200 relative overflow-hidden shrink-0 shadow-sm"
          style={{ backgroundColor: localValue }}
        >
          <input 
            type="color" 
            value={localValue} 
            onChange={(e) => handleChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-0"
            style={{ padding: 0, margin: 0 }}
          />
        </div>
        <input 
          type="text" 
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 text-xs font-mono outline-none uppercase text-slate-900 bg-transparent font-medium h-6"
          style={{ backgroundColor: 'transparent' }}
        />
      </div>
    </div>
  );
};

// --- Main Component ---

export const UnlayerEditor: React.FC<{ mode: 'email' | 'pdf', onSave?: () => void, onExport?: () => void }> = ({ mode, onSave, onExport }) => {
  const [state, setState] = useState<EditorState>({
    blocks: INITIAL_BLOCKS,
    selectedBlockId: null,
    bodyStyles: { 
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, sans-serif', 
      width: '600px',
      color: '#334155', 
      fontSize: '16px',
      lineHeight: '1.5',
      linkColor: '#2563eb'
    },
    device: 'desktop'
  });

  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Actions ---

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('blockType', type);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handlePresetDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('presetId', id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const loadTemplate = (template: Template) => {
    if (confirm('Loading a template will replace your current content. Continue?')) {
        // Deep clone to prevent mutation of the template definition
        const blocksCopy = JSON.parse(JSON.stringify(template.blocks));
        const newBlocks = blocksCopy.map((b: any) => ({
            ...b, 
            id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })) as Block[];
        
        setState(prev => ({
            ...prev,
            blocks: newBlocks,
            bodyStyles: { ...prev.bodyStyles, ...template.bodyStyles },
            selectedBlockId: null
        }));
    }
  };

  const insertMergeTag = (tag: string) => {
    if (!state.selectedBlockId) return;
    const block = state.blocks.find(b => b.id === state.selectedBlockId);
    if (!block) return;
    
    const currentText = block.content.text || '';
    // Append to text content
    updateBlockContent(block.id, 'text', currentText + ' ' + tag);
  };

  // Handle Drag Over Block (to determine insertion point)
  const handleBlockDragOver = (e: React.DragEvent, blockId: string) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? 'top' : 'bottom';

    if (!dragTarget || dragTarget.id !== blockId || dragTarget.position !== position) {
      setDragTarget({ id: blockId, position });
    }
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragTarget(null);
    if (isPreview) return;

    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const presetId = e.dataTransfer.getData('presetId');
    const reorderId = e.dataTransfer.getData('reorderId');

    // If dropped on empty canvas, append to end
    if (!dragTarget) {
       insertBlock(blockType, presetId, reorderId, state.blocks.length);
    }
  };

  const handleBlockDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPreview || !dragTarget) {
      setDragTarget(null);
      return;
    }

    const blockType = e.dataTransfer.getData('blockType') as BlockType;
    const presetId = e.dataTransfer.getData('presetId');
    const reorderId = e.dataTransfer.getData('reorderId');

    const targetIndex = state.blocks.findIndex(b => b.id === targetId);
    // Calculate insertion index based on top/bottom
    const insertIndex = dragTarget.position === 'top' ? targetIndex : targetIndex + 1;

    insertBlock(blockType, presetId, reorderId, insertIndex);
    setDragTarget(null);
  };

  const insertBlock = (blockType: BlockType | '', presetId: string, reorderId: string, index: number) => {
    const newBlocks = [...state.blocks];

    if (reorderId) {
      // Reorder existing
      const currentIndex = newBlocks.findIndex(b => b.id === reorderId);
      if (currentIndex > -1) {
        const [movedBlock] = newBlocks.splice(currentIndex, 1);
        // Adjust index if moving down
        const adjustedIndex = currentIndex < index ? index - 1 : index;
        newBlocks.splice(adjustedIndex, 0, movedBlock);
        setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: movedBlock.id }));
      }
    } else if (presetId) {
      // Insert Preset (DEEP CLONE)
      const preset = PRESETS.find(p => p.id === presetId);
      if (preset) {
        const blocksToAdd = JSON.parse(JSON.stringify(preset.blocks)).map((b: any) => ({
          ...b,
          id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })) as Block[];
        newBlocks.splice(index, 0, ...blocksToAdd);
        setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: blocksToAdd[0].id }));
      }
    } else if (blockType) {
      // Insert New Block
      const newBlock: Block = {
        id: `block_${Date.now()}`,
        type: blockType,
        content: getDefaultContent(blockType),
        styles: getDefaultStyles(blockType)
      };
      newBlocks.splice(index, 0, newBlock);
      setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: newBlock.id }));
    }
  };

  const duplicateBlock = (block: Block) => {
    const index = state.blocks.findIndex(b => b.id === block.id);
    const newBlock = { ...block, id: `block_${Date.now()}` }; // Cloning logic should ideally deep clone content too if objects
    const newBlocks = [...state.blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setState(prev => ({ ...prev, blocks: newBlocks, selectedBlockId: newBlock.id }));
  };

  const getDefaultContent = (type: BlockType) => {
    switch(type) {
      case 'text': return { text: 'Type your text here...' };
      case 'heading': return { text: 'Heading' };
      case 'button': return { text: 'Click Me', url: '#' };
      case 'image': return { url: '', alt: 'Image' };
      case 'divider': return {};
      case 'html': return { html: '<div style="padding:10px; text-align:center; color:#888;">Custom HTML</div>' };
      case 'video': return { url: 'https://www.youtube.com/watch?v=xyz' };
      default: return {};
    }
  };

  const getDefaultStyles = (type: BlockType): React.CSSProperties => {
    const base = { padding: '10px' };
    switch(type) {
      case 'heading': return { ...base, textAlign: 'center', color: '#0f172a', fontSize: '24px', fontWeight: 'bold' };
      case 'button': return { ...base, textAlign: 'center', display: 'inline-block', backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' };
      case 'image': return { ...base, width: '100%', display: 'block' };
      default: return { ...base };
    }
  };

  const updateBlockContent = (id: string, key: string, value: any) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, [key]: value } } : b)
    }));
  };

  const updateBlockStyles = (id: string, newStyles: React.CSSProperties) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, styles: { ...b.styles, ...newStyles } } : b)
    }));
  };

  const deleteBlock = (id: string) => {
    setState(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id),
      selectedBlockId: null
    }));
  };

  // --- Renderers ---

  const renderBlockPreview = (block: Block) => {
    const isSelected = !isPreview && state.selectedBlockId === block.id;
    
    return (
      <div 
        key={block.id}
        draggable={!isPreview}
        onDragStart={(e) => {
            if (isPreview) { e.preventDefault(); return; }
            e.dataTransfer.setData('reorderId', block.id);
            e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e) => handleBlockDragOver(e, block.id)}
        onDrop={(e) => handleBlockDrop(e, block.id)}
        onClick={(e) => { 
            if (isPreview) return;
            e.stopPropagation(); 
            setState(prev => ({ ...prev, selectedBlockId: block.id })); 
        }}
        className={cn(
          "relative group/block transition-all",
          !isPreview && "cursor-pointer",
          // Selection Ring
          !isPreview && isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300 ring-transparent",
          // Drop Indicators
          !isPreview && dragTarget?.id === block.id && dragTarget.position === 'top' && "border-t-4 border-t-blue-500",
          !isPreview && dragTarget?.id === block.id && dragTarget.position === 'bottom' && "border-b-4 border-b-blue-500"
        )}
        style={{ position: 'relative' }} // ensure relative for absolute controls
      >
        {/* Content Rendering */}
        <div style={block.styles} className="w-full">
            {block.type === 'text' && (
                <div 
                    contentEditable={!isPreview}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, 'text', e.currentTarget.textContent)}
                    className="outline-none empty:before:content-['Type_text...'] empty:before:text-slate-300"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}
                >
                    {block.content.text}
                </div>
            )}
            
            {block.type === 'heading' && (
                <h1 
                    contentEditable={!isPreview}
                    suppressContentEditableWarning
                    onBlur={(e) => updateBlockContent(block.id, 'text', e.currentTarget.textContent)}
                    className="outline-none"
                    style={{ margin: 0, fontFamily: 'inherit', fontWeight: 'inherit', fontSize: 'inherit', textAlign: 'inherit' as any }}
                >
                    {block.content.text}
                </h1>
            )}

            {block.type === 'button' && (
                <div style={{ textAlign: block.styles.textAlign as any }}>
                    <a 
                        href={isPreview ? block.content.url : undefined} 
                        onClick={(e) => !isPreview && e.preventDefault()}
                        className="inline-block transition-opacity hover:opacity-90"
                        style={{
                            backgroundColor: (block.styles as any).backgroundColor,
                            color: (block.styles as any).color,
                            padding: (block.styles as any).padding,
                            borderRadius: (block.styles as any).borderRadius,
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            fontFamily: 'inherit'
                        }}
                    >
                        {block.content.text}
                    </a>
                </div>
            )}

            {block.type === 'image' && (
                block.content.url ? (
                    <img 
                        src={block.content.url} 
                        alt={block.content.alt} 
                        style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                ) : (
                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg h-32 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-medium">Click to set image URL</span>
                    </div>
                )
            )}

            {block.type === 'divider' && (
                <hr style={{ borderTop: `2px solid ${(block.styles as any).color || '#e2e8f0'}`, margin: 0 }} />
            )}

            {block.type === 'html' && (
                <div dangerouslySetInnerHTML={{ __html: block.content.html }} />
            )}

            {block.type === 'video' && (
                <div className="bg-slate-900 flex items-center justify-center h-48 rounded relative overflow-hidden group/video">
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-slate-900 shadow-lg group-hover/video:scale-110 transition-transform">
                            <Video className="w-5 h-5 fill-slate-900" />
                        </div>
                    </div>
                    <img src="https://via.placeholder.com/600x300?text=Video+Thumbnail" alt="Video" className="w-full h-full object-cover opacity-50" />
                </div>
            )}
        </div>

        {/* Hover/Selection Toolbar */}
        {isSelected && !isPreview && (
          <div className="absolute -right-12 top-0 flex flex-col gap-1 z-50">
            <button 
              className="p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-500 hover:text-blue-600 hover:bg-blue-50 cursor-copy"
              onClick={(e) => { e.stopPropagation(); duplicateBlock(block); }}
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button 
              className="p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="cursor-grab active:cursor-grabbing p-1.5 bg-white border border-slate-200 shadow-sm rounded text-slate-400 hover:text-slate-600">
              <Move className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedBlock = state.blocks.find(b => b.id === state.selectedBlockId);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden font-sans">
      
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button 
                onClick={() => setState(prev => ({ ...prev, device: 'desktop' }))}
                className={cn(
                  "p-2 rounded-md transition-all",
                  state.device === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, device: 'tablet' }))}
                className={cn(
                  "p-2 rounded-md transition-all",
                  state.device === 'tablet' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, device: 'mobile' }))}
                className={cn(
                  "p-2 rounded-md transition-all",
                  state.device === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Smartphone className="h-4 w-4" />
              </button>
           </div>
           <div className="w-px h-6 bg-slate-200" />
           <div className="flex gap-1">
              <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors"><Undo className="h-4 w-4" /></button>
              <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors"><Redo className="h-4 w-4" /></button>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <Button 
             variant="ghost" 
             className={cn(
                "text-slate-600 gap-2 h-9 text-xs font-semibold",
                isPreview ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : "hover:bg-slate-100"
             )}
             onClick={() => {
                setIsPreview(!isPreview);
                if (!isPreview) setState(prev => ({ ...prev, selectedBlockId: null }));
             }}
           >
              {isPreview ? <><EyeOff className="h-4 w-4" /> Exit Preview</> : <><Eye className="h-4 w-4" /> Preview</>}
           </Button>
           <Button variant="outline" className="gap-2 h-9 text-xs font-semibold" onClick={onSave}>
              <Save className="h-4 w-4" /> Save Draft
           </Button>
           <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-9 text-xs font-semibold shadow-md" onClick={onExport}>
              <Download className="h-4 w-4" /> Export {mode === 'email' ? 'HTML' : 'PDF'}
           </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Canvas Area */}
        <div 
          className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-8 relative"
          onClick={() => !isPreview && setState(prev => ({ ...prev, selectedBlockId: null }))}
        >
           <div 
             ref={canvasRef}
             className="bg-white shadow-xl transition-all duration-300 min-h-[800px] flex flex-col relative"
             style={{ 
               width: state.device === 'desktop' ? '100%' : state.device === 'tablet' ? '600px' : '375px',
               maxWidth: state.bodyStyles.width || '600px',
               backgroundColor: state.bodyStyles.backgroundColor,
               fontFamily: state.bodyStyles.fontFamily,
               color: state.bodyStyles.color,
               fontSize: state.bodyStyles.fontSize,
               lineHeight: state.bodyStyles.lineHeight,
             }}
             onDragOver={(e) => { e.preventDefault(); if (!isPreview && !dragTarget) setDragTarget({ id: 'canvas-bottom', position: 'bottom' }); }}
             onDrop={handleCanvasDrop}
           >
              {/* Dynamic Style Injection for Canvas-Specific Overrides */}
              <style>{`
                .unlayer-canvas a { color: ${state.bodyStyles.linkColor || '#2563eb'}; }
                .unlayer-canvas p { margin-bottom: 1em; }
              `}</style>
              
              <div className="flex-1 py-8 px-8 min-h-full unlayer-canvas flex flex-col">
                 {state.blocks.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 pointer-events-none p-12 text-center h-full border-2 border-dashed border-slate-200 m-4 rounded-xl">
                       <Layout className="w-12 h-12 mb-2 mx-auto text-slate-200" />
                       <p className="text-sm font-medium text-slate-400">Drag blocks from the sidebar here</p>
                    </div>
                 ) : (
                    state.blocks.map(block => renderBlockPreview(block))
                 )}
              </div>
           </div>
        </div>

        {/* Right Sidebar */}
        {!isPreview && (
            <div className="w-[350px] bg-white border-l border-slate-200 flex flex-col shrink-0 z-20 shadow-xl h-full">
            {selectedBlock ? (
                // --- Properties Panel ---
                <div className="flex flex-col h-full animate-in slide-in-from-right-10 duration-200">
                    <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50 shrink-0">
                    <span className="font-bold text-sm text-slate-900 capitalize">{selectedBlock.type} Properties</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setState(prev => ({ ...prev, selectedBlockId: null }))}>
                        <X className="h-4 w-4 text-slate-500" />
                    </Button>
                    </div>
                    
                    <div className="p-5 space-y-6 overflow-y-auto flex-1 min-h-0">
                    {/* Content Settings */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Content</h4>
                        
                        {['text', 'heading', 'button'].includes(selectedBlock.type) && (
                            <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs text-slate-600 font-semibold">Text Content</Label>
                                {/* Merge Tags Helper */}
                                <div className="flex gap-1">
                                    {['{{first_name}}', '{{email}}', '{{unsubscribe}}'].map(tag => (
                                        <button 
                                            key={tag} 
                                            onClick={() => insertMergeTag(tag)}
                                            className="text-[9px] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                                            title={`Insert ${tag}`}
                                        >
                                            {tag.replace(/[{}]/g, '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {selectedBlock.type === 'text' ? (
                                <textarea 
                                rows={4}
                                className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm placeholder:text-slate-400"
                                value={selectedBlock.content.text}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                />
                            ) : (
                                <Input 
                                className="bg-white border-slate-300 text-slate-900 shadow-sm"
                                value={selectedBlock.content.text}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'text', e.target.value)}
                                />
                            )}
                            </div>
                        )}

                        {selectedBlock.type === 'html' && (
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-semibold">HTML Code</Label>
                                <textarea 
                                rows={8}
                                className="w-full rounded-md border border-slate-300 bg-white p-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                                value={selectedBlock.content.html}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'html', e.target.value)}
                                />
                            </div>
                        )}

                        {selectedBlock.type === 'button' && (
                            <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600 font-semibold">Link URL</Label>
                            <Input 
                                className="bg-white border-slate-300 text-slate-900 shadow-sm"
                                value={selectedBlock.content.url}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'url', e.target.value)}
                                placeholder="https://"
                            />
                            </div>
                        )}

                        {selectedBlock.type === 'image' && (
                            <div className="space-y-1.5">
                            <Label className="text-xs text-slate-600 font-semibold">Image URL</Label>
                            <Input 
                                className="bg-white border-slate-300 text-slate-900 shadow-sm"
                                value={selectedBlock.content.url}
                                onChange={(e) => updateBlockContent(selectedBlock.id, 'url', e.target.value)}
                                placeholder="https://"
                            />
                            </div>
                        )}
                    </div>

                    <div className="h-px bg-slate-100" />

                    {/* Style Settings */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Styles</h4>
                        
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-600 font-semibold">Alignment</Label>
                            <div className="flex bg-slate-100 rounded-md p-1 gap-1 border border-slate-200">
                                {['left', 'center', 'right'].map((align) => (
                                <button
                                    key={align}
                                    onClick={() => updateBlockStyles(selectedBlock.id, { textAlign: align as any })}
                                    className={cn(
                                    "flex-1 py-1 rounded flex items-center justify-center transition-all",
                                    selectedBlock.styles.textAlign === align ? "bg-white shadow-sm text-slate-900 font-medium" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {align === 'left' ? <AlignLeft className="w-4 h-4" /> : align === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                                </button>
                                ))}
                            </div>
                        </div>

                        {['heading', 'text'].includes(selectedBlock.type) && (
                            <ColorPicker 
                            label="Text Color" 
                            value={selectedBlock.styles.color as string} 
                            onChange={(val) => updateBlockStyles(selectedBlock.id, { color: val })} 
                            />
                        )}

                        {selectedBlock.type === 'button' && (
                            <>
                            <ColorPicker 
                                label="Background Color" 
                                value={(selectedBlock.styles as any).backgroundColor} 
                                onChange={(val) => updateBlockStyles(selectedBlock.id, { backgroundColor: val })} 
                            />
                            <ColorPicker 
                                label="Text Color" 
                                value={(selectedBlock.styles as any).color} 
                                onChange={(val) => updateBlockStyles(selectedBlock.id, { color: val })} 
                            />
                            <div className="space-y-1.5">
                                <Label className="text-xs text-slate-600 font-semibold">Border Radius</Label>
                                <Input className="h-8 text-xs bg-white" value={(selectedBlock.styles as any).borderRadius} onChange={(e) => updateBlockStyles(selectedBlock.id, { borderRadius: e.target.value })} />
                            </div>
                            </>
                        )}

                        <div className="space-y-1.5">
                            <div className="flex justify-between">
                                <Label className="text-xs text-slate-600 font-semibold">Padding</Label>
                                <span className="text-xs text-slate-400">{selectedBlock.styles.padding}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input className="h-8 text-xs bg-white border-slate-300 text-slate-900 shadow-sm" placeholder="Top/Bottom" onChange={(e) => updateBlockStyles(selectedBlock.id, { padding: `${e.target.value} ${selectedBlock.styles.padding?.toString().split(' ')[1] || '0px'}` })} />
                                <Input className="h-8 text-xs bg-white border-slate-300 text-slate-900 shadow-sm" placeholder="Left/Right" onChange={(e) => updateBlockStyles(selectedBlock.id, { padding: `${selectedBlock.styles.padding?.toString().split(' ')[0] || '0px'} ${e.target.value}` })} />
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <Button variant="destructive" className="w-full" onClick={() => deleteBlock(selectedBlock.id)}>Delete Block</Button>
                    </div>
                </div>
            ) : (
                // --- Standard Tabs ---
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full min-h-0">
                    <div className="px-2 pt-2 border-b border-slate-100 bg-slate-50/50 shrink-0">
                    <TabsList className="w-full grid grid-cols-4 bg-transparent h-12">
                        <TabsTrigger value="content" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Content</TabsTrigger>
                        <TabsTrigger value="blocks" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Blocks</TabsTrigger>
                        <TabsTrigger value="templates" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Templates</TabsTrigger>
                        <TabsTrigger value="body" className="text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md h-9">Body</TabsTrigger>
                    </TabsList>
                    </div>

                    <TabsContent value="content" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                    <div className="grid grid-cols-2 gap-3">
                        <ToolButton icon={Type} label="Text" type="text" onDragStart={handleDragStart} />
                        <ToolButton icon={ImageIcon} label="Image" type="image" onDragStart={handleDragStart} />
                        <ToolButton icon={MousePointer2} label="Button" type="button" onDragStart={handleDragStart} />
                        <ToolButton icon={Type} label="Heading" type="heading" onDragStart={handleDragStart} />
                        <ToolButton icon={Minus} label="Divider" type="divider" onDragStart={handleDragStart} />
                        <ToolButton icon={Code} label="HTML" type="html" onDragStart={handleDragStart} />
                        <ToolButton icon={Video} label="Video" type="video" onDragStart={handleDragStart} />
                    </div>
                    </TabsContent>

                    <TabsContent value="blocks" className="flex-1 overflow-y-auto p-4 m-0 space-y-4 min-h-0">
                        <div className="grid grid-cols-2 gap-3">
                            {PRESETS.map((preset) => (
                                <PresetButton key={preset.id} preset={preset} onDragStart={handlePresetDragStart} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="templates" className="flex-1 overflow-y-auto p-4 m-0 min-h-0">
                        <div className="space-y-4">
                            {SAVED_TEMPLATES.map((tpl) => (
                                <div key={tpl.id} className="group border border-slate-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white" onClick={() => loadTemplate(tpl)}>
                                    <div className={cn("h-24 relative overflow-hidden flex items-center justify-center", tpl.color || "bg-slate-100")}>
                                        <LayoutTemplate className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors">{tpl.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{tpl.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="body" className="flex-1 overflow-y-auto p-6 m-0 space-y-8 min-h-0">
                      {/* Section 1: Dimensions & Background */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dimensions</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                             <Label className="text-xs text-slate-600 font-semibold">Content Width</Label>
                             <span className="text-xs font-mono text-slate-500">{state.bodyStyles.width || '600px'}</span>
                          </div>
                          <Slider 
                            defaultValue={[parseInt(state.bodyStyles.width?.toString() || '600')]} 
                            max={900} 
                            min={320} 
                            step={10}
                            onValueChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, width: `${val[0]}px` } }))}
                          />
                        </div>
                        
                        <ColorPicker 
                            label="Content Background" 
                            value={state.bodyStyles.backgroundColor as string} 
                            onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, backgroundColor: val } }))} 
                        />
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Section 2: Typography */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography</h4>
                        
                        <div className="space-y-2">
                            <Label className="text-xs text-slate-600 font-semibold">Font Family</Label>
                            <div className="relative bg-white rounded-md">
                                <select 
                                    className="w-full h-9 rounded-md border border-slate-300 text-sm pl-3 pr-8 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none cursor-pointer"
                                    value={state.bodyStyles.fontFamily}
                                    style={{ backgroundColor: 'white', WebkitAppearance: 'none', appearance: 'none' }}
                                    onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, fontFamily: e.target.value } }))}
                                >
                                    <option value="Inter, sans-serif">Inter (Sans-Serif)</option>
                                    <option value="Arial, sans-serif">Arial (Sans-Serif)</option>
                                    <option value="'Times New Roman', serif">Times New Roman (Serif)</option>
                                    <option value="'Courier New', monospace">Courier New (Monospace)</option>
                                    <option value="'Georgia', serif">Georgia (Serif)</option>
                                    <option value="'Verdana', sans-serif">Verdana (Sans-Serif)</option>
                                </select>
                                <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-500 pointer-events-none bg-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label className="text-xs text-slate-600 font-semibold">Base Size</Label>
                              <Input 
                                 className="h-9 bg-white" 
                                 value={state.bodyStyles.fontSize} 
                                 onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, fontSize: e.target.value } }))}
                              />
                           </div>
                           <div className="space-y-2">
                              <Label className="text-xs text-slate-600 font-semibold">Line Height</Label>
                              <Input 
                                 className="h-9 bg-white" 
                                 value={state.bodyStyles.lineHeight} 
                                 onChange={(e) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, lineHeight: e.target.value } }))}
                              />
                           </div>
                        </div>

                        <ColorPicker 
                            label="Text Color" 
                            value={state.bodyStyles.color as string} 
                            onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, color: val } }))} 
                        />
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Section 3: Links */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Links</h4>
                        <ColorPicker 
                            label="Link Color" 
                            value={state.bodyStyles.linkColor as string} 
                            onChange={(val) => setState(prev => ({ ...prev, bodyStyles: { ...prev.bodyStyles, linkColor: val } }))} 
                        />
                      </div>
                    </TabsContent>
                </Tabs>
            )}
            </div>
        )}

      </div>
    </div>
  );
};

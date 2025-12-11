import React from 'react'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  HandHeart,
  Rss,
  FileEdit,
  Mail,
  Settings,
  ShieldCheck,
  CheckSquare,
  LucideIcon
} from 'lucide-react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '../ui/sidebar'
import { SidebarUserDropdown } from './SidebarComponents'
import { Separator } from '../ui/separator'

type NavItem =
  | { type: 'item', id: string, label: string, icon: LucideIcon }
  | { type: 'separator' }

interface FieldworkerSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const FieldworkerSidebar: React.FC<FieldworkerSidebarProps> = ({ currentView, onNavigate }) => {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavigate = (view: string) => {
    onNavigate(view)
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  const menuItems: NavItem[] = [
    { type: 'item', id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { type: 'item', id: 'feed', label: 'My Feed', icon: Rss },
    { type: 'separator' },
    { type: 'item', id: 'analytics', label: 'Giving Analytics', icon: BarChart3 },
    { type: 'item', id: 'donors', label: 'Donors', icon: Users },
    { type: 'item', id: 'pledges', label: 'Gifts', icon: HandHeart },
    { type: 'item', id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { type: 'separator' },
    { type: 'item', id: 'content', label: 'Content / Pages', icon: FileEdit },
    { type: 'item', id: 'email', label: 'Email Studio', icon: Mail },
    { type: 'item', id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <Sidebar className="bg-white border-r border-slate-200">
      <SidebarHeader className="pb-4">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="h-9 w-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-lg tracking-tighter shadow-sm shrink-0">
            GH
          </div>
          <div className="flex flex-col justify-center overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-sm tracking-tight text-slate-900 leading-none">
              GIVE<span className="font-light opacity-60">HOPE</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
              Fieldworker Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item, idx) => {
            if (item.type === 'separator') {
              return <Separator key={`sep-${idx}`} className="my-2 bg-slate-100" />
            }
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={currentView === item.id}
                  onClick={() => handleNavigate(item.id)}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900 font-medium text-slate-500 hover:text-slate-900"
                >
                  <item.icon 
                    className={`h-4.5 w-4.5 ${currentView === item.id ? 'text-slate-900' : 'text-slate-500'}`}
                  />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-6">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 shadow-sm mb-4">
          <div className="flex justify-between items-end mb-2">
            <p className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Goal Progress</p>
            <span className="text-xs font-bold text-slate-900">76%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-slate-900 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: '76%' }}
            />
          </div>
        </div>
        <SidebarUserDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}

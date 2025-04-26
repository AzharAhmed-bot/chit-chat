
import { MessageCircle, Home, Bell, Settings, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function AppSidebar() {
  const navItems = [
    { icon: Home, label: "Home", href: "#" },
    { icon: MessageCircle, label: "Chats", href: "#" },
    { icon: Bell, label: "Notifications", href: "#" },
    { icon: Settings, label: "Settings", href: "#" },
  ]

  return (
    <Sidebar collapsible="none" variant="inset" className="h-screen">
      <SidebarContent className="flex flex-col justify-between items-center h-full py-6 bg-gray-700 text-gray-100">
        {/* Top: Avatar + Main Nav */}
        <div className="flex flex-col items-start space-y-10">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img
              src="/avatar.jpg"
              alt="User avatar"
              width={48}
              height={48}
            />
          </div>

          {/* Navigation Buttons */}
          <SidebarMenu className="flex flex-col items-start space-y-6">
            {navItems.map(({ icon: Icon, label, href }) => (
              <SidebarMenuItem key={label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild>
                      <a
                        href={href}
                        className="p-2 hover:bg-gray-600 rounded-lg font-bold text-2xl"
                      >
                        <Icon/> 
                      </a>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {label}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Bottom: Logout */}
        <SidebarFooter className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton asChild>
                <button className="p-2 hover:bg-gray-600 rounded-lg">
                  <LogOut size={28} />
                </button>
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

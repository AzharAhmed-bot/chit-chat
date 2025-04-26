import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "../pages/common/AppSidebar"



export default function Layout({ children }) {

    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    )
  }





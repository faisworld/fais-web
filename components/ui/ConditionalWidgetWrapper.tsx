"use client";

import { usePathname } from "next/navigation";
import ElevenLabsWidgetWrapper from "@/components/ui/ElevenLabsWidgetWrapper";

export default function ConditionalWidgetWrapper({ agentId }: { agentId: string }) {
  const pathname = usePathname();
  
  // Check if this is the Kvitka Poloniny page
  const isKvitkaPage = pathname?.includes("/kvitka-poloniny");
  
  // Check if this is an admin page
  const isAdminPage = pathname?.startsWith("/admin");
  // Don't render the global widget on the Kvitka page or admin pages
  if (isKvitkaPage || isAdminPage) {
    return null;
  }

  // For all other pages, render the global widget
  return <ElevenLabsWidgetWrapper agentId={agentId} />;
}

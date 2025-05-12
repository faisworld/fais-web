"use client";

import { usePathname } from "next/navigation";
import ElevenLabsWidgetWrapper from "@/components/ui/ElevenLabsWidgetWrapper";

export default function ConditionalWidgetWrapper({ agentId }: { agentId: string }) {
  const pathname = usePathname();
  
  // Check if this is the Kvitka Poloniny page
  const isKvitkaPage = pathname?.includes("/kvitka-poloniny");

  // Don't render the global widget on the Kvitka page
  if (isKvitkaPage) {
    console.log('Skipping global widget on Kvitka Poloniny page');
    return null;
  }

  // For all other pages, render the global widget
  return <ElevenLabsWidgetWrapper agentId={agentId} />;
}

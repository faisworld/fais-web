"use client";

import { usePathname } from "next/navigation";
import ElevenLabsWidgetWrapper from "@/components/ui/ElevenLabsWidgetWrapper";

export default function ConditionalWidgetWrapper({ agentId }: { agentId: string }) {
  const pathname = usePathname();
  const isKvitkaPage = pathname?.includes("/kvitka-poloniny");

  // Don't render the global widget on the Kvitka page
  if (isKvitkaPage) {
    return null;
  }

  return <ElevenLabsWidgetWrapper agentId={agentId} />;
}

"use client"

import dynamic from "next/dynamic"

// Dynamically import the ElevenLabsWidget with no SSR
const ElevenLabsWidget = dynamic(() => import("@/components/ui/ElevenLabsWidget"), {
  ssr: false
})

export default function ElevenLabsWidgetWrapper({ agentId }: { agentId: string }) {
  return <ElevenLabsWidget agentId={agentId} />
}

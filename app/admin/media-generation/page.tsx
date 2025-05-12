"use client";

import MediaGenerationWidget from "@/components/ui/MediaGenerationWidget";
import React from "react";

export default function MediaGenerationPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Media Generation
      </h1>
      <MediaGenerationWidget />
    </div>
  );
}

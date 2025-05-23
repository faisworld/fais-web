"use client";

import { signOut } from "next-auth/react";
import Button from "@/components/ui/Button"; // Changed to uppercase B
import { LogOut } from "lucide-react";

export function AdminLogout() {
  return (
    <Button 
      onClick={() => signOut({ callbackUrl: '/' })}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </Button>
  );
}

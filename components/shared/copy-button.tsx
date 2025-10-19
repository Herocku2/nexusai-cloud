'use client'

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export function CopyButton({ text }: { text: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles');
  };

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleCopy}
      type="button"
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
}

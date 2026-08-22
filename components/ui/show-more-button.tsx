"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowMoreButtonProps {
  expanded: boolean;
  onClick: () => void;
  className?: string;
  moreLabel?: string;
  lessLabel?: string;
  "aria-controls"?: string;
}

/** A theme-aware toggle used wherever a section can reveal additional content. */
export function ShowMoreButton({
  expanded,
  onClick,
  className,
  moreLabel = "Show more",
  lessLabel = "Show less",
  "aria-controls": ariaControls,
}: ShowMoreButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={ariaControls}
    >
      {expanded ? <ChevronUp /> : <ChevronDown />}
      {expanded ? lessLabel : moreLabel}
    </Button>
  );
}

"use client";

import { CircleHelp } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

type TourHelpButtonProps = {
  onClick: () => void;
  label?: string;
};

export function TourHelpButton({
  onClick,
  label = "Abrir tour guiado",
}: TourHelpButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-11 shrink-0 cursor-pointer rounded-[14px]"
      onClick={onClick}
      aria-label={label}
    >
      <CircleHelp className="size-5" aria-hidden />
    </Button>
  );
}

type TourOfferDialogProps = {
  open: boolean;
  title: string;
  description: string;
  onDismiss: () => void;
  onStart: () => void;
};

export function TourOfferDialog({
  open,
  title,
  description,
  onDismiss,
  onStart,
}: TourOfferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer rounded-[14px]"
            onClick={onDismiss}
          >
            Agora não
          </Button>
          <Button
            type="button"
            className="cursor-pointer rounded-[14px]"
            onClick={onStart}
          >
            Começar tour
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

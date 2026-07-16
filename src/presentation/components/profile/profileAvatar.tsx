"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/presentation/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getProfileInitials } from "@/presentation/components/profile/profileUtils";

const loadedPhotoUrls = new Set<string>();

interface ProfileAvatarProps {
  name: string;
  photoUrl?: string | null;
  className?: string;
}

export function ProfileAvatar({ name, photoUrl, className }: ProfileAvatarProps) {
  const initials = getProfileInitials(name || "U");
  const [readyUrl, setReadyUrl] = useState<string | null>(null);

  const resolvedPhotoUrl = photoUrl ?? null;
  const isPhotoReady =
    resolvedPhotoUrl !== null &&
    (loadedPhotoUrls.has(resolvedPhotoUrl) || readyUrl === resolvedPhotoUrl);

  useEffect(() => {
    if (!photoUrl || loadedPhotoUrls.has(photoUrl) || readyUrl === photoUrl) {
      return;
    }

    let cancelled = false;
    const image = new window.Image();
    image.decoding = "async";
    image.src = photoUrl;

    image.onload = () => {
      if (cancelled) return;
      loadedPhotoUrls.add(photoUrl);
      setReadyUrl(photoUrl);
    };

    image.onerror = () => {
      if (cancelled) return;
      setReadyUrl(null);
    };

    return () => {
      cancelled = true;
    };
  }, [photoUrl, readyUrl]);

  return (
    <Avatar
      className={cn(
        "size-24 bg-primary shadow-[0px_4px_3px_rgba(0,0,0,0.1),0px_2px_2px_rgba(0,0,0,0.1)] after:hidden",
        className,
      )}
    >
      {photoUrl && isPhotoReady ? (
        <AvatarImage
          src={photoUrl}
          alt=""
          className="object-cover"
          loading="eager"
          fetchPriority="high"
        />
      ) : null}
      <AvatarFallback
        delayMs={photoUrl && !isPhotoReady ? Number.POSITIVE_INFINITY : 0}
        className="bg-primary text-[30px] font-bold leading-9 text-white"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

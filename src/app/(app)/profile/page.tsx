"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/presentation/providers/AuthProvider";
import { usePreferences } from "@/presentation/hooks/usePreferences";
import { getHistoryDi } from "@/lib/di/historyDi";
import { getUploadProfilePhotoUseCase } from "@/lib/di/profileDi";
import { ProfileScreen } from "@/presentation/components/profile/profileScreen";
import { defaultPreferences } from "@/domain/entities/UserPreferences";

const EMPTY_STATS = { totalCompleted: 0, streak: 0 };
const statsCache = new Map<string, typeof EMPTY_STATS>();

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuthContext();
  const { preferences } = usePreferences();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const userId = user?.id ?? null;
  const [stats, setStats] = useState(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsForUserId, setStatsForUserId] = useState<string | null>(null);

  if (userId !== statsForUserId) {
    const cachedStats = userId ? statsCache.get(userId) : undefined;
    setStatsForUserId(userId);
    setStats(cachedStats ?? EMPTY_STATS);
    setStatsLoading(Boolean(userId) && !cachedStats);
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!userId) return;

    const cachedStats = statsCache.get(userId);
    if (cachedStats) return;

    let cancelled = false;

    const loadStats = async () => {
      try {
        setStatsLoading(true);

        const { getStatsUseCase } = getHistoryDi();
        const statsData = await getStatsUseCase.execute({ userId });
        const nextStats = {
          totalCompleted: statsData.totalCompleted,
          streak: statsData.streak,
        };
        statsCache.set(userId, nextStats);

        if (!cancelled) {
          setStats(nextStats);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas do perfil:", err);
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const uploadProfilePhotoUseCase = getUploadProfilePhotoUseCase();
      await uploadProfilePhotoUseCase.execute(user.id, file);
      await refreshUser();
      toast.success("Foto de perfil atualizada!");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload da foto. Tente novamente.";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (authLoading || !user) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center bg-[#f8fafc]"
        role="status"
        aria-live="polite"
      >
        <p className="text-base text-[#64748b]">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <>
      <ProfileScreen
        user={user}
        preferences={preferences ?? defaultPreferences(user.id)}
        stats={stats}
        statsLoading={statsLoading}
        isUploadingPhoto={isUploading}
        onPhotoClick={handlePhotoClick}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
        aria-hidden
      />
    </>
  );
}

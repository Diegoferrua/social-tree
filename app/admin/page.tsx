import type { Metadata } from "next";
import { profile } from "@/config/profile";
import { links } from "@/config/links";
import { ICONS, type IconKey } from "@/lib/icons";
import AdminForm from "@/components/admin/AdminForm";

export const metadata: Metadata = {
  title: "Editar Social Tree",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05050a] px-6 text-center text-white/70">
        <p>
          El dashboard de edición no está disponible en producción.
          <br />
          Corré <code className="text-white">npm run dev</code> localmente para usarlo.
        </p>
      </div>
    );
  }

  const iconKeys = Object.keys(ICONS) as IconKey[];

  return (
    <div className="min-h-screen bg-[#05050a]">
      <AdminForm initialProfile={profile} initialLinks={links} iconKeys={iconKeys} />
    </div>
  );
}

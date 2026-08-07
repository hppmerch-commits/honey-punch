import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata = { title: "관리자 로그인 — HONEY PUNCH" };

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <p className="font-logo text-center text-[26px] tracking-[0.06em]">
          Honey Punch
        </p>
        <p className="mt-2 text-center text-[11px] tracking-[0.2em] text-neutral-400">
          ADMIN
        </p>
        <LoginForm />
      </div>
    </main>
  );
}

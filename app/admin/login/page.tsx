import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign in — Refinea CMS",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-black/[0.06] shadow-[0_2px_16px_rgba(0,0,0,0.04)] p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-xl mb-3">
            R
          </div>
          <h1 className="text-xl font-bold text-black tracking-[-0.01em]">
            Refinea CMS
          </h1>
          <p className="text-sm text-black/55 mt-1">
            Sign in to manage blog content.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

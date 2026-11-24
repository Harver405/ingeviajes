import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-5">
      <div className="w-full max-w-sm rounded-[var(--radius-card)] bg-paper p-8 shadow-[0_20px_60px_-30px_rgb(0_0_0/0.35)]">
        <h1 className="font-display text-2xl font-bold text-ink">Panel INGEVIAJES</h1>
        <p className="mt-1 text-sm text-muted">Ingresa para administrar las experiencias.</p>
        <LoginForm />
      </div>
    </main>
  );
}
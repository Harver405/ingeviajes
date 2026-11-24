"use client";

import { useActionState } from "react";
import { login, type Result } from "../actions";

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink outline-none transition-colors focus:border-lima-ink";

export default function LoginForm() {
  const [state, action, pending] = useActionState<Result, FormData>(login, {});
  return (
    <form action={action} className="mt-6 grid gap-4">
      <label className="text-sm font-semibold text-carbon">
        Correo
        <input name="email" type="email" required autoComplete="email" defaultValue={state.value} className={field} />
      </label>
      <label className="text-sm font-semibold text-carbon">
        Contraseña
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      )}
      <button
        disabled={pending}
        className="mt-2 rounded-full bg-lima px-5 py-3 font-display font-semibold text-ink transition-opacity disabled:opacity-60"
      >
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
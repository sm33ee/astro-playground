import { useState } from 'react';

type ReactCounterProps = {
  initial?: number;
};

export default function ReactCounter({ initial = 0 }: ReactCounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="text-sm uppercase tracking-[0.2em] text-brand-200">React island</div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-lg font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          type="button"
          onClick={() => setCount((value) => value - 1)}
          aria-label="Decrease count"
        >
          -
        </button>
        <div
          className="min-w-[3rem] text-center text-2xl font-semibold text-white"
          aria-live="polite"
          data-testid="count-value"
        >
          {count}
        </div>
        <button
          className="rounded-full bg-brand-500 px-4 py-2 text-lg font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-600"
          type="button"
          onClick={() => setCount((value) => value + 1)}
          aria-label="Increase count"
        >
          +
        </button>
      </div>
      <p className="text-sm text-slate-300">
        This counter is rendered with React and hydrated on the client.
      </p>
    </div>
  );
}

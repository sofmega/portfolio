// src/components/Rings.tsx
export default function Rings() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[920px] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10" />
      <div className="absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 border-dashed" />
      <div className="absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/10 border-dashed" />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#070709] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-accent text-zinc-950 flex items-center justify-center font-display font-black text-2xl shadow-[0_0_25px_rgba(212,249,51,0.4)] animate-pulse">
          S
        </div>
        <div className="text-center">
          <h2 className="font-display font-black text-2xl uppercase tracking-widest text-white">
            SHADOW FITNESS
          </h2>
          <p className="text-[10px] font-mono tracking-ultra-wide uppercase text-accent font-bold mt-0.5">
            DISCIPLINE OVER MOTIVATION
          </p>
        </div>
        <div className="w-36 h-0.5 bg-zinc-900 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-accent w-1/2 animate-[slide_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

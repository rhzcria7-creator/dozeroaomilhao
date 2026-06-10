import { useEffect, useRef, useState, ReactNode } from "react";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { PRODUCT, CHAPTERS } from "./constants/product";

// ============================================================
// Split Text (blur + rise)
// ============================================================
function SplitText({ text, className = "", delay = 0, stagger = 80 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.22em] align-baseline">
          {word.split("").map((ch, ci) => (
            <span
              key={ci}
              className="split-char inline-block"
              style={{ animationDelay: `${delay + wi * stagger + ci * 15}ms` }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

// ============================================================
// CountUp
// ============================================================
function CountUp({ end, duration = 1800, prefix = "", suffix = "", decimals = 0 }: { end: number; duration?: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Number((eased * end).toFixed(decimals)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.25 });
    io.observe(node);
    return () => io.disconnect();
  }, [end, duration, decimals]);
  return (
    <span ref={ref} className="count-wrap">{prefix}{val}{suffix}</span>
  );
}

// ============================================================
// Click spark (pixel blast)
// ============================================================
function ClickSpark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number; dx: number; dy: number; color: string }[]>([]);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const colors = ["#F5C542", "#F8D570", "#D9A82B", "#ffffff", "#F5C542"];
    const onClick = (e: MouseEvent) => {
      const t = e.currentTarget as HTMLElement;
      const rect = t.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const batch = Array.from({ length: 10 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 10;
        const dist = 40 + Math.random() * 40;
        return {
          id: Date.now() + i, x, y,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          color: colors[i % colors.length],
        };
      });
      setSparks((s) => [...s, ...batch]);
      setTimeout(() => setSparks((s) => s.filter((sp) => !batch.find((b) => b.id === sp.id))), 1000);
    };
    el.addEventListener("click", onClick as any);
    return () => el.removeEventListener("click", onClick as any);
  }, []);
  return (
    <div ref={ref} className="relative">
      {children}
      {sparks.map((s) => (
        <span key={s.id} className="pixel-spark" style={{ left: s.x, top: s.y, background: s.color, ["--dx" as any]: `${s.dx}px`, ["--dy" as any]: `${s.dy}px` }} />
      ))}
    </div>
  );
}

// ============================================================
// Spotlight Card
// ============================================================
function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`spotlight-card ${className}`}>
      <div className="spotlight-inner" />
      <div className="relative">{children}</div>
    </div>
  );
}

// ============================================================
// Main App - Landing Page Only
// ============================================================
export default function App() {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-black text-white antialiased radial-bg">
      <div className="noise" />

      {/* ===== HEADER ===== */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <img src="/logo-icon.png" alt="Do Zero ao Milhão" width={32} height={32} className="logo-float" />
            <span className="text-sm font-medium tracking-tight hidden sm:inline">Do Zero ao Milhão</span>
          </a>
          <nav className="flex items-center gap-6">
            <a href="#capitulos" className="text-xs text-white/50 hover:text-white transition">Capítulos</a>
            <a href="#sobre" className="text-xs text-white/50 hover:text-white transition">Sobre</a>
          </nav>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative py-20 lg:py-32 px-5 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/5 text-gold-400 text-xs tracking-widest">
            GUIA DEFINITIVO DE FINANÇAS PESSOAIS
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-8 reveal">
            <SplitText text="Do Zero ao Milhão" delay={0} />
          </h1>
          <p className="text-lg md:text-xl text-mist max-w-2xl mx-auto mb-10 reveal" style={{ animationDelay: "200ms" }}>
            O guia completo para transformar sua relação com o dinheiro, construir patrimônio e alcançar independência financeira.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal" style={{ animationDelay: "400ms" }}>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-mist">R$</span>
              <span className="font-display text-5xl text-gold-gradient">129</span>
              <span className="text-sm text-mist">,90</span>
            </div>
            <span className="text-xs text-white/30 line-through">R$ 297,00</span>
            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">56% OFF</span>
          </div>
        </div>
      </section>

      {/* ===== CTA BUTTON ===== */}
      <section className="px-5 lg:px-10 mb-20 reveal" style={{ animationDelay: "600ms" }}>
        <div className="max-w-5xl mx-auto text-center">
          <ClickSpark>
            <button className="cta-button">
              <span className="relative z-10">QUERO COMEÇAR AGORA</span>
            </button>
          </ClickSpark>
          <p className="mt-4 text-xs text-white/40">
            Acesso imediato · Garantia de {PRODUCT.guaranteeDays} dias
          </p>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="px-5 lg:px-10 py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="reveal">
            <div className="font-display text-4xl lg:text-5xl text-gold-gradient mb-2">
              <CountUp end={12847} suffix="+" />
            </div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Alunos</p>
          </div>
          <div className="reveal" style={{ animationDelay: "100ms" }}>
            <div className="font-display text-4xl lg:text-5xl text-gold-gradient mb-2">
              <CountUp end={4} suffix=".9" decimals={1} />
            </div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Avaliação Média</p>
          </div>
          <div className="reveal" style={{ animationDelay: "200ms" }}>
            <div className="font-display text-4xl lg:text-5xl text-gold-gradient mb-2">
              <CountUp end={97} suffix="%" />
            </div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Aprovação</p>
          </div>
          <div className="reveal" style={{ animationDelay: "300ms" }}>
            <div className="font-display text-4xl lg:text-5xl text-gold-gradient mb-2">
              <CountUp end={PRODUCT.pages} />
            </div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Capítulos</p>
          </div>
        </div>
      </section>

      {/* ===== CAPÍTULOS ===== */}
      <section id="capitulos" className="px-5 lg:px-10 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 reveal">
            <span className="text-xs tracking-[0.3em] uppercase text-gold-400">{PRODUCT.pages} Capítulos</span>
            <h2 className="font-display text-4xl md:text-5xl font-light tracking-tight mt-4">
              Tudo que você precisa saber
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {CHAPTERS.map((chapter, i) => (
              <div key={i} className="group p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-gold-400/30 transition-colors reveal" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="flex items-start gap-4">
                  <span className="font-display text-3xl text-white/10 group-hover:text-gold-400/30 transition-colors">
                    {String(chapter.n).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="text-[10px] text-gold-400/60 uppercase tracking-wider mb-1">{chapter.sub}</div>
                    <h3 className="font-medium text-sm leading-snug">{chapter.t}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOBRE ===== */}
      <section id="sobre" className="px-5 lg:px-10 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-gold-400">Sobre o guia</span>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight mt-4 mb-6">
            {PRODUCT.subtitle}
          </h2>
          <p className="text-white/60 leading-relaxed">
            Este guia foi desenvolvido para pessoas que querem transformar sua relação com o dinheiro. 
            Sem técnicas mirabolantes ou promessas vazias — apenas princípios práticos e executáveis que já 
            ajudaram milhares de brasileiros a construir patrimônio real.
          </p>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="px-5 lg:px-10 py-20 border-t border-white/5 reveal">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-400/10 border border-gold-400 mb-8 glow-pulse">
            <span className="text-4xl">📖</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight mb-4">
            Pronto para começar?
          </h2>
          <p className="text-white/60 mb-8">
            Acesso imediato após a confirmação do pagamento. O ebook chega no seu e-mail em até 2 minutos.
          </p>
          <ClickSpark>
            <button className="cta-button">
              <span className="relative z-10">QUERO MEU EBOOK AGORA</span>
            </button>
          </ClickSpark>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-12 px-5 lg:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-white/40">
            Do Zero ao Milhão © 2024 · Todos os direitos reservados
          </p>
          <p className="text-xs text-white/30 mt-2">
            Material educacional. Não constitui recomendação de investimento.
          </p>
        </div>
      </footer>
    </div>
  );
}
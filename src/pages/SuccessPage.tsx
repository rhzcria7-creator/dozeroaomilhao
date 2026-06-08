import { useEffect, useState } from "react";
import { PRODUCT } from "../constants/product";

export default function SuccessPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    const t = setTimeout(() => {
      if (sessionId) setStatus("success");
      else setStatus("error");
    }, 900);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 radial-bg">
      <div className="noise" />
      <div className="relative max-w-2xl text-center w-full">
        {status === "loading" && (
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto border-4 border-gold-400/20 border-t-gold-400 rounded-full animate-spin" />
            <p className="mt-6 text-white/60">Confirmando seu pagamento...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-400/10 border-2 border-gold-400 mb-8 glow-pulse">
              <svg
                className="w-10 h-10 text-gold-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <span className="text-xs tracking-[0.3em] uppercase text-gold-400">
              Acesso liberado
            </span>
            <h1 className="mt-3 font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05]">
              Pagamento{" "}
              <span className="text-gold-gradient italic">confirmado.</span>
            </h1>

            <p className="mt-6 text-lg text-white/70 max-w-lg mx-auto leading-relaxed">
              Bem-vindo à jornada. Seu{" "}
              <span className="text-white">{PRODUCT.fullName}</span> já está
              pronto para download.
            </p>

            <div className="mt-10 rounded-3xl border border-gold-400/30 bg-gradient-to-b from-gold-400/[0.08] to-transparent backdrop-blur p-7 lg:p-9 shimmer-border text-left">
              <div className="flex items-center gap-5">
                <div className="shrink-0 w-16 h-22 rounded-lg overflow-hidden border border-gold-400/40 bg-black">
                  <img
                    src="/ebook-cover.png"
                    alt="Ebook Do Zero ao Milhão"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] tracking-widest uppercase text-gold-400/80">
                    Ebook Premium · {PRODUCT.pages} páginas
                  </div>
                  <h2 className="mt-1 font-display text-xl">
                    {PRODUCT.name}
                  </h2>
                  <div className="text-xs text-mist">
                    {PRODUCT.subtitle}
                  </div>
                </div>
              </div>

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Em ambiente real, o download do PDF de 40 páginas seria liberado aqui. Verifique também seu e-mail."
                  );
                }}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gold-400 text-black font-semibold hover:bg-gold-300 transition-colors glow-pulse"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M12 15V3" />
                </svg>
                Baixar Ebook ({PRODUCT.pages} páginas · PDF)
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left">
              <h3 className="text-sm font-medium text-gold-400 mb-3">
                O que acontece agora
              </h3>
              <ul className="space-y-2.5 text-sm text-white/80">
                <li className="flex gap-3">
                  <span className="text-gold-400">✓</span>
                  <span>
                    Enviamos uma cópia do PDF e do recibo para o seu e-mail
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400">✓</span>
                  <span>O link de download fica válido por 30 dias</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400">✓</span>
                  <span>
                    Atualizações futuras do ebook são gratuitas para você
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gold-400">✓</span>
                  <span>
                    Garantia incondicional de {PRODUCT.guaranteeDays} dias
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <a
                href="/"
                className="btn-ghost !text-sm inline-flex"
              >
                Voltar ao início
              </a>
              <p className="text-xs text-white/50">
                Não recebeu o e-mail? Verifique sua caixa de spam ou{" "}
                <a
                  href="mailto:contato@dozeroaomilhao.com"
                  className="text-gold-400 hover:underline"
                >
                  entre em contato
                </a>
                .
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 mb-8">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            <h1 className="font-display text-5xl font-light mb-4">
              Ops! Algo deu{" "}
              <span className="text-red-500 italic">errado</span>
            </h1>

            <p className="text-xl text-white/70 mb-8">
              Não conseguimos confirmar seu pagamento. Tente novamente ou
              entre em contato.
            </p>

            <a
              href="/checkout"
              className="inline-block bg-gold-400 text-black px-8 py-4 rounded-full font-semibold hover:bg-gold-300 transition-colors"
            >
              Voltar ao checkout
            </a>
          </>
        )}
      </div>
    </div>
  );
}

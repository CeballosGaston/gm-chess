"use client";

import { useEffect, useRef } from "react";
import type { RevealApi } from "reveal.js";
import "reveal.js/reveal.css";
import "reveal.js/theme/black.css";
import "reveal.js/plugin/highlight/monokai.css";
import "./presentation.css";

export function RevealPresentation() {
  const deckRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<RevealApi | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const Reveal = (await import("reveal.js")).default;
      const RevealHighlight = (await import("reveal.js/plugin/highlight")).default;

      if (!mounted || !deckRef.current) return;

      const api = new Reveal(deckRef.current, {
        controls: true,
        controlsTutorial: false,
        controlsLayout: "bottom-right",
        controlsBackArrows: "visible",
        progress: true,
        slideNumber: true,
        hash: true,
        keyboard: true,
        overview: true,
        center: true,
        touch: true,
        loop: false,
        rtl: false,
        shuffle: false,
        fragments: true,
        help: true,
        showNotes: false,
        autoSlide: 0,
        autoSlideStoppable: true,
        mouseWheel: false,
        transition: "slide",
        transitionSpeed: "default",
        backgroundTransition: "fade",
        viewDistance: 3,
        display: "block",
        plugins: [RevealHighlight],
      });

      api.initialize();
      apiRef.current = api;
    };

    init();

    return () => {
      mounted = false;
      if (apiRef.current) {
        apiRef.current.destroy();
        apiRef.current = null;
      }
    };
  }, []);

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">

        {/* ============================================
            SLIDE 1: INTRO / HERO
            ============================================ */}
        <section>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
          }}>
            <h4 style={{ marginBottom: "0.5em", letterSpacing: "0.3em", color: "#f59e0b" }}>
              FULL-STACK CHESS PLATFORM
            </h4>
            <h1 style={{ fontSize: "4em", marginBottom: "0.1em", lineHeight: 1.1 }}>
              GM <span style={{ fontWeight: 300, color: "#fbbf24" }}>Grandmasters</span>
            </h1>
            <p style={{ fontSize: "0.65em", color: "#94a3b8", maxWidth: "600px", marginTop: "0.5em" }}>
              Juega y recibe coaching personalizado de Grandes Maestros de ajedrez de élite mundial
            </p>
            <div className="icon-grid fragment fade-up" data-fragment-index="1" style={{ marginTop: "1em" }}>
              <span className="tag-amber">Next.js 16</span>
              <span className="tag-amber">TypeScript</span>
              <span className="tag-amber">Supabase</span>
              <span className="tag-amber">React Query</span>
              <span className="tag-amber">chess.js</span>
              <span className="tag-amber">Tailwind CSS</span>
              <span className="tag-amber">Realtime</span>
              <span className="tag-amber">Stockfish AI</span>
            </div>
            <p className="fragment fade-in" data-fragment-index="2" style={{
              marginTop: "1.5em",
              fontSize: "0.4em",
              color: "#475569",
              fontStyle: "italic",
            }}>
              Presiona ESPACIO o &rarr; para navegar &middot; ESC para vista general
            </p>
          </div>
        </section>

        {/* ============================================
            SLIDE 2: PROBLEMA
            ============================================ */}
        <section>
          <h2>El Problema</h2>
          <div className="feature-grid" style={{ marginTop: "0.8em" }}>
            <div className="slide-card">
              <h4 style={{ marginBottom: "0.3em" }}>Acceso Limitado</h4>
              <p style={{ fontSize: "0.6em" }}>
                Encontrar un Gran Maestro disponible para coaching es extremadamente difícil y costoso.
                Las sesiones presenciales son inaccesibles para la mayoría de estudiantes.
              </p>
            </div>
            <div className="slide-card">
              <h4 style={{ marginBottom: "0.3em" }}>Sin Feedback Real</h4>
              <p style={{ fontSize: "0.6em" }}>
                Las plataformas de ajedrez online no ofrecen coaching personalizado.
                Los estudiantes juegan sin recibir retroalimentación de expertos.
              </p>
            </div>
            <div className="slide-card">
              <h4 style={{ marginBottom: "0.3em" }}>Costos Elevados</h4>
              <p style={{ fontSize: "0.6em" }}>
                Las sesiones privadas con GMs cuestan cientos de dólares por hora.
                No existe un modelo de pago por partida accesible.
              </p>
            </div>
            <div className="slide-card">
              <h4 style={{ marginBottom: "0.3em" }}>Sin Gamificación</h4>
              <p style={{ fontSize: "0.6em" }}>
                Falta un sistema de incentivos que motive tanto a estudiantes como a maestros
                a participar activamente en la plataforma.
              </p>
            </div>
          </div>
          <blockquote className="fragment fade-up" style={{ marginTop: "0.8em" }}>
            &ldquo;El ajedrez deber&iacute;a ser accesible para todos. Queremos democratizar el acceso a la ense&ntilde;anza de &eacute;lite.&rdquo;
          </blockquote>
        </section>

        {/* ============================================
            SLIDE 3: SOLUCIÓN
            ============================================ */}
        <section>
          <h2>Nuestra Solución</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.8em",
            marginTop: "0.8em",
          }}>
            <div className="slide-card" style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              <p style={{ fontSize: "0.65em", marginBottom: "0.3em" }}>
                Un <span className="highlight-amber">marketplace</span> que conecta estudiantes con
                Grandes Maestros verificados para sesiones de juego y coaching en tiempo real.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div className="stat-number" style={{ fontSize: "1.8em" }}>🎯</div>
              <h4 style={{ marginTop: "0.3em" }}>Partidas Reales</h4>
              <p style={{ fontSize: "0.5em" }}>Juega contra GMs en partidas completas con seguimiento</p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div className="stat-number" style={{ fontSize: "1.8em" }}>💬</div>
              <h4 style={{ marginTop: "0.3em" }}>Feedback Directo</h4>
              <p style={{ fontSize: "0.5em" }}>Los GMs dejan comentarios y análisis en cada partida</p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div className="stat-number" style={{ fontSize: "1.8em" }}>🪙</div>
              <h4 style={{ marginTop: "0.3em" }}>Sistema de Fichas</h4>
              <p style={{ fontSize: "0.5em" }}>Modelo freemium con paquetes de fichas para jugar</p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div className="stat-number" style={{ fontSize: "1.8em" }}>🤖</div>
              <h4 style={{ marginTop: "0.3em" }}>Asistencia IA</h4>
              <p style={{ fontSize: "0.5em" }}>Pistas inteligentes con Stockfish durante la partida</p>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 4: TECH STACK
            ============================================ */}
        <section>
          <h2>Tecnologías</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.8em",
            marginTop: "0.5em",
          }}>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2em", marginBottom: "0.2em" }}>⚛️</div>
              <h4>Frontend</h4>
              <div className="icon-grid">
                <span className="tag-amber">Next.js 16</span>
                <span className="tag-amber">React 19</span>
                <span className="tag-amber">TypeScript</span>
                <span className="tag-amber">Tailwind CSS v4</span>
                <span className="tag-amber">shadcn/ui</span>
                <span className="tag-amber">Radix UI</span>
              </div>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2em", marginBottom: "0.2em" }}>🗄️</div>
              <h4>Backend & DB</h4>
              <div className="icon-grid">
                <span className="tag-amber">Supabase</span>
                <span className="tag-amber">PostgreSQL</span>
                <span className="tag-amber">Row Level Security</span>
                <span className="tag-amber">Auth (Google OAuth)</span>
                <span className="tag-amber">Realtime Subscriptions</span>
              </div>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2em", marginBottom: "0.2em" }}>🧠</div>
              <h4>Lógica & AI</h4>
              <div className="icon-grid">
                <span className="tag-amber">chess.js</span>
                <span className="tag-amber">react-chessboard</span>
                <span className="tag-amber">Stockfish API</span>
                <span className="tag-amber">React Query</span>
                <span className="tag-amber">Vitest</span>
              </div>
            </div>
          </div>
          <p className="fragment fade-up" style={{ textAlign: "center", marginTop: "0.6em", fontSize: "0.5em", color: "#64748b" }}>
            Stack moderno full-stack con tipado estricto y testing comprehensivo
          </p>
        </section>

        {/* ============================================
            SLIDE 5: ARQUITECTURA
            ============================================ */}
        <section>
          <h2>Arquitectura</h2>
          <div className="arch-grid" style={{ marginTop: "0.5em" }}>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4>Frontend (Next.js)</h4>
              <ul style={{ fontSize: "0.45em", marginLeft: "0" }}>
                <li>App Router con layouts</li>
                <li>Server & Client Components</li>
                <li>Middleware para auth</li>
                <li>Rutas dinámicas</li>
                <li>Route handlers (API)</li>
              </ul>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4>Estado & Datos</h4>
              <ul style={{ fontSize: "0.45em", marginLeft: "0" }}>
                <li>React Query (cache)</li>
                <li>Estado local por feature</li>
                <li>Invalidación automática</li>
                <li>Optimistic updates</li>
                <li>Stale-while-revalidate</li>
              </ul>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4>Supabase</h4>
              <ul style={{ fontSize: "0.45em", marginLeft: "0" }}>
                <li>Auth (Google OAuth)</li>
                <li>PostgreSQL (profiles, games, messages)</li>
                <li>Realtime (websockets)</li>
                <li>Row Level Security</li>
                <li>Server-less</li>
              </ul>
            </div>
          </div>
          <div className="slide-card" style={{
            marginTop: "0.5em",
            textAlign: "center",
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
          }}>
            <p style={{ fontSize: "0.5em", color: "#94a3b8" }}>
              <span className="highlight-amber">Client</span> (React) &rarr;
              <span className="highlight-amber"> React Query</span> &rarr;
              <span className="highlight-amber"> Supabase</span> (Auth + DB + Realtime) &rarr;
              <span className="highlight-amber"> Stockfish API</span>
            </p>
          </div>
        </section>

        {/* ============================================
            SLIDE 6: AUTENTICACIÓN
            ============================================ */}
        <section>
          <h2>Autenticación</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.8em",
            marginTop: "0.5em",
          }}>
            <div className="slide-card">
              <h4>Google OAuth + Supabase Auth</h4>
              <ul style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">Login con Google mediante Supabase Auth</li>
                <li className="fragment fade-in">Callback route: <code style={{ fontSize: "0.9em" }}>/auth/callback</code></li>
                <li className="fragment fade-in">Sesión manejada por <code>@supabase/ssr</code></li>
                <li className="fragment fade-in">Auth Listener para cambios en tiempo real</li>
              </ul>
            </div>
            <div className="slide-card">
              <h4>Control de Acceso</h4>
              <ul style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">Middleware de Next.js protege todas las rutas</li>
                <li className="fragment fade-in">Redirección automática: no-auth &rarr; /login</li>
                <li className="fragment fade-in">Dos roles: <span className="highlight-amber">student</span> y <span className="highlight-purple">gm</span></li>
                <li className="fragment fade-in">Redirección por rol: / para students, /gm para GMs</li>
              </ul>
            </div>
          </div>
          <div className="slide-card fragment fade-up" style={{ marginTop: "0.5em" }}>
            <h4 style={{ marginBottom: "0.2em" }}>Hook principal:</h4>
            <pre style={{ fontSize: "0.45em", margin: 0 }}>
              <code className="language-typescript" data-noescape>
                {`function useUser() {
  return useQuery<Profile | null>({
    queryKey: ["currentUser"],
    queryFn: () => profileService.getCurrentUser(),
  });
}`}
              </code>
            </pre>
          </div>
        </section>

        {/* ============================================
            SLIDE 7: REALTIME
            ============================================ */}
        <section>
          <h2>Tiempo Real</h2>
          <div className="feature-grid" style={{ marginTop: "0.3em" }}>
            <div className="slide-card">
              <h4>Partidas en Vivo</h4>
              <p style={{ fontSize: "0.55em" }}>
                Supabase Realtime sincroniza el estado del tablero entre jugadores
                mediante <span className="highlight-amber">postgres_changes</span>.
                Cuando un jugador mueve, el FEN se actualiza instantáneamente.
              </p>
              <pre style={{ fontSize: "0.35em", margin: "0.3em 0 0" }}>
                <code className="language-typescript" data-noescape>
                  {`supabase
  .channel(\`game-\${gameId}\`)
  .on("postgres_changes",
    { event: "UPDATE", schema: "public",
      table: "games", filter: \`id=eq.\${gameId}\` },
    (payload) => {
      setFen(payload.new.fen);
      setTurn(payload.new.turn);
    }
  )
  .subscribe();`}
                </code>
              </pre>
            </div>
            <div className="slide-card">
              <h4>Mensajería Instantánea</h4>
              <p style={{ fontSize: "0.55em" }}>
                Los mensajes de feedback del GM llegan en tiempo real al estudiante
                mediante una suscripción separada a la tabla <span className="highlight-amber">messages</span>.
              </p>
              <pre style={{ fontSize: "0.35em", margin: "0.3em 0 0" }}>
                <code className="language-typescript" data-noescape>
                  {`supabase
  .channel(\`messages-\${gameId}\`)
  .on("postgres_changes",
    { event: "INSERT",
      schema: "public", table: "messages",
      filter: \`game_id=eq.\${gameId}\` },
    (payload) => {
      queryClient.setQueryData(
        ["messages", gameId],
        (old) => [...old, payload.new]
      );
    }
  )
  .subscribe();`}
                </code>
              </pre>
            </div>
          </div>
          <div className="slide-card fragment fade-up" style={{
            textAlign: "center",
            marginTop: "0.3em",
            background: "rgba(34, 197, 94, 0.06)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}>
            <p style={{ fontSize: "0.5em", margin: 0 }}>
              <span className="highlight-green">● Sincronización bidireccional</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="highlight-green">Actualización optimista del cache</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="highlight-green">Canales independientes</span>
            </p>
          </div>
        </section>

        {/* ============================================
            SLIDE 8: IA / STOCKFISH
            ============================================ */}
        <section>
          <h2>IA & Stockfish</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "60% 40%",
            gap: "0.8em",
            marginTop: "0.3em",
          }}>
            <div className="slide-card">
              <h4>Motor de Ajedrez</h4>
              <p style={{ fontSize: "0.55em" }}>
                Integración con la API de <span className="highlight-amber">chess-api.com</span> que ejecuta
                <span className="highlight-amber"> Stockfish</span> (profundidad 12) para calcular
                la mejor jugada en cualquier posición.
              </p>
              <pre style={{ fontSize: "0.45em", margin: "0.3em 0 0" }}>
                <code className="language-typescript" data-noescape>
                  {`async function getBestMove(fen: string) {
  const res = await fetch("https://chess-api.com/v1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen, depth: 12 }),
  });
  const data = await res.json();
  return {
    from: data.move.slice(0, 2),
    to: data.move.slice(2, 4),
    san: data.san,
    eval: data.eval,
  };
}`}
                </code>
              </pre>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4>UX de Pistas</h4>
              <ul style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">Bot&oacute;n &ldquo;Pista&rdquo; en la UI</li>
                <li className="fragment fade-in">Overlay SVG sobre el tablero</li>
                <li className="fragment fade-in">Círculos en origen y destino</li>
                <li className="fragment fade-in">Línea punteada del movimiento</li>
                <li className="fragment fade-in">Abort controller para cancelar</li>
                <li className="fragment fade-in">Estados: loading, error, resultado</li>
              </ul>
              <div className="stat-number fragment star-in" data-fragment-index="6" style={{
                fontSize: "1.5em",
                marginTop: "0.5em",
                padding: "0.3em 1em",
                background: "rgba(245, 158, 11, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}>
                ♟️ Deep 12
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 9: TESTING
            ============================================ */}
        <section>
          <h2>Testing</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.8em",
            marginTop: "0.3em",
          }}>
            <div className="slide-card">
              <h4>Stack de Testing</h4>
              <div className="icon-grid">
                <span className="tag-amber">Vitest</span>
                <span className="tag-amber">React Testing Library</span>
                <span className="tag-amber">jsdom</span>
                <span className="tag-amber">Vitest UI</span>
                <span className="tag-amber">Coverage v8</span>
              </div>
              <p style={{ fontSize: "0.5em", marginTop: "0.5em" }}>
                Tests unitarios y de integración para hooks, servicios y helpers.
                Mocking de Supabase y React Query.
              </p>
            </div>
            <div className="slide-card">
              <h4>Tests Implementados</h4>
              <ul style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">useChessGame - lógica de ajedrez</li>
                <li className="fragment fade-in">useGameMessages - mensajería</li>
                <li className="fragment fade-in">useUser / useLogout / useAuthListener</li>
                <li className="fragment fade-in">useGms - marketplace</li>
                <li className="fragment fade-in">authService - login/signout</li>
                <li className="fragment fade-in">profileService - queries</li>
                <li className="fragment fade-in">toggleAvailability - helper</li>
                <li className="fragment fade-in">auth callback route handler</li>
              </ul>
            </div>
          </div>
          <div className="slide-card fragment fade-up" style={{
            marginTop: "0.4em",
            textAlign: "center",
            background: "rgba(34, 197, 94, 0.06)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}>
            <p style={{ fontSize: "0.5em", margin: 0 }}>
              <span className="highlight-green">10 archivos de test</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="highlight-green">Cobertura de hooks críticos</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="highlight-green">npm run test</span>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <span className="highlight-green">npm run test:ui</span>
            </p>
          </div>
        </section>

        {/* ============================================
            SLIDE 10: FEATURES PRINCIPALES
            ============================================ */}
        <section>
          <h2>Features</h2>
          <div className="feature-grid" style={{ marginTop: "0.3em" }}>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>🏪</div>
              <h4 style={{ marginTop: "0.2em" }}>Marketplace de GMs</h4>
              <p style={{ fontSize: "0.5em" }}>
                Lista de Grandes Maestros con ELO, rating, idiomas,
                disponibilidad en tiempo real y badges por título.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>🪙</div>
              <h4 style={{ marginTop: "0.2em" }}>Wallet & Fichas</h4>
              <p style={{ fontSize: "0.5em" }}>
                Sistema de monedas virtuales con paquetes (Básico, Pro, Master).
                Costo por partida: <span className="highlight-amber">25 fichas</span>.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>♟️</div>
              <h4 style={{ marginTop: "0.2em" }}>Juego en Tiempo Real</h4>
              <p style={{ fontSize: "0.5em" }}>
                Tablero interactivo con react-chessboard, movimientos válidos,
                detección de jaque, jaque mate y estados de partida.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>👤</div>
              <h4 style={{ marginTop: "0.2em" }}>Perfiles</h4>
              <p style={{ fontSize: "0.5em" }}>
                Perfiles editables con biografía, idiomas, disponibilidad.
                Roles: <span className="highlight-amber">student</span> y <span className="highlight-purple">GM</span>.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>💬</div>
              <h4 style={{ marginTop: "0.2em" }}>Mensajería</h4>
              <p style={{ fontSize: "0.5em" }}>
                Sistema de feedback del GM al estudiante durante y después
                de la partida. Mensajes persistentes.
              </p>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.5em" }}>🎮</div>
              <h4 style={{ marginTop: "0.2em" }}>Panel GM</h4>
              <p style={{ fontSize: "0.5em" }}>
                Lobby de partidas, control de disponibilidad,
                ganancias acumuladas y gestión de sesiones.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 11: DEMO / COMPONENTES REALES
            ============================================ */}
        <section>
          <h2>En Acción</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.8em",
            marginTop: "0.3em",
          }}>
            <div className="slide-card">
              <h4>Flujo del Estudiante</h4>
              <ol style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">Login con Google</li>
                <li className="fragment fade-in">Explora el marketplace de GMs</li>
                <li className="fragment fade-in">Compra fichas (Wallet)</li>
                <li className="fragment fade-in">Selecciona un GM disponible</li>
                <li className="fragment fade-in">Juega la partida en tiempo real</li>
                <li className="fragment fade-in">Usa pistas de Stockfish si necesita ayuda</li>
                <li className="fragment fade-in">Recibe feedback del GM</li>
              </ol>
            </div>
            <div className="slide-card">
              <h4>Flujo del GM</h4>
              <ol style={{ fontSize: "0.5em" }}>
                <li className="fragment fade-in">Login y acceso al panel GM</li>
                <li className="fragment fade-in">Activa su disponibilidad</li>
                <li className="fragment fade-in">Ve partidas solicitadas en el lobby</li>
                <li className="fragment fade-in">Se une a la partida</li>
                <li className="fragment fade-in">Juega y da feedback al estudiante</li>
                <li className="fragment fade-in">Acumula ganancias por partida</li>
              </ol>
            </div>
          </div>
          <div className="slide-card fragment fade-up" style={{
            marginTop: "0.4em",
            textAlign: "center",
            background: "rgba(245, 158, 11, 0.06)",
            border: "1px solid rgba(245, 158, 11, 0.15)",
          }}>
            <p style={{ fontSize: "0.5em", margin: 0 }}>
              🎯 <span className="highlight-amber">Student</span>
              &rarr; Juega &rarr; Pide pista &rarr; Recibe feedback
              &nbsp;&nbsp;|&nbsp;&nbsp;
              🎯 <span className="highlight-purple">GM</span>
              &rarr; Disponible &rarr; Juega &rarr; Coach &rarr; Gana fichas
            </p>
          </div>
        </section>

        {/* ============================================
            SLIDE 12: HOOKS DESTACADOS
            ============================================ */}
        <section>
          <h2>Hooks Destacados</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.6em",
            marginTop: "0.3em",
          }}>
            <div className="slide-card">
              <h4>useChessGame</h4>
              <p style={{ fontSize: "0.45em" }}>
                Orquesta toda la lógica de ajedrez: movimientos, validación,
                sincronización con Supabase, turnos, detección de fin de partida.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">chess.js</span>
                <span className="tag-slate">Supabase</span>
                <span className="tag-slate">Realtime</span>
              </div>
            </div>
            <div className="slide-card">
              <h4>useStockfish</h4>
              <p style={{ fontSize: "0.45em" }}>
                Hook de AI que consulta la API de Stockfish para obtener
                la mejor jugada. Maneja loading, error y cancelación.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">AbortController</span>
                <span className="tag-slate">fetch</span>
              </div>
            </div>
            <div className="slide-card">
              <h4>useChessRealtime</h4>
              <p style={{ fontSize: "0.45em" }}>
                Suscripción a cambios en la tabla games mediante Supabase Realtime.
                Actualiza FEN y turno instantáneamente.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">postgres_changes</span>
                <span className="tag-slate">WebSocket</span>
              </div>
            </div>
            <div className="slide-card">
              <h4>useGms</h4>
              <p style={{ fontSize: "0.45em" }}>
                Lista de GMs con React Query + invalidación automática
                cuando cambia la disponibilidad en Supabase.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">React Query</span>
                <span className="tag-slate">Realtime</span>
              </div>
            </div>
            <div className="slide-card">
              <h4>useWallet</h4>
              <p style={{ fontSize: "0.45em" }}>
                Manejo de monedas virtuales: comprar y gastar fichas
                con invalidación automática del perfil.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">Optimistic</span>
                <span className="tag-slate">Cache</span>
              </div>
            </div>
            <div className="slide-card">
              <h4>useGameMessages</h4>
              <p style={{ fontSize: "0.45em" }}>
                Chat en tiempo real con mensajes del GM.
                React Query + Realtime para actualización instantánea.
              </p>
              <div className="icon-grid">
                <span className="tag-slate">INSERT</span>
                <span className="tag-slate">Query Client</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 13: ESTRUCTURA DEL PROYECTO
            ============================================ */}
        <section>
          <h2>Estructura</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.8em",
            marginTop: "0.3em",
          }}>
            <div className="slide-card">
              <pre style={{ fontSize: "0.4em", margin: 0 }}>
                <code className="language-plaintext" data-noescape>
{`gm-chess/
├── app/                # Next.js App Router
│   ├── (auth)/login/   # Login page
│   ├── auth/callback/  # OAuth callback
│   ├── game/[id]/      # Chess game view
│   ├── gm/             # GM panel & lobby
│   ├── profile/        # User profile
│   ├── wallet/         # Coin store
│   ├── presentation/   # 🆕 This slideshow
│   ├── layout.tsx
│   └── page.tsx        # Marketplace
├── components/         # UI components
│   ├── ui/             # shadcn/ui
│   └── presentation/   # 🆕 Slides
├── features/           # Feature modules
│   ├── auth/           # Auth hooks/services
│   ├── game/           # Chess logic, realtime
│   ├── marketplace/    # GM listing
│   ├── messages/       # Game chat
│   ├── profile/        # Profile management
│   └── wallet/         # Coins system
├── lib/                # Supabase client
└── types/              # Shared types`}
                </code>
              </pre>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4>Arquitectura por Features</h4>
              <p style={{ fontSize: "0.5em" }}>
                Cada feature contiene:
              </p>
              <ul style={{ fontSize: "0.5em" }}>
                <li><span className="highlight-amber">hooks/</span> - Lógica con React Query</li>
                <li><span className="highlight-amber">components/</span> - UI específica</li>
                <li><span className="highlight-amber">services/</span> - Supabase queries</li>
                <li><span className="highlight-amber">config/</span> - Constantes</li>
              </ul>
              <div className="fragment fade-in" style={{ marginTop: "0.5em" }}>
                <span className="tag-amber">Modular</span>
                <span className="tag-amber">Desacoplado</span>
                <span className="tag-amber">Testeable</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 14: ROADMAP
            ============================================ */}
        <section>
          <h2>Roadmap</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.6em",
            marginTop: "0.5em",
          }}>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4 style={{ color: "#94a3b8" }}>Fase 1 ✅</h4>
              <p style={{ fontSize: "0.45em", fontStyle: "italic", color: "#64748b" }}>Actual</p>
              <ul style={{ fontSize: "0.45em" }}>
                <li>MVP funcional</li>
                <li>Auth Google OAuth</li>
                <li>Marketplace de GMs</li>
                <li>Juego en tiempo real</li>
                <li>Pistas Stockfish</li>
                <li>Sistema de fichas</li>
                <li>Feedback del GM</li>
              </ul>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4 style={{ color: "#fbbf24" }}>Fase 2</h4>
              <p style={{ fontSize: "0.45em", fontStyle: "italic", color: "#64748b" }}>Próximo</p>
              <ul style={{ fontSize: "0.45em" }}>
                <li className="fragment fade-in">Torneos multijugador</li>
                <li className="fragment fade-in">Repetición de partidas (VOD)</li>
                <li className="fragment fade-in">Análisis post-partida</li>
                <li className="fragment fade-in">Notificaciones push</li>
                <li className="fragment fade-in">Suscripciones mensuales</li>
                <li className="fragment fade-in">Leaderboards</li>
              </ul>
            </div>
            <div className="slide-card" style={{ textAlign: "center" }}>
              <h4 style={{ color: "#22c55e" }}>Fase 3</h4>
              <p style={{ fontSize: "0.45em", fontStyle: "italic", color: "#64748b" }}>Futuro</p>
              <ul style={{ fontSize: "0.45em" }}>
                <li className="fragment fade-in">App móvil nativa</li>
                <li className="fragment fade-in">Streaming en vivo</li>
                <li className="fragment fade-in">IA generativa para análisis</li>
                <li className="fragment fade-in">Escuela de ajedrez online</li>
                <li className="fragment fade-in">NFTs de logros</li>
                <li className="fragment fade-in">API pública</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================
            SLIDE 15: CONCLUSIÓN
            ============================================ */}
        <section>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            textAlign: "center",
          }}>
            <h4 style={{ letterSpacing: "0.3em", color: "#f59e0b", marginBottom: "0.3em" }}>
              GRACIAS
            </h4>
            <h1 style={{ fontSize: "3em", marginBottom: "0.2em", lineHeight: 1.1 }}>
              GM <span style={{ fontWeight: 300, color: "#fbbf24" }}>Grandmasters</span>
            </h1>
            <p style={{ fontSize: "0.6em", color: "#94a3b8", maxWidth: "500px" }}>
              Democratizando el acceso a la enseñanza de ajedrez de élite
            </p>
            <div style={{
              display: "flex",
              gap: "0.6em",
              marginTop: "0.8em",
            }}>
              <div className="slide-card" style={{ padding: "0.5em 1em", minWidth: "120px" }}>
                <div className="stat-number" style={{ fontSize: "1.5em" }}>⚛️</div>
                <p style={{ fontSize: "0.4em", marginTop: "0.2em" }}>Next.js 16</p>
              </div>
              <div className="slide-card" style={{ padding: "0.5em 1em", minWidth: "120px" }}>
                <div className="stat-number" style={{ fontSize: "1.5em" }}>🗄️</div>
                <p style={{ fontSize: "0.4em", marginTop: "0.2em" }}>Supabase</p>
              </div>
              <div className="slide-card" style={{ padding: "0.5em 1em", minWidth: "120px" }}>
                <div className="stat-number" style={{ fontSize: "1.5em" }}>🧠</div>
                <p style={{ fontSize: "0.4em", marginTop: "0.2em" }}>Stockfish AI</p>
              </div>
            </div>
            <p className="fragment fade-in" style={{
              marginTop: "1em",
              fontSize: "0.45em",
              color: "#475569",
            }}>
              Full-stack &middot; TypeScript &middot; Tiempo real &middot; IA &middot; Portfolio 2026
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

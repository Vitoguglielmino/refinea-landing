/**
 * PlatformActionMinis — redesigned
 * ────────────────────────────────────────────────────────────────────────
 * Three small static mockups for the 3 Action cards on the landing.
 * Each is purpose-built (NOT a shrunk replica of the platform UI):
 *
 *   1. ContentMini — an article being generated, with persona-linked outline.
 *      Shows the value: AI content tailored to a Buyer Persona.
 *
 *   2. WorkflowsMini — the workflow execution UI (vertical DAG with
 *      pending/running/done nodes). Source: WorkflowNodeBox.tsx state styling.
 *
 *   3. BrandMemoryMini — a miniature of AssetsBuildGraph (7 clusters around
 *      a brand-kit hub, k-NN edges, palette from the real component).
 */

const brand = {
  color: "#6c47ff",
  text: "rgba(0,0,0,0.75)",
  muted: "rgba(0,0,0,0.5)",
  border: "rgba(0,0,0,0.06)",
  bg: "#ffffff",
  subtle: "#f5f6f7",
  accentSoft: "rgba(108,71,255,0.08)",
} as const;

const MONO =
  "var(--font-jetbrains-mono), 'JetBrains Mono', 'SF Mono', 'Roboto Mono', 'Fira Code', monospace";

const miniBase: React.CSSProperties = {
  background: brand.bg,
  border: `1px solid ${brand.border}`,
  borderRadius: 10,
  padding: 14,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

/* ════════════════════════════════════════════════════════════════════
   1. CONTENT MINI — generated article preview tied to a persona

   Animation: the three unchecked outline rows complete in sequence, then
   the whole sequence resets. CSS-only, runs on the GPU, no JS, no
   re-renders. Respects `prefers-reduced-motion: reduce` — when set, all
   rows freeze in their initial state (4 done, 3 pending) just like before.
   ════════════════════════════════════════════════════════════════════ */
export function ContentMini() {
  return (
    <div style={miniBase} className="content-mini">
      {/* Tab bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 8, borderBottom: `1px solid ${brand.border}` }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 4,
            background: brand.accentSoft,
            color: brand.color,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: brand.color }} />
          DRAFT
        </div>
        <span style={{ fontFamily: MONO, fontSize: 9, color: brand.muted }}>
          Article · 1,240 words
        </span>
      </div>

      {/* Title + persona target */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: brand.text, lineHeight: 1.35, letterSpacing: "-0.01em" }}>
          Why Italian leather still defines luxury craftsmanship
        </span>
        <span style={{ fontSize: 9, color: brand.muted, lineHeight: 1.4 }}>
          Targeted for · <span style={{ color: brand.color, fontWeight: 600 }}>Creative Professional</span> persona
        </span>
      </div>

      {/* Outline progress — first 4 always done, last 3 animate completing
          one by one across an 18s loop (5s done + reset gap). */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { txt: "H1 · Origins of Florentine leatherwork",        animate: false },
          { txt: "H2 · Why hand-stitching still matters",          animate: false },
          { txt: "H2 · Comparing modern luxury houses",            animate: false },
          { txt: "H2 · Sustainability in heritage materials",      animate: false },
          { txt: "H2 · The next generation of artisans",           animate: true, delay: 1 },
          { txt: "H2 · How AI is reshaping luxury discovery",      animate: true, delay: 5 },
          { txt: "H3 · Closing: craftsmanship as a brand promise", animate: true, delay: 9 },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 9 }}>
            {/* Two checkbox spans stacked: one for pending look, one for
                done look. Each animated row crossfades between them. For
                static rows (first 4) we render only the done variant. */}
            <span style={{ position: "relative", width: 12, height: 12, flexShrink: 0 }}>
              {s.animate && (
                <span
                  className="cm-check cm-check--pending"
                  style={{
                    ...checkBase,
                    background: "rgba(0,0,0,0.04)",
                    border: `1px dashed ${brand.border}`,
                    animationDelay: `${s.delay}s`,
                  }}
                />
              )}
              <span
                className={s.animate ? "cm-check cm-check--done-anim" : "cm-check cm-check--done"}
                style={{
                  ...checkBase,
                  background: "rgba(16,185,129,0.15)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  color: "#059669",
                  ...(s.animate ? { animationDelay: `${s.delay}s` } : {}),
                }}
              >
                ✓
              </span>
            </span>
            <span
              className={s.animate ? "cm-label cm-label--anim" : "cm-label cm-label--done"}
              style={{
                fontFamily: MONO,
                fontSize: 9,
                lineHeight: 1.4,
                color: s.animate ? brand.muted : brand.text,
                ...(s.animate ? { animationDelay: `${s.delay}s` } : {}),
              }}
            >
              {s.txt}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        /* Crossfade pattern: each animated row stacks two checkbox spans
           in the same 12×12 slot — one "pending" (dashed grey, no tick),
           one "done" (green with ✓). Keyframes flip their opacities at the
           same moment, giving the impression the row "checks itself" mid-
           cycle. 18s total loop with 3 staggered rows at delays 1/5/9.   */
        .cm-check--pending {
          opacity: 1;
          animation: cm-pending-fade 18s ease-in-out infinite;
        }
        .cm-check--done-anim {
          opacity: 0;
          animation: cm-done-fade 18s ease-in-out infinite;
        }
        .cm-label--anim {
          animation: cm-label-flip 18s ease-in-out infinite;
        }

        @keyframes cm-pending-fade {
          0%, 5% { opacity: 1; }
          8%, 92% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes cm-done-fade {
          0%, 5% { opacity: 0; transform: scale(0.85); }
          8%, 92% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.85); }
        }
        @keyframes cm-label-flip {
          0%, 5% { color: ${brand.muted}; }
          8%, 92% { color: ${brand.text}; }
          100% { color: ${brand.muted}; }
        }

        /* Honor OS-level "reduce motion" — freeze rows in their start
           state (pending checkbox visible, done overlay hidden). */
        @media (prefers-reduced-motion: reduce) {
          .cm-check--pending,
          .cm-check--done-anim,
          .cm-label--anim { animation: none; }
          .cm-check--pending { opacity: 1; }
          .cm-check--done-anim { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const checkBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: 12,
  height: 12,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 8,
};

/* ════════════════════════════════════════════════════════════════════
   2. WORKFLOWS MINI — workflow execution UI (DAG with node states)
   ════════════════════════════════════════════════════════════════════ */

type NodeStatus = "done" | "running" | "pending";

const NODE_STYLE: Record<NodeStatus, { border: string; bg: string; badge: string; badgeBg: string; badgeColor: string }> = {
  done: {
    border: "1.5px solid rgba(22,163,74,0.4)",
    bg: "linear-gradient(135deg, #fff 0%, rgba(22,163,74,0.03) 100%)",
    badge: "Done",
    badgeBg: "rgba(22,163,74,0.08)",
    badgeColor: "#16a34a",
  },
  running: {
    border: "1.5px solid rgba(108,71,255,0.5)",
    bg: "linear-gradient(135deg, #fff 0%, rgba(108,71,255,0.04) 100%)",
    badge: "Running",
    badgeBg: "rgba(108,71,255,0.08)",
    badgeColor: "#6c47ff",
  },
  pending: {
    border: "1px dashed rgba(0,0,0,0.12)",
    bg: "#fff",
    badge: "Pending",
    badgeBg: "rgba(0,0,0,0.04)",
    badgeColor: "rgba(0,0,0,0.4)",
  },
};

/**
 * WorkflowsMini animation
 * ────────────────────────────────────────────────────────────────────
 * The pipeline marches forward: nodes 3, 4, 5 (currently running / pending)
 * each cycle Running → Done over the loop, with the next node taking over
 * as Running. Nodes 1 and 2 stay Done throughout — they're "ancient
 * history" and don't need to animate.
 *
 * Total loop: 16s. Per node, animation-delay shifts the cycle so the
 * three animated nodes run in sequence rather than in parallel.
 *
 * For each animated node we render BOTH the "running" markup (spinner +
 * Running badge) and the "done" markup (duration + Done badge) layered
 * on top of each other; the CSS keyframes cross-fade between them.
 * Borders/backgrounds and the edge connector below also crossfade.
 *
 * CSS-only — server-rendered, no React state, no JS. Honors
 * `prefers-reduced-motion: reduce` by freezing in the start state.
 */
type AnimatedNode = {
  label: string;
  engine: string;
  /** Final duration shown when the node has flipped to Done. */
  endDuration: string;
  /** Cycle start offset (seconds) — when this node becomes Running. */
  delay: number;
};

export function WorkflowsMini() {
  // Wave marches from top to bottom, then ALL 5 nodes reset together so
  // the next cycle starts cleanly from node 1.
  //
  // Cycle is 28s split into 4 phases:
  //   0–20s  : 5×4s running windows (each node lights up then becomes Done)
  //   20–22s : all 5 nodes hold "Done" together (victory beat)
  //   22–24s : all 5 reset to Pending together
  //   24–28s : all Pending, brief silence before the next wave restarts
  //
  // Each node uses a SHARED animation-duration (28s) with NO animation-
  // delay — instead, each node has its own keyframe block (wf-node-1
  // through wf-node-5) where the running window is shifted in percentage
  // space. This is what guarantees the synchronized reset: every node's
  // 100% keyframe lands at the same wall-clock moment.
  const ANIMATED: AnimatedNode[] = [
    { label: "Crawl site map",         engine: "playwright",  endDuration: "1.2s", delay: 0 },
    { label: "Extract schema markup",  engine: "html-parser", endDuration: "0.4s", delay: 0 },
    { label: "Score content quality",  engine: "gpt-5-mini",  endDuration: "2.1s", delay: 0 },
    { label: "Detect entity coverage", engine: "embeddings",  endDuration: "0.9s", delay: 0 },
    { label: "Generate audit report",  engine: "report-gen",  endDuration: "0.7s", delay: 0 },
  ];

  // All three NODE_STYLE entries (done/running/pending) feed the badge
  // crossfade below — each rendered as its own absolutely-positioned span
  // and faded in/out by keyframes.
  const done = NODE_STYLE.done;
  const running = NODE_STYLE.running;
  const pending = NODE_STYLE.pending;

  return (
    <div style={miniBase} className="wf-mini">
      {/* Top header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 9,
              fontWeight: 700,
              color: brand.color,
              padding: "2px 6px",
              borderRadius: 3,
              background: brand.accentSoft,
              letterSpacing: "0.06em",
            }}
          >
            CONTENT QUALITY
          </span>
          <span style={{ fontSize: 9, color: brand.muted, fontFamily: MONO }}>· 7 nodes</span>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 9, color: "#6c47ff", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span className="wf-live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#6c47ff" }} />
          live
        </span>
      </div>

      {/* DAG vertical */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
        {/* All 5 nodes animate. Each gets a per-position class
            (wf-node-1 … wf-node-5) — keyframes shift the running window
            in percentage space so all 5 nodes share the same 28s cycle
            and reset together. `data-initial` is the prefers-reduced-
            motion fallback (only node 1 starts Running, rest Pending). */}
        {ANIMATED.map((n, i) => {
          const isLast = i === ANIMATED.length - 1;
          const pos = i + 1; // 1-indexed for class names
          const initial = i === 0 ? "running" : "pending";
          return (
            <div
              key={`anim-${i}`}
              data-initial={initial}
              className={`wf-anim-node wf-node-${pos}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
            >
              {/* The card itself — border/bg crossfade between pending/running/done */}
              <div
                className="wf-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 6,
                  position: "relative",
                }}
              >
                {/* Badge: stack 3 spans, crossfade them */}
                <span className="wf-badge-wrap" style={{ position: "relative", flexShrink: 0, minWidth: 38 }}>
                  <span
                    className="wf-badge wf-badge--pending"
                    style={{ ...badgeBase, background: pending.badgeBg, color: pending.badgeColor }}
                  >
                    Pending
                  </span>
                  <span
                    className="wf-badge wf-badge--running"
                    style={{ ...badgeBase, background: running.badgeBg, color: running.badgeColor }}
                  >
                    Running
                  </span>
                  <span
                    className="wf-badge wf-badge--done"
                    style={{ ...badgeBase, background: done.badgeBg, color: done.badgeColor }}
                  >
                    Done
                  </span>
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: brand.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {n.label}
                  </span>
                  <span style={{ fontSize: 8, color: brand.muted, fontFamily: MONO }}>
                    {n.engine}
                  </span>
                </div>

                {/* Right-edge cluster: spinner (visible only during Running)
                    + duration (visible only after Done). Same slot, faded. */}
                <span
                  className="wf-spinner"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "2px solid rgba(108,71,255,0.2)",
                    borderTopColor: brand.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  className="wf-duration"
                  style={{
                    fontSize: 9,
                    fontFamily: MONO,
                    color: brand.muted,
                    fontWeight: 500,
                    position: "absolute",
                    right: 10,
                  }}
                >
                  {n.endDuration}
                </span>
              </div>

              {/* Edge connector — fades from grey (pending) to green (done) */}
              {!isLast && (
                <div
                  className="wf-edge"
                  style={{
                    width: 1,
                    height: 8,
                    alignSelf: "center",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <style>{wfStyles}</style>
    </div>
  );
}

/**
 * WorkflowsMini animation timeline
 * ─────────────────────────────────
 * Total cycle: 28s (= 100% in keyframe space).
 * 5 nodes × 4s "Running" window = 20s of wave (0%–71.4%).
 * 71.4%–78.5%: all 5 hold Done together (2s "victory beat").
 * 78.5%–85.7%: all 5 reset to Pending together (2s).
 * 85.7%–100% : everyone sits Pending (4s pause before next wave).
 *
 * Each node has its own keyframe set with the running window shifted in
 * percentage space. animation-duration is 28s for ALL nodes — no
 * animation-delay anywhere — which is what guarantees they reset in sync.
 */
const WF_NODE_WINDOWS = [
  { start: 0,  end: 14 },   // node 1: 0–4s
  { start: 14, end: 29 },   // node 2: 4–8s
  { start: 29, end: 43 },   // node 3: 8–12s
  { start: 43, end: 57 },   // node 4: 12–16s
  { start: 57, end: 71 },   // node 5: 16–20s
] as const;

const WF_HOLD_END = 79;     // all-Done held until 79% (= 22s)
const WF_RESET_END = 86;    // back to Pending by 86% (= 24s)

const PENDING_CARD = `
  border: 1px dashed rgba(0,0,0,0.12);
  background: #fff;
`;
const RUNNING_CARD = `
  border: 1.5px solid rgba(108,71,255,0.5);
  background: linear-gradient(135deg, #fff 0%, rgba(108,71,255,0.04) 100%);
`;
const DONE_CARD = `
  border: 1.5px solid rgba(22,163,74,0.4);
  background: linear-gradient(135deg, #fff 0%, rgba(22,163,74,0.03) 100%);
`;

// Build the per-node keyframes. For node N with running window [s,e]:
//   0%       Pending
//   s        Pending  (sharp transition)
//   s+0.5%   Running
//   e        Running
//   e+0.5%   Done
//   79%      Done (still — synchronized hold)
//   86%      Pending (synchronized reset)
//   100%     Pending
function wfCardKeyframes(idx: number, w: { start: number; end: number }): string {
  return `
    @keyframes wf-card-${idx} {
      0%, ${w.start}% { ${PENDING_CARD} }
      ${w.start + 1}%, ${w.end}% { ${RUNNING_CARD} }
      ${w.end + 1}%, ${WF_HOLD_END}% { ${DONE_CARD} }
      ${WF_RESET_END}%, 100% { ${PENDING_CARD} }
    }`;
}
function wfBadgeKeyframes(idx: number, w: { start: number; end: number }): string {
  return `
    @keyframes wf-pending-${idx} {
      0%, ${w.start}% { opacity: 1; }
      ${w.start + 1}%, ${WF_RESET_END - 1}% { opacity: 0; }
      ${WF_RESET_END}%, 100% { opacity: 1; }
    }
    @keyframes wf-running-${idx} {
      0%, ${w.start}% { opacity: 0; }
      ${w.start + 1}%, ${w.end}% { opacity: 1; }
      ${w.end + 1}%, 100% { opacity: 0; }
    }
    @keyframes wf-done-${idx} {
      0%, ${w.end}% { opacity: 0; }
      ${w.end + 1}%, ${WF_HOLD_END}% { opacity: 1; }
      ${WF_RESET_END}%, 100% { opacity: 0; }
    }
    @keyframes wf-spinner-${idx} {
      0%, ${w.start}% { opacity: 0; }
      ${w.start + 1}%, ${w.end}% { opacity: 1; }
      ${w.end + 1}%, 100% { opacity: 0; }
    }
    @keyframes wf-duration-${idx} {
      0%, ${w.end}% { opacity: 0; }
      ${w.end + 1}%, ${WF_HOLD_END}% { opacity: 1; }
      ${WF_RESET_END}%, 100% { opacity: 0; }
    }
    @keyframes wf-edge-${idx} {
      0%, ${w.end}% { background: rgba(0,0,0,0.1); }
      ${w.end + 1}%, ${WF_HOLD_END}% { background: rgba(22,163,74,0.4); }
      ${WF_RESET_END}%, 100% { background: rgba(0,0,0,0.1); }
    }`;
}

const wfStyles = `
  /* Spinner keeps spinning whenever it's visible. */
  @keyframes mini-spin { to { transform: rotate(360deg); } }
  /* Subtle pulse on the "live" header dot to reinforce in-flight state. */
  @keyframes wf-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.6; }
  }
  .wf-live-dot { animation: wf-pulse 1.6s ease-in-out infinite; }

  /* Shared base: card starts Pending, badge wraps stay positioned. */
  .wf-card { ${PENDING_CARD} }
  .wf-badge {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    animation-duration: 28s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  .wf-badge-wrap { display: inline-block; height: 14px; }
  .wf-spinner {
    opacity: 0;
    animation-duration: 28s, 0.8s;
    animation-timing-function: ease-in-out, linear;
    animation-iteration-count: infinite, infinite;
  }
  .wf-duration {
    opacity: 0;
    animation-duration: 28s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }
  .wf-edge {
    background: rgba(0,0,0,0.1);
    animation-duration: 28s;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
  }

  /* Per-node animation hookups. animation-duration is the SAME 28s for
     every node — what differs is the keyframe percentages. That's how the
     wave moves down sequentially yet every node hits 100% (reset) at the
     same wall-clock moment. */
  ${WF_NODE_WINDOWS.map((w, i) => {
    const n = i + 1;
    return `
      .wf-node-${n} .wf-card { animation: wf-card-${n} 28s ease-in-out infinite; }
      .wf-node-${n} .wf-badge--pending { animation-name: wf-pending-${n}; }
      .wf-node-${n} .wf-badge--running { animation-name: wf-running-${n}; }
      .wf-node-${n} .wf-badge--done    { animation-name: wf-done-${n}; }
      .wf-node-${n} .wf-spinner  { animation-name: wf-spinner-${n}, mini-spin; }
      .wf-node-${n} .wf-duration { animation-name: wf-duration-${n}; }
      .wf-node-${n} .wf-edge     { animation-name: wf-edge-${n}; }
    `;
  }).join("")}

  ${WF_NODE_WINDOWS.map((w, i) => wfCardKeyframes(i + 1, w)).join("")}
  ${WF_NODE_WINDOWS.map((w, i) => wfBadgeKeyframes(i + 1, w)).join("")}

  /* Reduced-motion: freeze in the start state — node 1 Running (with
     spinner visible), nodes 2–5 Pending. */
  @media (prefers-reduced-motion: reduce) {
    .wf-card,
    .wf-badge,
    .wf-spinner,
    .wf-duration,
    .wf-edge,
    .wf-live-dot { animation: none; }
    .wf-duration { opacity: 0; }

    .wf-anim-node[data-initial="pending"] .wf-card { ${PENDING_CARD} }
    .wf-anim-node[data-initial="pending"] .wf-badge--pending { opacity: 1; }
    .wf-anim-node[data-initial="pending"] .wf-badge--running,
    .wf-anim-node[data-initial="pending"] .wf-badge--done { opacity: 0; }
    .wf-anim-node[data-initial="pending"] .wf-spinner { opacity: 0; }

    .wf-anim-node[data-initial="running"] .wf-card { ${RUNNING_CARD} }
    .wf-anim-node[data-initial="running"] .wf-badge--running { opacity: 1; }
    .wf-anim-node[data-initial="running"] .wf-badge--pending,
    .wf-anim-node[data-initial="running"] .wf-badge--done { opacity: 0; }
    .wf-anim-node[data-initial="running"] .wf-spinner { opacity: 1; }

    .wf-edge { background: rgba(0,0,0,0.1); }
  }
`;

const badgeBase: React.CSSProperties = {
  fontSize: 8,
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: 3,
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};

/* ════════════════════════════════════════════════════════════════════
   3. BRAND MEMORY MINI — AssetsBuildGraph miniature
   ════════════════════════════════════════════════════════════════════ */

/* Monochrome violet — intensity varies by step status.
   Analyzed clusters render in full brand violet; pending ones fade out. */
const VIOLET = "#6c47ff";
const STEP_STATUS: Record<string, "done" | "running" | "pending"> = {
  brand_kit:        "done",     // hub — always present
  proof_points:     "done",
  expert_voices:    "done",
  facts:            "running",  // currently being extracted
  earned_content:   "pending",
  site_structure:   "pending",
  consolidating:    "pending",
};

// Cluster centers (viewBox 0..100, mirrors AssetsBuildGraph CLUSTER_CENTERS)
const CLUSTERS: { id: string; cx: number; cy: number }[] = [
  { id: "brand_kit",      cx: 50, cy: 50 },
  { id: "proof_points",   cx: 22, cy: 36 },
  { id: "expert_voices",  cx: 78, cy: 28 },
  { id: "facts",          cx: 84, cy: 60 },
  { id: "earned_content", cx: 50, cy: 16 },
  { id: "site_structure", cx: 50, cy: 84 },
  { id: "consolidating",  cx: 16, cy: 68 },
];

function makeRng(seed: string) {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) | 0;
  if (s === 0) s = 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

type GNode = { id: number; x: number; y: number; r: number; cid: string; isHub: boolean };

// Generate nodes: hub + 6-8 satellites per cluster
const NODES: GNode[] = [];
let nodeIdCounter = 0;
CLUSTERS.forEach((c) => {
  const rng = makeRng(c.id);
  const isCenter = c.id === "brand_kit";
  // Hub
  NODES.push({
    id: nodeIdCounter++,
    x: c.cx,
    y: c.cy,
    r: isCenter ? 3.5 : 2.6,
    cid: c.id,
    isHub: true,
  });
  // Satellites
  const satCount = isCenter ? 10 : 7;
  for (let i = 0; i < satCount; i++) {
    const r1 = Math.abs((rng() + rng() - 1)) * (isCenter ? 7 : 5.5) + 2;
    const theta = rng() * Math.PI * 2;
    NODES.push({
      id: nodeIdCounter++,
      x: c.cx + Math.cos(theta) * r1,
      y: c.cy + Math.sin(theta) * r1,
      r: 0.7 + rng() * 0.6,
      cid: c.id,
      isHub: false,
    });
  }
});

// Edges: hubs to center + intra-cluster simple chain
type GEdge = { from: number; to: number; cid: string };
const EDGES: GEdge[] = [];
const hubByCluster: Record<string, number> = {};
NODES.forEach((n) => {
  if (n.isHub) hubByCluster[n.cid] = n.id;
});
// Hub backbone
const centerHub = hubByCluster["brand_kit"];
Object.keys(hubByCluster).forEach((cid) => {
  if (cid !== "brand_kit") EDGES.push({ from: centerHub, to: hubByCluster[cid], cid });
});
// Intra-cluster: connect each satellite to its hub
NODES.forEach((n) => {
  if (!n.isHub) EDGES.push({ from: hubByCluster[n.cid], to: n.id, cid: n.cid });
});
// Sparse satellite-to-satellite within each cluster (k=1 nearest)
CLUSTERS.forEach((c) => {
  const sats = NODES.filter((n) => n.cid === c.id && !n.isHub);
  sats.forEach((a) => {
    let best: GNode | null = null;
    let bestD = Infinity;
    sats.forEach((b) => {
      if (b.id === a.id) return;
      const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
      if (d < bestD) { bestD = d; best = b; }
    });
    if (best && a.id < (best as GNode).id) EDGES.push({ from: a.id, to: (best as GNode).id, cid: c.id });
  });
});

export function BrandMemoryMini() {
  const doneCount = Object.values(STEP_STATUS).filter((s) => s === "done").length;

  // Per-node opacity based on cluster status. Done = solid, running = pulsing
  // mid-tone, pending = ghosted.
  const nodeFillOpacity = (cid: string, isHub: boolean): number => {
    const st = STEP_STATUS[cid];
    if (st === "done")    return isHub ? 1.0 : 0.85;
    if (st === "running") return isHub ? 0.75 : 0.55;
    return isHub ? 0.28 : 0.18;
  };
  const edgeOpacity = (cid: string): number => {
    const st = STEP_STATUS[cid];
    if (st === "done")    return 0.45;
    if (st === "running") return 0.32;
    return 0.10;
  };

  return (
    <div style={{ ...miniBase, padding: 0, overflow: "hidden", position: "relative" }}>
      <div style={{ padding: "12px 14px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: brand.text, letterSpacing: "-0.01em" }}>
          Building Brand Memory
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, color: brand.color, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: brand.color }} />
          {doneCount} / 7 steps
        </span>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          background:
            "radial-gradient(ellipse at center, rgba(108,71,255,0.10) 0%, rgba(245,246,247,0) 60%)",
        }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" style={{ display: "block" }}>
          {/* Edges */}
          {EDGES.map((e, i) => {
            const a = NODES[e.from];
            const b = NODES[e.to];
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={VIOLET}
                strokeWidth={0.2}
                strokeOpacity={edgeOpacity(e.cid)}
              />
            );
          })}

          {/* Nodes */}
          {NODES.map((n) => (
            <circle
              key={n.id}
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={VIOLET}
              fillOpacity={nodeFillOpacity(n.cid, n.isHub)}
              stroke={n.isHub ? VIOLET : "none"}
              strokeOpacity={n.isHub ? 0.4 : 0}
              strokeWidth={n.isHub ? 1.2 : 0}
            />
          ))}
        </svg>
      </div>

      {/* Footer caption */}
      <div style={{ padding: "0 14px 12px", display: "flex", flexWrap: "wrap", gap: "3px 10px" }}>
        {[
          { l: "Done",     opacity: 0.95 },
          { l: "Running",  opacity: 0.55 },
          { l: "Pending",  opacity: 0.18 },
        ].map((x) => (
          <span key={x.l} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 8, color: brand.muted, fontFamily: MONO }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: VIOLET, opacity: x.opacity }} />
            {x.l}
          </span>
        ))}
      </div>
    </div>
  );
}

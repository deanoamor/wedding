export type Vals = Record<string, any>;

export const ACCENT = "#9A4A5E";

type State = { svc: number; venue: number; t: number };

export function buildVals(
  s: State,
  set: (p: Partial<State>) => void,
): Vals {
  const v: Vals = { accent: ACCENT };
  for (let i = 1; i <= 6; i++) {
    const on = s.svc === i;
    v["s" + i] = on;
    v["rb" + i] = on ? "#2A201C" : "#EFE6DB";
    v["rc" + i] = on ? "#FBF7F2" : "#2A201C";
    v["ra" + i] = on ? "rotate(45deg)" : "none";
    v["gr" + i] = on ? "1fr" : "0fr";
    v["op" + i] = on ? 1 : 0;
    v["vi" + i] = on ? "visible" : "hidden";
    v["vd" + i] = on ? "0s" : ".5s";
    v["pick" + i] = () => set({ svc: on ? 0 : i });
  }
  const tones = ["#B89A8A", "#8E9A7C", "#A48C9E"];
  for (let i = 1; i <= 3; i++) {
    const on = s.venue === i;
    v["g" + i] = on;
    v["gb" + i] = on ? "#FBF7F2" : "rgba(251,247,242,.2)";
    v["go" + i] = on ? 1 : 0.6;
    v["pickg" + i] = () => set({ venue: i });
    v["vo" + i] = on ? 1 : 0;
    v["vt" + i] = on ? "translateY(0)" : "translateY(10px)";
    v["t" + i] = s.t === i;
    v["to" + i] = s.t === i ? 1 : 0;
  }
  v.gtone = tones[s.venue - 1];
  v.tcount = "0" + s.t + " / 03";
  v.tprev = () => set({ t: s.t === 1 ? 3 : s.t - 1 });
  v.tnext = () => set({ t: s.t === 3 ? 1 : s.t + 1 });
  return v;
}

import { useRef, useState } from "react";

const COLORS = {
  primary: "#1A6FBF",
  primaryDark: "#0A4A8A",
  primaryLight: "#EAF3FB",
  green: "#1D9E75",
  greenLight: "#E1F5EE",
  amber: "#BA7517",
  amberLight: "#FAEEDA",
  coral: "#D85A30",
  coralLight: "#FAECE7",
  text: "#0F1C2E",
  textMuted: "#5A7A9A",
  textLight: "#9AB0C4",
  border: "rgba(26,111,191,0.15)",
  white: "#fff",
  bg: "#EAF3FB",
};

// ── Types ─────────────────────────────────────────────────────────
interface Service {
  id: string;
  name: string;
  icon: string;
  category: string;
  accent: string;
}

interface JobFormData {
  description: string;
  maintenanceType: string;
  date: string;
  time: string;
  location: string;
  specialNotes: string;
  photos: string[];
  service?: Service;
}

interface TimelineEvent {
  id: number;
  status: "done" | "active" | "pending";
  icon: string;
  title: string;
  time: string;
  desc: string;
  actor: string;
  highlight?: boolean;
  note?: string;
}

// ── Shared primitives ─────────────────────────────────────────────────────────
interface BtnProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "primary" | "outline" | "ghost" | "danger";
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Btn = ({ children, onPress, variant = "primary", style = {}, disabled }: BtnProps) => {
  const base: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 6, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", fontWeight: 700, borderRadius: 14,
    transition: "all .15s", opacity: disabled ? 0.5 : 1,
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: COLORS.primary, color: "#fff", padding: "14px 24px", fontSize: 15, width: "100%" },
    outline: { background: "transparent", color: COLORS.primary, border: `1.5px solid ${COLORS.primary}`, padding: "11px 20px", fontSize: 14 },
    ghost: { background: COLORS.primaryLight, color: COLORS.primary, padding: "10px 18px", fontSize: 13 },
    danger: { background: "#FEE2E2", color: "#B91C1C", padding: "11px 20px", fontSize: 14 },
  };
  return (
    <button
      onClick={disabled ? undefined : onPress}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}

const Input = ({ label, placeholder, value, onChange, type = "text", multiline, rows = 3, required }: InputProps) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, letterSpacing: .5, marginBottom: 5, textTransform: "uppercase" }}>
      {label}{required && <span style={{ color: COLORS.coral }}> *</span>}
    </div>
    {multiline ? (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        style={{
          width: "100%", boxSizing: "border-box", padding: "11px 14px",
          borderRadius: 12, border: `1px solid ${COLORS.border}`,
          background: "#fff", color: COLORS.text, fontSize: 14, fontFamily: "inherit",
          resize: "vertical", outline: "none",
        }}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", boxSizing: "border-box", padding: "11px 14px",
          borderRadius: 12, border: `1px solid ${COLORS.border}`,
          background: "#fff", color: COLORS.text, fontSize: 14, fontFamily: "inherit",
          outline: "none",
        }}
      />
    )}
  </div>
);

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
}

const Select = ({ label, value, onChange, options, required }: SelectProps) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.textMuted, letterSpacing: .5, marginBottom: 5, textTransform: "uppercase" }}>
      {label}{required && <span style={{ color: COLORS.coral }}> *</span>}
    </div>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", boxSizing: "border-box", padding: "11px 14px",
        borderRadius: 12, border: `1px solid ${COLORS.border}`,
        background: "#fff", color: value ? COLORS.text : COLORS.textLight,
        fontSize: 14, fontFamily: "inherit", outline: "none", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A7A9A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightEl?: React.ReactNode;
}

const Header = ({ title, subtitle, onBack, rightEl }: HeaderProps) => (
  <div style={{ background: COLORS.primary, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
    {onBack && (
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 10, border: "none",
        background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 22,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>‹</button>
    )}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>{subtitle}</div>}
    </div>
    {rightEl}
  </div>
);

interface TagProps {
  color: string;
  bg: string;
  children: React.ReactNode;
}

const Tag = ({ color, bg, children }: TagProps) => (
  <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 7 }}>{children}</span>
);

// ── Section card wrapper ─────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const Section = ({ title, icon, children }: SectionProps) => (
  <div style={{
    background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`,
    marginBottom: 12, overflow: "hidden",
  }}>
    <div style={{
      padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`,
      display: "flex", alignItems: "center", gap: 8,
      background: COLORS.primaryLight,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primaryDark }}>{title}</span>
    </div>
    <div style={{ padding: "14px 16px" }}>{children}</div>
  </div>
);

// ─── JOB CREATE SCREEN ───────────────────────────────────────────────────────
interface JobCreateScreenProps {
  service: Service;
  onBack: () => void;
  onSubmit: (data: JobFormData) => void;
}

function JobCreateScreen({ service, onBack, onSubmit }: JobCreateScreenProps) {
  const [form, setForm] = useState<JobFormData>({
    description: "", maintenanceType: "", date: "", time: "",
    location: "", specialNotes: "", photos: [],
  });
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof JobFormData, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = () => {
    setPhotoNames(p => [...p, `Photo_${p.length + 1}.jpg`]);
  };

  const canNext1 = form.description.length > 5 && !!form.maintenanceType;
  const canNext2 = !!form.date && !!form.time && !!form.location;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSubmit({ ...form, service });
    }, 1600);
  };

  const StepDot = ({ n }: { n: number }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: step >= n ? COLORS.primary : COLORS.border,
        color: step >= n ? "#fff" : COLORS.textLight,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: 13, transition: "all .3s",
      }}>{n}</div>
      {n < 3 && <div style={{ width: 36, height: 2, background: step > n ? COLORS.primary : COLORS.border, transition: "all .3s" }} />}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: COLORS.bg }}>
      <Header title="Create Job Request" subtitle="Fill in the details below" onBack={onBack} />

      {/* Service banner */}
      <div style={{
        margin: "12px 12px 0", padding: "12px 14px",
        background: "#fff", borderRadius: 14, border: `1.5px solid ${COLORS.primary}`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13, background: COLORS.primaryLight,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
        }}>{service.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{service.name}</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{service.category} · Auto-filled</div>
        </div>
        <Tag color={COLORS.primary} bg={COLORS.primaryLight}>Selected</Tag>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 0 6px" }}>
        <StepDot n={1} /><StepDot n={2} /><StepDot n={3} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around", paddingBottom: 10, paddingInline: 12 }}>
        {["Job Details", "Schedule", "Review"].map((l, i) => (
          <span key={l} style={{ fontSize: 10, fontWeight: 700, color: step === i + 1 ? COLORS.primary : COLORS.textLight, letterSpacing: .3 }}>{l}</span>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>

        {step === 1 && (
          <>
            <Section title="Job Description" icon="📝">
              <Input
                label="Describe the problem or task"
                placeholder="e.g. My kitchen lights are flickering and one socket is not working..."
                value={form.description}
                onChange={v => set("description", v)}
                multiline rows={4}
                required
              />
              <Select
                label="Maintenance Type"
                value={form.maintenanceType}
                onChange={v => set("maintenanceType", v)}
                required
                options={[
                  { value: "", label: "Select type..." },
                  { value: "preventive", label: "🛡️ Preventive — Scheduled maintenance" },
                  { value: "breakdown", label: "⚠️ Breakdown — Something is broken" },
                  { value: "installation", label: "🔧 Installation — New setup" },
                  { value: "inspection", label: "🔍 Inspection — Check & report" },
                ]}
              />
              <Input
                label="Special Notes (optional)"
                placeholder="Any access instructions, preferred brands, safety concerns..."
                value={form.specialNotes}
                onChange={v => set("specialNotes", v)}
                multiline rows={2}
              />
            </Section>

            <Section title="Photos" icon="📷">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {photoNames.map((n, i) => (
                  <div key={i} style={{
                    width: 72, height: 72, borderRadius: 10,
                    background: COLORS.primaryLight, display: "flex",
                    flexDirection: "column", alignItems: "center", justifyContent: "center",
                    border: `1px solid ${COLORS.border}`,
                  }}>
                    <span style={{ fontSize: 22 }}>🖼️</span>
                    <span style={{ fontSize: 9, color: COLORS.textMuted, marginTop: 3 }}>{n}</span>
                  </div>
                ))}
                <button onClick={handlePhoto} style={{
                  width: 72, height: 72, borderRadius: 10,
                  background: "#fff", border: `1.5px dashed ${COLORS.primary}`,
                  color: COLORS.primary, fontSize: 24, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>+</button>
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>Upload up to 6 photos. Helps the SP understand the job better.</div>
            </Section>

            <Btn onPress={() => setStep(2)} disabled={!canNext1}>
              Continue to Schedule →
            </Btn>
          </>
        )}

        {step === 2 && (
          <>
            <Section title="Preferred Schedule" icon="📅">
              <Input label="Preferred Date" type="date" value={form.date} onChange={v => set("date", v)} required />
              <Input label="Preferred Time" type="time" value={form.time} onChange={v => set("time", v)} required />
            </Section>

            <Section title="Location" icon="📍">
              <Input label="Full Address" placeholder="No. 12, Galle Road, Colombo 03" value={form.location} onChange={v => set("location", v)} required />
              <div style={{
                height: 110, borderRadius: 12, background: "linear-gradient(135deg, #B5D4F4 0%, #E1F5EE 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: `1px solid ${COLORS.border}`, cursor: "pointer",
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28 }}>🗺️</div>
                  <div style={{ fontSize: 12, color: COLORS.primary, fontWeight: 600, marginTop: 4 }}>Tap to pin on map</div>
                </div>
              </div>
            </Section>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outline" onPress={() => setStep(1)} style={{ width: "auto", flex: 1 }}>← Back</Btn>
              <Btn onPress={() => setStep(3)} disabled={!canNext2} style={{ flex: 2 }}>Review Job →</Btn>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Review card */}
            <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ background: COLORS.primaryDark, padding: "12px 16px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Job Summary</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 1 }}>Review before submitting</div>
              </div>
              {[
                ["Service", `${service.icon} ${service.name}`],
                ["Type", form.maintenanceType ? { preventive: "🛡️ Preventive", breakdown: "⚠️ Breakdown", installation: "🔧 Installation", inspection: "🔍 Inspection" }[form.maintenanceType] : "—"],
                ["Date", form.date || "—"],
                ["Time", form.time || "—"],
                ["Location", form.location || "—"],
                ["Photos", `${photoNames.length} attached`],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}`,
                }}>
                  <span style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600, maxWidth: "58%", textAlign: "right" }}>{v}</span>
                </div>
              ))}
              <div style={{ padding: "10px 16px" }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 600, marginBottom: 5 }}>Description</div>
                <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{form.description}</div>
              </div>
            </div>

            {/* Info notice */}
            <div style={{
              background: "#FFF7ED", border: "1px solid #FCD34D", borderRadius: 12,
              padding: "11px 14px", marginBottom: 12, display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 18 }}>ℹ️</span>
              <div style={{ fontSize: 12, color: "#92400E", lineHeight: 1.6 }}>
                Your request goes to admin for review & SP assignment. You may cancel before a verification code is sent — late cancellations incur a travel + processing charge.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="outline" onPress={() => setStep(2)} style={{ width: "auto", flex: 1 }}>← Back</Btn>
              <Btn onPress={handleSubmit} disabled={submitting} style={{ flex: 2 }}>
                {submitting ? "Submitting…" : "Submit Request ✓"}
              </Btn>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── JOB TRACKING SCREEN ─────────────────────────────────────────────────────
const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: 1, status: "done", icon: "📋", title: "Request Submitted", time: "May 14, 9:02 AM", desc: "Your job request was received and is awaiting admin review.", actor: "System" },
  { id: 2, status: "done", icon: "🔍", title: "Under Admin Review", time: "May 14, 9:15 AM", desc: "Admin is reviewing your request and finding the right service provider.", actor: "Admin" },
  { id: 3, status: "done", icon: "👷", title: "SP Assigned", time: "May 14, 10:30 AM", desc: "Ravi Perera (⭐ 4.8) has been assigned. Expected arrival: May 15 at 10:00 AM.", actor: "Admin", highlight: true },
  { id: 4, status: "done", icon: "✅", title: "Arrival Confirmed", time: "May 15, 9:58 AM", desc: "SP has confirmed arrival at your location. Work has begun.", actor: "SP" },
  { id: 5, status: "active", icon: "🔄", title: "Revisit Approved", time: "May 15, 2:30 PM", desc: "Additional materials needed. Admin approved a revisit for May 16.", actor: "Admin", note: "Parts sourcing required" },
  { id: 6, status: "pending", icon: "💳", title: "Payment", time: "Pending", desc: "Payment will be processed upon job completion.", actor: "System" },
  { id: 7, status: "pending", icon: "🏁", title: "Job Completed", time: "—", desc: "Job completion confirmation pending.", actor: "—" },
];

interface JobTrackingScreenProps {
  job: JobFormData | null;
  onBack: () => void;
  onReview: () => void;
  onCancel: () => void;
}

function JobTrackingScreen({ job, onBack, onReview, onCancel }: JobTrackingScreenProps) {
  const [showCancel, setShowCancel] = useState<boolean>(false);

  const statusColor: Record<string, string> = { done: COLORS.green, active: COLORS.primary, pending: COLORS.textLight };
  const statusBg: Record<string, string> = { done: COLORS.greenLight, active: COLORS.primaryLight, pending: "#F1F5F9" };

  const overall = "In Progress";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: COLORS.bg }}>
      <Header
        title="Job Tracking"
        subtitle="Job #JB-2024-0514"
        onBack={onBack}
        rightEl={
          <div style={{
            background: COLORS.amberLight, color: COLORS.amber,
            padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
          }}>● {overall}</div>
        }
      />

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {/* Job info card */}
        <div style={{
          background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`,
          padding: "14px 16px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14, background: COLORS.primaryLight,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
            }}>{job?.service?.icon || "⚡"}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{job?.service?.name || "Electrical & Wiring"}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>📍 12, Galle Road, Colombo 03</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>📅 May 15, 2025 · 10:00 AM</div>
            </div>
          </div>

          {/* SP info */}
          <div style={{
            marginTop: 12, padding: "10px 12px", borderRadius: 12,
            background: COLORS.primaryLight, border: `1px solid ${COLORS.border}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%", background: COLORS.primary,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0,
            }}>RP</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>Ravi Perera</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>⭐ 4.8 · 132 completed jobs</div>
            </div>
            <button style={{
              background: COLORS.green, border: "none", color: "#fff",
              borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>📞 Call</button>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ padding: "11px 16px", borderBottom: `1px solid ${COLORS.border}`, background: COLORS.primaryLight }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.primaryDark }}>📊 Job Timeline</span>
          </div>
          <div style={{ padding: "8px 16px 4px" }}>
            {TIMELINE_EVENTS.map((ev, i) => (
              <div key={ev.id} style={{ display: "flex", gap: 12, paddingBottom: i < TIMELINE_EVENTS.length - 1 ? 0 : 10 }}>
                {/* Line */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 32, flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: statusBg[ev.status],
                    border: ev.status === "active" ? `2px solid ${COLORS.primary}` : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0, zIndex: 1,
                    boxShadow: ev.status === "active" ? `0 0 0 4px ${COLORS.primaryLight}` : "none",
                  }}>{ev.status === "pending" ? <span style={{ fontSize: 12 }}>○</span> : ev.icon}</div>
                  {i < TIMELINE_EVENTS.length - 1 && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 20,
                      background: ev.status === "done" ? COLORS.green : COLORS.border,
                      marginTop: 3, marginBottom: 3,
                    }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: ev.status === "pending" ? COLORS.textLight : COLORS.text }}>{ev.title}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                      background: statusBg[ev.status], color: statusColor[ev.status],
                    }}>{ev.status === "active" ? "NOW" : ev.status === "done" ? "Done" : "Pending"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{ev.time} · {ev.actor}</div>
                  <div style={{ fontSize: 12, color: ev.status === "pending" ? COLORS.textLight : COLORS.textMuted, marginTop: 4, lineHeight: 1.5 }}>{ev.desc}</div>
                  {ev.note && (
                    <div style={{
                      marginTop: 6, padding: "6px 10px", borderRadius: 8,
                      background: COLORS.amberLight, border: `1px solid #FCD34D`,
                      fontSize: 11, color: COLORS.amber, fontWeight: 600,
                    }}>📌 Note: {ev.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <Btn variant="ghost" onPress={onReview} style={{ flex: 1, fontSize: 13 }}>⭐ Rate & Review</Btn>
          <Btn variant="danger" onPress={() => setShowCancel(true)} style={{ flex: 1, fontSize: 13 }}>✕ Cancel Job</Btn>
        </div>

        {/* Cancel modal */}
        {showCancel && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(10,30,60,0.55)",
            display: "flex", alignItems: "flex-end", zIndex: 100,
          }}>
            <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: "24px 20px", width: "100%", boxSizing: "border-box" }}>
              <div style={{ fontSize: 22, textAlign: "center", marginBottom: 6 }}>⚠️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, textAlign: "center", marginBottom: 8 }}>Cancel this job?</div>
              <div style={{
                background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 10,
                padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#92400E", lineHeight: 1.6,
              }}>
                ⚠️ Cancelling after SP assignment may incur a <strong>travel charge + admin fee</strong>. The exact amount will be determined by admin and charged to your account.
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="outline" onPress={() => setShowCancel(false)} style={{ flex: 1 }}>Keep Job</Btn>
                <Btn variant="danger" onPress={() => { setShowCancel(false); onCancel(); }} style={{ flex: 1 }}>Yes, Cancel</Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── JOB REVIEW SCREEN ───────────────────────────────────────────────────────
interface JobReviewScreenProps {
  job: JobFormData | null;
  onBack: () => void;
  onDone: () => void;
}

function JobReviewScreen({ job, onBack, onDone }: JobReviewScreenProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const TAGS = ["Punctual", "Professional", "Clean Work", "Great Value", "Friendly", "Careful", "Thorough", "Quick"];
  const toggleTag = (t: string) => setTags(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t]);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onDone, 2200);
  };

  if (submitted) return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: COLORS.bg, alignItems: "center", justifyContent: "center", gap: 14, padding: 24 }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, textAlign: "center" }}>Review Submitted!</div>
      <div style={{ fontSize: 14, color: COLORS.textMuted, textAlign: "center", lineHeight: 1.6 }}>Thank you for your feedback. It helps the community find great service providers.</div>
      <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(i => <span key={i} style={{ fontSize: 32, color: i <= rating ? "#FBBF24" : "#E2E8F0" }}>★</span>)}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", background: COLORS.bg }}>
      <Header title="Rate & Review" subtitle="Your feedback matters" onBack={onBack} />

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {/* SP card */}
        <div style={{
          background: "#fff", borderRadius: 16, border: `1px solid ${COLORS.border}`,
          padding: "16px", marginBottom: 12, textAlign: "center",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: COLORS.primary,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 auto 10px",
          }}>RP</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Ravi Perera</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{job?.service?.icon || "⚡"} {job?.service?.name || "Electrical & Wiring"}</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 3 }}>Completed · May 16, 2025</div>
        </div>

        {/* Star rating */}
        <Section title="Overall Rating" icon="⭐">
          <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "8px 0 12px" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                style={{
                  fontSize: 40, cursor: "pointer",
                  color: i <= (hover || rating) ? "#FBBF24" : "#E2E8F0",
                  transition: "all .15s",
                  transform: i <= (hover || rating) ? "scale(1.15)" : "scale(1)",
                  display: "inline-block",
                }}
              >★</span>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: COLORS.primary }}>
            {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating] || "Tap a star to rate"}
          </div>
        </Section>

        {/* Quick tags */}
        <Section title="What stood out?" icon="👍">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {TAGS.map(t => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                style={{
                  padding: "7px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                  cursor: "pointer", transition: "all .15s",
                  background: tags.includes(t) ? COLORS.primary : "#fff",
                  color: tags.includes(t) ? "#fff" : COLORS.textMuted,
                  border: `1.5px solid ${tags.includes(t) ? COLORS.primary : COLORS.border}`,
                }}
              >{tags.includes(t) ? "✓ " : ""}{t}</button>
            ))}
          </div>
        </Section>

        {/* Written review */}
        <Section title="Write a Review" icon="✍️">
          <textarea
            placeholder="Share your experience — what went well, what could be improved..."
            value={review}
            onChange={e => setReview(e.target.value)}
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box", padding: "11px 14px",
              borderRadius: 12, border: `1px solid ${COLORS.border}`,
              background: "#fff", color: COLORS.text, fontSize: 14, fontFamily: "inherit",
              resize: "vertical", outline: "none",
            }}
          />
          <div style={{ fontSize: 11, color: COLORS.textLight, textAlign: "right", marginTop: 4 }}>{review.length}/500</div>
        </Section>

        <Btn onPress={handleSubmit} disabled={rating === 0}>
          Submit Review ✓
        </Btn>
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
const DEMO_SERVICE: Service = { id: "1", name: "Electrical & Wiring", icon: "⚡", category: "Home", accent: "#1A6FBF" };

export default function App() {
  const [screen, setScreen] = useState<"create" | "tracking" | "review">("create");
  const [job, setJob] = useState<JobFormData | null>(null);

  const handleSubmit = (data: JobFormData) => {
    setJob(data);
    setScreen("tracking");
  };

  return (
    <div style={{
      width: "100%",
      height: "100vh",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      background: COLORS.bg,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {screen === "create" && (
        <JobCreateScreen
          service={DEMO_SERVICE}
          onBack={() => { }}
          onSubmit={handleSubmit}
        />
      )}
      {screen === "tracking" && (
        <JobTrackingScreen
          job={job}
          onBack={() => setScreen("create")}
          onReview={() => setScreen("review")}
          onCancel={() => setScreen("create")}
        />
      )}
      {screen === "review" && (
        <JobReviewScreen
          job={job}
          onBack={() => setScreen("tracking")}
          onDone={() => setScreen("tracking")}
        />
      )}

      {/* Nav bar */}
      <div style={{
        background: "#fff", borderTop: `1px solid ${COLORS.border}`,
        display: "flex", justifyContent: "space-around", padding: "8px 0",
        flexShrink: 0,
      }}>
        {[
          { id: "create", icon: "📝", label: "Create" },
          { id: "tracking", icon: "📊", label: "Track" },
          { id: "review", icon: "⭐", label: "Review" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id as "create" | "tracking" | "review")}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 12px", borderRadius: 10,
              opacity: screen === tab.id ? 1 : 0.45,
            }}
          >
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: screen === tab.id ? COLORS.primary : COLORS.textMuted }}>
              {tab.label}
            </span>
            {screen === tab.id && (
              <div style={{ width: 20, height: 2.5, borderRadius: 2, background: COLORS.primary }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
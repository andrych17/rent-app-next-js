"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Check, MapPin, Calendar, ArrowLeft, User, Mail, Phone, ChevronRight } from "lucide-react";
import { useWorkspaceStore } from "@/store/workspace";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  whatsapp: string;
  area: string;
  startDate: string;
  duration: string;
  notes: string;
}

const AREAS = [
  "Canggu", "Seminyak", "Ubud", "Kuta", "Sanur",
  "Jimbaran", "Nusa Dua", "Denpasar", "Other",
];

const DURATIONS = [
  { value: "1", label: "1 month" },
  { value: "2", label: "2 months" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
  { value: "12", label: "12 months (best value)" },
];

export default function CheckoutPanel() {
  const { setup, showCheckout, setShowCheckout, removeAccessory, clearAll } =
    useWorkspaceStore(
      useShallow((s) => ({
        setup: s.setup,
        showCheckout: s.showCheckout,
        setShowCheckout: s.setShowCheckout,
        removeAccessory: s.removeAccessory,
        clearAll: s.clearAll,
      }))
    );

  // step: "review" | "form" | "success"
  const [step, setStep] = useState<"review" | "form" | "success">("review");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    area: "",
    startDate: "",
    duration: "1",
    notes: "",
  });

  const total = useWorkspaceStore((s) => {
    const { setup } = s;
    return (
      (setup.desk?.price ?? 0) +
      (setup.chair?.price ?? 0) +
      setup.accessories.reduce((sum, a) => sum + a.price, 0)
    );
  });
  const itemCount = useWorkspaceStore(
    (s) =>
      (s.setup.desk ? 1 : 0) +
      (s.setup.chair ? 1 : 0) +
      s.setup.accessories.length
  );

  const allItems = [
    ...(setup.desk ? [{ ...setup.desk, type: "Desk" as const }] : []),
    ...(setup.chair ? [{ ...setup.chair, type: "Chair" as const }] : []),
    ...setup.accessories.map((a) => ({ ...a, type: "Accessory" as const })),
  ];
  const hasDeskSelected = !!setup.desk;

  const handleClose = () => {
    setShowCheckout(false);
    setTimeout(() => setStep("review"), 300);
  };

  const setField = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "WhatsApp number is required";
    if (!form.area) newErrors.area = "Please select your area";
    if (!form.startDate) newErrors.startDate = "Please select a start date";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) setStep("success");
  };

  const totalMonths = parseInt(form.duration || "1");
  const totalCost = total * totalMonths;

  // Today's date in YYYY-MM-DD for min date
  const today = new Date().toISOString().split("T")[0];

  if (!showCheckout) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
        >
          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center p-12 text-center gap-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="w-24 h-24 rounded-full bg-[var(--color-success)] flex items-center justify-center"
              >
                <Check size={48} className="text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-extrabold text-[var(--color-foreground)]">
                  You&apos;re All Set! 🌴
                </h2>
                <p className="text-sm text-[var(--color-muted)] mt-2 leading-relaxed">
                  Thanks <strong>{form.name.split(" ")[0]}</strong>! We&apos;ll WhatsApp you at{" "}
                  <strong>{form.whatsapp}</strong> within a few hours to confirm your delivery.
                </p>
              </div>
              <div className="w-full bg-[var(--color-surface-hover)] rounded-2xl p-5 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-[var(--color-muted)]">Area:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">{form.area}, Bali</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[var(--color-primary)] shrink-0" />
                  <span className="text-[var(--color-muted)]">Starting:</span>
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {new Date(form.startDate).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-base">💸</span>
                  <span className="text-[var(--color-muted)]">Total ({form.duration}mo):</span>
                  <span className="font-extrabold text-[var(--color-foreground)]">${totalCost}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  handleClose();
                  clearAll();
                }}
                className="btn-primary"
              >
                Back to Designer
              </button>
              <p className="text-xs text-[var(--color-muted)]">Free delivery · Free setup · Cancel anytime</p>
            </div>
          )}

          {/* ── REVIEW ── */}
          {step === "review" && (
            <>
              <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--color-border)] shrink-0">
                <div>
                  <h2 className="text-lg font-extrabold text-[var(--color-foreground)]">Your Setup</h2>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">{itemCount} item{itemCount !== 1 ? "s" : ""} · ${total}/mo</p>
                </div>
                <button onClick={handleClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--color-muted)]" style={{ background: "var(--color-surface-hover)", border: "none", cursor: "pointer" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 px-7 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">1</div>
                  <span className="text-xs font-bold text-[var(--color-foreground)]">Review</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-border)] text-[var(--color-muted)] text-xs font-bold flex items-center justify-center">2</div>
                  <span className="text-xs font-bold text-[var(--color-muted)]">Details</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[var(--color-border)] text-[var(--color-muted)] text-xs font-bold flex items-center justify-center">3</div>
                  <span className="text-xs font-bold text-[var(--color-muted)]">Confirm</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-7 pb-4 space-y-3">
                {!hasDeskSelected && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                      <span>⚠️</span> A desk is required to checkout
                    </p>
                  </div>
                )}
                {allItems.length === 0 ? (
                  <div className="text-center py-14">
                    <p className="text-5xl mb-4">🪹</p>
                    <p className="font-semibold text-[var(--color-foreground)]">Your workspace is empty</p>
                    <button onClick={handleClose} className="mt-3 text-sm text-[var(--color-primary)] hover:underline flex items-center gap-1 mx-auto">
                      <ArrowLeft size={14} /> Start adding items
                    </button>
                  </div>
                ) : allItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border border-[var(--color-border)]" style={{ backgroundColor: `${item.color}15` }}>
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-foreground)] truncate">{item.name}</p>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.type}</p>
                    </div>
                    <p className="text-sm font-bold text-[var(--color-foreground)] shrink-0">${item.price}<span className="text-xs font-normal text-[var(--color-muted)]">/mo</span></p>
                    {item.type === "Accessory" && (
                      <button onClick={() => removeAccessory(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-100 text-[var(--color-muted)] hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {allItems.length > 0 && (
                <div className="px-7 py-6 border-t border-[var(--color-border)] space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">Monthly Total</p>
                      <p className="text-3xl font-extrabold text-[var(--color-foreground)]">${total}<span className="text-sm font-normal text-[var(--color-muted)]">/mo</span></p>
                    </div>
                    <button onClick={() => { clearAll(); setShowCheckout(false); }} className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors flex items-center gap-1">
                      <Trash2 size={12} /> Clear all
                    </button>
                  </div>
                  <button
                    onClick={() => hasDeskSelected && setStep("form")}
                    disabled={!hasDeskSelected}
                    className="btn-primary pulse-cta"
                  >
                    {hasDeskSelected ? (<>Continue to Details <ChevronRight size={18} /></>) : "Select a Desk First"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── FORM ── */}
          {step === "form" && (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)] shrink-0">
                <button onClick={() => setStep("review")} className="btn-ghost w-8 h-8 p-0 rounded-xl">
                  <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                  <h2 className="text-[17px] font-extrabold text-[var(--color-foreground)] leading-tight">Delivery Details</h2>
                  <p className="text-xs text-[var(--color-muted)] mt-0.5">Where & when do you need it?</p>
                </div>
                <button onClick={handleClose} className="btn-ghost w-8 h-8 p-0 rounded-xl">
                  <X size={18} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-[var(--color-border)] shrink-0 bg-[var(--color-surface-hover)]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center"><Check size={11} /></div>
                  <span className="text-[11px] font-bold text-[var(--color-muted)]">Review</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-primary)]" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">2</div>
                  <span className="text-[11px] font-bold text-[var(--color-foreground)]">Details</span>
                </div>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--color-border)] text-[var(--color-muted)] text-[10px] font-bold flex items-center justify-center">3</div>
                  <span className="text-[11px] font-bold text-[var(--color-muted)]">Confirm</span>
                </div>
              </div>

              {/* Scrollable form body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* ── Contact Info ── */}
                <div className="form-section">
                  <div className="form-section-header">
                    <User size={12} />
                    Contact Info
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="form-field">
                      <label className="form-label">
                        Full Name <span className="form-label-required">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className={`form-input${errors.name ? " error" : ""}`}
                      />
                      {errors.name && <p className="form-error">⚠ {errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="form-field">
                        <label className="form-label">
                          <Mail size={12} />
                          Email <span className="form-label-required">*</span>
                        </label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setField("email", e.target.value)}
                          placeholder="you@email.com"
                          className={`form-input${errors.email ? " error" : ""}`}
                        />
                        {errors.email && <p className="form-error">⚠ {errors.email}</p>}
                      </div>

                      <div className="form-field">
                        <label className="form-label">
                          <Phone size={12} />
                          WhatsApp <span className="form-label-required">*</span>
                        </label>
                        <input
                          type="tel"
                          value={form.whatsapp}
                          onChange={(e) => setField("whatsapp", e.target.value)}
                          placeholder="+62 812 …"
                          className={`form-input${errors.whatsapp ? " error" : ""}`}
                        />
                        {errors.whatsapp && <p className="form-error">⚠ {errors.whatsapp}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Delivery ── */}
                <div className="form-section">
                  <div className="form-section-header">
                    <MapPin size={12} />
                    Delivery
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="form-field">
                        <label className="form-label">
                          Area in Bali <span className="form-label-required">*</span>
                        </label>
                        <select
                          value={form.area}
                          onChange={(e) => setField("area", e.target.value)}
                          className={`form-select${errors.area ? " error" : ""}`}
                        >
                          <option value="" disabled>Select area…</option>
                          {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                        {errors.area && <p className="form-error">⚠ {errors.area}</p>}
                      </div>

                      <div className="form-field">
                        <label className="form-label">
                          <Calendar size={12} />
                          Start Date <span className="form-label-required">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.startDate}
                          min={today}
                          onChange={(e) => setField("startDate", e.target.value)}
                          className={`form-input${errors.startDate ? " error" : ""}`}
                        />
                        {errors.startDate && <p className="form-error">⚠ {errors.startDate}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Rental Duration ── */}
                <div className="form-section">
                  <div className="form-section-header">
                    <span style={{ fontSize: "12px" }}>📅</span>
                    Rental Duration
                  </div>
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setField("duration", d.value)}
                          className={`py-2 sm:py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                            form.duration === d.value
                              ? "bg-[var(--color-primary)] text-white shadow-md"
                              : "bg-[var(--color-surface-hover)] text-[var(--color-muted)] hover:bg-[var(--color-border)] hover:text-[var(--color-foreground)]"
                          }`}
                          style={{ border: form.duration === d.value ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-border)" }}
                        >
                          {d.value === "12" ? <><span>12mo</span><br /><span>🔥</span></> : `${d.value}mo`}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--color-surface-hover)", border: "1.5px solid var(--color-border)" }}>
                      <span className="text-xs text-[var(--color-muted)]">${total}/mo × {totalMonths} month{totalMonths > 1 ? "s" : ""}</span>
                      <span className="text-lg font-extrabold text-[var(--color-foreground)]">${totalCost}</span>
                    </div>
                  </div>
                </div>

                {/* ── Notes ── */}
                <div className="form-section">
                  <div className="form-section-header">
                    <span style={{ fontSize: "12px" }}>📝</span>
                    Notes <span style={{ fontSize: "11px", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
                  </div>
                  <div className="p-4">
                    <textarea
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder="Anything we should know? Floor number, gate code, special needs…"
                      className="form-textarea"
                    />
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-[var(--color-border)] shrink-0 space-y-3" style={{ background: "var(--color-surface)" }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-[var(--color-muted)]">Total for {totalMonths} month{totalMonths > 1 ? "s" : ""}</span>
                  <span className="text-2xl font-extrabold text-[var(--color-foreground)]">${totalCost}</span>
                </div>
                <button onClick={handleSubmit} className="btn-primary pulse-cta">
                  Confirm &amp; Rent 🏝️
                </button>
                <p className="text-[11px] text-center text-[var(--color-muted)]">Free delivery · Free setup · Cancel anytime</p>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

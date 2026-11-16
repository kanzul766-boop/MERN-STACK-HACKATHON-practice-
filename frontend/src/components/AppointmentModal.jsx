import { useEffect, useState } from "react";
import { CalendarDays, Clock3, X } from "lucide-react";
import { api, jsonBody } from "../api.js";

export default function AppointmentModal({ doctor, onClose, onBooked, notify }) {
  const [availability, setAvailability] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/doctors/${doctor.id}/availability`)
      .then((result) => setAvailability(result.availability))
      .catch((requestError) => setError(requestError.message));
  }, [doctor.id]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await api("/appointments", {
        method: "POST",
        body: jsonBody({ doctorId: doctor.id, date, time, reason }),
      });
      notify(result.notificationWarning || "Appointment request sent to your doctor.", result.notificationWarning ? "error" : "success");
      onBooked();
      onClose();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close"><X size={19} /></button>
        <div className="modal-doctor">
          <img src={doctor.image} alt="" />
          <div><span className="eyebrow">YOUR VISIT</span><h2 id="booking-title">Book with {doctor.name}</h2><p>{doctor.specialization}</p></div>
        </div>
        {availability ? (
          <>
            <div className="availability-banner"><CalendarDays size={17} /><span>{availability.availableDays.join(" · ")} <b>{availability.startTime}–{availability.endTime}</b></span></div>
            <form className="modal-form" onSubmit={submit}>
              <label className="field-label">Choose a date<input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required /></label>
              <label className="field-label">Preferred time<input type="time" min={availability.startTime} max={availability.endTime} value={time} onChange={(e) => setTime(e.target.value)} required /></label>
              <label className="field-label">What would you like help with?<textarea rows="3" maxLength="500" placeholder="Share a little about your visit..." value={reason} onChange={(e) => setReason(e.target.value)} required /></label>
              {error && <div className="form-alert">{error}</div>}
              <button className="button button-primary full-button" disabled={busy}>{busy ? <span className="spinner" /> : <><Clock3 size={16} /> Request appointment</>}</button>
            </form>
          </>
        ) : error ? <div className="modal-error">{error}</div> : <div className="modal-loading"><span className="spinner" /> Checking availability…</div>}
      </section>
    </div>
  );
}

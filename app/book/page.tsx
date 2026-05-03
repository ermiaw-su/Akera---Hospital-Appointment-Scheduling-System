"use client";

import { useState, useEffect } from "react";
import styles from "./book.module.css";

export default function BookAppointment() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [poli, setPoli] = useState<any[]>([]);
  const [doctor, setDoctor] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [form, setForm] = useState({
    hospitalId: "",
    hospitalName: "",
    poliId: "",
    poliName: "",
    doctorId: "",
    doctorName: "",
    date: "",
    time: "",
    reason: "",
  });

// Fetch hospital
useEffect(() => {
  fetch("/api/hospitals/get")
    .then(res => res.json())
    .then(data => setHospitals(data.hospitals));
}, []);

// Fetch poli by hospital
useEffect(() => {
  // Check hospitalId
  if (!form.hospitalId) return;

  fetch(`/api/poli/get?hospitalId=${form.hospitalId}`)
    .then(res => res.json())
    .then(data => setPoli(data.poli));
}, [form.hospitalId]);

// Fetch doctors by poli
useEffect(() => {
  // Check poliId
  if (!form.poliId) return;

  fetch(`/api/doctors/get?poliId=${form.poliId}`)
    .then(res => res.json())
    .then(data => setDoctor(data.doctor));
}, [form.poliId]);

  // Handle autocomplete
  const handleHospitalChange = (value: string) => {
    setForm({ ...form, hospitalName: value });

    if (!value) {
      setSuggestions([]);
      return;
    }

    // Filter hospitals
    const filteredHospitals = hospitals
      .filter((h) =>
        h.hospitalName.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // limit suggestion
    
    setSuggestions(filteredHospitals);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("./api/appointments/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Appointment booked successfully");
      window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Book Hospital Appointment</h1>

      <form onSubmit={handleSubmit}>

        <div className={styles.formGrid}>

          {/* OUTLINED INPUT */}
          <div className={styles.group}>
            <label className={styles.label}>Hospital Name</label>
            <input
              className={`${styles.input} ${styles.outlined}`}
              value={form.hospitalName}
              onChange={(e) => handleHospitalChange(e.target.value)}
            />

            <div className={styles.suggestionBox}>
              {suggestions.map((h) => (
                <div
                  key={h._id}
                  className={styles.suggestionItem}
                  onClick={() => {
                    setForm({
                      ...form,
                      hospitalName: h.hospitalName,
                      hospitalId: h._id,
                      poliId: "",
                      doctorId: ""
                    });
                    setSuggestions([]);
                  }}
                >
                  {h.hospitalName}
                </div>
              ))}
            </div>
          </div>

          {/* SELECT */}
          <div className={styles.group}>
            <label className={styles.label}>Poli</label>
            <select
              className={styles.select}
              disabled={!form.hospitalId}
              value={form.poliId}
              onChange={(e) =>
                setForm({ ...form, poliId: e.target.value, doctorId: "" })
              }
            >
              <option value="">Select Poli</option>
              {poli.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.poliName}
                </option>
              ))}
            </select>
          </div>

          {/* SELECT */}
          <div className={styles.group}>
            <label className={styles.label}>Doctor</label>
            <select
              className={styles.select}
              disabled={!form.poliId}
              value={form.doctorId}
              onChange={(e) =>
                setForm({ ...form, doctorId: e.target.value })
              }
            >
              <option value="">Select Doctor</option>
              {doctor.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.doctorName}
                </option>
              ))}
            </select>
          </div>

          {/* DATE */}
          <div className={styles.group}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.input}
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          {/* TIME */}
          <div className={styles.group}>
            <label className={styles.label}>Time</label>
            <input
              type="time"
              className={styles.input}
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
            />
          </div>

          {/* MULTILINE */}
          <div className={styles.group}>
            <label className={styles.label}>Reason</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
            />
          </div>
        </div>

        <button className={styles.button}>
          Book Appointment
        </button>

      </form>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

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
    <div style={{ padding: "40px" }}>
      <h1>Book Hospital Appointment</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        
        <div style={{ position: "relative", marginBottom: "15px" }}>
          <input
            placeholder="Hospital Name"
            value={form.hospitalName}
            onChange={(e) => handleHospitalChange(e.target.value)}
          />

          {suggestions.map((h) => (
            <div
              key={h._id}
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

        <select
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

        <select
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

        {/* Date */}
        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          style={{ marginBottom: "15px", width: "100%", padding: "8px" }}
        />

        {/* Time */}
        <input
          type="time"
          value={form.time}
          onChange={(e) =>
            setForm({ ...form, time: e.target.value })
          }
          style={{ marginBottom: "15px", width: "100%", padding: "8px" }}
        />

        {/* Reason */}
        <input
          placeholder="Reason for visit"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
          style={{ marginBottom: "15px", width: "100%", padding: "8px" }}
        />

        <button style={{ marginTop: "20px" }}>
          Book Appointment
        </button>
      </form>
    </div>
  );
}
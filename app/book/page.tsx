"use client";

import { useState, useEffect } from "react";

export default function BookAppointment() {
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [form, setForm] = useState({
    hospitalName: "",
    poliName: "",
    doctorName: "",
    date: "",
    time: "",
    reason: "",
  });

  //Fetch hospitals from API
  useEffect(() => {
    fetch("/api/hospitals/get")
        .then((res) => res.json())
        .then((data) => {
        const names = data.hospitals.map((h: any) => h.hospitalName);
        setHospitals(names);
        });
    }, []);

  // Handle autocomplete
  const handleHospitalChange = (value: string) => {
    setForm({ ...form, hospitalName: value });

    if (!value) {
      setSuggestions([]);
      return;
    }

    const filtered = hospitals
      .filter((h) =>
        h.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5); // limit suggestion

    setSuggestions(filtered);
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
            style={{ width: "100%", padding: "8px" }}
          />

          {suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "40px",
                width: "100%",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                zIndex: 10,
              }}
            >
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setForm({ ...form, hospitalName: item });
                    setSuggestions([]);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doctor */}
        <input
          placeholder="Doctor Name"
          value={form.doctorName}
          onChange={(e) =>
            setForm({ ...form, doctorName: e.target.value })
          }
          style={{ marginBottom: "15px", width: "100%", padding: "8px" }}
        />

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
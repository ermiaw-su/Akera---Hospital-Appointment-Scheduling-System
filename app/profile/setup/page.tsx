"use client";

import { useState } from "react";

export default function profileSetup() {
    const[form, setForm] = useState({
        fullName: "",
        phone: "",
        gender: "",
        birthDate: "",
        address: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const res = await fetch("/api/profile/setup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            window.location.href = "../login";
        } else {
            alert(data.error);
        }
    };

    return (
      <div style={{ padding: "40px" }}>
        <h1>Complete Your Profile</h1>

        <form onSubmit={handleSubmit} style={{ marginTop: "30px" }}>
          <div style={{ marginBottom: "15px" }}>
            <input
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">-- Select Gender --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <button style={{ marginTop: "20px" }}>
            Save Profile
          </button>
        </form>
      </div>
    );

}
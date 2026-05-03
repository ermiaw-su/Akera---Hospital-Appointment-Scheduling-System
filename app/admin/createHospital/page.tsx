"use client"

import { useState } from "react"
import styles from "./createHospital.module.css";

export default function CreateHospital() {

  const [form, setForm] = useState({
    hospitalName: "",
    address: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/hospitals/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if(res.ok) {
      alert("Hospital created successfully");
    } else {
      alert(data.error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Hospital</h1>

        <form onSubmit={handleSubmit} className={styles.form}>

          <input
            className={styles.input}
            placeholder="Hospital Name"
            value={form.hospitalName}
            onChange={(e) =>
              setForm({ ...form, hospitalName: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            className={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <button className={styles.button}>
            Create Hospital
          </button>

        </form>
      </div>
    </div>
  );
}
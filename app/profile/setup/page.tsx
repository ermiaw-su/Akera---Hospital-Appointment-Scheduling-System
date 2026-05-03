"use client";

import { useState } from "react";
import styles from "./profileSetup.module.css";

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
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Complete Your Profile</h1>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid}>

              <div className={styles.group}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              <div className={styles.group}>
                <label className={styles.label}>Phone</label>
                <input
                  className={styles.input}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              <div className={styles.group}>
                <label className={styles.label}>Gender</label>
                <select
                  className={styles.input}
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value })
                  }
                >
                  <option value="">-- Select Gender --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className={styles.group}>
                <label className={styles.label}>Birth Date</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.birthDate}
                  onChange={(e) =>
                    setForm({ ...form, birthDate: e.target.value })
                  }
                />
              </div>

              <div className={`${styles.group} ${styles.full}`}>
                <label className={styles.label}>Address</label>
                <input
                  className={styles.input}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>

            </div>

            <button className={styles.button}>
              Save Profile
            </button>
          </form>
        </div>
      </div>
    );
}
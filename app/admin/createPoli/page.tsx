"use client"

import {useState, useEffect} from "react"
import styles from "./createPoli.module.css";
import jwt from "jsonwebtoken";

export default function createPoli() {
    const [form, setForm] = useState({
        hospitalId: "",
        poliName: "",
        poliCode: ""
    });
    const [hospitals, setHospitals] = useState<any[]>([]);

    //Fetch hospital from APi
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        const decoded: any = jwt.decode(token);

        if (!decoded || decoded.role !== "admin") {
            window.location.href = "/login";
            return;
        }
        
        const fetchHospitals = async () => {
            const res = await fetch("/api/hospitals/get");
            const data = await res.json();
            setHospitals(data.hospitals);
        };

        fetchHospitals();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.hospitalId || !form.poliName || !form.poliCode) {
            alert("Please fill all the fields");
            return;
        }

        const token = localStorage.getItem("token");

        const res = await fetch("/api/poli/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if(res.ok) {
            alert("Poli created successfully");
        } else {
            alert(data.error);
        }

    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
            <h1 className={styles.title}>Create Poli</h1>

            <form onSubmit={handleSubmit} className={styles.form}>

                <select
                className={styles.select}
                value={form.hospitalId}
                onChange={(e) =>
                    setForm({ ...form, hospitalId: e.target.value })
                }
                >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                    <option key={h._id} value={h._id}>
                    {h.hospitalName}
                    </option>
                ))}
                </select>

                <input
                className={styles.input}
                placeholder="Poli Name"
                value={form.poliName}
                onChange={(e) =>
                    setForm({ ...form, poliName: e.target.value })
                }
                />

                <input
                className={styles.input}
                placeholder="Poli Code"
                value={form.poliCode}
                onChange={(e) =>
                    setForm({ ...form, poliCode: e.target.value })
                }
                />

                <button className={styles.button}>
                Create Poli
                </button>

            </form>
            </div>
        </div>
        );
}
"use client"

import {useState, useEffect} from "react"
import styles from "./createDoctor.module.css";
import jwt from "jsonwebtoken";

export default function createDoctor() {
    const [form, setForm] = useState({
        hospitalId: "",
        poliId: "",
        doctorName: "",
        specialization: "",
        username: "",
        password: ""
    });

    const [hospitals, setHospitals] = useState<any[]>([]);
    const [poli, setPoli] = useState<any[]>([]);

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

    //Fetch poli from API
    useEffect(() => {
        if (!form.hospitalId) return;

        console.log(form.hospitalId);

        const fetchPoli = async () => {
            const res = await fetch(`/api/poli/get?hospitalId=${form.hospitalId}`);
            const data = await res.json();

            console.log("Poli data:", data);
            setPoli(data.poli);
        };

        fetchPoli();
    }, [form.hospitalId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const res = await fetch("/api/doctors/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (!form.poliId || !form.doctorName || !form.specialization || !form.username || !form.password) {
            alert("Please fill all the fields");
            return;
        }

        if(res.ok) {
            alert("Doctor created successfully");

            setForm({
                hospitalId: "",
                poliId: "",
                doctorName: "",
                specialization: "",
                username: "",
                password: ""
            });

            setPoli([]);
        } else {
            alert(data.error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
            <h1 className={styles.title}>Create Doctor</h1>

            <form onSubmit={handleSubmit} className={styles.form}>

                <select
                className={styles.select}
                value={form.hospitalId}
                onChange={(e) =>
                    setForm({ ...form, hospitalId: e.target.value, poliId: "" })
                }
                >
                <option value="">Select Hospital</option>
                {hospitals.map((h) => (
                    <option key={h._id} value={h._id.toString()}>
                    {h.hospitalName}
                    </option>
                ))}
                </select>

                <select
                className={styles.select}
                disabled={!form.hospitalId}
                value={form.poliId}
                onChange={(e) =>
                    setForm({ ...form, poliId: e.target.value })
                }
                >
                <option value="">Select Poli</option>
                {Array.isArray(poli) &&
                    poli.map((p) => (
                    <option key={p._id} value={p._id.toString()}>
                        {p.poliName}
                    </option>
                    ))}
                </select>

                <input
                className={styles.input}
                placeholder="Doctor Name"
                value={form.doctorName}
                onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                }
                />

                <input
                className={styles.input}
                placeholder="Specialization"
                value={form.specialization}
                onChange={(e) =>
                    setForm({ ...form, specialization: e.target.value })
                }
                />

                <input
                className={styles.input}
                placeholder="Username"
                value={form.username}
                onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                }
                />

                <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                }
                />

                <button className={styles.button}>
                Create Doctor
                </button>

            </form>
            </div>
        </div>
        );
}
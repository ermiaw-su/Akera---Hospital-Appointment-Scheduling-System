"use client"

import { useEffect, useState } from "react";
import {useSearchParams} from "next/navigation";
import styles from "./patientDetails.module.css";
import jwt from "jsonwebtoken";

export default function PatientDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [data, setData] = useState<any>(null);

    const [diagnosis, setDiagnosis] = useState("");
    const [medicine, setMedicine] = useState("");
    const [dosage, setDosage] = useState("");   

    const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        const res = await fetch(`/api/doctors/getAppointment?id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the request was successful
        if (!res.ok) {
            console.error("Failed to fetch data");
            return;
        }

        const data = await res.json();
        setData({...data.appointment, diagnoses: data.diagnoses, medicines: data.medicines});

        console.log(data);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        const decoded: any = jwt.decode(token);

        if (!decoded || decoded.role !== "doctor") {
            window.location.href = "/login";
            return;
        }

        // Check if id is defined
        if (!id) {
            return;
        }

        fetchData();

    }, [id]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const handleAddDiagnosis = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        await fetch("/api/doctors/addDiagnosis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: id,
                description: diagnosis,
            }),
        });

        setDiagnosis("");
        fetchData();
    };

    const handleAddMedicine = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        await fetch("/api/doctors/addMedicine", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: id,
                medicine: medicine,
                dosage: dosage,
            }),
        });

        setMedicine("");
        setDosage("");
        fetchData();
    }

    const handleFinish = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        await fetch("/api/doctors/finishAppointment", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                appointmentId: id,
            }),
        });

        window.location.href = "/doctor";
    }

    return (
    <div className={styles.container}>

        <h1 className={styles.title}>Patient Details</h1>

        {/* INFO */}
        <div className={styles.card}>
        <div className={styles.sectionTitle}>Patient Info</div>
        <p className={styles.info}>Name: {data.username}</p>
        <p className={styles.info}>Hospital: {data.hospitalName}</p>
        <p className={styles.info}>
            Date: {new Date(data.date).toLocaleString()}
        </p>
        <p className={styles.info}>Reason: {data.reason}</p>
        </div>

        {/* DIAGNOSIS */}
        <div className={styles.card}>
        <div className={styles.sectionTitle}>Add Diagnosis</div>

        <div className={styles.formRow}>
            <input
            className={styles.input}
            placeholder="Diagnosis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            />

            <button
            className={styles.button}
            onClick={handleAddDiagnosis}
            >
            Add
            </button>
        </div>

        <div className={styles.list}>
            {data.diagnoses?.map((d: any) => (
            <div key={d._id} className={styles.listItem}>
                {d.description}
            </div>
            ))}
        </div>
        </div>

        {/* MEDICINE */}
        <div className={styles.card}>
        <div className={styles.sectionTitle}>Add Medicine</div>

        <div className={styles.formRow}>
            <input
            className={styles.input}
            placeholder="Medicine"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            />

            <input
            className={styles.input}
            placeholder="Dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            />

            <button
            className={styles.button}
            onClick={handleAddMedicine}
            >
            Add
            </button>
        </div>

        <div className={styles.list}>
            {data.medicines?.map((m: any) => (
            <div key={m._id} className={styles.listItem}>
                {m.medicine} - {m.dosage}
            </div>
            ))}
        </div>
        </div>

        {/* FINISH */}
        <button
        className={styles.finish}
        onClick={handleFinish}
        disabled={
            data.diagnoses?.length === 0 ||
            data.medicines?.length === 0
        }
        >
        Finish Appointment
        </button>

    </div>
    );
}
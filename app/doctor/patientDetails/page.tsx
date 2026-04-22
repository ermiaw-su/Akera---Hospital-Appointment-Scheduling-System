"use client"

import { useEffect, useState } from "react";
import {useParams} from "next/navigation";

export default function PatientDetails() {
    const params = useParams();
    const id = params.id;
    
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

        const res = await fetch(`/api/doctors/appointmentDetails/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        setData(data);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
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

    return (
        <div style={{padding:"40px"}}>
            <h1>Patient Details</h1>

            <h3>Patient Info</h3>
            <p>Name: {data.patientName}</p>
            <p>Hospital: {data.hospitalName}</p>
            <p>Date: {new Date(data.date).toLocaleString()}</p>
            <p>Reason: {data.reason}</p>

            <h3>Add Diagnosis</h3>
            <input 
                placeholder="Diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
            />

            <button onClick={handleAddDiagnosis}>
                Add Diagnosis
            </button>

            <h3>Add Medicine</h3>
            <input 
                placeholder="Medicine Name"
                value={medicine}
                onChange={(e) => setMedicine(e.target.value)}
            />

            <input 
                placeholder="Dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
            />

            <button onClick={handleAddMedicine}>
                Add Medicine
            </button>

            <h3>Diagnoses</h3>
                <ul>
                    {data.diagnoses?.map((d: any) => (
                        <li key={d._id}>{d.description}</li>
                    ))}
                </ul>

            <h3>Medicines</h3>
                <ul>
                    {data.medicines?.map((m: any) => (
                        <li key={m._id}>
                            {m.medicine} - {m.dosage}
                        </li>
                    ))}
                </ul>
        </div>
    )
}
"use client"

import {useState, useEffect} from "react"

export default function createDoctor() {
    const [form, setForm] = useState({
        hospitalId: "",
        poliId: "",
        doctorName: "",
        specialization: ""
    });

    const [hospitals, setHospitals] = useState<any[]>([]);
    const [poli, setPoli] = useState<any[]>([]);

    //Fetch hospital from APi
    useEffect(() => {
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

        if(res.ok) {
            alert("Doctor created successfully");
        } else {
            alert(data.error);
        }
    };

    return (
        <div style={{padding:"40px"}}>
            <h1>Create Doctor</h1>

            <form onSubmit={handleSubmit} style={{marginTop:"20px"}}>

                <select
                        value={form.hospitalId}
                        onChange={(e) => setForm({ ...form, hospitalId: e.target.value, poliId: "" })}
                    >
                        <option value="">Select Hospital</option>

                        {hospitals.map((h) => (
                            <option key={h._id} value={h._id.toString()}>
                                {h.hospitalName}
                            </option>
                        ))}
                    </select>

                <select
                        disabled={!form.hospitalId}
                        value={form.poliId}
                        onChange={(e) => {
                            setForm({ ...form, poliId: e.target.value });
                        }}
                    >
                        <option value="">Select Poli</option>

                        {Array.isArray(poli) && poli.map((p) => (
                            <option key={p._id} value={p._id.toString()}>
                                {p.poliName}
                            </option>
                        ))}
                    </select>

                <input
                placeholder="Doctor Name"
                onChange={(e)=>setForm({...form,doctorName:e.target.value})}
                />

                <input
                placeholder="Specialization"
                onChange={(e)=>setForm({...form,specialization:e.target.value})}
                />

                <button style={{marginTop:"20px"}}>
                Create Doctor
                </button>

            </form>
        </div>
    )
}
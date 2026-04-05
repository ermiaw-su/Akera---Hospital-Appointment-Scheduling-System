"use client"

import {useState, useEffect} from "react"

export default function createDoctor() {
    const [form, setForm] = useState({
        poliId: "",
        doctorName: "",
        specialization: ""
    });

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

                <input
                placeholder="Poli ID"
                onChange={(e)=>setForm({...form,poliId:e.target.value})}
                />

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
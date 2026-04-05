"use client"

import {useState} from "react"

export default function createPoli() {
    const [form, setForm] = useState({
        hospitalId: "",
        poliName: "",
        poliCode: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
        <div style={{padding:"40px"}}>
            <h1>Create Poli</h1>

            <form onSubmit={handleSubmit} style={{marginTop:"20px"}}>

                <input
                placeholder="Hospital ID"
                onChange={(e)=>setForm({...form,hospitalId:e.target.value})}
                />

                <input
                placeholder="Poli Name"
                onChange={(e)=>setForm({...form,poliName:e.target.value})}
                />

                <input
                placeholder="Poli Code"
                onChange={(e)=>setForm({...form,poliCode:e.target.value})}
                />

                <button style={{marginTop:"20px"}}>
                Create Poli
                </button>

            </form>
        </div>
    )
}
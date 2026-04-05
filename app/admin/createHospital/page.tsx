"use client"

import { useState } from "react"

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
        <div style={{padding:"40px"}}>
            <h1>Create Hospital</h1>

            <form onSubmit={handleSubmit} style={{marginTop:"20px"}}>

                <input
                placeholder="Hospital Name"
                onChange={(e)=>setForm({...form,hospitalName:e.target.value})}
                />

                <input
                placeholder="Address"
                onChange={(e)=>setForm({...form,address:e.target.value})}
                />

                <input
                placeholder="Phone"
                onChange={(e)=>setForm({...form,phone:e.target.value})}
                />

                <button style={{marginTop:"20px"}}>
                Create Hospital
                </button>

            </form>
        </div>
    )
}
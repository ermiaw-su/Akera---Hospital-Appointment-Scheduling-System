"use client"

import {useState, useEffect} from "react"

export default function createPoli() {
    const [form, setForm] = useState({
        hospitalId: "",
        poliName: "",
        poliCode: ""
    });
    const [hospitals, setHospitals] = useState<any[]>([]);

    //Fetch hospital from APi
    useEffect(() => {
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
        <div style={{padding:"40px"}}>
            <h1>Create Poli</h1>

            <form onSubmit={handleSubmit} style={{marginTop:"20px"}}>

                <select
                        onChange={(e) => setForm({ ...form, hospitalId: e.target.value })}
                    >
                        <option value="">Select Hospital</option>

                        {hospitals.map((h) => (
                            <option key={h._id} value={h._id}>
                                {h.hospitalName}
                            </option>
                        ))}
                    </select>

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
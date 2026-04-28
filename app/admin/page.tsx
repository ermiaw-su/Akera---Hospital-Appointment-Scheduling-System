"use client";

import jwt from "jsonwebtoken";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function AdminDashoard() {

    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check the token
        const token = localStorage.getItem("token");

        // If token not found, redirect to login
        if (!token) {
            router.push("/login");
            return
        }

        // Decode the token
        const decoded: any = jwt.decode(token)

        // If token invalid, redirect to login
        if (!decoded || decoded.role !== "admin") {
            window.location.href = "/login";
            return
        }

        setAuthorized(true);
    }, []);

    // Set loading
    if (!authorized) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <button
                onClick={() => router.push("/admin/createHospital")}
            >
                Add Hospital
            </button>

            <button
                onClick={() => router.push("/admin/createPoli")}
            >
                Add Poli
            </button>

            <button
                onClick={() => router.push("/admin/createDoctor")}
            >
                Add Doctor
            </button>
        </div>
    )
}
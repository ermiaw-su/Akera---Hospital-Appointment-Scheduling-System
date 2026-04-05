"use client"

import {useEffect, useState} from "react";
import jwt from "jsonwebtoken";

export default function Dashboard(){
    //Perwakilan data dari database
    const [stats, setStats] = useState<any>(null);
    const [role, setRole] = useState("");

    useEffect(() => {

        //Check the token
        const token = localStorage.getItem("token");

        //If token not found, redirect to login
        if(!token){
            window.location.href="/login";
            return
        }

        //Decode the token
        const decoded:any = jwt.decode(token)

        //If token invalid, redirect to login
        if(!decoded){
            window.location.href="/login";
            return
        }

        //Set the role
        setRole(decoded.role);

        fetch("/api/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then((res) => res.json())
        .then((data) => setStats(data));
    }, []);

    //Just to make the user know it still processing
    if(!stats){
        return <p>Loading...</p>
    }

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>Dashboard</h1>

            {/* ==== STATS SECTION ==== */}
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                marginTop: "30px",
                }}
            >
                <div style={cardStyle}>
                <h3>Total Visits</h3>
                <p>{stats.totalVisits}</p>
                </div>

                <div style={cardStyle}>
                <h3>Total Diagnoses</h3>
                <p>{stats.totalDiagnoses}</p>
                </div>

                <div style={cardStyle}>
                <h3>Last Hospital</h3>
                <p>{stats.lastHospital}</p>
                </div>

                <div style={cardStyle}>
                <h3>Upcoming Appointment</h3>
                <p>{stats.upcomingAppointment}</p>
                </div>
            </div>

            {/* ==== ACTION BUTTONS ==== */}
            <div
                style={{
                marginTop: "50px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                }}
            >
                <button
                style={buttonStyle}
                onClick={() => (window.location.href = "/profile")}
                >
                👤 View User Detail
                </button>

                <button
                style={buttonStyle}
                onClick={() => (window.location.href = "/book")}
                >
                🏥 Book Hospital Appointment
                </button>

                <button
                style={buttonStyle}
                onClick={() => (window.location.href = "/visit-history")}
                >
                📜 Visit History
                </button>

                {/* Admin Features */}
                {role === "admin" && (
                    <>
                    <button
                    style={buttonStyle}
                    onClick={() => (window.location.href = "/admin/createHospital")}
                    >
                    🏥 Create Hospital
                    </button>
                    <button
                    style={buttonStyle}
                    onClick={() => (window.location.href = "/admin/createDoctor")}
                    >
                    👨 Create Doctor
                    </button>
                    <button
                    style={buttonStyle}
                    onClick={() => (window.location.href = "/admin/createPoli")}
                    >
                    🏥 Create Poli
                    </button>
                    </>
                )}
            </div>
            </div>
    );
}

const cardStyle: React.CSSProperties = {
  background: "#f4f6f9",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#0070f3",
  color: "white",
  fontWeight: "bold",
};
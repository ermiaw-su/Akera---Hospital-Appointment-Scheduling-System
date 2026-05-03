"use client"

import {useEffect, useState} from "react";
import jwt from "jsonwebtoken";
import styles from "./dashboard.module.css";

export default function Dashboard(){
    const [stats, setStats] = useState<any>(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if(!token){
            window.location.href="/login";
            return
        }

        const decoded:any = jwt.decode(token)

        if(!decoded){
            window.location.href="/login";
            return
        }

        setRole(decoded.role);

        fetch("/api/dashboard", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
        .then((res) => res.json())
        .then((data) => setStats(data));
    }, []);

    if(!stats){
        return <p>Loading...</p>
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className={styles.container}>
            
            {/* HEADER */}
            <div className={styles.header}>
                <h1>Dashboard</h1>
                <div className={styles.username}>
                    {stats.username} 👤
                </div>
            </div>

            {/* STATS */}
            <div className={styles.statsGrid}>
                <div className={styles.card}>
                    <h3>Total Visits</h3>
                    <p>{stats.totalVisits}</p>
                </div>

                <div className={styles.card}>
                    <h3>Total Diagnoses</h3>
                    <p>{stats.totalDiagnoses}</p>
                </div>

                <div className={styles.card}>
                    <h3>Last Hospital</h3>
                    <p>{stats.lastHospital}</p>
                </div>

                <div className={styles.card}>
                    <h3>Upcoming Appointment</h3>
                    <p>
                        {stats.upcomingAppointment?.date
                            ? new Date(stats.upcomingAppointment.date).toLocaleDateString()
                            : "None"}
                    </p>
                </div>
            </div>

            {/* MAIN */}
            <div className={styles.mainSection}>
                
                {/* LEFT DETAIL */}
                <div className={styles.left}>
                    <div className={styles.detailTitle}>
                        Upcoming Appointment Detail
                    </div>

                    {stats.upcomingAppointment ? (
                        <>
                            <div className={styles.detailItem}>
                                Hospital: {stats.upcomingAppointment.hospitalName}
                            </div>

                            <div className={styles.detailItem}>
                                Poli: {stats.upcomingAppointment.poliName}
                            </div>

                            <div className={styles.detailItem}>
                                Doctor: {stats.upcomingAppointment.doctorName}
                            </div>

                            <div className={styles.detailItem}>
                                Date: {new Date(stats.upcomingAppointment.date).toLocaleDateString()}
                            </div>

                            <div className={styles.detailItem}>
                                Time: {stats.upcomingAppointment.time}
                            </div>
                        </>
                    ) : (
                        <div className={styles.detailItem}>
                            No upcoming appointment
                        </div>
                    )}
                </div>

                {/* RIGHT BUTTONS */}
                <div className={styles.right}>
                    
                    <button
                        className={styles.button}
                        onClick={() => (window.location.href = "/profile")}
                    >
                        👤 View User Detail
                    </button>

                    <button
                        className={styles.button}
                        onClick={() => (window.location.href = "/book")}
                    >
                        🏥 Book Appointment
                    </button>

                    <button
                        className={styles.button}
                        onClick={() => (window.location.href = "/visit-history")}
                    >
                        📜 Visit History
                    </button>

                    <button
                        className={styles.button}
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                    {/* ADMIN */}
                    {role === "admin" && (
                        <>
                            <button
                                className={`${styles.button} ${styles.admin}`}
                                onClick={() => (window.location.href = "/admin/createHospital")}
                            >
                                🏥 Create Hospital
                            </button>

                            <button
                                className={`${styles.button} ${styles.admin}`}
                                onClick={() => (window.location.href = "/admin/createDoctor")}
                            >
                                👨 Create Doctor
                            </button>

                            <button
                                className={`${styles.button} ${styles.admin}`}
                                onClick={() => (window.location.href = "/admin/createPoli")}
                            >
                                🏥 Create Poli
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client"

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";
import styles from "./doctor.module.css";

export default function DoctorPage() {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [username, setUsername] = useState("");

    const router = useRouter();

    const fetchAppointments = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        let url = "/api/doctors/getAppointments";

        // Check if a date is selected
        if (selectedDate) {
            url += `?date=${selectedDate}`
        }

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        const data = await res.json();

        if (data.error) {
            console.log(data.error);
            setAppointments([]);
        } else {
            setAppointments(data.appointments || []);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        const decoded: any = jwt.decode(token);
        setUsername(decoded?.username || "Doctor");

        fetchAppointments();
    }, [selectedDate]);

      return (
        <div className={styles.container}>

            {/* HEADER */}
            <div className={styles.header}>
            
            {/* LEFT */}
            <h1 className={styles.title}>Doctor Appointment</h1>

            {/* RIGHT */}
            <div className={styles.headerRight}>
                
                <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.filter}
                />

                <div className={styles.userBox}>
                👤 {username}
                </div>

                <button
                className={styles.logout}
                onClick={handleLogout}
                >
                Logout
                </button>

            </div>
            </div>

            {/* EMPTY */}
            {appointments.length === 0 ? (
            <p className={styles.empty}>No appointments found</p>
            ) : (

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {appointments.map((a) => (
                    <tr key={a._id}>
                        <td>{a.username}</td>
                        <td>{new Date(a.date).toLocaleDateString()}</td>

                        <td>
                        <span
                            className={`${styles.status} ${
                            a.status === "finished"
                                ? styles.finished
                                : styles.scheduled
                            }`}
                        >
                            {a.status}
                        </span>
                        </td>

                        <td>
                        <button
                            className={styles.button}
                            onClick={() =>
                            router.push(`/doctor/patientDetails?id=${a._id}`)
                            }
                        >
                            Select
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            )}
        </div>
        );
}
"use client"

import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/navigation";

export default function DoctorPage() {
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState("");

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

    useEffect(() => {
        fetchAppointments();
    }, [selectedDate]);

      return (
        <div style={{ padding: "40px" }}>
            <h1>Doctor Appointment</h1>

            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ marginBottom: "20px" }}
            />

            {appointments.length === 0 ? (
                <p>No appointments found</p>
            ) : (
                <table border={1} cellPadding={10}>
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
                                <td>{a.patientName}</td>
                                <td>{new Date(a.date).toLocaleDateString()}</td>
                                <td>{a.status}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            router.push(`/doctor/patientDetails/${a._id}`)
                                        }
                                    >
                                        Select
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";

type Visit = {
  hospitalName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
};

export default function VisitHistory() {

  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch("/api/appoinments/history", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setVisits(data.visits);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Visit History</h1>

      {visits.length === 0 && (
        <p>No visit history yet.</p>
      )}

      {visits.map((visit, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "8px"
          }}
        >
          <h3>{visit.hospitalName}</h3>
          <p><b>Doctor:</b> {visit.doctorName}</p>
          <p><b>Date:</b> {visit.date}</p>
          <p><b>Time:</b> {visit.time}</p>
          <p><b>Reason:</b> {visit.reason}</p>
          <p><b>Status:</b> {visit.status}</p>
        </div>
      ))}

    </div>
  );
}
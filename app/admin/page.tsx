"use client";

import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css";

export default function AdminDashoard() {

    const [authorized, setAuthorized] = useState(false);
    const [username, setUsername] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const decoded: any = jwt.decode(token);

        if (!decoded || decoded.role !== "admin") {
            window.location.href = "/login";
            return;
        }

        setUsername(decoded?.username || "Admin");
        setAuthorized(true);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    if (!authorized) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>

            {/* HEADER */}
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Dashboard</h1>

                <div className={styles.userBox}>
                    <div className={styles.username}>
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

            {/* ACTION CARDS */}
            <div className={styles.grid}>

                <div
                    className={styles.card}
                    onClick={() => router.push("/admin/createHospital")}
                >
                    <div className={styles.cardIcon}>🏥</div>
                    <div className={styles.cardTitle}>Add Hospital</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => router.push("/admin/createPoli")}
                >
                    <div className={styles.cardIcon}>🩺</div>
                    <div className={styles.cardTitle}>Add Poli</div>
                </div>

                <div
                    className={styles.card}
                    onClick={() => router.push("/admin/createDoctor")}
                >
                    <div className={styles.cardIcon}>👨‍⚕️</div>
                    <div className={styles.cardTitle}>Add Doctor</div>
                </div>

            </div>
        </div>
    );
}
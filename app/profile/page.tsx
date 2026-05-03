"use client"

import { useEffect, useState } from "react";
import ProfileModal from "./updateProfile/page";
import styles from "./profile.module.css";

type UserProfile = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: string;
  createdAt: Date;
};

export default function ProfilePage() {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return
        }

        fetch("/api/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .then((data) => setUser(data));
    }, []);

    if(!user){
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>

            {/* SIDEBAR */}
            <div className={styles.sidebar}>
            <div className={styles.avatar}>
                <img src="https://i.pravatar.cc/150" alt="avatar" />
                <div className={styles.name}>{user.fullName}</div>
            </div>

            <div className={styles.menu}>
                <div className={`${styles.menuItem} ${styles.active}`}>
                ⚙ Account Settings
                </div>
                <div 
                    className={styles.menuItem}
                    onClick={() => (window.location.href = "/book")}
                    >
                    Book Appointment
                    </div>

                    <div 
                    className={styles.menuItem}
                    onClick={() => (window.location.href = "/visit-history")}
                    >
                    Book History
                    </div>

                    <div 
                    className={styles.menuItem}
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                    >
                    Sign Out
                    </div>
            </div>
            </div>

            {/* MAIN */}
            <div className={styles.main}>
            <div className={styles.title}>Account Settings</div>

            <div className={styles.formGrid}>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} value={user.fullName} readOnly />
                </div>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Username</label>
                <input className={styles.input} value={user.username} readOnly />
                </div>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input className={styles.input} value={user.email} readOnly />
                </div>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Phone</label>
                <input className={styles.input} value={user.phone} readOnly />
                </div>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Gender</label>
                <input className={styles.input} value={user.gender} readOnly />
                </div>

                <div className={styles.inputGroup}>
                <label className={styles.label}>Birth Date</label>
                <input className={styles.input} value={user.birthDate} readOnly />
                </div>

                <div className={styles.inputGroup} style={{ gridColumn: "span 2" }}>
                <label className={styles.label}>Address</label>
                <input className={styles.input} value={user.address} readOnly />
                </div>

            </div>

            <div className={styles.buttonGroup}>
                <button
                className={styles.saveButton}
                onClick={() => setShowModal(true)}
                >
                Edit Profile
                </button>
            </div>

            <ProfileModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />

            </div>
        </div>
        );
}
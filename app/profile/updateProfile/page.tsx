"use client"

import { useEffect, useState } from "react";
import styles from "./profileModal.module.css";

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

export default function ProfileModal({
    isOpen,
    onClose
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [form, setForm] = useState({
        email: "",
        fullName: "",
        phone: "",
        gender: "",
        birthDate: "",
        address: ""
    });

    console.log("USER:", user);
    console.log("ID:", user?._id);
    
    useEffect(() => {
        if (!isOpen) {
            return;
        }

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
        .then((data) => {
            setUser(data)
            // Set the form values
            setForm({
                email: data.email || "",
                fullName: data.fullName || "",
                phone: data.phone || "",
                gender: data.gender || "",
                birthDate: data.birthDate?.slice(0, 10) || "",
                address: data.address || ""
            });
        });

    }, [isOpen]);

    const handleChange = (e:any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/profile/updateProfile?id=${user?._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Profile updated successfully");
                onClose();
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update profile");
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            >
            <div className={styles.title}>Edit Profile</div>

            {!user ? (
                <p>Loading...</p>
            ) : (
                <div className={styles.form}>

                <label className={styles.label}>Full Name</label>
                <input
                    className={styles.input}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                />

                <label className={styles.label}>Phone</label>
                <input
                    className={styles.input}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <label className={styles.label}>Address</label>
                <input
                    className={styles.input}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                />

                <label className={styles.label}>Gender</label>
                <select
                    className={styles.select}
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>

                <label className={styles.label}>Birth Date</label>
                <input
                    className={styles.input}
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                />

                <label className={styles.label}>Email</label>
                <input
                    className={`${styles.input} ${styles.readonly}`}
                    type="email"
                    value={form.email}
                    readOnly
                />

                <label className={styles.label}>Username</label>
                <input
                    className={`${styles.input} ${styles.readonly}`}
                    value={user.username}
                    readOnly
                />

                <div className={styles.buttonGroup}>
                    <button
                    className={styles.save}
                    onClick={handleUpdate}
                    >
                    Save
                    </button>

                    <button
                    className={styles.cancel}
                    onClick={onClose}
                    >
                    Cancel
                    </button>
                </div>

                </div>
            )}
            </div>
        </div>
        );
}
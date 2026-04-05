"use client"

import { useEffect, useState } from "react";

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
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>User Profile</h1>

        <div
            style={{
            marginTop: "30px",
            background: "#f4f6f9",
            padding: "30px",
            borderRadius: "12px",
            maxWidth: "500px",
            }}
        >
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Birth Date:</strong> {user.birthDate}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
            <strong>Member Since:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
            </p>
        </div>
    </div>
    )
}
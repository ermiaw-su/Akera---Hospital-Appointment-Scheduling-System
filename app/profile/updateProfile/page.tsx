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
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "400px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Edit Profile</h2>

        {!user ? (
          <p>Loading...</p>
        ) : (
          <>
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
            />

            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <label>Address</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
            />

            <label>Gender</label>
            <select 
                name="gender"
                value={form.gender}
                onChange={handleChange}
            >
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>

            <label>Birth Date</label>
            <input 
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
            />

            {/* readonly fields */}
            <label>Email</label>
            <input 
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
            />
            <p><strong>Username:</strong> {user.username}</p>

            <button onClick={() => {console.log("CLIECKED"); handleUpdate();}} style={{ marginTop: "10px" }}>
              Save
            </button>

            <button onClick={onClose} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
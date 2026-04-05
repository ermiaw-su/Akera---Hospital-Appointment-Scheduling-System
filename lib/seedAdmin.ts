import bcrypt from "bcryptjs";
import {getDB} from "@/lib/mongodb";

export async function seedAdmin() {
    const db = await getDB();

    const admin = await db.collection("users").findOne({
        role: "admin"
    });

    if (!admin) {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        await db.collection("users").insertOne({
            username: "admin",
            password: hashedPassword,
            role: "admin",
            createdAt: new Date()
        });

        console.log("Admin created successfully");
    } else {
        console.log("Admin already exists");
    }
}
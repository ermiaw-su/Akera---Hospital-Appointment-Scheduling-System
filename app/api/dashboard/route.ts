import { NextResponse } from "next/server";
import {getDB} from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if(!authHeader){
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        const db = await getDB();
        const userId = new ObjectId(decoded.id);

        // Total visit
        const totalVisits = await db
        .collection("appoinments")
        .countDocuments({ userId, status: "finished" });

        // Total diagnoses
        const totalDiagnoses = await db
        .collection("diagnoses")
        .countDocuments({ userId });

        // Last visit
        const lastVisit = await db
        .collection("appoinments")
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

        // Upcoming appointment
        const upcomingAppointment = await db
        .collection("appoinments")
        .find({ userId, status: "scheduled" })
        .sort({ date: 1 })
        .limit(1)
        .toArray();

        return NextResponse.json({
            totalVisits,
            totalDiagnoses,
            lastHospital: lastVisit[0]?.hospitalName || "None",
            upcomingAppointment: upcomingAppointment[0]?.date || "None",
        });
    } catch (error) {
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        );
    }
}
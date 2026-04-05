import { NextResponse } from "next/server";
import {getDB} from "@/lib/mongodb";
import jwt from "jsonwebtoken";

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

        // Dummy logic sementara
        const totalVisits = await db
        .collection("visits")
        .countDocuments({ userId: decoded.id });

        const totalDiagnoses = await db
        .collection("diagnoses")
        .countDocuments({ userId: decoded.id });

        const lastVisit = await db
        .collection("visits")
        .find({ userId: decoded.id })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();

        return NextResponse.json({
        totalVisits,
        totalDiagnoses,
        lastHospital: lastVisit[0]?.hospitalName || "None",
        upcomingAppointment: "Not scheduled",
        });
    } catch (error) {
        return NextResponse.json(
            {error: "Unauthorized"},
            {status: 401}
        );
    }
}
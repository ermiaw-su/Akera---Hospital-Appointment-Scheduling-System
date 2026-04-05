import { NextResponse } from "next/server";
import {getDB} from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

export async function POST(request: Request){
    try {
        const authHeader = request.headers.get("authorization");

        if(!authHeader) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const token = authHeader.split(" ")[1];

        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        const body = await request.json();

        const db = await getDB();

        await db.collection("appoinments").insertOne({
            userId: new ObjectId(decoded.id),
            hospitalName: body.hospitalName,
            doctorName: body.doctorName,
            date: body.date,
            time: body.time,
            reason: body.reason,
            status: "scheduled",
            createdAt: new Date()
        });

        return NextResponse.json({
            message: "Appointment booked successfully"
        });
    } catch (error) {
        console.log("Booking Error: ", error);

        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}
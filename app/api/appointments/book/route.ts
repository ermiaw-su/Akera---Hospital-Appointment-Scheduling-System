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

        // Take IDs from the body
        const {hospitalId, poliId, doctorId} = body;

        const user = await db.collection("users").findOne({_id: new ObjectId(decoded.id)});

        if(!user) {
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            )
        }

        // Validate Hospital
        const hospital = await db.collection("hospitals").findOne({_id: new ObjectId(hospitalId)});

        if(!hospital) {
            return NextResponse.json(
                {error: "Hospital not found"},
                {status: 404}
            )
        }
        
        // Validate Poli
        const poli = await db.collection("poli").findOne({_id: new ObjectId(poliId)});

        if(!poli) {
            return NextResponse.json(
                {error: "Poli not found"},
                {status: 404}
            )
        }

        // Validate Doctor
        const doctor = await db.collection("doctors").findOne({_id: new ObjectId(doctorId)});

        if(!doctor) {
            return NextResponse.json(
                {error: "Doctor not found"},
                {status: 404}
            )
        }

        // Validate Date
        if(!body.date) {
            return NextResponse.json(
                {error: "Date is required"},
                {status: 400}
            )
        }

        const fullDate = new Date(`${body.date}T${body.time}`);

        if(fullDate <= new Date()) {
            return NextResponse.json(
                {error: "Date must be in the future"},
                {status: 400}
            )
        }

        await db.collection("appointments").insertOne({
            userId: new ObjectId(decoded.id),
            username: user.username,
            hospitalId: new ObjectId(hospitalId),
            hospitalName: hospital.hospitalName,
            poliId: new ObjectId(poliId),
            poliName: poli.poliName,
            doctorId: new ObjectId(doctorId),
            doctorName: doctor.doctorName,
            date: fullDate,
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
import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    try {
        // Take id from the params
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid appoinment ID" },
                { status: 400 }
            );
        }

        const db = await getDB();

        const appointment = await db.collection("appointments").findOne({
            _id: new ObjectId(id)
        });

        if (!appointment) {
            return NextResponse.json(
                { error: "Appointment not found" },
                { status: 404 }
            );
        }

        const diagnoses = await db.collection("diagnoses")
            .find({appointmentId: new ObjectId(id)})
            .toArray();
        
        const medicines = await db.collection("medicines")
            .find({appointmentId: new ObjectId(id)})
            .toArray();

        return NextResponse.json({
            appointment,
            diagnoses,
            medicines
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
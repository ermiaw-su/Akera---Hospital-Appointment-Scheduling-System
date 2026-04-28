import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, {params}: {params: {id:string}}) {
    try {
        const db = await getDB();

        const appointment = await db.collection("appointments")
            .findOne({ _id: new ObjectId(params.id) });

        if (!appointment) {
            return NextResponse.json(
                { error: "Appointment not found" },
                { status: 404 }
            );
        }

        const diagnoses = await db.collection("diagnoses").find({
            appointmendId: new ObjectId(params.id)
        }).toArray();

        const medicines = await db.collection("medicines").find({
            appointmendId: new ObjectId(params.id)
        }).toArray();

        return NextResponse.json({
            ... appointment,
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
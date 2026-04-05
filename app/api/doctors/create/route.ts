import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function POST(request: Request) {
    try {
        //Take the input
        const body = await request.json()

        //Ensure all inputs are filled
        if (!body.poliId || !body.doctorName) {
            return NextResponse.json(
                {error: "Poli ID and Doctor Name are required"},
                {status: 400}
            )
        }
        const poliId = new ObjectId(body.poliId)

        //Ensure all inputs are filled
        const db = await getDB()

        //Ensure poli name and poli code are unique
        const existingDoctor = await db.collection("doctors").findOne({
            poliId: poliId,
            doctorName: body.doctorName
        })

        if(existingDoctor) {
            return NextResponse.json(
                {error: "Doctor already exists"},
                {status: 400}
            )
        }

        //Insert the doctor
        const doctor = await db.collection("doctors").insertOne({
            poliId: poliId,
            doctorName: body.doctorName,
            specialization: body.specialization,
            createdAt: new Date()
        })

        return NextResponse.json({
            message: "Doctor created successfully",
            doctor
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}
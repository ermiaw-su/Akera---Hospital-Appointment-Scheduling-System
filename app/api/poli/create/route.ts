import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function POST(request: Request) {
    //Take the input
    const body = await request.json()

    //Ensure all inputs are filled
    if (!body.hospitalId || !body.poliName || !body.poliCode) {
        return NextResponse.json(
            {error: "Hospital ID, Poli Name and Poli Code are required"},
            {status: 400}
        )
    }

    const hospitalId = new ObjectId(body.hospitalId)

    //Check the database
    const db = await getDB()

    //Ensure poli name and poli code are unique
    const existingPoliName = await db.collection("poli").findOne({
        hospitalId: hospitalId,
        poliName: body.poliName
    })

    const existingPoliCode = await db.collection("poli").findOne({
        hospitalId: hospitalId,
        poliCode: body.poliCode
    })

    if (existingPoliName) {
        return NextResponse.json(
            {error: "Poli name already exists"},
            {status: 400}
        )
    }

    if (existingPoliCode) {
        return NextResponse.json(
            {error: "Poli code already exists"},
            {status: 400}
        )
    }

    const poli = await db.collection("poli").insertOne({
        hospitalId: hospitalId,
        poliName: body.poliName,
        poliCode: body.poliCode,
        totalDoctor: 0,
        createdAt: new Date()
    })

    return NextResponse.json({
        message: "Poli created successfully",
        poli
    })
}
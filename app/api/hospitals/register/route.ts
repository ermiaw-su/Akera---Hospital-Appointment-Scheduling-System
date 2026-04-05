import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body.hospitalName || !body.address || !body.phone) {
            return NextResponse.json(
                {error: "Hospital Name, Address and Phone are required"},
                {status: 400}
            )
        }

        const db = await getDB()

        const existingHospital = await db.collection("hospitals").findOne({
            hospitalName: body.hospitalName
        })

        if (existingHospital) {
            return NextResponse.json(
                {error: "Hospital already exists"},
                {status: 400}
            )
        }

        const hospital = await db.collection("hospitals").insertOne({
            hospitalName: body.hospitalName,
            address: body.address,
            phone: body.phone,
            createdAt: new Date()
        })

        return NextResponse.json({
            message: "Hospital registered successfully",
            hospital
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: "Something went wrong"}, 
            {status: 500}
        )
    }
}
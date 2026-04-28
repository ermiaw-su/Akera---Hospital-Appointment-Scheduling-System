import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        // Take poliId from the params
        const poliId = searchParams.get("poliId");

        // Validation
        if(!poliId) {
            return NextResponse.json(
                {error: "Poli ID is required"},
                {status: 400}
            );
        }

        const db = await getDB()

        const doctor = await db.collection("doctors")
            .find({
                poliId: new ObjectId(poliId)
            })
            .sort({fullName: 1})
            .toArray()

        return NextResponse.json({
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
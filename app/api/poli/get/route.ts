import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const hospitalId = searchParams.get("hospitalId");

        // Validation
        if(!hospitalId || !ObjectId.isValid(hospitalId)) {
            return NextResponse.json(
                {error: "Invalid hospital ID"},
                {status: 400}
            )
        }

        const db = await getDB()

        const poli = await db.collection("poli")
            .find({hospitalId: new ObjectId(hospitalId)})
            .sort({poliName: 1})
            .toArray()

        return NextResponse.json({
            poli
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}
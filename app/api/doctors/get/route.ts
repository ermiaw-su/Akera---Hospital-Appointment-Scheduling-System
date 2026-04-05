import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(request: Request, {params}: {params: {poliId: string}}) {
    try {
        const db = await getDB()

        const doctor = await db.collection("doctors")
            .find({
                poliId: new ObjectId(params.poliId)
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
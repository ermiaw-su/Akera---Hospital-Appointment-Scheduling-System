import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";

export async function GET(request: Request, {params}: {params: {hospitalId: string}}) {
    try {
        const db = await getDB()

        const poli = await db.collection("poli")
            .find({hospitalId: new ObjectId(params.hospitalId)})
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
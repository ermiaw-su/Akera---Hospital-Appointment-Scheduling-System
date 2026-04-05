import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";

export async function GET(request: Request) {
    try {
        const db = await getDB()

        const hospitals = await db.collection("hospitals")
            .find({})
            .sort({hospitalName: 1})
            .toArray()

        return NextResponse.json({
            hospitals
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}
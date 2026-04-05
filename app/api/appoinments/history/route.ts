import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if(!authHeader) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        const token = authHeader.split(" ")[1];

        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        const db = await getDB();

        const visits = await db
            .collection("appoinments")
            .find({userId: new ObjectId(decoded.id)})
            .sort({date: -1})
            .toArray();

        return NextResponse.json({
            visits
        });

    } catch (error) {
        console.log("Visit History Error: ", error);

        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}
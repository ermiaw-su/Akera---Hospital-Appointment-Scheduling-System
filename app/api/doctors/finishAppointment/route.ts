import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");
                
        if (!authHeader) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
                
        const token = authHeader.split(" ")[1];
                
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET!
        );

        // Get the input
        const body = await request.json(); 
        
        // Take the appointment ID
        const {appointmentId} = body;

        if (!appointmentId || !ObjectId.isValid(appointmentId)) {
            return NextResponse.json(
                { error: "Invalid appoinment ID" },
                { status: 400 }
            );
        }

        // Get the database
        const db = await getDB();

        await db.collection("appoinments").updateOne(
            {_id: new ObjectId(appointmentId)},
            {
                $set: {
                    status: "finished",
                    finishedAt: new Date()
                }
            }
        );

        return NextResponse.json({ message: "Appoinment finished" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
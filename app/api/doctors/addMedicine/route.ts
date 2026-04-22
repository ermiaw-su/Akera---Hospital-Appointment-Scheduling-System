import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
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

        const body = await request.json();

        const db = await getDB();

        await db.collection("medicines").insertOne({
            appointmentId: new ObjectId(body.appointmentId),
            medicine:  body.medicine,
            dosage: body.dosage,
            createdAt: new Date() 
        });

        return NextResponse.json({message:"Medicine added successfully"});
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}
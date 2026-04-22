import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
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

        const {searchParams} = new URL(request.url);
        const date = searchParams.get("date");

        const db = await getDB(); 
        const doctorId =  new ObjectId(decoded.id);

        let query: any = {doctorId, status: "scheduled"};

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);

            query.date = {
                $gte: start,
                $lte: end
            }
        }

        // Get appoinments
        const appointments = await db
            .collection("appoinments")
            .find(query)
            .sort({date: -1})
            .toArray();

        // Check if appoinments exist
        if (!appointments) {
            return NextResponse.json(
                { error: "You do not have any appointments" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            appointments
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
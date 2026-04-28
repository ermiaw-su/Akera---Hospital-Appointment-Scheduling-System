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

        const doctor = await db.collection("doctors").findOne({
            userId: new ObjectId(decoded.id)
        });

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        const doctorId =  doctor._id;

        let query: any = {doctorId, status: "scheduled"};

        if (date) {
            const start = new Date(date + "T00:00:00");
            const end = new Date(date + "T23:59:59.999");
            end.setHours(23, 59, 59, 999);

            query.date = {
                $gte: start,
                $lte: end
            }
        }

        // Get appointments
        const appointments = await db
            .collection("appointments")
            .find(query)
            .sort({date: -1})
            .toArray();

        // Check if appointments exist
        if (appointments.length === 0) {
            return NextResponse.json({
                appointments: []
            });
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
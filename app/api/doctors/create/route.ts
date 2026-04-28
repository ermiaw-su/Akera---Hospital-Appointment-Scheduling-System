import {NextResponse} from "next/server";
import {getDB} from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        // Get the header
        const authHeader = request.headers.get("authorization")

        if (!authHeader) {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        // Get the token
        const token = authHeader.split(" ")[1]

        // Declare decoded
        let decoded: any;

        try {
            // Verify the token
            decoded = jwt.verify(token, process.env.JWT_SECRET!);
        } catch {
            return NextResponse.json(
                {error: "Invalid token"},
                {status: 401}
            )
        }

        if (decoded.role !== "admin") {
            return NextResponse.json(
                {error: "Unauthorized"},
                {status: 401}
            )
        }

        //Take the input
        const body = await request.json()

        //Ensure all inputs are filled
        if (!body.poliId || !body.doctorName) {
            return NextResponse.json(
                {error: "Poli ID and Doctor Name are required"},
                {status: 400}
            )
        }
        const poliId = new ObjectId(body.poliId)

        //Ensure all inputs are filled
        const db = await getDB()

        // Check existing username
        const existingUser = await db.collection("users").findOne({
            username: body.username
        });

        if (existingUser) {
            return NextResponse.json(
                {error: "Username already exists"},
                {status: 400}
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(body.password, 10);

        //Insert the user
        const user = await db.collection("users").insertOne({
            username: body.username,
            password: hashedPassword,
            role: "doctor",
            createdAt: new Date()
        });

        const userId = user.insertedId

        //Ensure poli name and poli code are unique
        const existingDoctor = await db.collection("doctors").findOne({
            poliId: poliId,
            doctorName: body.doctorName
        })

        if(existingDoctor) {
            return NextResponse.json(
                {error: "Doctor already exists"},
                {status: 400}
            )
        }

        //Insert the doctor
        const doctor = await db.collection("doctors").insertOne({
            userId: userId,
            poliId: poliId,
            doctorName: body.doctorName,
            specialization: body.specialization,
            createdAt: new Date()
        })

        return NextResponse.json({
            message: "Doctor created successfully",
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
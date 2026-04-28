import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function PATCH(request: Request) {
    try {
        // Get the token
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

        // Get ID
        const {searchParams} = new URL(request.url);
        const id = searchParams.get("id");

        // Check if ID is valid
        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json(
                { error: "Invalid ID" },
                { status: 400 }
            );
        }

        // Get Database
        const db = await getDB();

        // Get the input
        const body = await request.json();

        // Declare the update data
        const updateData: any = {}

        if (body.email !== undefined) {
            updateData.email = body.email;
        }

        if (body.address !== undefined) {
            updateData.address = body.address;
        }

        if (body.birthDate !== undefined) {
            updateData.birthDate = body.birthDate;
        }

        if (body.fullName !== undefined) {
            updateData.fullName = body.fullName;
        }

        if (body.phone !== undefined) {
            updateData.phone = body.phone;
        }

        if (body.gender !== undefined) {
            updateData.gender = body.gender;
        }

        // Get the user
        const user = await db.collection("users").findOne({
            _id: new ObjectId(id)
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Update the user
        await db.collection("users").updateOne({
            _id: new ObjectId(id)
        }, {
            $set: updateData
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(error, {
            status: 500
        })
    }
}
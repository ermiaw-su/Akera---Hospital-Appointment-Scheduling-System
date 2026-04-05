import { NextResponse } from "next/server";
import { getDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export async function POST(request:Request){
  try{

    // Get token
    const authHeader = request.headers.get("authorization");

    if(!authHeader) {
      return NextResponse.json(
        {error:"Unauthorized"},
        {status:401}
      );
    }

    //Split the token
    const token = authHeader?.split(" ")[1];

    //Verify the token
    const decoded: any = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    );

    //Get the input
    const body = await request.json();

    //Get the database
    const db = await getDB();

    //Ensure all inputs are filled
    if(!body.fullName || !body.phone || !body.gender || !body.birthDate || !body.address) {
      return NextResponse.json(
        {error:"All fields are required"},
        {status:400}
      );
    }

    //Validate the fullname type
    if(typeof body.fullName !== "string") {
      return NextResponse.json(
        {error:"Invalid data type"},
        {status:400}
      );
    }

    //Validate the address type
    if (typeof body.address !== "string") {
      return NextResponse.json(
        { error: "Invalid data type" },
        { status: 400 }
      );
    }

    //Validate the phone type
    if (typeof body.phone !== "string") {
      return NextResponse.json(
        { error: "Invalid data type" },
        { status: 400 }
      );
    }

    if(!/^(\+62|08)\d{8,13}$/.test(body.phone)) {
      return NextResponse.json(
        {error:"Invalid phone number"},
        {status:400}
      );
    }

    //Validate the date type
    if(isNaN(Date.parse(body.birthDate))) {
      return NextResponse.json(
        {error:"Invalid date"},
        {status:400}
      );
    }

    //Validate the gender type
    if(!["male", "female"].includes(body.gender)) {
      return NextResponse.json(
        {error:"Invalid gender"},
        {status:400}
      );
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(decoded.id) },
      {
        $set: {
          fullName: body.fullName,
          phone: body.phone,
          gender: body.gender,
          birthDate: body.birthDate,
          address: body.address
        }
      }
    )

    console.log("Update result:", result)

    return NextResponse.json({
      message:"Profile updated"
    });

  }catch(err){
    console.log("PROFILE SETUP ERROR:", err);

    return NextResponse.json(
      {error:"Something went wrong"},
      {status:500}
    );

  }
}
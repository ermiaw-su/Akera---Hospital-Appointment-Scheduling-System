import { NextResponse } from "next/server"
import { getDB } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { rateLimit } from "@/lib/rateLimit"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  try {
    //take the IP address client
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    //rate limit
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      )
    }

    //Take the inputs
    const body = await request.json()
    const { username, password, email } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    //Check the database
    const db = await getDB()
    const existingUser = await db.collection("users").findOne({ username })

    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      )
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    //Insert into database
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      role: "user", //default
      createdAt: new Date()
    })

    const token = jwt.sign(
      { id: result.insertedId.toString() },
      process.env.JWT_SECRET!,
      {expiresIn: "1d"}
    )

    return NextResponse.json({
      message: "User created successfully",
      token
    })

  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
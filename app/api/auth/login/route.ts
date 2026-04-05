import {NextResponse} from "next/server"
import {getDB} from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {rateLimit} from "@/lib/rateLimit"
import {seedAdmin} from "@/lib/seedAdmin"

export async function POST(request: Request) {
    try {
        //Check the role admin
        await seedAdmin()

        //Take the IP Address client
        const ip = request.headers.get("x-forwarded-for") || "unknown"

        if(!rateLimit(ip)) {
            return NextResponse.json(
                {error: "Too many requests"},
                {status: 429}    
            )
        }

        //Take the inputs
        const body = await request.json()
        const {username, password} = body

        if (!username || !password) {
            return NextResponse.json(
                {error: "Username and password are required"},
                {status: 400}
            )
        }

        //Check the DB
        const db = await getDB()
        const user = await db.collection("users").findOne({username})

        if(!user){
            return NextResponse.json(
                {error: "User not found"},
                {status: 404}
            )
        }

        //Check the password
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            return NextResponse.json(
                {error: "Invalid credentials"},
                {status: 401}
            )
        }

        //Sign the token
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET!,
            {expiresIn: "1d"}
        )

        return NextResponse.json({
            message: "Login successful",
            token
        })
    } catch (error) {
        return NextResponse.json(
            {error: "Something went wrong"},
            {status: 500}
        )
    }
}
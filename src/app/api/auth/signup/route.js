    import { NextResponse } from 'next/server';
    import dbConnect from '@/lib/mongodb';
    import User from '@/models/User';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';

    export async function POST(req) {
    await dbConnect();
    console.log("Database connected Successfully");
    try {
        const body = await req.json();
        const { email, password } = body;
        console.log("Email: ", email)
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return NextResponse.json({ message: 'User already exists.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({ email, password: hashedPassword });
        
        const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return NextResponse.json({ result: newUser, token }, { status: 201 });
    } catch (error) {
        console.error('Signup Error:', error);
        return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
    }
    }

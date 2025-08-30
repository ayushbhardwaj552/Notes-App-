
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User doesn't exist." }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 400 });
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ result: existingUser, token }, { status: 200 });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
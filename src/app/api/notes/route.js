
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/verifyToken';

// GET all notes for the logged-in user
export async function GET(req) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const notes = await Note.find({ userId: decoded.id }).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, data: notes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// POST a new note
export async function POST(req) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const note = await Note.create({ ...body, userId: decoded.id });
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}


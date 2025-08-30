
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Note from '@/models/Note';
import { verifyToken } from '@/lib/verifyToken';

// PUT (update) a specific note
export async function PUT(req, { params }) {
  const decoded = verifyToken(req);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  await dbConnect();

  try {
    const body = await req.json();
    let note = await Note.findById(params.id);

    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }

    // Check if the note belongs to the user
    if (note.userId.toString() !== decoded.id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    note = await Note.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: note }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// DELETE a specific note
export async function DELETE(req, { params }) {
    const decoded = verifyToken(req);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        let note = await Note.findById(params.id);

        if (!note) {
            return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
        }

        if (note.userId.toString() !== decoded.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await Note.deleteOne({ _id: params.id });

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}

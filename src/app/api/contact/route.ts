import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        // Validate
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required fields.' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const newSubmission = await db.collection('contacts').insertOne({
            name,
            email,
            phone: phone || null,
            message,
            createdAt: new Date()
        });

        return NextResponse.json(
            { success: true, message: 'Message received successfully!', data: { id: newSubmission.insertedId } },
            { status: 201 }
        );
    } catch (error: unknown) {
        const err = error as any;
        console.error('Contact API Error:', err);
        
        // Check if it's an authentication error
        if (err.code === 8000 || err.codeName === 'AtlasError') {
            return NextResponse.json(
                { error: 'Database connection error. Please check your credentials.' },
                { status: 503 }
            );
        }
        
        return NextResponse.json(
            { error: 'Internal server error while processing contact submission.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const db = await getDatabase();
        const submissions = await db.collection('contacts')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(submissions || []);
    } catch (error) {
        console.error('Contact GET API Error:', error);
        // Return empty array instead of error to prevent UI crash
        return NextResponse.json([]);
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await getDatabase();
        await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}

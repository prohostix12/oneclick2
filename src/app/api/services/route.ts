import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const db = await getDatabase();
        const services = await db.collection('services')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(services || []);
    } catch (error) {
        console.error('Services API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, category, items, image } = body;

        if (!name || !description || !category) {
            return NextResponse.json(
                { error: 'Name, description, and category are required' },
                { status: 400 }
            );
        }

        const db = await getDatabase();
        const service = {
            name,
            description,
            category,
            image: image || '',
            items: items ? items.filter((item: string) => item.trim()) : [],
            createdAt: new Date()
        };

        const result = await db.collection('services').insertOne(service);

        return NextResponse.json({
            message: 'Service added successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error adding service:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
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
        await db.collection('services').deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SERVICES_FILE = path.join(process.cwd(), 'data', 'services.json');

function readLocalServices(): any[] {
    try {
        if (!fs.existsSync(SERVICES_FILE)) return [];
        return JSON.parse(fs.readFileSync(SERVICES_FILE, 'utf-8'));
    } catch {
        return [];
    }
}

function writeLocalServices(services: any[]) {
    try {
        const dir = path.dirname(SERVICES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
    } catch (error) {
        console.error('Error writing local services:', error);
    }
}

export async function GET() {
    try {
        const db = await getDatabase();
        const services = await db.collection('services')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();
        return NextResponse.json(services || []);
    } catch (error) {
        console.warn('Database error fetching services, using local JSON fallback:', error);
        const services = readLocalServices();
        return NextResponse.json(services);
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

        const service = {
            name,
            description,
            category,
            image: image || '',
            items: items ? items.filter((item: string) => item.trim()) : [],
            createdAt: new Date()
        };

        try {
            const db = await getDatabase();
            const result = await db.collection('services').insertOne(service);

            return NextResponse.json({
                message: 'Service added successfully',
                id: result.insertedId
            });
        } catch (dbError) {
            console.warn('Database error adding service, writing to local JSON fallback:', dbError);
            const services = readLocalServices();
            const localId = new ObjectId().toString();
            const localService = {
                ...service,
                _id: localId,
                id: localId,
                createdAt: new Date().toISOString()
            };
            services.unshift(localService);
            writeLocalServices(services);

            return NextResponse.json({
                message: 'Service added successfully (Local fallback)',
                id: localId
            });
        }
    } catch (error) {
        console.error('Error in POST /api/services:', error);
        return NextResponse.json({ error: 'Failed to add service' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const body = await request.json();
        const { name, description, category, items, image } = body;

        if (!name || !description || !category) {
            return NextResponse.json(
                { error: 'Name, description, and category are required' },
                { status: 400 }
            );
        }

        try {
            const db = await getDatabase();
            await db.collection('services').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name,
                        description,
                        category,
                        image: image || '',
                        items: items ? items.filter((item: string) => item.trim()) : [],
                        updatedAt: new Date()
                    }
                }
            );

            return NextResponse.json({ message: 'Service updated successfully' });
        } catch (dbError) {
            console.warn('Database error updating service, updating local JSON fallback:', dbError);
            const services = readLocalServices();
            const idx = services.findIndex((s: any) => s._id === id || s.id === id);
            if (idx >= 0) {
                services[idx] = {
                    ...services[idx],
                    name,
                    description,
                    category,
                    image: image || '',
                    items: items ? items.filter((item: string) => item.trim()) : [],
                    updatedAt: new Date().toISOString()
                };
                writeLocalServices(services);
                return NextResponse.json({ message: 'Service updated successfully (Local fallback)' });
            } else {
                return NextResponse.json({ error: 'Service not found in fallback' }, { status: 404 });
            }
        }
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        try {
            const db = await getDatabase();
            await db.collection('services').deleteOne({ _id: new ObjectId(id) });

            return NextResponse.json({ message: 'Service deleted successfully' });
        } catch (dbError) {
            console.warn('Database error deleting service, deleting from local JSON fallback:', dbError);
            const services = readLocalServices().filter((s: any) => s._id !== id && s.id !== id);
            writeLocalServices(services);
            return NextResponse.json({ message: 'Service deleted successfully (Local fallback)' });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}

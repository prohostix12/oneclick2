import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json');

function readLocalContacts(): any[] {
  try {
    if (!fs.existsSync(CONTACTS_FILE)) return [];
    return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
  } catch { return []; }
}

function writeLocalContacts(contacts: any[]) {
  const dir = path.dirname(CONTACTS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required fields.' }, { status: 400 });
        }

        const entry = { name, email, phone: phone || null, message, createdAt: new Date().toISOString() };

        try {
            const db = await getDatabase();
            const result = await db.collection('contacts').insertOne(entry);
            return NextResponse.json({ success: true, message: 'Message received successfully!', data: { id: result.insertedId } }, { status: 201 });
        } catch {
            const contacts = readLocalContacts();
            const newEntry = { ...entry, _id: Date.now().toString() };
            contacts.push(newEntry);
            writeLocalContacts(contacts);
            return NextResponse.json({ success: true, message: 'Message received successfully!', data: { id: newEntry._id } }, { status: 201 });
        }
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const db = await getDatabase();
        const submissions = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(submissions || []);
    } catch {
        return NextResponse.json(readLocalContacts().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

        try {
            const db = await getDatabase();
            await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
        } catch {
            const contacts = readLocalContacts().filter((c: any) => c._id !== id);
            writeLocalContacts(contacts);
        }
        return NextResponse.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
}

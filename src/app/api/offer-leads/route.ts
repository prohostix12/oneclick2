import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const OFFER_LEADS_FILE = path.join(process.cwd(), 'data', 'offer-leads.json');

function readLocal(): any[] {
  try {
    if (!fs.existsSync(OFFER_LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(OFFER_LEADS_FILE, 'utf-8'));
  } catch { return []; }
}

function writeLocal(leads: any[]) {
  const dir = path.dirname(OFFER_LEADS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OFFER_LEADS_FILE, JSON.stringify(leads, null, 2));
}

export async function GET() {
  try {
    const db = await getDatabase();
    const leads = await db.collection('offer_leads').find({}).sort({ date: -1 }).toArray();
    return NextResponse.json({ success: true, data: leads });
  } catch {
    const leads = readLocal().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json({ success: true, data: leads, source: 'local' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, businessName, offerWon, offerId } = body;

    if (!name || !phone || !email || !businessName) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const newLead = {
      name, phone, email, businessName, offerWon, offerId,
      date: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const db = await getDatabase();
      const result = await db.collection('offer_leads').insertOne(newLead);
      return NextResponse.json({ success: true, data: { ...newLead, id: result.insertedId } });
    } catch {
      const leads = readLocal();
      const entry = { ...newLead, _id: Date.now().toString() };
      leads.push(entry);
      writeLocal(leads);
      return NextResponse.json({ success: true, data: { ...entry, id: entry._id } });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save lead' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    try {
      const db = await getDatabase();
      await db.collection('offer_leads').deleteOne({ _id: new ObjectId(id) });
    } catch {
      const leads = readLocal().filter((l: any) => l._id !== id);
      writeLocal(leads);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}

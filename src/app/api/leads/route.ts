import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');

function readLocalLeads(): any[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'));
  } catch { return []; }
}

function writeLocalLeads(leads: any[]) {
  const dir = path.dirname(LEADS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
}

interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  interestedService: string;
  submittedAt: string;
  source: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectToDatabase() {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('advertisement');
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validation
    const { fullName, email, phone, interestedService } = body;

    if (!fullName || !email || !phone || !interestedService) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, phone, and interestedService are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Phone validation (basic)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const leadData = {
      ...body,
      emailLower: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'new',
      submittedAt: body.submittedAt || new Date().toISOString(),
    };

    // Try MongoDB first, fall back to local JSON file
    try {
      const database = await connectToDatabase();
      const leadsCollection = database.collection('leads');
      const existingLead = await leadsCollection.findOne({ email: email.toLowerCase() });

      if (existingLead) {
        await leadsCollection.updateOne(
          { email: email.toLowerCase() },
          { $set: { ...leadData, updatedAt: new Date().toISOString(), status: 'updated' } }
        );
        return NextResponse.json({ success: true, message: 'Lead updated', leadId: existingLead._id, isUpdate: true });
      } else {
        const result = await leadsCollection.insertOne(leadData);
        return NextResponse.json({ success: true, message: 'Lead captured', leadId: result.insertedId, isUpdate: false });
      }
    } catch (dbError) {
      console.warn('MongoDB unavailable, saving to local file:', (dbError as Error).message);

      // Local JSON fallback
      const leads = readLocalLeads();
      const existing = leads.findIndex((l: any) => l.emailLower === email.toLowerCase());
      const newLead = { ...leadData, _id: Date.now().toString() };

      if (existing >= 0) {
        leads[existing] = { ...leads[existing], ...newLead, status: 'updated' };
      } else {
        leads.push(newLead);
      }
      writeLocalLeads(leads);
      return NextResponse.json({ success: true, message: 'Lead captured', leadId: newLead._id, isUpdate: existing >= 0 });
    }

  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const status = searchParams.get('status');
  const service = searchParams.get('service');

  try {
    const database = await connectToDatabase();
    const leadsCollection = database.collection('leads');

    const filter: any = {};
    if (status) filter.status = status;
    if (service) filter.interestedService = service;

    const total = await leadsCollection.countDocuments(filter);
    const leads = await leadsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, data: leads, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });

  } catch (dbError) {
    console.warn('MongoDB unavailable, reading from local file');

    // Local JSON fallback
    let leads = readLocalLeads();
    if (status) leads = leads.filter((l: any) => l.status === status);
    if (service) leads = leads.filter((l: any) => l.interestedService === service);
    leads.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const total = leads.length;
    const paginated = leads.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ success: true, data: paginated, pagination: { page, limit, total, pages: Math.ceil(total / limit) }, source: 'local' });
  }
}

// Cleanup function for graceful shutdown
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});
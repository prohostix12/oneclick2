import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

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

    // Connect to database
    const database = await connectToDatabase();
    const leadsCollection = database.collection('leads');

    // Check for duplicate email (optional - you might want to allow duplicates)
    const existingLead = await leadsCollection.findOne({ email: email.toLowerCase() });
    
    // Prepare lead data
    const leadData: LeadData & { 
      createdAt: Date; 
      updatedAt: Date; 
      status: string;
      emailLower: string;
    } = {
      ...body,
      emailLower: email.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'new',
      submittedAt: body.submittedAt || new Date().toISOString()
    };

    let result;
    
    if (existingLead) {
      // Update existing lead with new information
      result = await leadsCollection.updateOne(
        { email: email.toLowerCase() },
        { 
          $set: {
            ...leadData,
            updatedAt: new Date(),
            status: 'updated'
          }
        }
      );
      
      return NextResponse.json({
        success: true,
        message: 'Lead information updated successfully',
        leadId: existingLead._id,
        isUpdate: true
      });
    } else {
      // Insert new lead
      result = await leadsCollection.insertOne(leadData);
      
      return NextResponse.json({
        success: true,
        message: 'Lead captured successfully',
        leadId: result.insertedId,
        isUpdate: false
      });
    }

  } catch (error) {
    console.error('Error processing lead:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Database error: ' + error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const service = searchParams.get('service');

    const database = await connectToDatabase();
    const leadsCollection = database.collection('leads');

    // Build filter
    const filter: any = {};
    if (status) filter.status = status;
    if (service) filter.interestedService = service;

    // Get total count
    const total = await leadsCollection.countDocuments(filter);

    // Get leads with pagination
    const leads = await leadsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
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
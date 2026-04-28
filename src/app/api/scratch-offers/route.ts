import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Path to store offers data
const dataDir = path.join(process.cwd(), 'data');
const offersFile = path.join(dataDir, 'scratch-offers.json');

// In-memory store for Vercel (read-only file system)
let inMemoryOffers: any[] = [];
let offersLoaded = false;

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Read offers from file or memory
async function readOffers() {
  try {
    // If already loaded in memory, return that
    if (offersLoaded && inMemoryOffers.length > 0) {
      return inMemoryOffers;
    }

    // Try to read from file
    await ensureDataDir();
    const data = await fs.readFile(offersFile, 'utf-8');
    inMemoryOffers = JSON.parse(data);
    offersLoaded = true;
    return inMemoryOffers;
  } catch (error) {
    console.error('Error reading offers:', error);
    // Return in-memory store even if file read fails
    return inMemoryOffers;
  }
}

// Write offers to file and memory
async function writeOffers(offers: any[]) {
  try {
    // Always update in-memory store
    inMemoryOffers = offers;
    offersLoaded = true;

    // Try to write to file (may fail on Vercel)
    await ensureDataDir();
    await fs.writeFile(offersFile, JSON.stringify(offers, null, 2));
  } catch (error) {
    console.error('Error writing offers to file:', error);
    // Still keep in memory even if file write fails
    inMemoryOffers = offers;
    offersLoaded = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Read offers from file
    let offersStore = [];
    try {
      offersStore = await readOffers();
    } catch (readError) {
      console.error('Error reading offers:', readError);
      offersStore = [];
    }

    // Sort by newest first
    offersStore.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Filter offers based on parameters
    let filteredOffers = [...offersStore];
    
    if (status !== 'all') {
      filteredOffers = filteredOffers.filter(offer => offer.status === status);
    }
    
    if (dateFrom) {
      filteredOffers = filteredOffers.filter(offer => 
        new Date(offer.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredOffers = filteredOffers.filter(offer => 
        new Date(offer.createdAt) <= new Date(dateTo)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOffers = filteredOffers.slice(startIndex, endIndex);

    // Statistics
    const statistics = {
      totalOffers: offersStore.length,
      todayOffers: offersStore.filter((offer: any) => 
        new Date(offer.createdAt).toDateString() === new Date().toDateString()
      ).length,
      offerTypes: ['percentage', 'free', 'fixed']
    };

    // Pagination info
    const pagination = {
      page,
      limit,
      total: filteredOffers.length,
      pages: Math.ceil(filteredOffers.length / limit)
    };

    return NextResponse.json({
      success: true,
      data: paginatedOffers,
      pagination,
      statistics
    });

  } catch (error) {
    console.error('Error fetching scratch offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch scratch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.offer) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Read existing offers
    let offersStore = [];
    try {
      offersStore = await readOffers();
    } catch (readError) {
      console.error('Error reading offers:', readError);
      offersStore = [];
    }

    // Create new offer entry
    const newOffer = {
      _id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone,
      companyName: body.companyName || '',
      offer: body.offer,
      scratchedAt: body.scratchedAt || new Date().toISOString(),
      source: body.source || 'homepage',
      claimed: false,
      createdAt: new Date().toISOString(),
      ipAddress: request.ip || '127.0.0.1',
      status: 'claimed',
      userAgent: request.headers.get('user-agent') || '',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    // Add to offers and save to file
    offersStore.push(newOffer);
    
    try {
      await writeOffers(offersStore);
    } catch (writeError) {
      console.error('Error writing offers to file:', writeError);
      // Still return success even if file write fails, as the data was processed
      return NextResponse.json({
        success: true,
        data: newOffer,
        message: 'Scratch offer processed successfully'
      });
    }
    
    console.log('New offer saved:', newOffer);
    console.log('Total offers:', offersStore.length);

    return NextResponse.json({
      success: true,
      data: newOffer,
      message: 'Scratch offer saved successfully'
    });

  } catch (error) {
    console.error('Error saving scratch offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save scratch offer: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const offerId = searchParams.get('id');

    if (!offerId) {
      return NextResponse.json(
        { success: false, error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // Read existing offers
    let offersStore = [];
    try {
      offersStore = await readOffers();
    } catch (readError) {
      console.error('Error reading offers:', readError);
      // Return success anyway - on Vercel we can't delete from file system
      return NextResponse.json({
        success: true,
        message: 'Offer marked for deletion (read-only storage)'
      });
    }

    // Filter out the offer to delete
    const updatedOffers = offersStore.filter((offer: any) => offer._id !== offerId);

    // Check if offer was found
    if (updatedOffers.length === offersStore.length) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Try to save updated offers
    try {
      await writeOffers(updatedOffers);
      console.log('Offer deleted:', offerId);
      console.log('Total offers remaining:', updatedOffers.length);

      return NextResponse.json({
        success: true,
        message: 'Offer deleted successfully'
      });
    } catch (writeError) {
      console.error('Error writing offers (read-only storage):', writeError);
      // On Vercel, file system is read-only, so return success anyway
      return NextResponse.json({
        success: true,
        message: 'Offer deletion processed (storage is read-only on this system)'
      });
    }

  } catch (error) {
    console.error('Error deleting scratch offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete scratch offer' },
      { status: 500 }
    );
  }
}
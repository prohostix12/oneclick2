import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const SETTINGS_ID = 'main_config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const db = await getDatabase();
    
    if (featured === 'true') {
      const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
      if (!settings || !settings.featuredOfferId) {
        return NextResponse.json({ success: true, data: null });
      }
      
      const featuredOffer = await db.collection('offers').findOne({ _id: new ObjectId(settings.featuredOfferId) });
      return NextResponse.json({
        success: true,
        data: featuredOffer ? { ...featuredOffer, id: featuredOffer._id.toString() } : null
      });
    }

    const offers = await db.collection('offers').find({}).sort({ createdAt: -1 }).toArray();
    const formattedOffers = offers.map(o => ({ ...o, id: o._id.toString() }));

    return NextResponse.json({
      success: true,
      data: formattedOffers
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const newOffer = {
      title: body.title,
      description: body.description,
      discount: body.discount,
      type: body.type || 'percentage',
      color: body.color || '#e61e25',
      active: body.active !== false,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('offers').insertOne(newOffer);

    return NextResponse.json({
      success: true,
      data: { ...newOffer, id: result.insertedId.toString() },
      message: 'Offer created successfully'
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    delete updateData._id; // Ensure we don't try to update immutable _id

    await db.collection('offers').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true, message: 'Offer updated' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    await db.collection('offers').deleteOne({ _id: new ObjectId(id) });

    // Clear featured if it matched
    const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
    if (settings && settings.featuredOfferId === id) {
      await db.collection('offer_settings').updateOne(
        { configId: SETTINGS_ID },
        { $set: { featuredOfferId: null } }
      );
    }

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { featuredOfferId } = body;

    if (!featuredOfferId) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const db = await getDatabase();
    await db.collection('offer_settings').updateOne(
      { configId: SETTINGS_ID },
      { $set: { featuredOfferId } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Featured updated' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

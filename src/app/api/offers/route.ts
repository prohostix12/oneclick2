import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

const SETTINGS_ID = 'main_config';
const OFFERS_FILE = path.join(process.cwd(), 'data', 'offers.json');

function readLocalOffers(): any[] {
  try {
    if (!fs.existsSync(OFFERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(OFFERS_FILE, 'utf-8'));
  } catch { return []; }
}

function writeLocalOffers(offers: any[]) {
  fs.writeFileSync(OFFERS_FILE, JSON.stringify(offers, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    try {
      const db = await getDatabase();
      if (featured === 'true') {
        const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
        if (!settings?.featuredOfferId) return NextResponse.json({ success: true, data: null });
        const featuredOffer = await db.collection('offers').findOne({ _id: new ObjectId(settings.featuredOfferId) });
        return NextResponse.json({ success: true, data: featuredOffer ? { ...featuredOffer, id: featuredOffer._id.toString() } : null });
      }
      const offers = await db.collection('offers').find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json({ success: true, data: offers.map(o => ({ ...o, id: o._id.toString() })) });
    } catch {
      const offers = readLocalOffers();
      return NextResponse.json({ success: true, data: offers, source: 'local' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOffer = {
      title: body.title, description: body.description, discount: body.discount,
      type: body.type || 'percentage', color: body.color || '#e61e25',
      active: body.active !== false, createdAt: new Date().toISOString()
    };

    try {
      const db = await getDatabase();
      const result = await db.collection('offers').insertOne(newOffer);
      return NextResponse.json({ success: true, data: { ...newOffer, id: result.insertedId.toString() }, message: 'Offer created' });
    } catch {
      const offers = readLocalOffers();
      const entry = { ...newOffer, id: Date.now().toString(), _id: Date.now().toString() };
      offers.push(entry);
      writeLocalOffers(offers);
      return NextResponse.json({ success: true, data: entry, message: 'Offer created' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    delete updateData._id;

    try {
      const db = await getDatabase();
      await db.collection('offers').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    } catch {
      const offers = readLocalOffers();
      const idx = offers.findIndex((o: any) => o.id === id || o._id === id);
      if (idx >= 0) offers[idx] = { ...offers[idx], ...updateData };
      writeLocalOffers(offers);
    }
    return NextResponse.json({ success: true, message: 'Offer updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    try {
      const db = await getDatabase();
      await db.collection('offers').deleteOne({ _id: new ObjectId(id) });
    } catch {
      const offers = readLocalOffers().filter((o: any) => o.id !== id && o._id !== id);
      writeLocalOffers(offers);
    }
    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { featuredOfferId } = body;
    if (!featuredOfferId) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    try {
      const db = await getDatabase();
      await db.collection('offer_settings').updateOne({ configId: SETTINGS_ID }, { $set: { featuredOfferId } }, { upsert: true });
    } catch {
      // best-effort: no local storage for featured setting
    }
    return NextResponse.json({ success: true, message: 'Featured updated' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

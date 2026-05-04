import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import fs from 'fs';
import path from 'path';

const SETTINGS_ID = 'main_config';
const SETTINGS_FILE = path.join(process.cwd(), 'data', 'offer-settings.json');

function readLocalSettings(): any {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return null;
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
  } catch { return null; }
}

function writeLocalSettings(data: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}

const defaultSettings = {
  enabled: true,
  limit: 100,
  expiryDate: '2026-12-31',
  offers: [
    { id: '1', title: '20% Discount on Services',  discount: '20% OFF', description: 'On your first advertising campaign', color: '#e61e25' },
    { id: '2', title: 'Free Branding Package',      discount: 'FREE',    description: 'Full corporate identity design', color: '#3b82f6' },
    { id: '3', title: 'Advertisement Design',       discount: 'FREE',    description: 'Professional billboard design', color: '#10b981' },
    { id: '4', title: 'Expert Consultation',        discount: 'FREE',    description: 'One-on-one strategy session', color: '#f59e0b' },
    { id: '5', title: 'Social Media Promotion',     discount: 'FREE',    description: 'One week of targeted social ads', color: '#8b5cf6' },
  ]
};

export async function GET() {
  try {
    const db = await getDatabase();
    const settings = await db.collection('offer_settings').findOne({ configId: SETTINGS_ID });
    return NextResponse.json({ success: true, ...(settings || defaultSettings) });
  } catch {
    const local = readLocalSettings();
    return NextResponse.json({ success: true, ...(local || defaultSettings) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    try {
      const db = await getDatabase();
      await db.collection('offer_settings').updateOne(
        { configId: SETTINGS_ID },
        { $set: { ...updateData, configId: SETTINGS_ID } },
        { upsert: true }
      );
    } catch {
      writeLocalSettings(updateData);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

function readSettings() {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) return null;
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function writeSettings(settings: any) {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export async function GET() {
  try {
    const s = readSettings();
    return NextResponse.json(s || {});
  } catch (e) {
    console.error('GET /api/settings error', e);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, location } = body;
    if (!email || !phone || !location) {
      return NextResponse.json({ error: 'email, phone, and location are required' }, { status: 400 });
    }
    const settings = { email, phone, location };
    writeSettings(settings);
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    console.error('POST /api/settings error', e);
    return NextResponse.json({ error: 'internal server error' }, { status: 500 });
  }
}

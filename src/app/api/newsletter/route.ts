import { NextRequest, NextResponse } from 'next/server';

interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
    status: 'active' | 'unsubscribed';
}

// In-memory storage (in production, use a database)
let subscribers: Subscriber[] = [
    {
        id: '1',
        email: 'john.doe@example.com',
        subscribedAt: '2024-03-01T10:00:00Z',
        status: 'active'
    },
    {
        id: '2',
        email: 'sarah.smith@company.com',
        subscribedAt: '2024-03-05T14:30:00Z',
        status: 'active'
    }
];

export async function GET() {
    try {
        return NextResponse.json(subscribers);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch subscribers' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingSubscriber = subscribers.find(sub => sub.email === email);
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return NextResponse.json(
                    { error: 'Email already subscribed' },
                    { status: 409 }
                );
            } else {
                // Reactivate subscription
                existingSubscriber.status = 'active';
                existingSubscriber.subscribedAt = new Date().toISOString();
                return NextResponse.json(
                    { message: 'Successfully resubscribed to newsletter!' },
                    { status: 200 }
                );
            }
        }

        // Add new subscriber
        const newSubscriber: Subscriber = {
            id: Date.now().toString(),
            email,
            subscribedAt: new Date().toISOString(),
            status: 'active'
        };

        subscribers.push(newSubscriber);

        return NextResponse.json(
            { message: 'Successfully subscribed to newsletter!' },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Subscriber ID is required' },
                { status: 400 }
            );
        }

        const subscriberIndex = subscribers.findIndex(sub => sub.id === id);
        if (subscriberIndex === -1) {
            return NextResponse.json(
                { error: 'Subscriber not found' },
                { status: 404 }
            );
        }

        subscribers.splice(subscriberIndex, 1);

        return NextResponse.json(
            { message: 'Subscriber deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete subscriber' },
            { status: 500 }
        );
    }
}
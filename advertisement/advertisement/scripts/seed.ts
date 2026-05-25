import { MongoClient } from 'mongodb';

const uri = process.env.DATABASE_URL || "mongodb+srv://project_db_user:yLtS5VhXfPvziVZP@cluster0.8gdtuxs.mongodb.net/advertisement?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db();

        // 1. Clear existing data
        console.log('Clearing existing data...');
        await db.collection('contacts').deleteMany({});
        await db.collection('testimonials').deleteMany({});
        await db.collection('industries').deleteMany({});
        await db.collection('projects').deleteMany({});
        await db.collection('services').deleteMany({});
        await db.collection('team').deleteMany({});

        // 2. Contacts
        console.log('Seeding contacts...');
        const contacts = [
            {
                name: "Ahmed Al Mansouri",
                email: "ahmed@retailgroup.ae",
                phone: "+971 50 123 4567",
                message: "Looking for AI-driven signage solutions for our new mall launch in Dubai Marina.",
                createdAt: new Date()
            },
            {
                name: "Sara Jenkins",
                email: "sara@marketinghub.com",
                phone: "+971 55 987 6543",
                message: "Requesting a quote for fleet brand transformation project covering 50+ vehicles.",
                createdAt: new Date()
            },
            {
                name: "John Doe",
                email: "j.doe@corporate.ae",
                phone: "+971 52 555 1111",
                message: "Interested in the Digital Facade solution for our HQ building in Business Bay.",
                createdAt: new Date()
            }
        ];
        await db.collection('contacts').insertMany(contacts);

        // 3. Testimonials
        console.log('Seeding testimonials...');
        const testimonials = [
            { 
                name: "Ahmed Al Mansouri", 
                role: "CEO, Emirates Retail Group", 
                company: "Emirates Retail Group",
                quote: "One Click Advertisement transformed our mall's visual identity with their AI-driven design approach. The results exceeded our expectations, and the installation was flawless.",
                rating: 5,
                image: "/images/testimonial-1.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Sarah Jenkins", 
                role: "Marketing Director, Global Brands", 
                company: "Global Brands LLC",
                quote: "Absolute precision in their cladding solutions. The team was professional, timely, and delivered exceptional quality. Our building facade is now a landmark in Dubai.",
                rating: 5,
                image: "/images/testimonial-2.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Mohammed Hassan", 
                role: "Operations Head, Tech Solutions", 
                company: "Tech Solutions DMCC",
                quote: "Transformed our headquarters into a tech landmark. The digital signage integration was seamless, and their support team is outstanding.",
                rating: 5,
                image: "/images/testimonial-3.jpg",
                createdAt: new Date() 
            },
            { 
                name: "Lisa Chen", 
                role: "Brand Manager, Luxury Motors", 
                company: "Luxury Motors",
                quote: "Their fleet branding service is unmatched. All 30 of our vehicles now showcase our brand perfectly, and the RTA approval process was handled smoothly.",
                rating: 5,
                image: "/images/testimonial-4.jpg",
                createdAt: new Date() 
            }
        ];
        await db.collection('testimonials').insertMany(testimonials);

        // 4. Industries
        console.log('Seeding industries...');
        const industries = [
            { name: "Retail & Malls", icon: "Store", description: "Premium signage and branding for shopping centers", projectCount: 150, createdAt: new Date() },
            { name: "Corporate Centers", icon: "Briefcase", description: "Professional office branding and wayfinding", projectCount: 200, createdAt: new Date() },
            { name: "Real Estate", icon: "Building2", description: "Property marketing and facade solutions", projectCount: 180, createdAt: new Date() },
            { name: "Automotive", icon: "Car", description: "Fleet branding and showroom displays", projectCount: 120, createdAt: new Date() },
            { name: "Hospitality", icon: "Hotel", description: "Hotel and restaurant branding solutions", projectCount: 90, createdAt: new Date() },
            { name: "Healthcare", icon: "HeartPulse", description: "Medical facility signage and wayfinding", projectCount: 75, createdAt: new Date() }
        ];
        await db.collection('industries').insertMany(industries);

        // 5. Projects Portfolio
        console.log('Seeding projects...');
        const projects = [
            {
                title: "Dubai Mall Expansion",
                client: "Emaar Properties",
                category: "Retail",
                description: "Complete signage and wayfinding system for the new wing",
                image: "/images/project-1.jpg",
                year: 2024,
                location: "Dubai, UAE",
                services: ["Digital Signage", "Wayfinding", "LED Displays"],
                featured: true,
                createdAt: new Date()
            },
            {
                title: "Emirates Towers Facade",
                client: "Emirates Group",
                category: "Corporate",
                description: "LED facade transformation with dynamic content display",
                image: "/images/project-2.jpg",
                year: 2024,
                location: "Dubai, UAE",
                services: ["Digital Facade", "LED Installation", "Content Management"],
                featured: true,
                createdAt: new Date()
            },
            {
                title: "Luxury Fleet Branding",
                client: "Al Tayer Motors",
                category: "Automotive",
                description: "Complete fleet wrap for 50+ luxury vehicles",
                image: "/images/project-3.jpg",
                year: 2023,
                location: "Dubai, UAE",
                services: ["Vehicle Wrapping", "Fleet Branding", "RTA Approval"],
                featured: true,
                createdAt: new Date()
            },
            {
                title: "City Walk Retail",
                client: "Meraas",
                category: "Retail",
                description: "Outdoor advertising and retail signage",
                image: "/images/project-4.jpg",
                year: 2023,
                location: "Dubai, UAE",
                services: ["Outdoor Signage", "Retail Branding", "Installation"],
                featured: false,
                createdAt: new Date()
            }
        ];
        await db.collection('projects').insertMany(projects);

        // 6. Services
        console.log('Seeding services...');
        const services = [
            {
                title: "Architectural Signage",
                description: "AI-optimized physical signage solutions that withstand the UAE climate while maintaining premium aesthetics.",
                icon: "ShieldCheck",
                details: ["3D Fabricated Letters", "Wayfinding Systems", "Industrial Cladding", "Monument Signs", "Pylon Signs"],
                category: "Physical",
                price: "Starting from AED 5,000",
                duration: "2-4 weeks",
                image: "/images/service-1.jpg",
                createdAt: new Date()
            },
            {
                title: "Digital Facades",
                description: "High-resolution LED screens and dynamic surfaces integrated with your building's architecture.",
                icon: "Target",
                details: ["Transparent LED Glass", "Outdoor Video Walls", "Architectural Lighting", "Media Facades", "Interactive Displays"],
                category: "Digital",
                price: "Starting from AED 50,000",
                duration: "4-8 weeks",
                image: "/images/service-2.jpg",
                createdAt: new Date()
            },
            {
                title: "Fleet Branding",
                description: "Complete transformation of your corporate fleet using RTA-approved premium wrapping materials.",
                icon: "Car",
                details: ["Full Body Wraps", "RTA Approval Management", "Protective Laminates", "Fleet Design", "Installation & Warranty"],
                category: "Transformation",
                price: "Starting from AED 3,000 per vehicle",
                duration: "1-2 weeks",
                image: "/images/service-3.jpg",
                createdAt: new Date()
            },
            {
                title: "Digital Printing",
                description: "Large format printing for indoor and outdoor applications with UV-resistant materials.",
                icon: "Printer",
                details: ["Banner Printing", "Wall Graphics", "Window Graphics", "Floor Graphics", "Exhibition Graphics"],
                category: "Printing",
                price: "Starting from AED 500",
                duration: "3-5 days",
                image: "/images/service-4.jpg",
                createdAt: new Date()
            },
            {
                title: "Exhibition & Events",
                description: "Complete exhibition stand design, fabrication, and installation services.",
                icon: "Presentation",
                details: ["Stand Design", "Fabrication", "Installation", "Graphics", "Audio Visual"],
                category: "Events",
                price: "Starting from AED 10,000",
                duration: "2-3 weeks",
                image: "/images/service-5.jpg",
                createdAt: new Date()
            },
            {
                title: "Neon & LED Signs",
                description: "Custom neon and LED signage for retail, hospitality, and entertainment venues.",
                icon: "Lightbulb",
                details: ["Custom Neon", "LED Channel Letters", "Backlit Signs", "RGB Lighting", "Smart Controls"],
                category: "Lighting",
                price: "Starting from AED 2,000",
                duration: "1-3 weeks",
                image: "/images/service-6.jpg",
                createdAt: new Date()
            }
        ];
        await db.collection('services').insertMany(services);

        // 7. Team Members
        console.log('Seeding team...');
        const team = [
            {
                name: "Khalid Al Mazrouei",
                role: "CEO & Founder",
                bio: "15+ years of experience in advertising and signage industry",
                image: "/images/team-1.jpg",
                email: "khalid@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Sarah Williams",
                role: "Creative Director",
                bio: "Award-winning designer specializing in brand identity",
                image: "/images/team-2.jpg",
                email: "sarah@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Ahmed Hassan",
                role: "Technical Director",
                bio: "Expert in LED technology and digital signage systems",
                image: "/images/team-3.jpg",
                email: "ahmed@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            },
            {
                name: "Maria Rodriguez",
                role: "Project Manager",
                bio: "Certified PMP with 10+ years in project delivery",
                image: "/images/team-4.jpg",
                email: "maria@oneclickadv.ae",
                linkedin: "https://linkedin.com",
                createdAt: new Date()
            }
        ];
        await db.collection('team').insertMany(team);

        console.log('✅ Successfully seeded all data to MongoDB!');
        console.log('Collections created:');
        console.log('- contacts:', contacts.length);
        console.log('- testimonials:', testimonials.length);
        console.log('- industries:', industries.length);
        console.log('- projects:', projects.length);
        console.log('- services:', services.length);
        console.log('- team:', team.length);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
}

main();

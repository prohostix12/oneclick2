import { NextRequest, NextResponse } from 'next/server';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    category: string;
    image: string;
    status: 'published' | 'draft';
    readTime: string;
}

// In-memory storage (in production, use a database)
let blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Latest Signage Design Trends in UAE 2024',
        excerpt: 'Discover the cutting-edge design trends shaping the advertising landscape in the UAE this year.',
        content: `
            <h2>The Evolution of Signage Design in the UAE</h2>
            <p>The UAE's advertising landscape is constantly evolving, driven by technological advancements and changing consumer preferences. In 2024, we're seeing several key trends that are reshaping how businesses communicate with their audiences.</p>
            
            <h3>1. Sustainable Materials and Eco-Friendly Designs</h3>
            <p>Environmental consciousness is becoming increasingly important in the UAE. Businesses are now opting for sustainable materials like recycled aluminum, bamboo composites, and solar-powered LED systems. This shift not only reduces environmental impact but also appeals to eco-conscious consumers.</p>
            
            <h3>2. Interactive Digital Displays</h3>
            <p>Touch-enabled displays and QR code integration are becoming standard. These interactive elements allow customers to engage directly with brands, access additional information, and even make purchases on the spot.</p>
            
            <h3>3. Minimalist Arabic Typography</h3>
            <p>Clean, modern Arabic fonts are gaining popularity, especially in Dubai and Abu Dhabi. This trend reflects the UAE's commitment to preserving cultural identity while embracing contemporary design principles.</p>
            
            <h3>4. Smart Signage with IoT Integration</h3>
            <p>Internet of Things (IoT) technology is enabling signs to collect data, adjust content based on weather conditions, and even monitor foot traffic patterns. This data-driven approach helps businesses optimize their advertising strategies.</p>
            
            <h3>Conclusion</h3>
            <p>As we move through 2024, the key to successful signage in the UAE lies in balancing innovation with cultural sensitivity, sustainability with functionality, and technology with human connection.</p>
        `,
        author: 'Design Team',
        date: '2024-03-10',
        category: 'Design Trends',
        image: '/signage-branding.png',
        status: 'published',
        readTime: '5 min read'
    },
    {
        id: '2',
        title: 'ROI Analysis: Digital vs Traditional Signage',
        excerpt: 'A comprehensive case study comparing the return on investment between digital and traditional advertising methods.',
        content: `
            <h2>Understanding ROI in Modern Advertising</h2>
            <p>In today's competitive market, businesses need to make informed decisions about their advertising investments. This comprehensive analysis examines the return on investment (ROI) of digital versus traditional signage solutions.</p>
            
            <h3>Traditional Signage: The Foundation</h3>
            <p>Traditional signage has been the backbone of outdoor advertising for decades. Our analysis of 50 UAE businesses shows:</p>
            <ul>
                <li>Average ROI: 150-200% over 3 years</li>
                <li>Lower initial maintenance costs</li>
                <li>Proven durability in harsh UAE climate</li>
                <li>One-time content creation cost</li>
            </ul>
            
            <h3>Digital Signage: The Future</h3>
            <p>Digital displays offer dynamic content capabilities and real-time updates:</p>
            <ul>
                <li>Average ROI: 250-350% over 3 years</li>
                <li>Higher initial investment but lower long-term content costs</li>
                <li>Ability to display multiple campaigns</li>
                <li>Real-time performance tracking</li>
            </ul>
            
            <h3>Case Study: Dubai Mall Retailer</h3>
            <p>A major retailer in Dubai Mall switched from traditional to digital signage and saw:</p>
            <ul>
                <li>40% increase in foot traffic</li>
                <li>25% boost in sales conversion</li>
                <li>60% reduction in content update costs</li>
                <li>ROI improvement from 180% to 320%</li>
            </ul>
            
            <h3>Recommendations</h3>
            <p>The choice between digital and traditional signage depends on your specific needs, budget, and location. For high-traffic areas with frequent content changes, digital signage offers superior ROI. For permanent branding in stable locations, traditional signage remains cost-effective.</p>
        `,
        author: 'Marketing Team',
        date: '2024-03-08',
        category: 'Case Studies',
        image: '/signage-digital-print.png',
        status: 'published',
        readTime: '8 min read'
    },
    {
        id: '3',
        title: 'Dubai Municipality Signage Regulations Update',
        excerpt: 'Important updates to signage regulations in Dubai that every business owner should know.',
        content: `
            <h2>New Signage Regulations in Dubai</h2>
            <p>Dubai Municipality has updated its signage regulations to ensure better urban aesthetics and safety standards. Here's what businesses need to know.</p>
            
            <h3>Key Changes</h3>
            <ul>
                <li>New size restrictions for commercial signage</li>
                <li>Updated color guidelines for heritage areas</li>
                <li>Digital display brightness limitations</li>
                <li>Enhanced safety requirements for installation</li>
            </ul>
            
            <h3>Compliance Timeline</h3>
            <p>All existing signage must comply with new regulations by December 2024. New installations must follow updated guidelines immediately.</p>
        `,
        author: 'Legal Team',
        date: '2024-03-05',
        category: 'Regulations',
        image: '/signage-cladding.png',
        status: 'published',
        readTime: '6 min read'
    },
    {
        id: '4',
        title: 'Essential Maintenance Tips for Outdoor LED Displays',
        excerpt: 'Keep your LED displays running efficiently in UAE\'s harsh climate with these proven maintenance strategies.',
        content: `
            <h2>Protecting Your LED Investment in the UAE</h2>
            <p>LED displays are a significant investment, and proper maintenance is crucial for maximizing their lifespan in the UAE's challenging climate conditions. Here's your comprehensive maintenance guide.</p>
            
            <h3>Daily Maintenance Checklist</h3>
            <ul>
                <li><strong>Visual Inspection:</strong> Check for dead pixels, color inconsistencies, or physical damage</li>
                <li><strong>Brightness Check:</strong> Ensure displays are visible but not overly bright during different times of day</li>
                <li><strong>Content Verification:</strong> Confirm all content is displaying correctly without glitches</li>
                <li><strong>Temperature Monitoring:</strong> Check cooling systems are functioning properly</li>
            </ul>
            
            <h3>Weekly Deep Cleaning Protocol</h3>
            <p>The UAE's sandy environment requires regular cleaning:</p>
            <ol>
                <li>Power down the display completely</li>
                <li>Use compressed air to remove sand and dust from vents</li>
                <li>Clean the screen surface with anti-static microfiber cloth</li>
                <li>Check and clean cooling fans and air filters</li>
                <li>Inspect cable connections for corrosion or looseness</li>
            </ol>
            
            <h3>Monthly Technical Maintenance</h3>
            <ul>
                <li>Calibrate color and brightness settings</li>
                <li>Update firmware and software</li>
                <li>Test backup power systems</li>
                <li>Inspect mounting hardware for wear</li>
                <li>Check weatherproofing seals</li>
            </ul>
            
            <h3>Seasonal Maintenance (Summer Focus)</h3>
            <p>UAE summers are particularly harsh on electronic displays:</p>
            <ul>
                <li>Increase cooling system maintenance frequency</li>
                <li>Monitor internal temperatures more closely</li>
                <li>Adjust brightness settings for extreme heat conditions</li>
                <li>Check for thermal expansion effects on mounting</li>
            </ul>
            
            <h3>Common Issues and Solutions</h3>
            <p><strong>Overheating:</strong> Ensure adequate ventilation and consider additional cooling solutions.</p>
            <p><strong>Sand Infiltration:</strong> Upgrade to higher IP-rated enclosures if necessary.</p>
            <p><strong>Color Drift:</strong> Regular calibration prevents color inconsistencies over time.</p>
            
            <h3>Professional Service Schedule</h3>
            <p>While daily and weekly maintenance can be handled in-house, schedule professional servicing every 6 months for optimal performance and warranty compliance.</p>
        `,
        author: 'Technical Team',
        date: '2024-03-09',
        category: 'Maintenance Tips',
        image: '/signage-production.png',
        status: 'published',
        readTime: '7 min read'
    },
    {
        id: '5',
        title: 'Vinyl Signage Care: Extending Life in Desert Conditions',
        excerpt: 'Protect your vinyl signs from UV damage and sand erosion with these expert maintenance techniques.',
        content: `
            <h2>Vinyl Signage Maintenance in the UAE</h2>
            <p>Vinyl signs face unique challenges in the UAE's desert climate. UV radiation, sand abrasion, and extreme temperatures can significantly reduce their lifespan without proper care.</p>
            
            <h3>Understanding UV Damage</h3>
            <p>The UAE receives some of the world's highest UV radiation levels. This causes:</p>
            <ul>
                <li>Color fading and bleaching</li>
                <li>Material brittleness and cracking</li>
                <li>Adhesive failure</li>
                <li>Surface chalking</li>
            </ul>
            
            <h3>Preventive Measures</h3>
            <h4>Material Selection</h4>
            <ul>
                <li>Use UV-resistant vinyl with protective laminates</li>
                <li>Choose high-quality adhesives rated for extreme temperatures</li>
                <li>Consider reflective or light-colored backgrounds to reduce heat absorption</li>
            </ul>
            
            <h4>Installation Best Practices</h4>
            <ul>
                <li>Avoid installation during peak heat hours (10 AM - 4 PM)</li>
                <li>Ensure proper surface preparation and cleaning</li>
                <li>Allow adequate curing time before exposure to elements</li>
                <li>Use edge sealing techniques for enhanced durability</li>
            </ul>
            
            <h3>Regular Maintenance Schedule</h3>
            
            <h4>Weekly Cleaning (Essential in Sandy Areas)</h4>
            <ol>
                <li>Rinse with clean water to remove sand and dust</li>
                <li>Use mild soap solution for stubborn dirt</li>
                <li>Avoid high-pressure washing which can damage edges</li>
                <li>Dry with soft cloth to prevent water spots</li>
            </ol>
            
            <h4>Monthly Inspection</h4>
            <ul>
                <li>Check for edge lifting or bubbling</li>
                <li>Look for color fading or discoloration</li>
                <li>Inspect for cracks or tears</li>
                <li>Verify adhesion at stress points</li>
            </ul>
            
            <h3>Repair Techniques</h3>
            <p><strong>Edge Lifting:</strong> Clean the area, apply heat, and re-adhere using appropriate pressure.</p>
            <p><strong>Small Tears:</strong> Use matching vinyl patches with overlapping edges.</p>
            <p><strong>Fading:</strong> Consider partial replacement or protective coating application.</p>
            
            <h3>When to Replace</h3>
            <p>Replace vinyl signage when:</p>
            <ul>
                <li>Color fading exceeds 30% of original vibrancy</li>
                <li>Multiple areas show lifting or cracking</li>
                <li>Text becomes difficult to read</li>
                <li>Repair costs exceed 60% of replacement cost</li>
            </ul>
            
            <h3>Cost-Saving Tips</h3>
            <ul>
                <li>Invest in higher-grade materials upfront</li>
                <li>Implement regular cleaning schedules</li>
                <li>Address minor issues immediately</li>
                <li>Consider seasonal protective measures</li>
            </ul>
        `,
        author: 'Installation Team',
        date: '2024-03-07',
        category: 'Maintenance Tips',
        image: '/signage-vehicle.png',
        status: 'published',
        readTime: '6 min read'
    },
    {
        id: '6',
        title: 'Aluminum Signage Maintenance: Preventing Corrosion in Coastal Areas',
        excerpt: 'Essential maintenance practices for aluminum signs in Dubai and Abu Dhabi\'s coastal environments.',
        content: `
            <h2>Coastal Corrosion Challenges</h2>
            <p>Aluminum signage in Dubai and Abu Dhabi faces unique challenges due to salt air exposure. Proper maintenance prevents costly corrosion damage and extends sign life significantly.</p>
            
            <h3>Understanding Coastal Corrosion</h3>
            <p>Salt air accelerates oxidation processes, leading to:</p>
            <ul>
                <li>Pitting corrosion on aluminum surfaces</li>
                <li>Galvanic corrosion at dissimilar metal joints</li>
                <li>Coating degradation and peeling</li>
                <li>Fastener deterioration</li>
            </ul>
            
            <h3>Protective Coatings and Treatments</h3>
            
            <h4>Anodizing Benefits</h4>
            <ul>
                <li>Creates protective oxide layer</li>
                <li>Increases corrosion resistance by 10x</li>
                <li>Available in various colors and finishes</li>
                <li>Requires minimal maintenance</li>
            </ul>
            
            <h4>Powder Coating Advantages</h4>
            <ul>
                <li>Superior adhesion and durability</li>
                <li>Excellent UV and chemical resistance</li>
                <li>Wide range of colors and textures</li>
                <li>Environmentally friendly application</li>
            </ul>
            
            <h3>Maintenance Schedule for Coastal Areas</h3>
            
            <h4>Monthly Cleaning (Critical for Salt Exposure)</h4>
            <ol>
                <li>Rinse thoroughly with fresh water to remove salt deposits</li>
                <li>Use mild alkaline cleaner for stubborn residue</li>
                <li>Scrub gently with non-abrasive brushes</li>
                <li>Rinse again and dry completely</li>
                <li>Apply protective wax coating if recommended</li>
            </ol>
            
            <h4>Quarterly Inspection</h4>
            <ul>
                <li>Check for white corrosion spots (early aluminum oxidation)</li>
                <li>Inspect fasteners and mounting hardware</li>
                <li>Look for coating chips or scratches</li>
                <li>Verify structural integrity</li>
                <li>Test electrical connections if applicable</li>
            </ul>
            
            <h3>Early Corrosion Treatment</h3>
            
            <h4>Surface Preparation</h4>
            <ol>
                <li>Clean affected area thoroughly</li>
                <li>Remove loose corrosion with fine abrasive</li>
                <li>Apply aluminum-specific primer</li>
                <li>Use matching topcoat for protection</li>
            </ol>
            
            <h4>Fastener Maintenance</h4>
            <ul>
                <li>Use stainless steel or aluminum fasteners only</li>
                <li>Apply anti-seize compound during installation</li>
                <li>Replace corroded fasteners immediately</li>
                <li>Consider upgrading to marine-grade hardware</li>
            </ul>
            
            <h3>Preventive Strategies</h3>
            
            <h4>Design Considerations</h4>
            <ul>
                <li>Avoid water traps and crevices</li>
                <li>Ensure proper drainage</li>
                <li>Use compatible materials throughout</li>
                <li>Design for easy access during maintenance</li>
            </ul>
            
            <h4>Environmental Protection</h4>
            <ul>
                <li>Install windbreaks to reduce salt spray exposure</li>
                <li>Consider sacrificial anodes for large installations</li>
                <li>Apply marine-grade sealants at joints</li>
                <li>Use corrosion inhibitors in enclosed spaces</li>
            </ul>
            
            <h3>Professional Assessment</h3>
            <p>Schedule annual professional inspections for:</p>
            <ul>
                <li>Coating thickness measurements</li>
                <li>Structural integrity assessment</li>
                <li>Electrical system testing</li>
                <li>Preventive maintenance planning</li>
            </ul>
            
            <h3>Replacement Indicators</h3>
            <p>Consider replacement when:</p>
            <ul>
                <li>Corrosion affects structural integrity</li>
                <li>Coating failure exceeds 25% of surface area</li>
                <li>Repair costs exceed 70% of replacement value</li>
                <li>Safety concerns arise from deterioration</li>
            </ul>
        `,
        author: 'Coastal Specialist Team',
        date: '2024-03-06',
        category: 'Maintenance Tips',
        image: '/signage-exhibition.png',
        status: 'published',
        readTime: '8 min read'
    },
    {
        id: '7',
        title: 'Neon and LED Strip Maintenance: Troubleshooting Common Issues',
        excerpt: 'Keep your neon and LED strip installations bright and reliable with these maintenance and troubleshooting tips.',
        content: `
            <h2>Maintaining Bright and Reliable Lighting</h2>
            <p>Neon and LED strip lighting create stunning visual effects but require specific maintenance approaches to ensure longevity and consistent performance in the UAE's demanding environment.</p>
            
            <h3>LED Strip Maintenance</h3>
            
            <h4>Daily Checks</h4>
            <ul>
                <li>Visual inspection for dark sections or color inconsistencies</li>
                <li>Check for overheating in enclosed installations</li>
                <li>Verify controller and power supply operation</li>
                <li>Test remote control or app connectivity</li>
            </ul>
            
            <h4>Weekly Cleaning Protocol</h4>
            <ol>
                <li>Power off the system completely</li>
                <li>Remove dust and debris with soft brush</li>
                <li>Clean diffuser covers with mild soap solution</li>
                <li>Check for loose connections at joints</li>
                <li>Inspect mounting clips and adhesive strips</li>
            </ol>
            
            <h3>Traditional Neon Maintenance</h3>
            
            <h4>Safety First</h4>
            <p><strong>Warning:</strong> Traditional neon operates at high voltage. Always disconnect power and wait 10 minutes before maintenance.</p>
            
            <h4>Monthly Inspection</h4>
            <ul>
                <li>Check for gas leaks (dim or flickering sections)</li>
                <li>Inspect electrode connections</li>
                <li>Test transformer output voltage</li>
                <li>Look for cracks in glass tubing</li>
                <li>Verify mounting support integrity</li>
            </ul>
            
            <h3>Common Issues and Solutions</h3>
            
            <h4>LED Strip Problems</h4>
            
            <p><strong>Flickering or Dimming:</strong></p>
            <ul>
                <li>Check power supply capacity</li>
                <li>Verify voltage drop across long runs</li>
                <li>Inspect solder joints at connections</li>
                <li>Test for overheating issues</li>
            </ul>
            
            <p><strong>Color Inconsistency:</strong></p>
            <ul>
                <li>Calibrate controller settings</li>
                <li>Check for damaged LED chips</li>
                <li>Verify proper heat dissipation</li>
                <li>Replace affected sections if necessary</li>
            </ul>
            
            <p><strong>Premature Failure:</strong></p>
            <ul>
                <li>Ensure adequate ventilation</li>
                <li>Use appropriate IP-rated products</li>
                <li>Install surge protection devices</li>
                <li>Avoid exceeding maximum run lengths</li>
            </ul>
            
            <h4>Neon Troubleshooting</h4>
            
            <p><strong>Won't Light Up:</strong></p>
            <ol>
                <li>Check circuit breaker and fuses</li>
                <li>Test transformer output with multimeter</li>
                <li>Inspect high-voltage connections</li>
                <li>Look for broken or cracked tubing</li>
            </ol>
            
            <p><strong>Partial Lighting:</strong></p>
            <ul>
                <li>Identify gas leak locations</li>
                <li>Check for loose electrode connections</li>
                <li>Test individual tube sections</li>
                <li>Verify proper grounding</li>
            </ul>
            
            <h3>Environmental Considerations</h3>
            
            <h4>Heat Management</h4>
            <ul>
                <li>Ensure minimum 2-inch clearance around transformers</li>
                <li>Use heat sinks for high-power LED installations</li>
                <li>Consider active cooling for enclosed spaces</li>
                <li>Monitor ambient temperatures regularly</li>
            </ul>
            
            <h4>Moisture Protection</h4>
            <ul>
                <li>Use appropriate IP ratings for outdoor installations</li>
                <li>Seal all electrical connections properly</li>
                <li>Install drainage systems where needed</li>
                <li>Apply conformal coatings to circuit boards</li>
            </ul>
            
            <h3>Preventive Maintenance Schedule</h3>
            
            <h4>Monthly Tasks</h4>
            <ul>
                <li>Clean all surfaces and covers</li>
                <li>Check and tighten electrical connections</li>
                <li>Test emergency shutdown systems</li>
                <li>Document performance metrics</li>
            </ul>
            
            <h4>Quarterly Tasks</h4>
            <ul>
                <li>Calibrate color and brightness settings</li>
                <li>Update controller firmware</li>
                <li>Test backup power systems</li>
                <li>Inspect mounting hardware</li>
            </ul>
            
            <h4>Annual Tasks</h4>
            <ul>
                <li>Professional electrical inspection</li>
                <li>Thermal imaging assessment</li>
                <li>Performance benchmarking</li>
                <li>Warranty compliance verification</li>
            </ul>
            
            <h3>Upgrade Considerations</h3>
            <p>Consider upgrading to newer LED technology when:</p>
            <ul>
                <li>Energy costs exceed 40% of original installation</li>
                <li>Maintenance frequency increases significantly</li>
                <li>Color consistency becomes problematic</li>
                <li>Smart control features are desired</li>
            </ul>
            
            <h3>Professional Service</h3>
            <p>Schedule professional maintenance for:</p>
            <ul>
                <li>High-voltage neon systems (quarterly)</li>
                <li>Complex LED installations (bi-annually)</li>
                <li>Critical business signage (monthly)</li>
                <li>Warranty compliance requirements</li>
            </ul>
        `,
        author: 'Electrical Team',
        date: '2024-03-04',
        category: 'Maintenance Tips',
        image: '/services-hero-bg.png',
        status: 'published',
        readTime: '9 min read'
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const status = searchParams.get('status');

        if (id) {
            // Get single post
            const post = blogPosts.find(p => p.id === id);
            if (!post) {
                return NextResponse.json(
                    { error: 'Post not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(post);
        }

        // Get all posts (filter by status if provided)
        let filteredPosts = blogPosts;
        if (status && status !== 'all') {
            filteredPosts = blogPosts.filter(post => post.status === status);
        }

        return NextResponse.json(filteredPosts);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const postData = await request.json();
        
        const newPost: BlogPost = {
            id: Date.now().toString(),
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author || 'Admin',
            date: new Date().toISOString().split('T')[0],
            category: postData.category,
            image: postData.image,
            status: postData.status || 'draft',
            readTime: `${Math.ceil(postData.content.length / 1000)} min read`
        };

        blogPosts.unshift(newPost);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const postData = await request.json();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const postIndex = blogPosts.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        const updatedPost: BlogPost = {
            ...blogPosts[postIndex],
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            author: postData.author,
            category: postData.category,
            image: postData.image,
            status: postData.status,
            readTime: `${Math.ceil(postData.content.length / 1000)} min read`
        };

        blogPosts[postIndex] = updatedPost;

        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update post' },
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
                { error: 'Post ID is required' },
                { status: 400 }
            );
        }

        const postIndex = blogPosts.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        blogPosts.splice(postIndex, 1);

        return NextResponse.json(
            { message: 'Post deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
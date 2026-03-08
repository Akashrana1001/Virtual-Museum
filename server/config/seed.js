const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Event = require('../models/Event');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Artwork.deleteMany({});
        await Event.deleteMany({});

        // Create admin
        const admin = await User.create({
            name: 'Gallery Admin',
            email: 'admin@virtualmuseum.com',
            password: 'admin123',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        });

        // Create artists
        const artists = await User.create([
            {
                name: 'Elena Vasquez',
                email: 'elena@art.com',
                password: 'artist123',
                role: 'artist',
                bio: 'Contemporary digital artist specializing in surreal landscapes and dreamscapes. Based in Barcelona, exploring the intersection of technology and fine art.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                website: 'https://elenavasquez.art',
                socialLinks: { instagram: '@elena.art', twitter: '@elenavasquez' },
            },
            {
                name: 'Marcus Chen',
                email: 'marcus@art.com',
                password: 'artist123',
                role: 'artist',
                bio: 'Abstract painter and sculptor working with mixed media. Inspired by urban architecture and the flow of city life.',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                website: 'https://marcuschen.studio',
                socialLinks: { instagram: '@marcus.studio', twitter: '@marcuschen' },
            },
            {
                name: 'Sarah Okonkwo',
                email: 'sarah@art.com',
                password: 'artist123',
                role: 'artist',
                bio: 'Photographer and visual storyteller. Capturing moments of human connection across cultures.',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
                socialLinks: { instagram: '@sarah.captures' },
            },
        ]);

        // Create a regular user
        await User.create({
            name: 'Art Lover',
            email: 'user@test.com',
            password: 'user1234',
            role: 'user',
        });

        // Artwork image URLs (Unsplash)
        const artworkImages = [
            'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
            'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
            'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800',
            'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800',
            'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
            'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
            'https://images.unsplash.com/photo-1552084162-ec07b3f162dc?w=800',
            'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800',
            'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800',
        ];

        // Create artworks
        const artworks = await Artwork.create([
            {
                title: 'Ethereal Dawn',
                artist: artists[0]._id,
                description: 'A breathtaking digital painting capturing the first light of dawn breaking through ethereal clouds. Colors blend seamlessly from deep violet to warm gold.',
                medium: 'Digital Painting',
                year: 2024,
                imageUrl: artworkImages[0],
                category: 'digital',
                tags: ['landscape', 'dawn', 'surreal'],
                room: 1,
                position3D: { wall: 'north', x: -3, y: 1.6, z: -4.9 },
                status: 'approved',
            },
            {
                title: 'Urban Symphony',
                artist: artists[1]._id,
                description: 'An abstract interpretation of city life, where geometric shapes and bold colors create a rhythm reminiscent of an urban symphony.',
                medium: 'Acrylic on Canvas',
                year: 2023,
                imageUrl: artworkImages[1],
                category: 'painting',
                tags: ['abstract', 'urban', 'geometric'],
                room: 1,
                position3D: { wall: 'north', x: 3, y: 1.6, z: -4.9 },
                status: 'approved',
            },
            {
                title: 'Whispers of Culture',
                artist: artists[2]._id,
                description: 'A powerful photograph capturing an intimate moment of cultural exchange between two strangers in a bustling market.',
                medium: 'Photography',
                year: 2024,
                imageUrl: artworkImages[2],
                category: 'photography',
                tags: ['culture', 'people', 'street'],
                room: 1,
                position3D: { wall: 'east', x: 4.9, y: 1.6, z: -2 },
                status: 'approved',
            },
            {
                title: 'Digital Metamorphosis',
                artist: artists[0]._id,
                description: 'A series exploring transformation through digital manipulation. Organic forms morph into technological structures.',
                medium: 'Digital Art',
                year: 2024,
                imageUrl: artworkImages[3],
                category: 'digital',
                tags: ['transformation', 'technology', 'organic'],
                room: 1,
                position3D: { wall: 'east', x: 4.9, y: 1.6, z: 2 },
                status: 'approved',
            },
            {
                title: 'Fractured Reality',
                artist: artists[1]._id,
                description: 'Mixed media sculpture exploring the fragmentation of modern identity through shattered mirrors and reclaimed materials.',
                medium: 'Mixed Media',
                year: 2023,
                imageUrl: artworkImages[4],
                category: 'mixed-media',
                tags: ['sculpture', 'identity', 'modern'],
                room: 2,
                position3D: { wall: 'north', x: -3, y: 1.6, z: -4.9 },
                status: 'approved',
            },
            {
                title: 'Solitude in Blue',
                artist: artists[2]._id,
                description: 'A contemplative photograph of a lone figure standing at the edge of a vast ocean, bathed in blue twilight.',
                medium: 'Photography',
                year: 2024,
                imageUrl: artworkImages[5],
                category: 'photography',
                tags: ['solitude', 'ocean', 'blue'],
                room: 2,
                position3D: { wall: 'north', x: 3, y: 1.6, z: -4.9 },
                status: 'approved',
            },
            {
                title: 'Neural Gardens',
                artist: artists[0]._id,
                description: 'AI-assisted artwork visualizing neural networks as lush, overgrown gardens where data flows like water through organic pathways.',
                medium: 'AI-Assisted Digital',
                year: 2025,
                imageUrl: artworkImages[6],
                category: 'digital',
                tags: ['AI', 'neural', 'garden', 'technology'],
                room: 2,
                position3D: { wall: 'south', x: -3, y: 1.6, z: 4.9 },
                status: 'approved',
            },
            {
                title: 'Chromatic Dreams',
                artist: artists[1]._id,
                description: 'A vivid explosion of color on canvas, representing the wild landscapes of dreams and subconscious imagery.',
                medium: 'Oil on Canvas',
                year: 2024,
                imageUrl: artworkImages[7],
                category: 'painting',
                tags: ['color', 'dreams', 'abstract'],
                room: 2,
                position3D: { wall: 'south', x: 3, y: 1.6, z: 4.9 },
                status: 'approved',
            },
            {
                title: 'Echoes of Tomorrow',
                artist: artists[0]._id,
                description: 'Futuristic digital landscape where ancient ruins merge with advanced technology, suggesting cyclical nature of civilization.',
                medium: 'Digital Painting',
                year: 2025,
                imageUrl: artworkImages[8],
                category: 'digital',
                tags: ['future', 'ruins', 'civilization'],
                room: 3,
                position3D: { wall: 'north', x: 0, y: 1.6, z: -4.9 },
                status: 'approved',
            },
            {
                title: 'The Weight of Light',
                artist: artists[2]._id,
                description: 'Experimental photography using long exposure to capture the physical weight and movement of light through dark spaces.',
                medium: 'Long Exposure Photography',
                year: 2024,
                imageUrl: artworkImages[9],
                category: 'photography',
                tags: ['light', 'experimental', 'long-exposure'],
                room: 3,
                position3D: { wall: 'west', x: -4.9, y: 1.6, z: 0 },
                status: 'approved',
            },
            {
                title: 'Convergence',
                artist: artists[1]._id,
                description: 'A large-scale installation piece where parallel lines of steel and thread converge to a single vanishing point.',
                medium: 'Steel and Thread Installation',
                year: 2023,
                imageUrl: artworkImages[10],
                category: 'installation',
                tags: ['installation', 'geometric', 'perspective'],
                room: 3,
                position3D: { wall: 'east', x: 4.9, y: 1.6, z: 0 },
                status: 'approved',
            },
            {
                title: 'Bloom in Chaos',
                artist: artists[0]._id,
                description: 'Digital artwork depicting flowers blooming amidst urban destruction, symbolizing resilience and beauty in adversity.',
                medium: 'Digital Art',
                year: 2025,
                imageUrl: artworkImages[11],
                category: 'digital',
                tags: ['flowers', 'urban', 'resilience'],
                room: 3,
                position3D: { wall: 'south', x: 0, y: 1.6, z: 4.9 },
                status: 'approved',
            },
        ]);

        // Create events
        await Event.create([
            {
                title: 'Digital Horizons: A New Era of Art',
                description: 'Join us for an immersive virtual exhibition featuring the latest works from emerging digital artists. Experience art like never before in our 3D gallery space.',
                date: new Date('2026-04-15T18:00:00Z'),
                endDate: new Date('2026-04-15T21:00:00Z'),
                type: 'virtual',
                coverImage: 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=800',
                organizer: admin._id,
                featuredArtists: [artists[0]._id, artists[1]._id],
                maxAttendees: 200,
                status: 'upcoming',
            },
            {
                title: 'Photography Through the Lens of Culture',
                description: 'Sarah Okonkwo presents her latest collection, followed by a live Q&A about cultural photography and visual storytelling.',
                date: new Date('2026-05-01T15:00:00Z'),
                endDate: new Date('2026-05-01T17:00:00Z'),
                type: 'virtual',
                coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
                organizer: admin._id,
                featuredArtists: [artists[2]._id],
                maxAttendees: 150,
                status: 'upcoming',
            },
            {
                title: 'Abstract Expressions: Live Painting Session',
                description: 'Watch Marcus Chen create a new abstract piece live, with commentary on his process and techniques. Interactive audience participation encouraged.',
                date: new Date('2026-05-20T19:00:00Z'),
                endDate: new Date('2026-05-20T21:00:00Z'),
                type: 'hybrid',
                location: 'Virtual Gallery Room 2 & Studio 54, New York',
                coverImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
                organizer: admin._id,
                featuredArtists: [artists[1]._id],
                maxAttendees: 100,
                status: 'upcoming',
            },
        ]);

        console.log('Seed data created successfully!');
        console.log(`Admin: admin@virtualmuseum.com / admin123`);
        console.log(`Artist: elena@art.com / artist123`);
        console.log(`User: user@test.com / user1234`);
        console.log(`${artworks.length} artworks created across 3 rooms`);

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();

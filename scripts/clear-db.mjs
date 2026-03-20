import { MongoClient } from 'mongodb';

const URI = 'mongodb+srv://faatlabtech_db_user:COKBW0WVOaRgtvsd@ravecluster.e7c9j70.mongodb.net/?appName=ravecluster';

const COLLECTIONS = [
    'users',
    'posts',
    'campaigns',
    'applications',
    'messages',
    'notifications',
    'payments',
    'projects',
    'tickets',
    'disputes',
    'works',
];

async function main() {
    const client = new MongoClient(URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // Auto-detect DB name or use default
    const dbName = 'rave-social'; // adjust if different
    const db = client.db(dbName);

    // List actual collections that exist
    const existing = (await db.listCollections().toArray()).map(c => c.name);
    console.log('📦 Existing collections:', existing);

    let cleared = 0;
    for (const name of existing) {
        const result = await db.collection(name).deleteMany({});
        console.log(`🗑  Cleared "${name}" — ${result.deletedCount} documents removed`);
        cleared++;
    }

    console.log(`\n✅ Done. Cleared ${cleared} collection(s).`);
    await client.close();
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});

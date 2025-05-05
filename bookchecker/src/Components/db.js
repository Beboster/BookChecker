// db.js
const { MongoClient } = require('mongodb');

const uri = 'your-mongodb-uri-here'; // Replace with Atlas or local URI
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db('myDatabase');
    const collection = database.collection('myCollection');

    // Example: Insert a document
    const result = await collection.insertOne({ name: 'Test', age: 25 });
    console.log(`Inserted with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

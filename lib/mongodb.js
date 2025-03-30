export default async function ConnectToDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    return db;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

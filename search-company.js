const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'Stock';
const collectionName = 'PublicCompanies';

const client = new MongoClient(uri);

async function connectToDB() {
    try {
        await client.connect();
        console.log('Connected to Mongo');

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        return collection;
    } catch (error) {
        console.error('Error connecting to database:', error);
        return null;
    }
}

async function closeConnection() {
    try {
        await client.close();
        console.log("Database connection closed");
    } catch(error) {
        console.error('Error closing database connection', error);
    }
}

async function searchCompany(searchTerm, searchType, collection) {
    try {
        console.log("seaching for company");
        let query = {};
        if (searchType === "ticker") {
            query = { stock_ticker: searchTerm };
        } else if (searchType === "company") {
            query = { company_name: searchTerm };
        }
        return await collection.find(query).toArray();
    } catch (error) {
        console.error('No company found:', error);
        return [];
    }
}

module.exports = { connectToDB, searchCompany, closeConnection };

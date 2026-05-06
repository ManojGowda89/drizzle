import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { faker } from '@faker-js/faker';
import { usersTable } from './src/drizzle/schema/testtable.js';

const db = drizzle(process.env.DATABASE_URL);

async function seedDatabase() {
  console.log('🌱 Starting to seed database with 100 dummy users...');
  
  try {
    // Generate 100 dummy users
    const dummyUsers = Array.from({ length: 100 }, () => ({
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 80 }),
      email: faker.internet.email(),
      deviceid: faker.string.numeric(10),
    }));

    // Insert all users
    await db.insert(usersTable).values(dummyUsers);
    
    console.log('✓ Successfully inserted 100 dummy users');
    
    // Display total count
    const allUsers = await db.select().from(usersTable);
    console.log(`✓ Total users in database: ${allUsers.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();

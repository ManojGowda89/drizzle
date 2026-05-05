import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq, or } from 'drizzle-orm';
import { usersTable } from './src/drizzle/schema/testtable.js';
  
const db = drizzle(process.env.DATABASE_URL);

async function main() {
  // CREATE: Insert a new user
  const newUser = {
    name: 'Jane',
    age: 25,
    email: 'jane@example.com',
    deviceid: '0987654321',
  };
  
  await db.insert(usersTable).values(newUser);
  console.log('✓ User created');

  // READ: Get all users
  const allUsers = await db.select().from(usersTable);
  console.log('✓ All users:', allUsers);

  // READ: Get specific user
  const specificUser = await db.select().from(usersTable).where(eq(usersTable.name, 'John'));
  console.log('✓ Specific user:', specificUser);

  // UPDATE: Update user age
  await db
    .update(usersTable)
    .set({ age: 32 })
    .where(eq(usersTable.email, 'john@example.com'));
  console.log('✓ User updated');

  // READ: Search by name or email
  const searchTerm = 'Jane'; // User can input email or name here
  const searchResult = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.name, searchTerm), eq(usersTable.email, searchTerm)));
  console.log('✓ Search result (name or email):', searchResult);

  // DELETE: Delete user (commented out)
  // await db.delete(usersTable).where(eq(usersTable.email, 'jane@example.com'));
  // console.log('✓ User deleted');
}

main();

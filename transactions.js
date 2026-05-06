import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from './src/drizzle/schema/testtable.js';

const db = drizzle(process.env.DATABASE_URL);

// Transaction Example 1: Multiple inserts and updates
async function transactionExample1() {
  console.log('🔄 Transaction Example 1: Multiple operations...');
  
  try {
    await db.transaction(async (txx) => {
      // Insert multiple users
      await txx.insert(usersTable).values([
        {
          name: 'Alice',
          age: 28,
          email: 'alice@example.com',
          deviceid: '1111111111',
        },
        {
          name: 'Bob',
          age: 32,
          email: 'bob@example.com',
          deviceid: '2222222222',
          fix:"df"
        },
      ]);

      // Update user age
      await txx
        .update(usersTable)
        .set({ age: 35 })
        .where(eq(usersTable.name, 'John'));

      console.log('✓ All operations completed in transaction');
    });
  } catch (error) {
    console.error('✗ Transaction failed:', error.message);
  }
}

// Transaction Example 2: Conditional operations with rollback
async function transactionExample2() {
  console.log('\n🔄 Transaction Example 2: Conditional operations...');
  
  try {
    await db.transaction(async (tx) => {
      // Get user
      const user = await tx
        .select()
        .from(usersTable)
        .where(eq(usersTable.name, 'Alice'));

      if (user.length === 0) {
        throw new Error('User not found - transaction will rollback');
      }

      // Update if user exists
      await tx
        .update(usersTable)
        .set({ age: 29 })
        .where(eq(usersTable.name, 'Alice'));

      console.log('✓ User updated successfully');
    });
  } catch (error) {
    console.error('✗ Transaction rolled back:', error.message);
  }
}

// Transaction Example 3: Delete with transaction
async function transactionExample3() {
  console.log('\n🔄 Transaction Example 3: Delete operations...');
  
  try {
    await db.transaction(async (tx) => {
      // Delete user
      await tx
        .delete(usersTable)
        .where(eq(usersTable.email, 'bob@example.com'));

      console.log('✓ User deleted successfully');
    });
  } catch (error) {
    console.error('✗ Transaction failed:', error.message);
  }
}

// Run all examples
async function main() {
  console.log('📋 Transaction Examples\n');
  
  await transactionExample1();
//   await transactionExample2();
//   await transactionExample3();
  
  console.log('\n✓ All transaction examples completed');
  process.exit(0);
}

main();

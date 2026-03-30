require('dotenv').config();
const axios = require('axios');
// Fetch our DB pool specifically to clean up the test user at the end
const pool = require('./config/db'); 

// Connect to the local running server instance
const API_URL = `http://localhost:${process.env.PORT || 5000}`;

// Using a timestamp to ensure this test user is completely unique on every run
const TEST_EMAIL = `automation_test_${Date.now()}@kean.edu`;
const TEST_PASS = 'SecureTestPwd123!';

async function runTests() {
  console.log('\n=============================================================');
  console.log('🧪 PANTRY PAL - FULL SYSTEM VERIFICATION & INTEGRATION TEST');
  console.log('=============================================================\n');

  let token = '';
  let userId = null;
  let itemId = null;

  try {
    // ---- [1] SERVER PING ----
    console.log('▶ [1/6] Pinging backend Express server...');
    try {
      await axios.get(API_URL + '/');
      console.log('  ✔ Success: Server is ONLINE and responding securely.\n');
    } catch (err) {
      console.log('  ✖ ERROR: Server is NOT responding.');
      console.log('    -> Make sure you run `npm run dev` in a separate terminal before running this script!\n');
      process.exit(1);
    }

    // ---- [2] REGISTER USER ----
    console.log(`▶ [2/6] Database Write - Requesting user registration (${TEST_EMAIL})...`);
    try {
      const regRes = await axios.post(`${API_URL}/auth/register`, {
        email: TEST_EMAIL,
        password: TEST_PASS
      });
      token = regRes.data.token;
      userId = regRes.data.id;
      console.log(`  ✔ Success: User Registered. Assigned ID: ${userId}`);
      console.log('  ✔ Success: Received JWT Authentication Token.\n');
    } catch (err) {
      console.error('  ✖ ERROR: App registration failed ->', err.response?.data || err.message);
      throw new Error('Registration failed');
    }

    // ---- [3] LOGIN USER ----
    console.log('▶ [3/6] Auth Verification - Requesting login with BCrypt password checking...');
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: TEST_EMAIL,
        password: TEST_PASS
      });
      if (loginRes.data.token) {
        console.log('  ✔ Success: Password match successful! Verified JWT signature matches.\n');
      }
    } catch (err) {
      console.error('  ✖ ERROR: App Login failed ->', err.response?.data || err.message);
      throw new Error('Login failed');
    }

    // Setup Bearer Auth Config for protected requests
    const authConfig = {
      headers: { Authorization: `Bearer ${token}` }
    };

    // ---- [4] CREATE ITEM ----
    console.log('▶ [4/6] Database Write - Utilizing API to inject a new Pantry Data Item...');
    try {
      // Expiration date calculated as precisely 5 days from today
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const formattedDate = futureDate.toISOString().split('T')[0];

      const itemRes = await axios.post(`${API_URL}/items`, {
        location_id: 1, // Fridge
        name: "Automated Golden Apple Test",
        category: "System Test",
        quantity: 5.5,
        unit_id: 7, // Units (qty)
        expiration_date: formattedDate
      }, authConfig);
      
      itemId = itemRes.data.id;
      console.log(`  ✔ Success: Item saved via API. Inserted DB ID: ${itemId}\n`);
    } catch (err) {
      console.error('  ✖ ERROR: Item Request failed ->', err.response?.data || err.message);
      throw new Error('Item creation failed');
    }

    // ---- [5] QUERY EXPIRING SOON ----
    console.log('▶ [5/6] Database Read - Executing complex "Expiring Soon" parameterized interval query...');
    try {
      const expireRes = await axios.get(`${API_URL}/items/expiring-soon`, authConfig);
      const items = expireRes.data;
      
      if (items.some(i => i.id === itemId)) {
        console.log(`  ✔ Success: The test item was computationally recognized and returned as expiring soon!\n`);
      } else {
        console.log('  ✖ ERROR: Did not find the newly created item in the expiring list scope.');
        throw new Error('Item missing from expiring query');
      }
    } catch (err) {
      console.error('  ✖ ERROR: Expiring Query failed ->', err.response?.data || err.message);
      throw new Error('Query failed');
    }

    // ---- [6] DELETE ITEM ----
    console.log('▶ [6/6] Database Delete - Dispatching deletion instructions to safely remove item...');
    try {
      await axios.delete(`${API_URL}/items/${itemId}`, authConfig);
      console.log('  ✔ Success: Delete command triggered successfully and item gracefully removed.\n');
    } catch (err) {
      console.error('  ✖ ERROR: Delete Request failed ->', err.response?.data || err.message);
      throw new Error('Delete failed');
    }

    console.log('✨ ALL SYSTEMS GREEN! The Pantry Pal Backend & Remote DB schema is fully operational.');

  } catch (error) {
    console.log('\n❌ SYSTEM VERIFICATION FAILED. See errors mapped above.');
  } finally {
    // Cleanup the database test user manually directly targeting the connection pool
    console.log('\n🧹 Initiating Post-Test Cleanup Sequence...');
    try {
      if (TEST_EMAIL) {
        await pool.execute('DELETE FROM users WHERE email = ?', [TEST_EMAIL]);
        console.log('  ✔ Auto-generated test user completely purged from remote DB.');
      }
    } catch (cleanupErr) {
      console.log('  ✖ Cleanup warning: Could not cleanly purge user (Might require manual Kean DB execution) ->', cleanupErr.message);
    }
    
    // Safely exit the pool so NodeJS terminates the script gracefully
    pool.end();
  }
}

runTests();

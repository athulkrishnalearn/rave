const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const PROJECT_ID = '69bac4d5685c5aa0891da592'; // adjust if needed
const JWT_SECRET = process.env.JWT_SECRET || 'rave-secret-key';

async function main() {
  try {
    // 1️⃣ GET project to obtain vendor id
    const getRes = await fetch(`http://localhost:3000/api/project/${PROJECT_ID}`);
    const getData = await getRes.json();
    console.log('GET project status:', getRes.status, getData.project?.status, getData.project?.paymentStatus);
    const vendorId = getData.project?.vendor?.toString?.() || getData.project?.vendor;
    if (!vendorId) {
      console.error('Could not determine vendor id from project');
      return;
    }
    // 2️⃣ Create JWT for this vendor
    const token = jwt.sign({ id: vendorId, role: 'vendor' }, JWT_SECRET);
    const authHeader = { Authorization: `Bearer ${token}` };

    // 3️⃣ POST FUND_ESCROW
    const postRes = await fetch(`http://localhost:3000/api/project/${PROJECT_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ action: 'FUND_ESCROW', payload: {} })
    });
    const postData = await postRes.json();
    console.log('POST FUND_ESCROW status:', postRes.status, postData);

    // 4️⃣ GET again to see updated state
    const getRes2 = await fetch(`http://localhost:3000/api/project/${PROJECT_ID}`);
    const getData2 = await getRes2.json();
    console.log('GET after FUND_ESCROW status:', getRes2.status, getData2.project?.status, getData2.project?.paymentStatus);
  } catch (err) {
    console.error('Error during test:', err);
  }
}

main();

/**
 * Quick test script to verify NCM API token
 * Run with: npx ts-node scripts/test-ncm-token.ts
 */

import axios from "axios";

const NCM_API_BASE_URL = "https://demo.nepalcanmove.com/api";
const TOKEN = "009d25035b2da1b4533b0f2cbfe1877d510aaa7e";

async function testToken() {
  console.log("🔍 Testing NCM API Token...\n");
  console.log(`Token: ${TOKEN.slice(0, 10)}...${TOKEN.slice(-10)}`);
  console.log(`Token Length: ${TOKEN.length} characters\n`);

  // Test 1: Branches with Bearer token
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 1: GET /v2/branches with Bearer token");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  try {
    const res1 = await axios.get(`${NCM_API_BASE_URL}/v2/branches`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    console.log("✅ SUCCESS - Got", res1.data?.length || 0, "branches\n");
  } catch (error: any) {
    console.log("❌ FAILED -", error.response?.status, error.response?.data?.detail || error.message, "\n");
  }

  // Test 2: Branches with Token prefix
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 2: GET /v2/branches with Token prefix");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  try {
    const res2 = await axios.get(`${NCM_API_BASE_URL}/v2/branches`, {
      headers: { Authorization: `Token ${TOKEN}` },
    });
    console.log("✅ SUCCESS - Got", res2.data?.length || 0, "branches\n");
  } catch (error: any) {
    console.log("❌ FAILED -", error.response?.status, error.response?.data?.detail || error.message, "\n");
  }

  // Test 3: Create order with Token prefix
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 3: POST /v1/order/create with Token prefix");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  try {
    // This will fail with validation error but should NOT fail with auth error
    const res3 = await axios.post(
      `${NCM_API_BASE_URL}/v1/order/create`,
      { name: "Test", phone: "9800000000" }, // Incomplete data
      { headers: { Authorization: `Token ${TOKEN}`, "Content-Type": "application/json" } }
    );
    console.log("✅ SUCCESS -", res3.data, "\n");
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("❌ AUTH FAILED - Token is invalid\n");
    } else {
      console.log("⚠️ Validation error (expected) - Token is VALID\n");
      console.log("   Response:", error.response?.data, "\n");
    }
  }

  // Test 4: Create order with Bearer prefix
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Test 4: POST /v1/order/create with Bearer prefix");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  try {
    const res4 = await axios.post(
      `${NCM_API_BASE_URL}/v1/order/create`,
      { name: "Test", phone: "9800000000" },
      { headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" } }
    );
    console.log("✅ SUCCESS -", res4.data, "\n");
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("❌ AUTH FAILED - Bearer doesn't work for this endpoint\n");
    } else {
      console.log("⚠️ Validation error (expected) - Token is VALID with Bearer\n");
      console.log("   Response:", error.response?.data, "\n");
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Done! Check which auth format works for each endpoint.");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

testToken();

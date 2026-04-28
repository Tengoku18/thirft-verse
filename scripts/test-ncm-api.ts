/**
 * NCM API Test Script
 *
 * Run with: npx ts-node scripts/test-ncm-api.ts
 * Or: npx tsx scripts/test-ncm-api.ts
 *
 * This script tests each NCM API function independently.
 * Make sure EXPO_PUBLIC_NCM_API_TOKEN is set in your .env file.
 */

import axios from "axios";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const NCM_API_BASE_URL = "https://demo.nepalcanmove.com/api";
const NCM_API_TOKEN = process.env.EXPO_PUBLIC_NCM_API_TOKEN;

if (!NCM_API_TOKEN) {
  console.error("❌ EXPO_PUBLIC_NCM_API_TOKEN is not set in .env file");
  process.exit(1);
}

console.log("🔑 Using NCM API Token:", NCM_API_TOKEN.slice(0, 10) + "...");

// Create axios instance
const ncmApi = axios.create({
  baseURL: NCM_API_BASE_URL,
  headers: {
    Authorization: `Token ${NCM_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Test functions
async function testFetchBranches() {
  console.log("\n📍 TEST 1: Fetch NCM Branches");
  console.log("─".repeat(40));

  try {
    const response = await axios.get(`${NCM_API_BASE_URL}/v2/branches`, {
      headers: { Authorization: `Bearer ${NCM_API_TOKEN}` },
    });

    console.log("✅ Success! Found", response.data.length, "branches");
    console.log("📋 First 3 branches:");
    response.data.slice(0, 3).forEach((branch: any) => {
      console.log(
        `   - ${branch.name} (${branch.code}) - ${branch.district_name || "N/A"}`,
      );
    });
    return true;
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function testGetOrderDetails(orderId: number) {
  console.log("\n📦 TEST 2: Get Order Details (ID:", orderId, ")");
  console.log("─".repeat(40));

  try {
    const response = await ncmApi.get("/v1/order", {
      params: { id: orderId },
    });

    console.log("✅ Success! Order details:");
    console.log("   - Order ID:", response.data.orderid);
    console.log("   - COD Charge:", response.data.cod_charge);
    console.log("   - Delivery Charge:", response.data.delivery_charge);
    console.log("   - Delivery Status:", response.data.last_delivery_status);
    console.log("   - Payment Status:", response.data.payment_status);
    return true;
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function testGetOrderStatus(orderId: number) {
  console.log("\n📊 TEST 3: Get Order Status History (ID:", orderId, ")");
  console.log("─".repeat(40));

  try {
    const response = await ncmApi.get("/v1/order/status", {
      params: { id: orderId },
    });

    console.log("✅ Success! Status history:");
    response.data.forEach((status: any) => {
      console.log(`   - ${status.status} (${status.added_time})`);
    });
    return true;
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function testGetOrderComments(orderId: number) {
  console.log("\n💬 TEST 4: Get Order Comments (ID:", orderId, ")");
  console.log("─".repeat(40));

  try {
    const response = await ncmApi.get("/v1/order/comment", {
      params: { id: orderId },
    });

    console.log("✅ Success! Found", response.data.length, "comments:");
    response.data.slice(0, 3).forEach((comment: any) => {
      console.log(
        `   - [${comment.addedBy}]: ${comment.comments.slice(0, 50)}...`,
      );
    });
    return true;
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

async function testBulkStatuses(orderIds: number[]) {
  console.log("\n📋 TEST 5: Get Bulk Order Statuses");
  console.log("─".repeat(40));

  try {
    const response = await ncmApi.post("/v1/orders/statuses", {
      orders: orderIds,
    });

    console.log("✅ Success!");
    console.log("   Results:", response.data.result);
    console.log("   Errors (not found):", response.data.errors);
    return true;
  } catch (error: any) {
    console.error("❌ Failed:", error.response?.data || error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║     NCM API Integration Tests          ║");
  console.log("╚════════════════════════════════════════╝");

  const results: Record<string, boolean> = {};

  // Test 1: Fetch branches (should always work)
  results["Fetch Branches"] = await testFetchBranches();

  // For the remaining tests, we need a valid order ID
  // You can find order IDs by logging into the demo portal:
  // https://demo.nepalcanmove.com/
  // email: demovendor@ncm.com
  // password: m0hgMuP7rP

  // Use a test order ID (you may need to create one first or use an existing one)
  // These tests may fail if no orders exist for this vendor
  const testOrderId = 134; // Example order ID from documentation

  results["Get Order Details"] = await testGetOrderDetails(testOrderId);
  results["Get Order Status"] = await testGetOrderStatus(testOrderId);
  results["Get Order Comments"] = await testGetOrderComments(testOrderId);
  results["Bulk Statuses"] = await testBulkStatuses([testOrderId, 9999]); // 9999 should fail

  // Summary
  console.log("\n╔════════════════════════════════════════╗");
  console.log("║           Test Summary                 ║");
  console.log("╚════════════════════════════════════════╝");

  let passed = 0;
  let failed = 0;

  Object.entries(results).forEach(([test, result]) => {
    if (result) {
      console.log(`✅ ${test}`);
      passed++;
    } else {
      console.log(`❌ ${test}`);
      failed++;
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log("\n💡 Tips:");
    console.log("   - Make sure EXPO_PUBLIC_NCM_API_TOKEN is correct in .env");
    console.log("   - The test order ID (134) may not exist for your vendor");
    console.log(
      "   - Log into https://demo.nepalcanmove.com to check your orders",
    );
    console.log(
      "   - Create a test order first using the 'Move to NCM' flow in your app",
    );
  }
}

runTests().catch(console.error);

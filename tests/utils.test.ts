import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { formatCurrency } from "@/lib/utils";
import { checkRateLimit } from "@/lib/security";

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    test("formats EUR currency for German locale", () => {
      const result = formatCurrency(1234.56, "de", "EUR");
      // German format uses non-breaking space and comma
      assert.ok(result.includes("1.234,56"));
      assert.ok(result.includes("€"));
    });

    test("formats USD currency for English locale", () => {
      const result = formatCurrency(1234.56, "en", "USD");
      assert.ok(result.includes("1,234.56"));
      assert.ok(result.includes("$"));
    });

    test("formats 0 gracefully", () => {
      const result = formatCurrency(0, "de", "EUR");
      assert.ok(result.includes("0,00"));
    });
  });

  describe("Security Rate Limiter", () => {
    test("allows requests up to maxRequests", () => {
      const id = "test-client-" + Date.now();
      const r1 = checkRateLimit(id, 3, 5000);
      assert.equal(r1.allowed, true);
      assert.equal(r1.remaining, 2);

      const r2 = checkRateLimit(id, 3, 5000);
      assert.equal(r2.allowed, true);
      assert.equal(r2.remaining, 1);

      const r3 = checkRateLimit(id, 3, 5000);
      assert.equal(r3.allowed, true);
      assert.equal(r3.remaining, 0);

      const r4 = checkRateLimit(id, 3, 5000);
      assert.equal(r4.allowed, false);
      assert.equal(r4.remaining, 0);
    });
  });

  describe("Utility Tracker Helpers", () => {
    test("linearRegression computes accurate trend slope", async () => {
      const { linearRegression } = await import("@/components/utilities/utility-helpers");
      // y = 2x + 1 for x in [0, 1, 2] -> values = [1, 3, 5]
      const result = linearRegression([1, 3, 5]);
      assert.equal(Math.round(result.slope), 2);
      assert.equal(Math.round(result.intercept), 1);
    });

    test("parseGermanMonth parses month strings correctly", async () => {
      const { parseGermanMonth } = await import("@/components/utilities/utility-helpers");
      const d1 = parseGermanMonth("Jan 2026");
      assert.ok(d1);
      assert.equal(d1?.getFullYear(), 2026);
      assert.equal(d1?.getMonth(), 0);

      const d2 = parseGermanMonth("Dez. 2025");
      assert.ok(d2);
      assert.equal(d2?.getFullYear(), 2025);
      assert.equal(d2?.getMonth(), 11);
    });

    test("getEfficiencyGrade calculates grades based on avg delta", async () => {
      const { getEfficiencyGrade } = await import("@/components/utilities/utility-helpers");
      assert.equal(getEfficiencyGrade(-12).grade, "A+");
      assert.equal(getEfficiencyGrade(-7).grade, "A");
      assert.equal(getEfficiencyGrade(-2).grade, "B");
      assert.equal(getEfficiencyGrade(3).grade, "C");
      assert.equal(getEfficiencyGrade(8).grade, "D");
      assert.equal(getEfficiencyGrade(15).grade, "F");
    });
  });
});

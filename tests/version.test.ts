import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { isVersionLessThan } from "@/lib/utils/version";

describe("Version Comparison Utility (isVersionLessThan)", () => {
  test("identifies standard semantic version upgrades correctly", () => {
    assert.equal(isVersionLessThan("1.9.0", "1.10.0"), true);
    assert.equal(isVersionLessThan("1.10.0", "1.9.0"), false);
    assert.equal(isVersionLessThan("1.9.1", "1.9.2"), true);
    assert.equal(isVersionLessThan("2.0.0", "1.99.99"), false);
  });

  test("handles identical versions", () => {
    assert.equal(isVersionLessThan("1.10.0", "1.10.0"), false);
    assert.equal(isVersionLessThan("0.1.0", "0.1.0"), false);
  });

  test("handles pre-release tags correctly", () => {
    // Current is stable, latest is prerelease of same version
    assert.equal(isVersionLessThan("1.10.0", "1.10.0-rc.1"), false);

    // Current is older than prerelease of next version
    assert.equal(isVersionLessThan("1.9.0", "1.10.0-rc.1"), true);

    // Current is prerelease, latest is stable of same version
    assert.equal(isVersionLessThan("1.10.0-rc.1", "1.10.0"), true);

    // Prerelease comparison
    assert.equal(isVersionLessThan("1.10.0-rc.1", "1.10.0-rc.2"), true);
    assert.equal(isVersionLessThan("1.10.0-rc.2", "1.10.0-rc.1"), false);
  });

  test("handles v prefixes", () => {
    assert.equal(isVersionLessThan("v1.9.0", "v1.10.0"), true);
    assert.equal(isVersionLessThan("v1.10.0", "1.9.0"), false);
  });
});


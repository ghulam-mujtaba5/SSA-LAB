import dotenv from "dotenv";
import { execSync } from "child_process";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function runM1IdempotencyTest() {
  console.log("================================================================================");
  console.log("🔍 SSA LAB - M1 SEEDING IDEMPOTENCY & STABILITY EMPIRICAL TEST");
  console.log("================================================================================\n");

  const dbConnectModule = await import("../lib/mongoose.js");
  const dbConnect = dbConnectModule.default;
  await dbConnect();

  const LabProfile = (await import("../models/LabProfile.js")).default;
  const Publication = (await import("../models/Publication.js")).default;
  const Member = (await import("../models/Member.js")).default;
  const ResearchDomain = (await import("../models/ResearchDomain.js")).default;
  const EventHighlight = (await import("../models/EventHighlight.js")).default;
  const FypProject = (await import("../models/FypProject.js")).default;
  const Project = (await import("../models/Project.js")).default;

  const contentModels = {
    LabProfile,
    ResearchDomain,
    Publication,
    Project,
    Member,
    EventHighlight,
    FypProject,
  };

  async function getCollectionSnapshot() {
    const snapshot = {};
    for (const [name, model] of Object.entries(contentModels)) {
      const docs = await model.find().sort({ slug: 1, key: 1 }).lean();
      const count = docs.length;
      // Strip dynamic Mongo fields like updatedAt for checksum
      const normalizedDocs = docs.map(d => {
        const copy = { ...d };
        delete copy.updatedAt;
        delete copy.__v;
        return copy;
      });
      const hash = crypto.createHash("sha256").update(JSON.stringify(normalizedDocs)).digest("hex");
      snapshot[name] = { count, hash };
    }
    return snapshot;
  }

  // Pre-seed clean baseline
  console.log("📦 Preparing baseline seeding state...");
  execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

  const baselineSnapshot = await getCollectionSnapshot();
  console.log("\n📊 Baseline Snapshot (Counts & SHA256 Data Hashes):");
  console.table(baselineSnapshot);

  // Execute 3 successive runs
  for (let run = 1; run <= 3; run++) {
    console.log(`\n▶️ Executing Successive Run #${run}...`);
    execSync("node scripts/seed-all-data.js", { encoding: "utf-8" });

    const currentSnapshot = await getCollectionSnapshot();
    let isIdentical = true;

    for (const [name, data] of Object.entries(baselineSnapshot)) {
      if (currentSnapshot[name].count !== data.count || currentSnapshot[name].hash !== data.hash) {
        isIdentical = false;
        console.error(`  ❌ Mismatch in ${name}: Count ${data.count} -> ${currentSnapshot[name].count}, Hash changed!`);
      }
    }

    if (isIdentical) {
      console.log(`  ✅ Run #${run} PASSED: 100% Bit-for-Bit Identical Content & Document Counts across all 7 M1 collections!`);
    } else {
      console.error(`  ❌ Run #${run} FAILED`);
      process.exit(1);
    }
  }

  console.log("\n================================================================================");
  console.log("🎉 ALL 3 SUCCESSIVE RUNS PROVED 100% IDEMPOTENT AND DETERMINISTIC!");
  console.log("================================================================================");
  process.exit(0);
}

runM1IdempotencyTest().catch(err => {
  console.error("FATAL ERROR in test:", err);
  process.exit(1);
});

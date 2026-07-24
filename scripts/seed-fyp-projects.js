const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

dotenv.config({ path: ".env.local" });

async function seedFypProjects() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured in .env.local");
  }

  const sourcePath = path.join(__dirname, "..", "data", "fypProjects.js");
  const source = fs
    .readFileSync(sourcePath, "utf8")
    .replace(
      "export const defaultFypProjects =",
      "globalThis.defaultFypProjects =",
    );
  const sandbox = {};
  vm.runInNewContext(source, sandbox, { filename: sourcePath });
  const defaultFypProjects = sandbox.defaultFypProjects;

  await mongoose.connect(process.env.MONGODB_URI);
  const collection = mongoose.connection.collection("fypprojects");

  for (const project of defaultFypProjects) {
    await collection.updateOne(
      { slug: project.slug },
      {
        $set: { ...project, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );
  }

  console.log(`Seeded ${defaultFypProjects.length} FYP project record(s).`);
}

seedFypProjects()
  .catch((error) => {
    console.error("FYP seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

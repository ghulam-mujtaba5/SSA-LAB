const STRING_FIELDS = [
  "title",
  "summary",
  "status",
  "projectType",
  "nature",
  "programme",
  "session",
  "institution",
  "supervisor",
  "coSupervisor",
  "problem",
  "solution",
  "outcome",
  "coverImage",
  "coverAlt",
  "liveUrl",
  "repositoryUrl",
];

const ARRAY_FIELDS = [
  "specializations",
  "sdgs",
  "objectives",
  "features",
  "technologies",
  "contributions",
  "limitations",
  "futureWork",
];

export function slugifyFypTitle(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, "-")
    .slice(0, 180);
}

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map(cleanString).filter(Boolean).slice(0, 50);
}

export function normalizeFypPayload(input = {}) {
  const output = {};

  for (const field of STRING_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      output[field] = cleanString(input[field]);
    }
  }

  for (const field of ARRAY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      output[field] = cleanStringArray(input[field]);
    }
  }

  if (Object.prototype.hasOwnProperty.call(input, "students")) {
    output.students = Array.isArray(input.students)
      ? input.students
          .map((student) => ({
            name: cleanString(student?.name),
            registration: cleanString(student?.registration),
          }))
          .filter((student) => student.name)
          .slice(0, 20)
      : [];
  }

  if (Object.prototype.hasOwnProperty.call(input, "architecture")) {
    output.architecture = Array.isArray(input.architecture)
      ? input.architecture
          .map((stage) => ({
            title: cleanString(stage?.title),
            detail: cleanString(stage?.detail),
          }))
          .filter((stage) => stage.title)
          .slice(0, 12)
      : [];
  }

  if (Object.prototype.hasOwnProperty.call(input, "gallery")) {
    output.gallery = Array.isArray(input.gallery)
      ? input.gallery
          .map((image, index) => ({
            url: cleanString(image?.url),
            caption: cleanString(image?.caption),
            alt: cleanString(image?.alt),
            order: Number.isFinite(Number(image?.order))
              ? Number(image.order)
              : index,
          }))
          .filter((image) => image.url)
          .slice(0, 20)
      : [];
  }

  for (const field of ["published", "featured"]) {
    if (Object.prototype.hasOwnProperty.call(input, field)) {
      output[field] = Boolean(input[field]);
    }
  }

  if (Object.prototype.hasOwnProperty.call(input, "displayOrder")) {
    output.displayOrder = Number.isFinite(Number(input.displayOrder))
      ? Number(input.displayOrder)
      : 0;
  }

  if (output.title) output.slug = slugifyFypTitle(output.title);

  return output;
}


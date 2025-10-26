// seed.mjs  — No dotenv version (ESM)

import mongoose from "mongoose";

// ---- 1) Read ENV (no dotenv)
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI تعریف نشده. هنگام اجرای اسکریپت حتماً ENV را ست کن یا از --env-file استفاده کن.");
  process.exit(1);
}

// ---- 2) Import models (ensure file names/case match!)
import Product from "../models/Product.js";
import Project from "../models/Project.js";

// Optional local Counter model (if you use getNextId with 'counters' collection)
import { Schema } from "mongoose";
const Counter =
  mongoose.models.Counter ||
  mongoose.model(
    "Counter",
    new Schema({ name: { type: String, unique: true }, value: { type: Number, default: 0 } }, { versionKey: false })
  );

// ---- 3) Connect
console.log("⏳ Connecting Mongo…");
await mongoose.connect(MONGODB_URI);
console.log("✅ Connected\n");

// ---- 4) Clean collections
await Product.deleteMany({});
await Project.deleteMany({});
console.log("🧹 Cleared collections: products, projects\n");

// ---- 5) Seed data (8 products, 6 projects) — all with non-empty specs/highlights
const products = [
  {
    numericId: 1,
    title: "Planetary Gearbox Model A",
    short: "Suitable for industrial robots with high precision",
    gallery: [
      "/placeholders/p-planetary1.jpg",
      "/placeholders/p-planetary2.jpg",
      "/placeholders/p-planetary3.jpg",
    ],
    badges: ["Precision", "Industrial", "Planetary"],
    specs: [
      ["Gear Ratio", "1:20"],
      ["Rated Torque", "80 Nm"],
      ["Motor Input", "NEMA 23"],
      ["Backlash", "< 8 arc-min"],
      ["Weight", "2.1 kg"],
    ],
    highlights: ["High efficiency", "Low backlash", "Durable aluminum housing"],
  },
  {
    numericId: 2,
    title: "Planetary Gearbox Model B",
    short: "Budget-friendly version for light automation",
    gallery: [
      "/placeholders/p-gearB1.jpg",
      "/placeholders/p-gearB2.jpg",
      "/placeholders/p-gearB3.jpg",
    ],
    badges: ["Planetary", "Automation"],
    specs: [
      ["Gear Ratio", "1:15"],
      ["Torque", "50 Nm"],
      ["Input", "NEMA 17"],
    ],
    highlights: ["Affordable price", "Compatible with 3D printers"],
  },
  {
    numericId: 3,
    title: "Adjustable 3D-Printed Stand",
    short: "For light tools and educational projects",
    gallery: [
      "/placeholders/p-stand1.jpg",
      "/placeholders/p-stand2.jpg",
      "/placeholders/p-stand3.jpg",
    ],
    badges: ["3D Print"],
    specs: [
      ["Dimensions", "120×80 mm"],
      ["Material", "PETG"],
    ],
    highlights: ["Fast height adjustment", "Lightweight"],
  },
  {
    numericId: 4,
    title: "3D-Printed Tool Holder",
    short: "Multi-purpose workshop holder",
    gallery: [
      "/placeholders/p-holder1.jpg",
      "/placeholders/p-holder2.jpg",
      "/placeholders/p-holder3.jpg",
    ],
    badges: ["3D Print", "Holder"],
    specs: [
      ["Dimensions", "100×100 mm"],
      ["Weight", "120 g"],
    ],
    highlights: ["High print quality", "Modular design"],
  },
  {
    numericId: 5,
    title: "Educational Motion Mechanism",
    short: "Four-bar for teaching motion analysis",
    gallery: [
      "/placeholders/p-motion1.jpg",
      "/placeholders/p-motion2.jpg",
      "/placeholders/p-motion3.jpg",
    ],
    badges: ["Education"],
    specs: [
      ["Type", "Four-Bar Mechanism"],
      ["Material", "Aluminum"],
    ],
    highlights: ["University-friendly", "Easy assembly & maintenance"],
  },
  {
    numericId: 6,
    title: "Mini Educational Gearbox",
    short: "Designed for student competition robots",
    gallery: [
      "/placeholders/p-eduGear1.jpg",
      "/placeholders/p-eduGear2.jpg",
      "/placeholders/p-eduGear3.jpg",
    ],
    badges: ["Education", "Small"],
    specs: [
      ["Gear Ratio", "1:30"],
      ["Motor Input", "DC 550"],
    ],
    highlights: ["Compact & lightweight", "Cost-effective"],
  },
  {
    numericId: 7,
    title: "Omni Wheel (All-Directional)",
    short: "Move in all directions for smart robots",
    gallery: [
      "/placeholders/p-omni1.jpg",
      "/placeholders/p-omni2.jpg",
      "/placeholders/p-omni3.jpg",
    ],
    badges: ["OmniWheel", "Robotics"],
    specs: [
      ["Diameter", "100 mm"],
      ["Width", "40 mm"],
    ],
    highlights: ["High maneuverability", "Good traction"],
  },
  {
    numericId: 8,
    title: "Power Transmission Educational Kit",
    short: "Learn gearbox and power transmission concepts",
    gallery: [
      "/placeholders/p-kit1.jpg",
      "/placeholders/p-kit2.jpg",
      "/placeholders/p-kit3.jpg",
    ],
    badges: ["Education"],
    specs: [
      ["Number of Gears", "8"],
      ["Recommended Age", "12+ years"],
    ],
    highlights: ["Conceptual learning", "Ideal for class and home"],
  },
];

const projects = [
  {
    numericId: 1,
    title: "Robotic Bar Screen (RBS)",
    summary: "Smart bar screen robot for wastewater networks",
    overview:
      "The Robotic Bar Screen (RBS) is an automated solution designed to safely and efficiently clean wastewater channels. With IoT connectivity and real-time control, it reduces manpower needs, lowers maintenance costs, and enhances operational reliability for municipalities and industrial plants.",
    gallery: [
      "/placeholders/pr-rbs1.jpg",
      "/placeholders/pr-rbs2.jpg",
      "/placeholders/pr-rbs3.jpg",
    ],
    year: 2022,
    status: "delivered",
    tags: ["Wastewater", "Automation", "IoT"],
    specs: [
      ["Power", "1.2 kW"],
      ["Channel Width", "600–900 mm"],
      ["Communication", "Modbus/MQTT"],
    ],
    highlights: [
      "Automated and safe",
      "Reduced maintenance cost",
      "Delivered to municipality",
    ],
  },
  {
    numericId: 2,
    title: "MoltenMover",
    summary: "Safe transport of molten materials",
    overview:
      "MoltenMover is a robotic carrier engineered to handle high-temperature molten metals safely within foundries. Designed with advanced safety systems and precision motion control, it minimizes human exposure to hazards and increases productivity in industrial operations.",
    gallery: [
      "/placeholders/pr-molten1.jpg",
      "/placeholders/pr-molten2.jpg",
      "/placeholders/pr-molten3.jpg",
    ],
    year: 2024,
    status: "in-progress",
    tags: ["Foundry", "Safety"],
    specs: [
      ["Capacity", "200 kg"],
      ["Max Temperature", "1200°C"],
    ],
    highlights: ["High safety", "Industrial application"],
  },
  {
    numericId: 3,
    title: "Off-Grid Solar System",
    summary: "Independent energy supply for remote locations",
    overview:
      "A robust and scalable photovoltaic power system that ensures continuous electricity supply in off-grid environments. Designed for rural areas, remote facilities, and industrial sites, it provides reliable power while significantly lowering operational costs and environmental impact.",
    gallery: [
      "/placeholders/pr-solar1.jpg",
      "/placeholders/pr-solar2.jpg",
      "/placeholders/pr-solar3.jpg",
    ],
    year: 2023,
    status: "delivered",
    tags: ["Solar", "Energy"],
    specs: [
      ["PV Power", "3 kWp"],
      ["Battery", "15 kWh"],
      ["Voltage", "48V"],
    ],
    highlights: ["24/7 reliability", "Reduced fuel cost"],
  },
  {
    numericId: 4,
    title: "Linear Robot Mechanism",
    summary: "Precise X-axis motion",
    overview:
      "A high-precision linear motion module developed for laboratory automation, CNC attachments, and testing equipment. Featuring a servo drive and rigid structure, it offers smooth, accurate positioning suitable for prototyping and research applications.",
    gallery: [
      "/placeholders/pr-linear1.jpg",
      "/placeholders/pr-linear2.jpg",
      "/placeholders/pr-linear3.jpg",
    ],
    year: 2024,
    status: "prototype",
    tags: ["Linear", "Mechanism"],
    specs: [
      ["Stroke", "300 mm"],
      ["Motor", "Servo"],
    ],
    highlights: ["Precise control", "Laboratory applications"],
  },
  {
    numericId: 5,
    title: "Industrial Warehouse Robot",
    summary: "Autonomous goods handling in warehouses",
    overview:
      "This AGV-based warehouse robot automates internal logistics with intelligent navigation and payload control. It helps businesses optimize order processing, reduce manual labor, and improve warehouse safety and operational speed.",
    gallery: [
      "/placeholders/pr-warehouse1.jpg",
      "/placeholders/pr-warehouse2.jpg",
      "/placeholders/pr-warehouse3.jpg",
    ],
    year: 2023,
    status: "in-progress",
    tags: ["AGV", "Logistics"],
    specs: [
      ["Speed", "1.5 m/s"],
      ["Battery", "48V LiFePO4"],
    ],
    highlights: ["Fully autonomous", "Optimized delivery time"],
  },
  {
    numericId: 6,
    title: "Smart Hydroponic System",
    summary: "Smart soil-less agriculture",
    overview:
      "An AI-enabled hydroponic farming system that maximizes productivity while minimizing water consumption. Sensors and automation provide optimal nutrient delivery, climate tuning, and remote management, making it ideal for modern sustainable agriculture.",
    gallery: [
      "/placeholders/pr-hydro1.jpg",
      "/placeholders/pr-hydro2.jpg",
      "/placeholders/pr-hydro3.jpg",
    ],
    year: 2025,
    status: "prototype",
    tags: ["IoT", "Agriculture"],
    specs: [
      ["Capacity", "150 plants"],
      ["Water Saving", "70%"],
    ],
    highlights: ["Fully automated", "Remote monitoring"],
  },
];


export { products, projects };


// ---- 6) Insert
await Product.insertMany(products);
await Project.insertMany(projects);
console.log("✅ Inserted: products(8), projects(6)");

// ---- 7) Update counters (if you use getNextId with counters)
const maxProd = Math.max(...products.map((x) => x.numericId));
const maxProj = Math.max(...projects.map((x) => x.numericId));
await Counter.updateOne({ name: "products" }, { $set: { value: maxProd } }, { upsert: true });
await Counter.updateOne({ name: "projects" }, { $set: { value: maxProj } }, { upsert: true });
console.log("🔢 Counters updated.");

// ---- 8) Done
await mongoose.disconnect();
console.log("🔌 Disconnected. 🎉 Seed done.");
process.exit(0);

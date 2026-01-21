import prisma from "../src/config/db.js";

async function main() {
  console.log("🌱 Seeding database (Cities + Activities + CityActivity mapping)...");

  /* ===================== CITIES ===================== */
  const cities = [
    { name: "Bengaluru", country: "India", costIndex: 3 },
    { name: "Mysuru", country: "India", costIndex: 2 },
    { name: "Mangaluru", country: "India", costIndex: 2 },
    { name: "Chennai", country: "India", costIndex: 3 },
    { name: "Hyderabad", country: "India", costIndex: 3 },
    { name: "Mumbai", country: "India", costIndex: 4 },
    { name: "Delhi", country: "India", costIndex: 4 },
    { name: "Jaipur", country: "India", costIndex: 2 },
    { name: "Goa", country: "India", costIndex: 3 },
    { name: "Kochi", country: "India", costIndex: 2 },

    { name: "Paris", country: "France", costIndex: 5 },
    { name: "Rome", country: "Italy", costIndex: 4 },
    { name: "London", country: "United Kingdom", costIndex: 5 },
    { name: "Amsterdam", country: "Netherlands", costIndex: 4 },
    { name: "Barcelona", country: "Spain", costIndex: 4 },

    { name: "New York", country: "USA", costIndex: 5 },
    { name: "Los Angeles", country: "USA", costIndex: 4 },
    { name: "San Francisco", country: "USA", costIndex: 5 },
    { name: "Chicago", country: "USA", costIndex: 4 },

    { name: "Tokyo", country: "Japan", costIndex: 5 },
    { name: "Kyoto", country: "Japan", costIndex: 4 },
    { name: "Osaka", country: "Japan", costIndex: 4 },

    { name: "Dubai", country: "UAE", costIndex: 5 },
    { name: "Abu Dhabi", country: "UAE", costIndex: 5 },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: {
        name_country: { name: city.name, country: city.country },
      },
      update: { costIndex: city.costIndex },
      create: city,
    });
  }

  console.log("✅ Cities seeded");

  /* ===================== ACTIVITIES ===================== */
  const activities = [
    // India
    ["Lalbagh Botanical Garden Visit", "Nature", 150, 2],
    ["Cubbon Park Morning Walk", "Nature", 0, 1],
    ["Mysore Palace Guided Tour", "Heritage", 300, 3],
    ["Brindavan Gardens Light Show", "Leisure", 200, 2],
    ["Panambur Beach Walk", "Leisure", 0, 2],
    ["St. Aloysius Chapel Visit", "Culture", 100, 1],
    ["Marina Beach Sunrise Walk", "Nature", 0, 2],
    ["Kapaleeshwarar Temple Visit", "Spiritual", 50, 1],
    ["Charminar Heritage Walk", "Heritage", 100, 2],
    ["Ramoji Film City Tour", "Entertainment", 1500, 6],
    ["Gateway of India Visit", "Landmark", 0, 1],
    ["Elephanta Caves Tour", "Heritage", 600, 4],
    ["Red Fort Historical Tour", "Heritage", 200, 3],
    ["India Gate Evening Walk", "Leisure", 0, 1],
    ["Amber Fort Exploration", "Heritage", 300, 3],
    ["Hawa Mahal Photo Stop", "Landmark", 50, 1],
    ["Goa Beach Leisure Time", "Leisure", 0, 3],
    ["Scuba Diving Experience", "Adventure", 3500, 4],
    ["Backwater Houseboat Ride", "Leisure", 2500, 4],
    ["Fort Kochi Cultural Walk", "Culture", 300, 2],

    // Europe
    ["Eiffel Tower Observation Deck", "Landmark", 2500, 2],
    ["Louvre Museum Exploration", "Museum", 2000, 4],
    ["Colosseum Historical Tour", "Heritage", 2200, 3],
    ["Vatican Museums Visit", "Museum", 2500, 4],
    ["London Eye Ride", "Landmark", 3000, 1],
    ["British Museum Tour", "Museum", 0, 3],
    ["Amsterdam Canal Cruise", "Leisure", 1800, 2],
    ["Anne Frank House Visit", "Museum", 1200, 2],
    ["Sagrada Familia Tour", "Landmark", 2000, 3],
    ["La Rambla Walking Tour", "Culture", 0, 2],

    // USA
    ["Statue of Liberty Ferry Visit", "Landmark", 2800, 3],
    ["Central Park Relaxed Walk", "Nature", 0, 2],
    ["Hollywood Walk of Fame", "Landmark", 0, 2],
    ["Universal Studios Tour", "Entertainment", 5000, 6],
    ["Golden Gate Bridge Photo Stop", "Landmark", 0, 1],
    ["Alcatraz Island Tour", "Heritage", 3500, 4],
    ["Millennium Park Visit", "Leisure", 0, 2],
    ["Chicago River Architecture Cruise", "Leisure", 2500, 2],

    // Japan
    ["Shinkansen Bullet Train Ride", "Transport", 6000, 2],
    ["Tokyo Skytree Observation Deck", "Landmark", 3000, 2],
    ["Kyoto Temple & Shrine Visit", "Spiritual", 1000, 3],
    ["Traditional Tea Ceremony Experience", "Culture", 2000, 2],
    ["Osaka Street Food Tour", "Food", 1500, 3],
    ["Osaka Castle Visit", "Heritage", 400, 2],

    // UAE
    ["Desert Safari with Dune Bashing", "Adventure", 3500, 4],
    ["Burj Khalifa Observation Deck Visit", "Landmark", 4000, 2],
    ["Luxury Marina Yacht Cruise", "Leisure", 5000, 3],
    ["Sheikh Zayed Grand Mosque Visit", "Spiritual", 0, 2],
    ["Ferrari World Theme Park", "Entertainment", 6000, 6],
  ];

  for (const [title, category, cost, duration] of activities) {
    await prisma.activity.upsert({
      where: { title },
      update: {},
      create: { title, category, cost, duration },
    });
  }

  console.log("✅ Activities seeded");

  /* ===================== CITY ↔ ACTIVITY MAPPING ===================== */
  const cityActivities = {
    Bengaluru: ["Lalbagh Botanical Garden Visit", "Cubbon Park Morning Walk"],
    Mysuru: ["Mysore Palace Guided Tour", "Brindavan Gardens Light Show"],
    Mangaluru: ["Panambur Beach Walk", "St. Aloysius Chapel Visit"],
    Chennai: ["Marina Beach Sunrise Walk", "Kapaleeshwarar Temple Visit"],
    Hyderabad: ["Charminar Heritage Walk", "Ramoji Film City Tour"],
    Mumbai: ["Gateway of India Visit", "Elephanta Caves Tour"],
    Delhi: ["Red Fort Historical Tour", "India Gate Evening Walk"],
    Jaipur: ["Amber Fort Exploration", "Hawa Mahal Photo Stop"],
    Goa: ["Goa Beach Leisure Time", "Scuba Diving Experience"],
    Kochi: ["Backwater Houseboat Ride", "Fort Kochi Cultural Walk"],

    Paris: ["Eiffel Tower Observation Deck", "Louvre Museum Exploration"],
    Rome: ["Colosseum Historical Tour", "Vatican Museums Visit"],
    London: ["London Eye Ride", "British Museum Tour"],
    Amsterdam: ["Amsterdam Canal Cruise", "Anne Frank House Visit"],
    Barcelona: ["Sagrada Familia Tour", "La Rambla Walking Tour"],

    "New York": ["Statue of Liberty Ferry Visit", "Central Park Relaxed Walk"],
    "Los Angeles": ["Hollywood Walk of Fame", "Universal Studios Tour"],
    "San Francisco": ["Golden Gate Bridge Photo Stop", "Alcatraz Island Tour"],
    Chicago: ["Millennium Park Visit", "Chicago River Architecture Cruise"],

    Tokyo: ["Shinkansen Bullet Train Ride", "Tokyo Skytree Observation Deck"],
    Kyoto: ["Kyoto Temple & Shrine Visit", "Traditional Tea Ceremony Experience"],
    Osaka: ["Osaka Street Food Tour", "Osaka Castle Visit"],

    Dubai: ["Desert Safari with Dune Bashing", "Burj Khalifa Observation Deck Visit"],
    "Abu Dhabi": ["Sheikh Zayed Grand Mosque Visit", "Ferrari World Theme Park"],
  };

  const allCities = await prisma.city.findMany();
  const allActivities = await prisma.activity.findMany();

  const cityMap = Object.fromEntries(allCities.map(c => [c.name, c.id]));
  const activityMap = Object.fromEntries(allActivities.map(a => [a.title, a.id]));

  for (const city in cityActivities) {
    for (const activity of cityActivities[city]) {
      await prisma.cityActivity.upsert({
        where: {
          cityId_activityId: {
            cityId: cityMap[city],
            activityId: activityMap[activity],
          },
        },
        update: {},
        create: {
          cityId: cityMap[city],
          activityId: activityMap[activity],
        },
      });
    }
  }

  console.log("✅ City–Activity mappings seeded");
  console.log("🎉 Database seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

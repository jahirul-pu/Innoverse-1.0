import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Categories ──────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Audio", slug: "audio", icon: "🎧", description: "Earbuds, headphones, speakers & more", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { name: "Smart Home", slug: "smart-home", icon: "🏠", description: "Smart plugs, LED strips, cameras & automation", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { name: "Wearables", slug: "wearables", icon: "⌚", description: "Smartwatches, fitness bands & trackers", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { name: "Accessories", slug: "accessories", icon: "🔌", description: "Cables, chargers, hubs & peripherals", sortOrder: 4 },
    }),
    prisma.category.create({
      data: { name: "Cameras", slug: "cameras", icon: "📷", description: "Webcams, action cameras & projectors", sortOrder: 5 },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ── Brands ──────────────────────────────────────────────
  const brandData = [
    { name: "SoundCore", slug: "soundcore" },
    { name: "Baseus", slug: "baseus" },
    { name: "Govee", slug: "govee" },
    { name: "Amazfit", slug: "amazfit" },
    { name: "JBL", slug: "jbl" },
    { name: "Ugreen", slug: "ugreen" },
    { name: "Logitech", slug: "logitech" },
    { name: "TP-Link", slug: "tp-link" },
    { name: "Sony", slug: "sony" },
    { name: "XGIMI", slug: "xgimi" },
    { name: "Keychron", slug: "keychron" },
    { name: "Razer", slug: "razer" },
    { name: "Xiaomi", slug: "xiaomi" },
    { name: "GoPro", slug: "gopro" },
    { name: "Anker", slug: "anker" },
  ];

  const brands = await Promise.all(
    brandData.map((b) => prisma.brand.create({ data: b }))
  );

  console.log(`✅ Created ${brands.length} brands`);

  const findBrand = (name: string) => brands.find((b) => b.name === name)!;
  const findCat = (name: string) => categories.find((c) => c.name === name)!;

  // ── Products ────────────────────────────────────────────
  const productData = [
    {
      name: "Wireless ANC Earbuds Pro",
      slug: "wireless-anc-earbuds-pro",
      shortDescription: "Premium ANC earbuds with 40dB noise cancellation, Hi-Res audio, and 32-hour battery life.",
      description: "<p>Experience audio excellence with the SoundCore Wireless ANC Earbuds Pro.</p><p>Hi-Res Audio certified with LDAC codec support. 8 hours playback (ANC on), 32 hours total with case. IPX5 water resistance.</p>",
      price: 2990,
      compareAtPrice: 3450,
      sku: "SC-ANC-PRO-BK",
      stock: 45,
      categoryId: findCat("Audio").id,
      brandId: findBrand("SoundCore").id,
      isFeatured: true,
      isNewArrival: true,
      specs: [
        { key: "Driver Size", value: "10mm dynamic" },
        { key: "ANC Depth", value: "40dB" },
        { key: "Bluetooth", value: "5.3" },
        { key: "Codec", value: "LDAC, AAC, SBC" },
        { key: "Battery (Buds)", value: "8 hours (ANC on)" },
        { key: "Battery (Case)", value: "32 hours total" },
        { key: "Water Resistance", value: "IPX5" },
        { key: "Weight (Per Bud)", value: "5.2g" },
        { key: "Charging", value: "USB-C, Wireless Qi" },
        { key: "Warranty", value: "1 Year Official" },
      ],
      variants: [
        { name: "Midnight Black", type: "color", value: "#1C1E20", stock: 20, priceAdj: 0 },
        { name: "Arctic White", type: "color", value: "#F3F4F1", stock: 15, priceAdj: 0 },
        { name: "Navy Blue", type: "color", value: "#2F3E63", stock: 10, priceAdj: 0 },
      ],
    },
    {
      name: "Magnetic USB-C Cable 2m",
      slug: "magnetic-usb-c-cable",
      shortDescription: "Braided nylon cable with magnetic tip for easy connection. 100W PD fast charging.",
      price: 490,
      sku: "BS-USBC-MAG-2M",
      stock: 200,
      categoryId: findCat("Accessories").id,
      brandId: findBrand("Baseus").id,
      isNewArrival: false,
      specs: [
        { key: "Length", value: "2m" },
        { key: "Material", value: "Braided Nylon" },
        { key: "Charging", value: "100W PD" },
        { key: "Data Transfer", value: "480Mbps" },
      ],
    },
    {
      name: "Smart LED Strip 5M RGB",
      slug: "smart-led-strip",
      shortDescription: "App-controlled RGB strip with music sync and 16 million colors.",
      price: 1290,
      compareAtPrice: 1600,
      sku: "GV-LED-5M-RGB",
      stock: 80,
      categoryId: findCat("Smart Home").id,
      brandId: findBrand("Govee").id,
      isFeatured: true,
      specs: [
        { key: "Length", value: "5 meters" },
        { key: "Colors", value: "16 million RGB" },
        { key: "Control", value: "App, Voice, Remote" },
        { key: "Connectivity", value: "Wi-Fi + Bluetooth" },
        { key: "Music Sync", value: "Yes" },
      ],
    },
    {
      name: "Fitness Band 7 Pro",
      slug: "fitness-band-7-pro",
      shortDescription: "SpO2, heart rate, 120+ sport modes, 18-day battery.",
      price: 3490,
      sku: "AZ-BAND7-PRO",
      stock: 60,
      categoryId: findCat("Wearables").id,
      brandId: findBrand("Amazfit").id,
      isNewArrival: true,
      specs: [
        { key: "Display", value: "1.47\" AMOLED" },
        { key: "Sensors", value: "SpO2, Heart Rate, Accelerometer" },
        { key: "Sport Modes", value: "120+" },
        { key: "Battery", value: "18 days" },
        { key: "Water Resistance", value: "5 ATM" },
      ],
    },
    {
      name: "Mini Bluetooth Speaker",
      slug: "mini-bluetooth-speaker",
      shortDescription: "Waterproof portable speaker with 10-hour playtime.",
      price: 2190,
      compareAtPrice: 2500,
      sku: "JBL-MINI-BT",
      stock: 0,
      categoryId: findCat("Audio").id,
      brandId: findBrand("JBL").id,
      isFeatured: false,
      specs: [
        { key: "Output", value: "5W" },
        { key: "Battery", value: "10 hours" },
        { key: "Waterproof", value: "IP67" },
        { key: "Bluetooth", value: "5.1" },
      ],
    },
    {
      name: "65W GaN Charger",
      slug: "65w-gan-charger",
      shortDescription: "Compact GaN charger with 3 ports. Powers laptops and phones.",
      price: 1790,
      sku: "UG-GAN65-3P",
      stock: 120,
      categoryId: findCat("Accessories").id,
      brandId: findBrand("Ugreen").id,
      isFeatured: true,
      specs: [
        { key: "Total Output", value: "65W" },
        { key: "Ports", value: "2× USB-C, 1× USB-A" },
        { key: "Technology", value: "GaN III" },
        { key: "Compatibility", value: "Laptops, Phones, Tablets" },
      ],
    },
    {
      name: "Webcam 2K AutoFocus",
      slug: "webcam-2k-autofocus",
      shortDescription: "2K resolution with autofocus and dual microphones.",
      price: 4990,
      compareAtPrice: 5500,
      sku: "LG-WC2K-AF",
      stock: 30,
      categoryId: findCat("Cameras").id,
      brandId: findBrand("Logitech").id,
      specs: [
        { key: "Resolution", value: "2K (2560×1440)" },
        { key: "Frame Rate", value: "30fps" },
        { key: "Autofocus", value: "Yes" },
        { key: "Microphones", value: "Dual stereo" },
      ],
    },
    {
      name: "Smart Plug Wi-Fi 4 Pack",
      slug: "smart-plug-wifi",
      shortDescription: "Voice-controlled plugs compatible with Alexa and Google.",
      price: 2290,
      sku: "TPL-PLUG-4PK",
      stock: 55,
      categoryId: findCat("Smart Home").id,
      brandId: findBrand("TP-Link").id,
      specs: [
        { key: "Quantity", value: "4 plugs" },
        { key: "Control", value: "App, Alexa, Google" },
        { key: "Max Load", value: "15A" },
        { key: "Scheduling", value: "Yes" },
      ],
    },
    {
      name: "Noise Cancelling Headphones",
      slug: "nc-headphones",
      shortDescription: "Industry-leading ANC with 30-hour battery and LDAC.",
      price: 8990,
      compareAtPrice: 12500,
      sku: "SN-NC-WH1000",
      stock: 18,
      categoryId: findCat("Audio").id,
      brandId: findBrand("Sony").id,
      isFeatured: true,
      isNewArrival: true,
      specs: [
        { key: "ANC", value: "Industry-leading" },
        { key: "Battery", value: "30 hours" },
        { key: "Codec", value: "LDAC, AAC" },
        { key: "Driver", value: "40mm" },
        { key: "Weight", value: "254g" },
      ],
    },
    {
      name: "Smart Watch Ultra",
      slug: "smart-watch-ultra",
      shortDescription: "AMOLED display, GPS, 14-day battery, 100m water resistance.",
      price: 6490,
      compareAtPrice: 8900,
      sku: "AZ-ULTRA-WCH",
      stock: 25,
      categoryId: findCat("Wearables").id,
      brandId: findBrand("Amazfit").id,
      isFeatured: true,
      specs: [
        { key: "Display", value: "1.39\" AMOLED" },
        { key: "GPS", value: "Dual-band" },
        { key: "Battery", value: "14 days" },
        { key: "Water Resistance", value: "100m" },
      ],
    },
    {
      name: "Portable Projector Mini",
      slug: "portable-projector",
      shortDescription: "1080p portable projector with built-in speakers and Android TV.",
      price: 15990,
      compareAtPrice: 19900,
      sku: "XG-PROJ-MINI",
      stock: 10,
      categoryId: findCat("Cameras").id,
      brandId: findBrand("XGIMI").id,
      specs: [
        { key: "Resolution", value: "1080p" },
        { key: "Brightness", value: "400 ANSI lumens" },
        { key: "OS", value: "Android TV" },
        { key: "Speakers", value: "Built-in stereo" },
      ],
    },
    {
      name: "Mechanical Keyboard RGB",
      slug: "mechanical-keyboard",
      shortDescription: "Hot-swappable switches, wireless Bluetooth, Mac/Win compatible.",
      price: 5490,
      compareAtPrice: 6900,
      sku: "KC-MECH-RGB",
      stock: 0,
      categoryId: findCat("Accessories").id,
      brandId: findBrand("Keychron").id,
      isFeatured: false,
      specs: [
        { key: "Switches", value: "Gateron (Hot-swappable)" },
        { key: "Layout", value: "75%" },
        { key: "Connection", value: "Bluetooth 5.1 / USB-C" },
        { key: "Backlight", value: "RGB per-key" },
        { key: "Battery", value: "4000mAh" },
      ],
    },
    {
      name: "TWS Gaming Earbuds",
      slug: "tws-gaming-earbuds",
      shortDescription: "60ms low-latency gaming mode with THX spatial audio.",
      price: 4990,
      sku: "RZ-TWS-GAME",
      stock: 40,
      categoryId: findCat("Audio").id,
      brandId: findBrand("Razer").id,
      isNewArrival: true,
      specs: [
        { key: "Latency", value: "60ms (Gaming Mode)" },
        { key: "Audio", value: "THX Spatial" },
        { key: "ANC", value: "Hybrid" },
        { key: "Battery", value: "6.5 hours (ANC off)" },
      ],
    },
    {
      name: "Desk Lamp Smart LED",
      slug: "desk-lamp-smart",
      shortDescription: "Color temperature adjustable, app control, eye-care certified.",
      price: 2490,
      compareAtPrice: 2900,
      sku: "XM-LAMP-LED",
      stock: 70,
      categoryId: findCat("Smart Home").id,
      brandId: findBrand("Xiaomi").id,
      specs: [
        { key: "Brightness", value: "600 lumens" },
        { key: "Color Temp", value: "2700K–6500K" },
        { key: "Control", value: "App, Touch, Voice" },
        { key: "Eye Care", value: "Flicker-free certified" },
      ],
    },
    {
      name: "Action Camera 4K",
      slug: "action-camera-4k",
      shortDescription: "4K60 video, HyperSmooth stabilization, waterproof to 10m.",
      price: 22990,
      sku: "GP-AC4K-HERO",
      stock: 15,
      categoryId: findCat("Cameras").id,
      brandId: findBrand("GoPro").id,
      isFeatured: true,
      specs: [
        { key: "Video", value: "4K60 / 2.7K120" },
        { key: "Stabilization", value: "HyperSmooth 5.0" },
        { key: "Waterproof", value: "10m (33ft)" },
        { key: "Sensor", value: "1/1.9\" CMOS" },
      ],
    },
    {
      name: "USB-C Hub 7-in-1",
      slug: "usb-c-hub-7in1",
      shortDescription: "HDMI 4K, USB-A 3.0, SD card, 100W PD pass-through.",
      price: 3290,
      compareAtPrice: 3800,
      sku: "AK-HUB7-USBC",
      stock: 90,
      categoryId: findCat("Accessories").id,
      brandId: findBrand("Anker").id,
      specs: [
        { key: "Ports", value: "HDMI, 2× USB-A, USB-C PD, SD, microSD, Ethernet" },
        { key: "HDMI", value: "4K@30Hz" },
        { key: "PD", value: "100W pass-through" },
        { key: "Material", value: "Aluminum" },
      ],
    },
  ];

  for (const data of productData) {
    const { specs, variants, ...productFields } = data;

    await prisma.product.create({
      data: {
        ...productFields,
        specs: specs ? { create: specs.map((s, i) => ({ ...s, sortOrder: i })) } : undefined,
        variants: variants ? { create: variants } : undefined,
      },
    });
  }

  console.log(`✅ Created ${productData.length} products`);

  // ── Admin User ──────────────────────────────────────────
  await prisma.user.create({
    data: {
      phone: "01700000000",
      name: "Admin",
      email: "admin@innoverse.com.bd",
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Created admin user (phone: 01700000000)");

  // ── Sample Coupon ───────────────────────────────────────
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      maxDiscount: 500,
      minOrderAmount: 1000,
      usageLimit: 100,
    },
  });

  console.log("✅ Created coupon: WELCOME10 (10% off, max ৳500)\n");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

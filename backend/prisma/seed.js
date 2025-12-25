import bcrypt from "bcryptjs";
import prisma from "../src/config/db.js";

async function main() {
  const email = "admin@example.com";
  const password = "password123";

  const exists = await prisma.user.findUnique({ where: { email } });

  if (!exists) {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        role: "ADMIN",
        status: "APPROVED",
      },
    });

    console.log("✅ Admin created:", email);
  } else {
    console.log("ℹ️ Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit());

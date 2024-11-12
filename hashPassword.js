const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("oman", hashedPassword);
}

hashPassword("oman"); // استخدم كلمة المرور "oman" للتشفير

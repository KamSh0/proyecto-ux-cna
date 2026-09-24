import bcrypt from 'bcrypt';

const password = await bcrypt.hash("shakedown1979", 12);
console.log(password);

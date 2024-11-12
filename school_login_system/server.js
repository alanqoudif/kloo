// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("تم الاتصال بقاعدة البيانات MongoDB بنجاح"))
.catch((err) => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // لتقديم الملفات الثابتة

// تعريف مخطط المستخدم
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
});

const User = mongoose.model('User', userSchema);

// إرسال صفحة تسجيل الدخول عند الوصول إلى `/`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// مسار تسجيل الدخول
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // البحث عن المستخدم حسب اسم المستخدم
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

  // التحقق من صحة كلمة المرور
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

  // إنشاء رمز JWT يتضمن معلومات المستخدم ودوره
  const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  
  // إرسال رمز JWT في ملف تعريف الارتباط
  res.cookie('token', token, { httpOnly: true });

  // التوجيه بناءً على الدور
  if (user.role === 'admin') {
    res.redirect('/admin');
  } else if (user.role === 'teacher') {
    res.redirect('/teacher');
  } else {
    // توجيه الطالب إلى الصفحة الرئيسية "index.html"
    res.redirect('/index.html');
  }
});

// Middleware لتحديد الصلاحيات
const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(403).json({ message: 'غير مصرح' });

    try {
      const user = jwt.verify(token, SECRET_KEY);
      if (!roles.includes(user.role)) return res.status(403).json({ message: 'ليس لديك الصلاحية' });
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({ message: 'رمز الدخول غير صالح' });
    }
  };
};

// مسارات بناءً على الصلاحيات
app.get('/admin', authorize(['admin']), (req, res) => {
  res.send('مرحبًا بك في قسم الإدارة');
});

app.get('/teacher', authorize(['admin', 'teacher']), (req, res) => {
  res.send('مرحبًا بك في قسم المعلمين');
});

app.get('/student', authorize(['admin', 'teacher', 'student']), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});

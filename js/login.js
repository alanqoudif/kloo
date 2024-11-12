// js/login.js

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    // البحث عن المستخدم في Firestore
    db.collection('users').where('username', '==', username).get()
    .then((snapshot) => {
        if (snapshot.empty) {
            alert('اسم المستخدم غير موجود.');
            return;
        }

        snapshot.forEach(doc => {
            const user = doc.data();
            // مقارنة كلمة المرور (يفضل استخدام Firebase Auth بدلاً من تخزين كلمات المرور في Firestore)
            // هنا نفترض أن كلمة المرور مشفرة ويتم التحقق من صحتها
            // لكن Firebase Auth يتعامل مع المصادقة بشكل أفضل
            // لذا يفضل استخدام Firebase Auth بشكل كامل

            // هذا مثال بسيط:
            // إذا كان نوع المستخدم admin، نقوم بتسجيل الدخول
            if (user.user_type === 'admin') {
                // تسجيل الدخول باستخدام Firebase Auth
                auth.signInWithEmailAndPassword(user.email, password)
                .then(() => {
                    window.location.href = 'admin_dashboard.html';
                })
                .catch((error) => {
                    console.error('خطأ في تسجيل الدخول:', error);
                    alert('كلمة المرور غير صحيحة.');
                });
            } else {
                alert('ليس لديك صلاحية الوصول إلى قسم الإدارة.');
            }
        });
    })
    .catch((error) => {
        console.error('خطأ في البحث عن المستخدم:', error);
    });
});

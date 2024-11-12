document.addEventListener('DOMContentLoaded', () => {
    // دور المستخدم - يمكن تغييره بناءً على حالة تسجيل الدخول (طالب أو إدارة)
    const userRole = 'admin'; // أمثلة: 'student' للطلاب، 'admin' للإدارة

    // تحديد العنصر الرئيسي لعرض المحتوى
    const mainContent = document.getElementById('main-content');

    // إذا كان المستخدم طالبًا، عرض جدول الصف الخاص به
    if (userRole === 'student') {
        displayStudentSchedule();
    } 
    // إذا كان المستخدم إدارة، عرض خيارات الصفوف
    else if (userRole === 'admin') {
        displayAdminOptions();
    }

    function displayStudentSchedule() {
        // هنا يمكنك جلب بيانات الجدول المدرسي للطالب من قاعدة البيانات وعرضها
        mainContent.innerHTML = `
            <h2>جدول الصف الخاص بك</h2>
            <div class="schedule">
                <!-- مثال على جدول الطالب -->
                <table>
                    <tr>
                        <th>اليوم</th>
                        <th>الدرس الأول</th>
                        <th>الدرس الثاني</th>
                        <th>الدرس الثالث</th>
                        <th>الدرس الرابع</th>
                    </tr>
                    <tr>
                        <td>الأحد</td>
                        <td>رياضيات</td>
                        <td>علوم</td>
                        <td>لغة عربية</td>
                        <td>تربية إسلامية</td>
                    </tr>
                    <!-- أضف المزيد من الصفوف للجدول حسب الحاجة -->
                </table>
            </div>
        `;
    }

    function displayAdminOptions() {
        // عرض خيارات الصفوف للإدارة
        mainContent.innerHTML = `
            <h2>اختر صفًا لعرض الجدول</h2>
            <div class="grade-options">
                <button onclick="showClassSections('tenth')">الصف العاشر</button>
                <button onclick="showClassSections('eleventh')">الصف الحادي عشر</button>
                <button onclick="showClassSections('twelfth')">الصف الثاني عشر</button>
            </div>
        `;
    }

    // عرض مربعات الصفوف بناءً على الصف المحدد
    window.showClassSections = function(grade) {
        let sectionsHTML = '';
        for (let i = 1; i <= 6; i++) {
            sectionsHTML += `<button onclick="displaySchedule('${grade}', ${i})">صف ${i}</button>`;
        }
        mainContent.innerHTML = `
            <h2>اختر صفًا في ${getGradeName(grade)}</h2>
            <div class="section-options">${sectionsHTML}</div>
        `;
    }

    // عرض جدول صف محدد
    window.displaySchedule = function(grade, section) {
        mainContent.innerHTML = `
            <h2>جدول ${getGradeName(grade)} - صف ${section}</h2>
            <div class="schedule">
                <!-- هنا يمكنك جلب بيانات الجدول المدرسي من قاعدة البيانات للصف المحدد وعرضها -->
                <p>عرض جدول الصف ${section} في ${getGradeName(grade)}</p>
            </div>
            <button onclick="displayAdminOptions()">العودة إلى اختيار الصفوف</button>
        `;
    }

    // تحويل اسم الصف من إنجليزي إلى عربي
    function getGradeName(grade) {
        switch (grade) {
            case 'tenth': return 'الصف العاشر';
            case 'eleventh': return 'الصف الحادي عشر';
            case 'twelfth': return 'الصف الثاني عشر';
            default: return '';
        }
    }
});

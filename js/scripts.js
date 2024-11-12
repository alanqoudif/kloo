// مثال على كيفية إظهار رابط اختيار المواد بناءً على نوع المستخدم
window.onload = function() {
    // استخدام الجلسات (Sessions) لجلب نوع المستخدم من السيرفر
    // هنا سنفترض أن نوع المستخدم تم تخزينه في متغير JavaScript
    // يمكنك تعديل هذا الجزء ليتوافق مع نظام الجلسات الخاص بك

    // مثال باستخدام AJAX لجلب نوع المستخدم من السيرفر
    fetch('get_user_type.php')
        .then(response => response.json())
        .then(data => {
            if (data.user_type === 'admin' || data.user_type === 'student') {
                document.getElementById('courses-link').style.display = 'block';
            }
        })
        .catch(error => console.error('Error:', error));
}






// js/scripts.js

function toggleSubBoxes(deptId) {
    const dept = document.getElementById(deptId);
    if (dept.classList.contains('hidden')) {
        // إخفاء جميع الأقسام الفرعية الأخرى
        const allDepts = document.querySelectorAll('[id^="dept"]');
        allDepts.forEach(d => {
            if (d.id !== deptId) {
                d.classList.add('hidden');
            }
        });

        // إخفاء جميع الأقسام الفرعية للمواد
        const allSubDepts = document.querySelectorAll('[id^="subdept"]');
        allSubDepts.forEach(sd => sd.classList.add('hidden'));

        dept.classList.remove('hidden');
    } else {
        dept.classList.add('hidden');
    }
}

function toggleLinkBoxes(subdeptId) {
    const subdept = document.getElementById(subdeptId);
    if (subdept.classList.contains('hidden')) {
        // إخفاء جميع الأقسام الفرعية الأخرى
        const allSubDepts = document.querySelectorAll('[id^="subdept"]');
        allSubDepts.forEach(sd => {
            if (sd.id !== subdeptId) {
                sd.classList.add('hidden');
            }
        });

        subdept.classList.remove('hidden');
    } else {
        subdept.classList.add('hidden');
    }
}



// js/scripts.js

function toggleSubBoxes(deptId) {
    const dept = document.getElementById(deptId);
    const allDepts = document.querySelectorAll('[id^="dept"]');

    // إخفاء جميع الأقسام الفرعية الأخرى
    allDepts.forEach(d => {
        if (d.id !== deptId) {
            d.classList.add('hidden');
        }
    });

    // إخفاء جميع الأقسام الفرعية للمواد
    const allSubDepts = document.querySelectorAll('[id^="subdept"]');
    allSubDepts.forEach(sd => {
        if (!sd.id.startsWith(deptId)) {
            sd.classList.add('hidden');
        }
    });

    // إظهار أو إخفاء القسم الفرعي المطلوب
    if (dept.classList.contains('hidden')) {
        dept.classList.remove('hidden');
    } else {
        dept.classList.add('hidden');
    }
}

function toggleLinkBoxes(subdeptId) {
    const subdept = document.getElementById(subdeptId);
    const allSubDepts = document.querySelectorAll('[id^="subdept"]');

    // إخفاء جميع الأقسام الفرعية الأخرى
    allSubDepts.forEach(sd => {
        if (sd.id !== subdeptId) {
            sd.classList.add('hidden');
        }
    });

    // إظهار أو إخفاء القسم الفرعي المطلوب
    if (subdept.classList.contains('hidden')) {
        subdept.classList.remove('hidden');
    } else {
        subdept.classList.add('hidden');
    }
}

// إخفاء المربعات الفرعية والروابط عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const allDepts = document.querySelectorAll('[id^="dept"]');
    allDepts.forEach(dept => dept.classList.add('hidden'));

    const allSubDepts = document.querySelectorAll('[id^="subdept"]');
    allSubDepts.forEach(subdept => subdept.classList.add('hidden'));
});








// وظيفة لتسجيل الخروج
function logout() {
    // إزالة حالة تسجيل الدخول من المخزن المحلي أو الـ session
    localStorage.removeItem("loggedInUser"); // إذا كنت تستخدم localStorage لتخزين حالة المستخدم
    sessionStorage.removeItem("loggedInUser"); // إذا كنت تستخدم sessionStorage
    
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    window.location.href = "login.html";
    }








    // دالة لعرض الجدول الدراسي للمستخدم
function displayUserSchedule() {
    var loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    var schedules = JSON.parse(localStorage.getItem("userSchedules"));
    
    if (loggedInUser && schedules) {
        var userSchedule = schedules[loggedInUser.username];
    
        if (userSchedule) {
            var tableBody = document.querySelector(".schedule-table tbody");
            tableBody.innerHTML = ""; // تنظيف الجدول الحالي
    
            // إنشاء الجدول بناءً على جدول المستخدم
            for (var day in userSchedule) {
                var row = document.createElement("tr");
    
                // اليوم
                var dayCell = document.createElement("td");
                dayCell.textContent = day;
                row.appendChild(dayCell);
    
                // الحصص
                var classCell = document.createElement("td");
                classCell.textContent = userSchedule[day][1] + " (" + userSchedule[day][0] + ")";
                row.appendChild(classCell);
    
                tableBody.appendChild(row);
            }
        } else {
            alert("لم يتم العثور على جدول دراسي لهذا المستخدم.");
        }
    }
    }
    
    // استدعاء الدالة عند تحميل الصفحة
    window.onload = function() {
    displayUserSchedule();
    };




 
  
  // تسجيل الغياب
  document.getElementById('attendance-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // الحصول على اسم الطالب وتاريخ الغياب
    const studentName = document.getElementById('student-name').value;
    const absenceDate = document.getElementById('absence-date').value;
  
    // إضافة الطالب إلى قائمة الغياب
    const absentList = document.getElementById('absent-students-list');
    const newAbsentItem = document.createElement('li');
    newAbsentItem.textContent = `${studentName} - ${absenceDate}`;
    newAbsentItem.addEventListener('click', editAttendance);
    absentList.appendChild(newAbsentItem);
  
    // تحديث عدد الطلاب الغائبين
    updateAbsentCount();
  
    // إعادة تعيين الحقول
    document.getElementById('student-name').value = '';
    document.getElementById('absence-date').value = '';
  });
  
  // تحديث عدد الغائبين
  function updateAbsentCount() {
    const absentCount = document.getElementById('absent-students-list').children.length;
    document.getElementById('absent-students-count').textContent = `${absentCount} طالب`;
  }
  
  // تعديل معلومات الغياب
  function editAttendance() {
    const info = this.textContent.split(' - ');
    const studentName = prompt('تعديل اسم الطالب:', info[0]);
    const absenceDate = prompt('تعديل تاريخ الغياب:', info[1]);
  
    if (studentName && absenceDate) {
      this.textContent = `${studentName} - ${absenceDate}`;
    }
  }
  
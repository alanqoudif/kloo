// js/admin.js

// إظهار القسم المطلوب وإخفاء الأقسام الأخرى
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-content');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.toggle('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// تسجيل الغياب
// js/admin.js

// دالة لإظهار القسم المطلوب وإخفاء الباقي
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-content');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.toggle('hidden'); // إظهار أو إخفاء القسم المحدد
        } else {
            section.classList.add('hidden'); // إخفاء الأقسام الأخرى
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // الحصول على عناصر النموذج والقائمة
    const attendanceForm = document.getElementById('attendanceForm');
    const absencesList = document.getElementById('absencesList');
    const studentIdSelect = document.getElementById('studentId');
    
    console.log('attendanceForm:', attendanceForm); // للتصحيح
    
    if (!attendanceForm) {
        console.error('لم يتم العثور على العنصر بالمعرف attendanceForm');
        return;
    }
    
    // تحميل قائمة الطلاب في نموذج الغياب
    function loadStudentOptions() {
        db.collection('students').get()
        .then((snapshot) => {
            studentIdSelect.innerHTML = '<option value="">اختر الطالب</option>';
            snapshot.forEach(doc => {
                const data = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${data.studentName} (${data.studentNumber})`;
                studentIdSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('خطأ في تحميل قائمة الطلاب:', error);
        });
    }
    
    // تسجيل غياب جديد
    attendanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = attendanceForm.studentId.value;
        const absenceDate = attendanceForm.absenceDate.value;
        const absenceReason = attendanceForm.absenceReason.value.trim();
    
        if (studentId && absenceDate) {
            db.collection('absences').add({
                studentId: studentId,
                date: firebase.firestore.Timestamp.fromDate(new Date(absenceDate)),
                reason: absenceReason
            })
            .then(() => {
                alert('تم تسجيل الغياب بنجاح!');
                attendanceForm.reset();
                incrementAbsences(studentId);
                // قائمة الغيابات سيتم تحديثها تلقائيًا بواسطة onSnapshot
            })
            .catch((error) => {
                console.error('خطأ في تسجيل الغياب:', error);
                alert('حدث خطأ أثناء تسجيل الغياب.');
            });
        } else {
            alert('يرجى اختيار الطالب وتحديد تاريخ الغياب.');
        }
    });
    
    // زيادة عدد الغيابات للطالب
    function incrementAbsences(studentId) {
        const studentRef = db.collection('students').doc(studentId);
        studentRef.get()
        .then((doc) => {
            if (doc.exists) {
                const currentAbsences = doc.data().absences || 0;
                studentRef.update({
                    absences: currentAbsences + 1
                });
            }
        })
        .catch((error) => {
            console.error('خطأ في تحديث عدد الغيابات:', error);
        });
    }
    
    // تحميل قائمة الغيابات
    function loadAbsences() {
        db.collection('absences').orderBy('date', 'desc').onSnapshot((snapshot) => {
            absencesList.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                db.collection('students').doc(data.studentId).get()
                .then((studentDoc) => {
                    if (studentDoc.exists) {
                        const studentData = studentDoc.data();
                        const li = document.createElement('li');
                        li.textContent = `${studentData.studentName} (${studentData.studentNumber}) - ${data.date.toDate().toLocaleDateString()} - ${data.reason || 'بدون سبب'}`;
                        absencesList.appendChild(li);
                    } else {
                        console.error('لم يتم العثور على الطالب بالمعرف:', data.studentId);
                    }
                })
                .catch((error) => {
                    console.error('خطأ في جلب بيانات الطالب:', error);
                });
            });
        });
    }
    
    // تحميل البيانات عند تحميل الصفحة
    loadStudentOptions();
    loadAbsences();
});

// إدارة الطلاب


addStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentNumber = addStudentForm.studentNumber.value;
    const studentName = addStudentForm.studentName.value;
    const studentClass = addStudentForm.studentClass.value;
    const studentCourses = addStudentForm.studentCourses.value.split(',');

    db.collection('students').add({
        studentNumber: studentNumber,
        studentName: studentName,
        class: studentClass,
        courses: studentCourses,
        absences: 0
    })
    .then(() => {
        alert('تم إضافة الطالب بنجاح!');
        addStudentForm.reset();
        loadStudents();
    })
    .catch((error) => {
        console.error('خطأ في إضافة الطالب:', error);
    });
});

// تحميل قائمة الطلاب
function loadStudents() {
    db.collection('students').get()
    .then((snapshot) => {
        studentsTableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${data.studentNumber}</td>
                <td>${data.studentName}</td>
                <td>${data.class}</td>
                <td>${data.courses.join(', ')}</td>
                <td>${data.absences}</td>
                <td>
                    <button onclick="editStudent('${doc.id}')">تعديل</button>
                    <button onclick="deleteStudent('${doc.id}')">حذف</button>
                </td>
            `;
            studentsTableBody.appendChild(tr);
        });
    })
    .catch((error) => {
        console.error('خطأ في تحميل قائمة الطلاب:', error);
    });
}

// تعديل الطالب
function editStudent(docId) {
    const newName = prompt('أدخل اسم الطالب الجديد:');
    if (newName) {
        db.collection('students').doc(docId).update({
            studentName: newName
        })
        .then(() => {
            alert('تم تعديل اسم الطالب بنجاح!');
            loadStudents();
        })
        .catch((error) => {
            console.error('خطأ في تعديل الطالب:', error);
        });
    }
}

// حذف الطالب
function deleteStudent(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطالب؟')) {
        db.collection('students').doc(docId).delete()
        .then(() => {
            alert('تم حذف الطالب بنجاح!');
            loadStudents();
        })
        .catch((error) => {
            console.error('خطأ في حذف الطالب:', error);
        });
    }
}

// إدارة الكتب
const addBookForm = document.getElementById('addBookForm');
const booksTableBody = document.querySelector('#booksTable tbody');

addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookTitle = addBookForm.bookTitle.value;
    const bookAuthor = addBookForm.bookAuthor.value;
    const bookCategory = addBookForm.bookCategory.value;
    const bookPrice = parseFloat(addBookForm.bookPrice.value);

    db.collection('books').add({
        title: bookTitle,
        author: bookAuthor,
        category: bookCategory,
        price: bookPrice,
        availability: true
    })
    .then(() => {
        alert('تم إضافة الكتاب بنجاح!');
        addBookForm.reset();
        loadBooks();
    })
    .catch((error) => {
        console.error('خطأ في إضافة الكتاب:', error);
    });
});

// تحميل قائمة الكتب
function loadBooks() {
    db.collection('books').get()
    .then((snapshot) => {
        booksTableBody.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${data.title}</td>
                <td>${data.author}</td>
                <td>${data.category}</td>
                <td>${data.price.toFixed(2)} جنيه</td>
                <td>
                    <button onclick="editBook('${doc.id}')">تعديل</button>
                    <button onclick="deleteBook('${doc.id}')">حذف</button>
                </td>
            `;
            booksTableBody.appendChild(tr);
        });
    })
    .catch((error) => {
        console.error('خطأ في تحميل قائمة الكتب:', error);
    });
}

// تعديل الكتاب
function editBook(docId) {
    const newPrice = prompt('أدخل السعر الجديد للكتاب:');
    if (newPrice && !isNaN(newPrice)) {
        db.collection('books').doc(docId).update({
            price: parseFloat(newPrice)
        })
        .then(() => {
            alert('تم تعديل سعر الكتاب بنجاح!');
            loadBooks();
        })
        .catch((error) => {
            console.error('خطأ في تعديل الكتاب:', error);
        });
    } else {
        alert('السعر غير صالح.');
    }
}

// حذف الكتاب
function deleteBook(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الكتاب؟')) {
        db.collection('books').doc(docId).delete()
        .then(() => {
            alert('تم حذف الكتاب بنجاح!');
            loadBooks();
        })
        .catch((error) => {
            console.error('خطأ في حذف الكتاب:', error);
        });
    }
}

// تحميل البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadAbsentStudents();
    loadStudents();
    loadBooks();
    // يمكنك إضافة دوال تحميل للأقسام الأخرى مثل الأخبار، الجداول، الصلاحيات
});












// تغيير كلمة المرور
const changePasswordForm = document.getElementById('changePasswordForm');

changePasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentUsername = changePasswordForm.studentUsername.value;
    const newPassword = changePasswordForm.newPassword.value;

    db.collection('users').where('username', '==', studentUsername).get()
    .then((snapshot) => {
        if (snapshot.empty) {
            alert('اسم المستخدم غير موجود.');
            return;
        }

        snapshot.forEach(doc => {
            auth.getUserByEmail(doc.data().email)
            .then((userRecord) => {
                auth.updateUser(userRecord.uid, {
                    password: newPassword
                })
                .then(() => {
                    alert('تم تغيير كلمة المرور بنجاح!');
                    changePasswordForm.reset();
                })
                .catch((error) => {
                    console.error('خطأ في تغيير كلمة المرور:', error);
                    alert('حدث خطأ أثناء تغيير كلمة المرور.');
                });
            })
            .catch((error) => {
                console.error('خطأ في جلب مستخدم Firebase:', error);
            });
        });
    })
    .catch((error) => {
        console.error('خطأ في البحث عن الطالب:', error);
    });
});





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
  









  // js/admin.js

// إظهار القسم المطلوب وإخفاء الأقسام الأخرى
function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-content');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.toggle('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

// التعامل مع نموذج إضافة كتاب جديد


addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookTitle = addBookForm.bookTitle.value.trim();
    const bookAuthor = addBookForm.bookAuthor.value.trim();
    const bookCategory = addBookForm.bookCategory.value.trim();
    const bookPrice = parseFloat(addBookForm.bookPrice.value);
    
    if (bookTitle && bookAuthor && bookCategory && !isNaN(bookPrice)) {
        db.collection('books').add({
            title: bookTitle,
            author: bookAuthor,
            category: bookCategory,
            price: bookPrice,
            availability: true
        })
        .then(() => {
            alert('تم إضافة الكتاب بنجاح!');
            addBookForm.reset();
            loadBooks(); // تحديث قائمة الكتب بعد الإضافة
        })
        .catch((error) => {
            console.error('خطأ في إضافة الكتاب:', error);
            alert('حدث خطأ أثناء إضافة الكتاب.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
});

// تحميل قائمة الكتب في قسم إدارة الكتب
function loadBooks() {
    db.collection('books').onSnapshot((snapshot) => {
        const booksTableBody = document.querySelector('#booksTable tbody');
        booksTableBody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${data.title}</td>
                <td>${data.author}</td>
                <td>${data.category}</td>
                <td>${data.price.toFixed(2)} جنيه</td>
                <td>
                    <button onclick="editBook('${doc.id}', '${data.price}')">تعديل السعر</button>
                    <button onclick="deleteBook('${doc.id}')">حذف</button>
                </td>
            `;
            booksTableBody.appendChild(tr);
        });
    });
}

// تعديل سعر الكتاب
function editBook(docId, currentPrice) {
    const newPrice = prompt('أدخل السعر الجديد للكتاب:', currentPrice);
    if (newPrice && !isNaN(newPrice)) {
        db.collection('books').doc(docId).update({
            price: parseFloat(newPrice)
        })
        .then(() => {
            alert('تم تعديل سعر الكتاب بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في تعديل سعر الكتاب:', error);
            alert('حدث خطأ أثناء تعديل السعر.');
        });
    } else {
        alert('السعر غير صالح.');
    }
}

// حذف كتاب
function deleteBook(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الكتاب؟')) {
        db.collection('books').doc(docId).delete()
        .then(() => {
            alert('تم حذف الكتاب بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في حذف الكتاب:', error);
            alert('حدث خطأ أثناء حذف الكتاب.');
        });
    }
}

// تحميل الكتب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
});
















// js/admin.js

// الإشارة إلى العناصر

const studentsTableBody = document.querySelector('#studentsTable tbody');

// إضافة طالب جديد
addStudentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentNumber = addStudentForm.studentNumber.value.trim();
    const studentName = addStudentForm.studentName.value.trim();
    const studentClass = addStudentForm.studentClass.value.trim();
    const studentCourses = addStudentForm.studentCourses.value.split(',').map(course => course.trim());
    const studentEmail = addStudentForm.studentEmail.value.trim();

    if (studentNumber && studentName && studentClass && studentCourses.length > 0 && studentEmail) {
        db.collection('students').add({
            studentNumber: studentNumber,
            studentName: studentName,
            class: studentClass,
            courses: studentCourses,
            absences: 0,
            email: studentEmail
        })
        .then(() => {
            alert('تم إضافة الطالب بنجاح!');
            addStudentForm.reset();
            // قائمة الطلاب سيتم تحديثها تلقائيًا بواسطة onSnapshot
        })
        .catch((error) => {
            console.error('خطأ في إضافة الطالب:', error);
            alert('حدث خطأ أثناء إضافة الطالب.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
});

// تحميل قائمة الطلاب في قسم إدارة الطلاب
function loadStudents() {
    db.collection('students').onSnapshot((snapshot) => {
        studentsTableBody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${data.studentNumber}</td>
                <td>${data.studentName}</td>
                <td>${data.class}</td>
                <td>${data.courses.join(', ')}</td>
                <td>${data.absences}</td>
                <td>
                    <button onclick="editStudent('${doc.id}', '${data.studentName}', '${data.class}', '${data.courses.join(', ')}', '${data.email}')">تعديل</button>
                    <button onclick="deleteStudent('${doc.id}')">حذف</button>
                </td>
            `;
            studentsTableBody.appendChild(tr);
        });
    });
}

// تعديل معلومات الطالب
function editStudent(docId, currentName, currentClass, currentCourses, currentEmail) {
    const newName = prompt('أدخل اسم الطالب الجديد:', currentName);
    const newClass = prompt('أدخل الصف الجديد:', currentClass);
    const newCourses = prompt('أدخل المواد الجديدة (مفصولة بفواصل):', currentCourses);
    const newEmail = prompt('أدخل البريد الإلكتروني الجديد:', currentEmail);
    
    if (newName && newClass && newCourses && newEmail) {
        db.collection('students').doc(docId).update({
            studentName: newName.trim(),
            class: newClass.trim(),
            courses: newCourses.split(',').map(course => course.trim()),
            email: newEmail.trim()
        })
        .then(() => {
            alert('تم تعديل معلومات الطالب بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في تعديل الطالب:', error);
            alert('حدث خطأ أثناء تعديل الطالب.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
}

// حذف طالب
function deleteStudent(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الطالب؟')) {
        db.collection('students').doc(docId).delete()
        .then(() => {
            alert('تم حذف الطالب بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في حذف الطالب:', error);
            alert('حدث خطأ أثناء حذف الطالب.');
        });
    }
}

// تحميل الطلاب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
});







// js/admin.js

// الإشارة إلى العناصر
const attendanceForm = document.getElementById('attendanceForm');
const absencesList = document.getElementById('absencesList');
const studentIdSelect = document.getElementById('studentId');

// تحميل قائمة الطلاب في نموذج الغياب
function loadStudentOptions() {
    db.collection('students').get()
    .then((snapshot) => {
        studentIdSelect.innerHTML = '<option value="">اختر الطالب</option>';
        snapshot.forEach(doc => {
            const data = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${data.studentName} (${data.studentNumber})`;
            studentIdSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error('خطأ في تحميل قائمة الطلاب:', error);
    });
}

// تسجيل غياب جديد
attendanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = attendanceForm.studentId.value;
    const absenceDate = attendanceForm.absenceDate.value;
    const absenceReason = attendanceForm.absenceReason.value.trim();

    if (studentId && absenceDate) {
        db.collection('absences').add({
            studentId: studentId,
            date: firebase.firestore.Timestamp.fromDate(new Date(absenceDate)),
            reason: absenceReason
        })
        .then(() => {
            alert('تم تسجيل الغياب بنجاح!');
            attendanceForm.reset();
            incrementAbsences(studentId);
            // قائمة الغيابات سيتم تحديثها تلقائيًا بواسطة onSnapshot
        })
        .catch((error) => {
            console.error('خطأ في تسجيل الغياب:', error);
            alert('حدث خطأ أثناء تسجيل الغياب.');
        });
    } else {
        alert('يرجى اختيار الطالب وتحديد تاريخ الغياب.');
    }
});

// زيادة عدد الغيابات للطالب
function incrementAbsences(studentId) {
    const studentRef = db.collection('students').doc(studentId);
    studentRef.get()
    .then((doc) => {
        if (doc.exists) {
            const currentAbsences = doc.data().absences || 0;
            studentRef.update({
                absences: currentAbsences + 1
            });
        }
    })
    .catch((error) => {
        console.error('خطأ في تحديث عدد الغيابات:', error);
    });
}

// تحميل قائمة الغيابات
function loadAbsences() {
    db.collection('absences').orderBy('date', 'desc').onSnapshot((snapshot) => {
        absencesList.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            db.collection('students').doc(data.studentId).get()
            .then((studentDoc) => {
                const studentData = studentDoc.data();
                const li = document.createElement('li');
                li.textContent = `${studentData.studentName} (${studentData.studentNumber}) - ${data.date.toDate().toLocaleDateString()} - ${data.reason || 'بدون سبب'}`;
                absencesList.appendChild(li);
            })
            .catch((error) => {
                console.error('خطأ في جلب بيانات الطالب:', error);
            });
        });
    });
}

// تحميل الغيابات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
    loadStudentOptions();
    loadAbsences();
});












































// js/admin.js

// الإشارة إلى العناصر
const addNewsForm = document.getElementById('addNewsForm');
const newsTableBody = document.querySelector('#newsTable tbody');

// إضافة خبر جديد
addNewsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newsTitle = addNewsForm.newsTitle.value.trim();
    const newsContent = addNewsForm.newsContent.value.trim();

    if (newsTitle && newsContent) {
        db.collection('news').add({
            title: newsTitle,
            content: newsContent,
            publish_date: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('تم إضافة الخبر بنجاح!');
            addNewsForm.reset();
            // قائمة الأخبار سيتم تحديثها تلقائيًا بواسطة onSnapshot
        })
        .catch((error) => {
            console.error('خطأ في إضافة الخبر:', error);
            alert('حدث خطأ أثناء إضافة الخبر.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
});

// تحميل قائمة الأخبار في قسم إدارة الأخبار
function loadNews() {
    db.collection('news').orderBy('publish_date', 'desc').onSnapshot((snapshot) => {
        newsTableBody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${data.title}</td>
                <td>${data.content}</td>
                <td>${data.publish_date ? data.publish_date.toDate().toLocaleString() : ''}</td>
                <td>
                    <button onclick="editNews('${doc.id}', '${data.title}', '${data.content}')">تعديل</button>
                    <button onclick="deleteNews('${doc.id}')">حذف</button>
                </td>
            `;
            newsTableBody.appendChild(tr);
        });
    });
}

// تعديل الخبر
function editNews(docId, currentTitle, currentContent) {
    const newTitle = prompt('أدخل عنوان الخبر الجديد:', currentTitle);
    const newContent = prompt('أدخل محتوى الخبر الجديد:', currentContent);
    
    if (newTitle && newContent) {
        db.collection('news').doc(docId).update({
            title: newTitle.trim(),
            content: newContent.trim()
        })
        .then(() => {
            alert('تم تعديل الخبر بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في تعديل الخبر:', error);
            alert('حدث خطأ أثناء تعديل الخبر.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
}

// حذف خبر
function deleteNews(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الخبر؟')) {
        db.collection('news').doc(docId).delete()
        .then(() => {
            alert('تم حذف الخبر بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في حذف الخبر:', error);
            alert('حدث خطأ أثناء حذف الخبر.');
        });
    }
}

// تحميل الأخبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
    loadStudentOptions();
    loadAbsences();
    loadNews();
});










// js/admin.js

// الإشارة إلى العناصر
const addScheduleForm = document.getElementById('addScheduleForm');
const schedulesTableBody = document.querySelector('#schedulesTable tbody');

// إضافة جدول جديد
addScheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const scheduleName = addScheduleForm.scheduleName.value.trim();
    const scheduleContent = addScheduleForm.scheduleContent.value.trim();

    if (scheduleName && scheduleContent) {
        db.collection('schedules').add({
            name: scheduleName,
            content: scheduleContent,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
            alert('تم إضافة الجدول بنجاح!');
            addScheduleForm.reset();
            // قائمة الجداول سيتم تحديثها تلقائيًا بواسطة onSnapshot
        })
        .catch((error) => {
            console.error('خطأ في إضافة الجدول:', error);
            alert('حدث خطأ أثناء إضافة الجدول.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
});

// تحميل قائمة الجداول الدراسية في قسم إدارة الجداول
function loadSchedules() {
    db.collection('schedules').orderBy('created_at', 'desc').onSnapshot((snapshot) => {
        schedulesTableBody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${data.name}</td>
                <td>${data.content}</td>
                <td>${data.created_at ? data.created_at.toDate().toLocaleString() : ''}</td>
                <td>
                    <button onclick="editSchedule('${doc.id}', '${data.name}', '${data.content}')">تعديل</button>
                    <button onclick="deleteSchedule('${doc.id}')">حذف</button>
                </td>
            `;
            schedulesTableBody.appendChild(tr);
        });
    });
}

// تعديل الجدول الدراسي
function editSchedule(docId, currentName, currentContent) {
    const newName = prompt('أدخل اسم الجدول الجديد:', currentName);
    const newContent = prompt('أدخل محتوى الجدول الجديد:', currentContent);
    
    if (newName && newContent) {
        db.collection('schedules').doc(docId).update({
            name: newName.trim(),
            content: newContent.trim()
        })
        .then(() => {
            alert('تم تعديل الجدول بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في تعديل الجدول:', error);
            alert('حدث خطأ أثناء تعديل الجدول.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
}

// حذف جدول دراسي
function deleteSchedule(docId) {
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الجدول؟')) {
        db.collection('schedules').doc(docId).delete()
        .then(() => {
            alert('تم حذف الجدول بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في حذف الجدول:', error);
            alert('حدث خطأ أثناء حذف الجدول.');
        });
    }
}

// تحميل الجداول الدراسية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
    loadStudentOptions();
    loadAbsences();
    loadNews();
    loadSchedules();
});















// js/admin.js

// الإشارة إلى العناصر
const permissionsForm = document.getElementById('permissionsForm');
const permissionsTableBody = document.querySelector('#permissionsTable tbody');

// منح الصلاحيات
permissionsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const teacherUsername = permissionsForm.teacherUsername.value.trim();
    const permission = permissionsForm.permission.value;

    if (teacherUsername && permission) {
        // البحث عن المعلم في Firestore
        db.collection('users').where('username', '==', teacherUsername).get()
        .then((snapshot) => {
            if (snapshot.empty) {
                alert('اسم المستخدم للمعلم غير موجود.');
                return;
            }

            snapshot.forEach(doc => {
                db.collection('users').doc(doc.id).update({
                    permission: permission
                })
                .then(() => {
                    alert('تم منح الصلاحية بنجاح!');
                    permissionsForm.reset();
                })
                .catch((error) => {
                    console.error('خطأ في منح الصلاحية:', error);
                    alert('حدث خطأ أثناء منح الصلاحية.');
                });
            });
        })
        .catch((error) => {
            console.error('خطأ في البحث عن المعلم:', error);
            alert('حدث خطأ أثناء البحث عن المعلم.');
        });
    } else {
        alert('يرجى ملء جميع الحقول بشكل صحيح.');
    }
});

// تحميل قائمة الصلاحيات في قسم منح الصلاحيات
function loadPermissions() {
    db.collection('users').where('user_type', '==', 'teacher').onSnapshot((snapshot) => {
        permissionsTableBody.innerHTML = '';

        snapshot.forEach((doc) => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${data.username}</td>
                <td>${data.permission || 'لا توجد'}</td>
                <td>
                    <button onclick="editPermission('${doc.id}', '${data.permission}')">تعديل</button>
                </td>
            `;
            permissionsTableBody.appendChild(tr);
        });
    });
}

// تعديل الصلاحية
function editPermission(docId, currentPermission) {
    const newPermission = prompt('أدخل الصلاحية الجديدة (view, edit, admin):', currentPermission);
    if (newPermission && ['view', 'edit', 'admin'].includes(newPermission)) {
        db.collection('users').doc(docId).update({
            permission: newPermission
        })
        .then(() => {
            alert('تم تعديل الصلاحية بنجاح!');
        })
        .catch((error) => {
            console.error('خطأ في تعديل الصلاحية:', error);
            alert('حدث خطأ أثناء تعديل الصلاحية.');
        });
    } else {
        alert('صلاحية غير صحيحة.');
    }
}

// تحميل الصلاحيات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadStudents();
    loadStudentOptions();
    loadAbsences();
    loadNews();
    loadSchedules();
    loadPermissions();
});

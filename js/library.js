document.addEventListener('DOMContentLoaded', () => {
    // قائمة الكتب المتاحة للشراء أو التأجير
    const books = [
        { id: 1, title: 'أساسيات الرياضيات', author: 'محمد أحمد', price: 50, rentPrice: 10 },
        { id: 2, title: 'علوم الحاسوب', author: 'سالم الحارثي', price: 75, rentPrice: 15 },
        { id: 3, title: 'الأدب العربي', author: 'فاطمة علي', price: 60, rentPrice: 12 },
        // أضف المزيد من الكتب حسب الحاجة
    ];

    const libraryContent = document.getElementById('library-content');
    displayBooks(books);

    function displayBooks(books) {
        libraryContent.innerHTML = `
            <div class="books-grid">
                ${books.map(book => `
                    <div class="book-box">
                        <h2>${book.title}</h2>
                        <p>المؤلف: ${book.author}</p>
                        <p>السعر: ${book.price} ريال</p>
                        <p>سعر التأجير: ${book.rentPrice} ريال</p>
                        <button onclick="buyBook(${book.id})">شراء</button>
                        <button onclick="rentBook(${book.id})">تأجير</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // عملية الشراء
    window.buyBook = function(bookId) {
        const selectedBook = books.find(book => book.id === bookId);
        if (selectedBook) {
            // إرسال بيانات الشراء إلى الإدارة
            sendDataToAdmin('شراء', selectedBook);
            alert(`تم شراء الكتاب: ${selectedBook.title}`);
        }
    }

    // عملية التأجير
    window.rentBook = function(bookId) {
        const selectedBook = books.find(book => book.id === bookId);
        if (selectedBook) {
            // إرسال بيانات التأجير إلى رئيس مصادر التعلم
            sendDataToHeadOfResources('تأجير', selectedBook);
            alert(`تم تأجير الكتاب: ${selectedBook.title}`);
        }
    }

    // إرسال بيانات الشراء إلى الإدارة
    function sendDataToAdmin(action, book) {
        // هنا يمكنك إضافة منطق الإرسال إلى الخادم لإعلام الإدارة بعملية الشراء
        console.log(`تم إرسال بيانات ${action} إلى الإدارة للكتاب: ${book.title}`);
    }

    // إرسال بيانات التأجير إلى رئيس مصادر التعلم
    function sendDataToHeadOfResources(action, book) {
        // هنا يمكنك إضافة منطق الإرسال إلى الخادم لإعلام رئيس مصادر التعلم بعملية التأجير
        console.log(`تم إرسال بيانات ${action} إلى رئيس مصادر التعلم للكتاب: ${book.title}`);
    }
});

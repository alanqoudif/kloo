// دالة لتحديد الترحيب بناءً على التوقيت
function getGreeting() {
    const now = new Date();
    const omanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Muscat" }));
    const hours = omanTime.getHours();

    if (hours >= 5 && hours < 12) {
        return "صباح الخير!";
    } else if (hours >= 12 && hours < 17) {
        return "مساء الخير!";
    } else if (hours >= 17 && hours < 20) {
        return "مساء النور!";
    } else {
        return "مساء الخير!";
    }
}

// دالة لتحديث التوقيت لسلطنة عمان
function updateOmanTime() {
    const now = new Date();
    const omanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Muscat" }));
    const timeString = omanTime.toLocaleTimeString("ar-EG", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    document.getElementById("oman-time").innerText = `الوقت الحالي في سلطنة عمان: ${timeString}`;
}

// تفعيل الترحيب والتوقيت عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("greeting").innerText = getGreeting();
    updateOmanTime();
    setInterval(updateOmanTime, 1000); // تحديث التوقيت كل ثانية
});

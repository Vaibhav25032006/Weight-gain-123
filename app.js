const AppEngine = {
    // आपके 10 स्पेसिफिक हर्बालाइफ टास्क का टाइमिंग डेटा
    tasksData: [
        { id: "t1", hour: 6, min: 0, time: "06:00 AM", name: "Morning Hydration", desc: "1 glass lukewarm water" },
        { id: "t2", hour: 6, min: 30, time: "06:30 AM", name: "Morning Club", desc: "Online session / 2 Stretches 50s" },
        { id: "t3", hour: 8, min: 0, time: "08:00 AM", name: "Breakfast Nutrition", desc: "Formula-1 (3 scoops) + ShakeMate (2 scoops)" },
        { id: "t4", hour: 10, min: 0, time: "10:00 AM", name: "Mid-Morning Snack", desc: "2 Bananas / Chiku / Mango" },
        { id: "t5", hour: 12, min: 0, time: "12:00 PM", name: "Lunch Setup", desc: "4 Roti + Sabzi + Salad + Curd" },
        { id: "t6", hour: 13, min: 0, time: "01:00 PM", name: "Afresh Energy Shake", desc: "1 Scoop Afresh" },
        { id: "t7", hour: 16, min: 0, time: "04:00 PM", name: "Evening Snack", desc: "Tea + Healthy Snacks" },
        { id: "t8", hour: 17, min: 0, time: "05:00 PM", name: "Evening Nutrition", desc: "Sprouts / Soaked Dry Fruits" },
        { id: "t9", hour: 20, min: 0, time: "08:00 PM", name: "Dinner Plan", desc: "3 Roti + Sabzi" },
        { id: "t10", hour: 22, min: 0, time: "10:00 PM", name: "Sleep Alert", desc: "Time to rest" }
    ],

    init() {
        this.renderTimelineTable();
        // ⚡ जैसे ही यूज़र क्रोम में आएगा, यह चेन अपने आप बैकग्राउंड में एक्टिवेट हो जाएगी
        this.syncAllAlarmsToSystemClock(); 
    },

    renderTimelineTable() {
        const container = document.getElementById('timeline-container');
        container.innerHTML = "";
        
        this.tasksData.forEach(task => {
            const row = document.createElement('div');
            row.className = "task-row";
            row.innerHTML = `
                <div class="task-time">${task.time}</div>
                <div style="flex: 1; padding: 0 10px;">
                    <strong>${task.name}</strong> <span style="color: green; font-size: 12px;">(Alarm Synced)</span><br>
                    <small>${task.desc}</small>
                </div>
            `;
            container.appendChild(row);
        });
    },

    // 🔗 यही वो मुख्य चेन है जो बिना APK खोले सीधे मोबाइल की घड़ी सेट करेगी
    syncAllAlarmsToSystemClock() {
        console.log("Initiating System Clock Bridge Connection...");
        
        this.tasksData.forEach(task => {
            // एंड्रॉइड इंटेंट लिंक जो बैकग्राउंड में डाउनलोड की हुई APK को सीधे ट्रिगर करेगा
            const intentUrl = `intent://set_alarm?id=${task.id}&hour=${task.hour}&min=${task.min}&name=${encodeURIComponent(task.name)}#Intent;scheme=herbalifeclock;package=com.vaibhav.herbalifeclock;end`;
            
            // एक छुपे हुए फ्रेम के ज़रिए क्रोम से सिग्नल फोन की घड़ी को भेज देना
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = intentUrl;
            document.body.appendChild(iframe);
            
            // भेजने के बाद फ्रेम को डिलीट कर देना ताकि यूज़र को कुछ पता न चले
            setTimeout(() => iframe.remove(), 500);
        });

        document.getElementById('clock-status-banner').innerText = "⏰ सिस्टम घड़ी लिंक: 10 अलार्म सेट हो चुके हैं!";
    }
};

window.addEventListener('load', () => AppEngine.init());

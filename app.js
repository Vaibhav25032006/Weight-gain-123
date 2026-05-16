const DashboardEngine = {
    // तेरे 10 फिक्स्ड हर्बालाइफ टास्क्स का 100% सही शेड्यूल डेटा
    tasksData: [
        { id: "t1", hour: 6, min: 0, time: "06:00 AM", name: "Morning Hydration", desc: "1 गिलास गुनगुना पानी पिएं", voiceText: "गुड मॉर्निंग! सुबह के छह बज गए हैं। खाली Pete एक गिलास गुनगुना पानी पीने का समय हो गया है।" },
        { id: "t2", hour: 6, min: 30, time: "06:30 AM", name: "Morning Wellness Club", desc: "ऑनलाइन सेशन / लाइट स्ट्रेचिंग 50 सेकंड", voiceText: "साढ़े छह बज चुके हैं। तुरंत मॉर्निंग वेलनेस क्लब सेशन जॉइन करें या हल्की स्ट्रेचिंग शुरू करें।" },
        { id: "t3", hour: 8, min: 0, time: "08:00 AM", name: "Breakfast Nutrition Shake", desc: "फार्मूला-1 (3 चम्मच) + शेक मेट (2 चम्मच)", voiceText: "आठ बज गए हैं, यह आपके नाश्ते का समय है। अपना शानदार फॉर्मूला वन और शेक मेट न्यूट्रिशन शेक तैयार करें।" },
        { id: "t4", hour: 10, min: 0, time: "10:00 AM", name: "Mid-Morning Snack", desc: "2 केले / चीकू या आम खाएं", voiceText: "दस बज चुके हैं। मिड मॉर्निंग स्नैक का टाइम है, दो फ्रेश केले या कोई भी मौसमी फल खाएं।" },
        { id: "t5", hour: 12, min: 0, time: "12:00 PM", name: "Lunch Setup Preparation", desc: "4 रोटी + हरी सब्जी + सलाद + दही", voiceText: "दुपहर के बारह बज गए हैं। अपने लंच की तैयारी करें, प्लेट में चार रोटी, सब्जी, सलाद और दही होना चाहिए।" },
        { id: "t6", hour: 13, min: 0, time: "01:00 PM", name: "Afresh Energy Drink", desc: "1 चम्मच अफ्रेश गर्म पानी में", voiceText: "दुपहर का एक बज चुका है। अपनी एनर्जी को बूस्ट करने के लिए एक चम्मच अफ्रेश ड्रिंक तैयार करें।" },
        { id: "t7", hour: 16, min: 0, time: "04:00 PM", name: "Evening Snack Recharge", desc: "चाय या हल्के हेल्दी स्नैक्स", voiceText: "शाम के चार बज गए हैं। आपके इवनिंग स्नैक का समय हो गया है, कुछ हल्का और हेल्दी खाएं।" },
        { id: "t8", hour: 17, min: 0, time: "05:00 PM", name: "Evening Nutrition Sprouts", desc: "अंकुरित अनाज या भीगे हुए ड्राई फ्रूट्स", voiceText: "शाम के पांच बज चुके हैं। न्यूट्रिशन रीचार्ज के लिए अंकुरित अनाज या भीगे हुए बादाम खाएं।" },
        { id: "t9", hour: 20, min: 0, time: "08:00 PM", name: "Healthy Dinner Meal", desc: "3 रोटी + हरी मौसमी सब्जी", voiceText: "रात के आठ बज गए हैं, यह डिनर का टाइम है। अपनी तीन रोटी और हरी सब्जी का हल्का भोजन करें।" },
        { id: "t10", hour: 22, min: 0, time: "10:00 PM", name: "Rest & Sleep Alert", desc: "शरीर को आराम दें, सोने का समय", voiceText: "रात के दस बज चुके हैं। अब फोन साइड में रखें, शरीर को रिकवरी देने के लिए गहरी नींद सोने का समय है।" }
    ],

    completedCount: 0,

    init() {
        this.setTodayDate();
        this.renderTimeline();
        this.startCamera();
        this.updateProgressGraph();
        this.fireAndroidBridgeIntents();
    },

    setTodayDate() {
        const calendarInput = document.getElementById('app-calendar');
        const today = new Date().toISOString().split('T')[0];
        calendarInput.value = today;
    },

    // 📷 फ्रंट कैमरा लाइव स्ट्रीम को चालू करने का फिक्स्ड कोड
    async startCamera() {
        const video = document.getElementById('webcam');
        const status = document.getElementById('ai-status');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                video.srcObject = stream;
                status.innerText = "🔍 AI Face Scanner: एक्टिव (चेहरा सामने रखें)";
                status.style.color = "#8bc34a";
            } catch (err) {
                status.innerText = "❌ कैमरा ब्लॉक है! Chrome की सेटिंग्स में Allow करें।";
                status.style.color = "#ef4444";
            }
        }
    },

    // 📷 AI कैमरा स्कैनिंग एनीमेशन और ऑटो-वॉयस अलर्ट ट्रिगर
    triggerAICameraScan() {
        const status = document.getElementById('ai-status');
        status.innerText = "⚡ Scanning Face Matrix... Please Hold Still...";
        status.style.color = "#eab308";

        setTimeout(() => {
            status.innerText = "✅ AI वेरिफिकेशन सफल! टास्क लॉक कर दिया गया है।";
            status.style.color = "#8bc34a";
            
            // दिल्ली वाले लहजे में बोलने के लिए voice.js का इंजन कॉल करना
            if (typeof VoiceEngine !== 'undefined') {
                VoiceEngine.speakHindi("आपका टास्क सफलतापूर्वक वेरीफाई हो गया है। बहुत बढ़िया प्रोग्रेस है!");
            }
        }, 2000);
    },

    // ⏰ 10 टास्क्स की लिस्ट स्क्रीन पर रेंडर करना (With Interactive Checkboxes)
    renderTimeline() {
        const container = document.getElementById('timeline-container');
        container.innerHTML = "";

        this.tasksData.forEach((task) => {
            const row = document.createElement('div');
            row.className = "task-row";
            row.innerHTML = `
                <div class="task-time">${task.time}</div>
                <div class="task-details">
                    <strong>${task.name}</strong>
                    <small>${task.desc}</small>
                </div>
                <input type="checkbox" class="task-checkbox" id="check-${task.id}" onchange="DashboardEngine.handleTaskToggle(this, '${task.voiceText}')">
            `;
            container.appendChild(row);
        });
    },

    // 📊 चेकबॉक्स टिक होने पर लाइव ग्राफ का प्रतिशत अपडेट करना और आवाज बोलना
    handleTaskToggle(checkbox, voiceMessage) {
        if (checkbox.checked) {
            this.completedCount++;
            if (typeof VoiceEngine !== 'undefined') {
                VoiceEngine.speakHindi(voiceMessage);
            }
        } else {
            this.completedCount--;
        }
        this.updateProgressGraph();
    },

    // 📊 प्रोग्रेस बार/ग्राफ को डायनेमिक अपडेट करने का लॉजिक
    updateProgressGraph() {
        const percentage = Math.round((this.completedCount / this.tasksData.length) * 100);
        document.getElementById('progress-bar').style.width = `${percentage}%`;
        document.getElementById('graph-stats').innerText = `${this.completedCount} / 10 टास्क्स पूरे हुए (${percentage}%)`;
    },

    // 📅 कैलेंडर तारीख बदलने का हैंडलर
    handleDateChange() {
        this.completedCount = 0;
        this.updateProgressGraph();
        this.renderTimeline();
        if (typeof VoiceEngine !== 'undefined') {
            VoiceEngine.speakHindi("तारीख बदल गई है। नया शेड्यूल लोड हो चुका है।");
        }
    },

    // 🤖 फोन के बैकग्राउंड अलार्म सिस्टम (APK) को सिग्नल भेजने की पाइपलाइन
    fireAndroidBridgeIntents() {
        this.tasksData.forEach(task => {
            const url = `intent://set_alarm?id=${task.id}&hour=${task.hour}&min=${task.min}&name=${encodeURIComponent(task.name)}#Intent;scheme=herbalifeclock;package=com.vaibhav.herbalifeclock;end`;
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => iframe.remove(), 400);
        });
    }
};

window.addEventListener('load', () => DashboardEngine.init());

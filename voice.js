const VoiceEngine = {
    synth: window.speechSynthesis,
    delhiVoice: null,

    init() {
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => this.assignVoice();
        }
        this.assignVoice();
    },

    assignVoice() {
        const voices = this.synth.getVoices();
        // गूगल क्रोम की सबसे बेहतरीन भारतीय हिंदी फीमेल आवाज़ को चुनना
        this.delhiVoice = voices.find(v => v.lang === 'hi-IN' || v.name.includes('Google हिन्दी')) || voices[0];
    },

    speakHindi(text) {
        if (!this.synth) return;
        this.synth.cancel(); // अगर कोई पुरानी आवाज़ चल रही हो तो उसे तुरंत रोकना

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.delhiVoice;
        utterance.rate = 0.9;  // सामान्य और साफ बोलने की गति
        utterance.pitch = 1.05; // आदरणीय और स्पष्ट महिला की पिच
        this.synth.speak(utterance);
    }
};

VoiceEngine.init();

package com.vaibhav.herbalifeclock;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import java.util.Calendar;

public class AndroidBridgeReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        Uri data = intent.getData();
        
        // 1. चेक करना कि क्या सिग्नल हमारे ही हर्बालाइफ वेब ऐप से आया है
        if (data != null && "herbalifeclock".equals(data.getScheme())) {
            try {
                // 2. क्रोम ब्राउज़र के लिंक से टास्क आईडी और टाइम निकालना
                String taskId = data.getQueryParameter("id");
                int hour = Integer.parseInt(data.getQueryParameter("hour"));
                int min = Integer.parseInt(data.getQueryParameter("min"));
                String taskName = data.getQueryParameter("name");

                // 3. मोबाइल की असली सिस्टम क्लॉक (AlarmManager) का एक्सेस लेना
                AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
                
                Calendar calendar = Calendar.getInstance();
                calendar.set(Calendar.HOUR_OF_DAY, hour);
                calendar.set(Calendar.MINUTE, min);
                calendar.set(Calendar.SECOND, 0);

                // अगर आज का समय निकल चुका है, तो अलार्म अगले दिन के लिए सेट होगा
                if (calendar.before(Calendar.getInstance())) {
                    calendar.add(Calendar.DATE, 1);
                }

                // 4. बैकग्राउंड अलार्म सर्विस को ट्रिगर करने का इंटेंट बनाना
                Intent alarmIntent = new Intent(context, SystemAlarmService.class);
                alarmIntent.putExtra("TASK_ID", taskId);
                alarmIntent.putExtra("TASK_NAME", taskName);

                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context, 
                    taskId.hashCode(), // हर टास्क के लिए यूनिक आईडी (जैसे t1, t2)
                    alarmIntent, 
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );

                // 🎯 फोन की मुख्य घड़ी को जगाना (चाहे फोन लॉक हो या सोया हुआ हो)
                if (alarmManager != null) {
                    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                        alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                    } else {
                        alarmManager.setExact(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), pendingIntent);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

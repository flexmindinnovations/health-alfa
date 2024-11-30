import { showNotification } from "@mantine/notifications";
import { notificationAudio } from '../main';

export const openNotificationWithSound = (options, type) => {
    showNotification(options);
    notificationAudio.volume = 1.0;
    notificationAudio.currentTime = 0;
    notificationAudio.play().catch((error) => {
        console.error("Unable to play sound:", error);
    });
}
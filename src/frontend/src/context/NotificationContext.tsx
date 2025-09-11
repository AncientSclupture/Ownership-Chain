import { createContext, useState } from "react";

export type NotificationType = {
    title: string | "default title";
    description: string | "no-description";
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-fit";
};

export type NotificationContextType = {
    notificationData: NotificationType;
    setNotificationData: (d: NotificationType) => void;
};

export const NotificationContext = createContext<NotificationContextType>({
    notificationData: { title: "default title", description: "no-description", position: "bottom-right" },
    setNotificationData: () => { }
});

export const PopUpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notificationData, setNotificationData] = useState<NotificationType>({
        title: "default notif",
        description: "no-description",
        position: "bottom-right",
    });

    return (
        <NotificationContext.Provider value={{ notificationData, setNotificationData }}>
            {children}
        </NotificationContext.Provider>
    );
};

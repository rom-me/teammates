package teammates.ui.output;

import java.util.List;
import java.util.stream.Collectors;

import teammates.common.datatransfer.attributes.NotificationAttributes;

/**
 * The API output for a list of notifications.
 */
public class NotificationsData extends ApiOutput {
    private final List<NotificationData> notifications;

    public NotificationsData(List<NotificationAttributes> notificationAttributesList) {
        notifications = notificationAttributesList.stream().map(NotificationData::new).collect(Collectors.toList());
    }

    public List<NotificationData> getNotifications() {
        return notifications;
    }
}

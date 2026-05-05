/**
 * Service pour gérer les notifications Push
 */

import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { NotificationPayload } from '@types/index';

// Configuration du comportement des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const isValidUuid = (value?: string | null) =>
  typeof value === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

export class NotificationService {
  /**
   * Initialise les notifications
   */
  static async initialize(): Promise<string | null> {
    try {
      // Demander les permissions
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== 'granted') {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Permissions de notification refusées');
          return null;
        }
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (!isValidUuid(projectId)) {
        console.warn(
          'Notifications push désactivées: projectId EAS manquant ou invalide'
        );
        return null;
      }

      // Obtenir le token d'enregistrement
      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      return token.data;
    } catch (error) {
      console.error('Erreur initialisation notifications:', error);
      return null;
    }
  }

  /**
   * Envoie une notification locale immédiate
   */
  static async sendLocalNotification(
    payload: NotificationPayload
  ): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Immédiate
      });
    } catch (error) {
      console.error('Erreur envoi notification:', error);
    }
  }

  /**
   * Programme une notification pour une heure donnée
   */
  static async scheduleNotification(
    payload: NotificationPayload,
    date: Date,
    identifier?: string
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
          sound: 'default',
        },
        trigger: {
          type: 'date',
          date: date,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Erreur programmation notification:', error);
      return null;
    }
  }

  /**
   * Programme des notifications récurrentes (ex: Zmanim quotidiens)
   */
  static async scheduleRecurringNotification(
    payload: NotificationPayload,
    time: { hour: number; minute: number }
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: payload.title,
          body: payload.body,
          data: payload.data,
        },
        trigger: {
          type: 'daily',
          hour: time.hour,
          minute: time.minute,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Erreur programmation notification récurrente:', error);
      return null;
    }
  }

  /**
   * Annule une notification programmée
   */
  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Erreur annulation notification:', error);
    }
  }

  /**
   * Annule toutes les notifications
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erreur annulation notifications:', error);
    }
  }

  /**
   * Écoute les interactions de notification
   */
  static addNotificationListener(
    handler: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(
      ({ notification }) => handler(notification)
    );
  }

  /**
   * Écoute la réception de notification
   */
  static addNotificationReceivedListener(
    handler: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(handler);
  }
}

export default NotificationService;

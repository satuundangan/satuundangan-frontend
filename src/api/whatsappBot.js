import { apiFetch } from './client.js';

export const fetchWhatsappBotStatus = () => apiFetch('/admin/whatsapp-bot/status');

export const connectWhatsappBot = () =>
  apiFetch('/admin/whatsapp-bot/connect', {
    method: 'POST',
  });

export const logoutWhatsappBot = () =>
  apiFetch('/admin/whatsapp-bot/logout', {
    method: 'POST',
  });

export const toggleWhatsappBot = (enabled) =>
  apiFetch('/admin/whatsapp-bot/toggle-bot', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  });

export const toggleWhatsappBotAi = (enabled) =>
  apiFetch('/admin/whatsapp-bot/toggle-ai', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  });

export const testWhatsappBotAi = (message) =>
  apiFetch('/admin/whatsapp-bot/test-ai', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

export const sendWhatsappBotMessage = (to, text) =>
  apiFetch('/admin/whatsapp-bot/send-message', {
    method: 'POST',
    body: JSON.stringify({ to, text }),
  });

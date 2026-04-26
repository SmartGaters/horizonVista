// Centralized contact + social info — edit here to update everywhere.

export const COMPANY = {
  name: "HorizonVista Travel",
  tagline: "Your Journey, Our Passion",
  founded: 2025,
  headquarters: "Istanbul, Turkey",
  generalEmail: "info@horizonvista.com",
  generalPhone: "+90 212 555 0100",
  website: "www.horizonvista.com",
} as const;

export const BRANCHES = [
  {
    city: "Istanbul",
    address: "Bağcılar Cad. No:14, Şişli",
    phone: "+90 541 420 59",
    email: "istanbul@horizonvista.com",
    hours: "Mon–Sat 09:00–18:00",
  },
  {
    city: "Ankara",
    address: "Kızılay Mah. Atatürk Blv. No:72",
    phone: "+90 552 578 6880",
    email: "ankara@horizonvista.com",
    hours: "Mon–Sat 09:00–17:30",
  },
  {
    city: "Dubai (Partner)",
    address: "Business Bay, Tower B, Office 412",
    phone: "+971 4 555 0303",
    email: "dubai@horizonvista.com",
    hours: "Sun–Thu 09:00–18:00",
  },
] as const;

export const SOCIAL = {
  // Replace with your actual Telegram bot/username (e.g. https://t.me/YourBot)
  telegram: "https://t.me/HorizonVistaBot",
  telegramHandle: "@HorizonVistaBot",
  instagram: "https://instagram.com/horizonvista",
  instagramHandle: "@horizonvista",
  facebook: "https://facebook.com/HorizonVistaTravel",
  facebookHandle: "HorizonVistaTravel",
  whatsapp: "https://wa.me/905551234567",
  whatsappHandle: "+90 555 123 4567",
} as const;

export const LANGUAGES = ["Turkish", "English", "Arabic"] as const;
export const PAYMENTS = [
  "Credit Card (Visa/Mastercard)",
  "Bank Transfer",
  "PayPal",
  "Installment Plans (up to 12 months interest-free)",
] as const;
export const CURRENCIES = ["TRY", "USD", "EUR", "AED"] as const;

// Helper to extract results from API response
export function extractResults(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.results) return response.results;
  if (response.data?.results) return response.data.results;
  return [];
}

// Helper to get name from object or return string directly
export function getName(val: any): string | null {
  if (!val) return null;
  if (typeof val === "string") return val;
  return val.name || val.name_en || val.display_name || null;
}

// Format phone number for links (remove spaces, dashes)
export function formatPhoneForLink(phone: string | undefined): string {
  return phone?.replace(/[\s-]/g, "") || "";
}

// Generate communication links
export function getPhoneLinks(phoneNumber: string) {
  const cleanNumber = phoneNumber.replace(/^\+/, "");
  return {
    tel: `tel:${phoneNumber}`,
    whatsapp: `https://wa.me/${cleanNumber}`,
    viber: `viber://chat?number=${phoneNumber.replace(/^\+/, "%2B")}`,
  };
}

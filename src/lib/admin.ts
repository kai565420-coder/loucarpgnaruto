export const ADMIN_IPS = ["192.168.1.112", "192.168.100.20", "168.232.5.90", "45.173.223.116"];

export const isAdmin = (ip: string) => ADMIN_IPS.includes(ip);

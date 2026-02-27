export const ADMIN_IPS = ["192.168.1.112", "192.168.100.20"];

export const isAdmin = (ip: string) => ADMIN_IPS.includes(ip);

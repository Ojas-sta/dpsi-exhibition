'use client';

let cachedFingerprint: string | null = null;

export async function getDeviceFingerprint(): Promise<string> {
  if (cachedFingerprint) return cachedFingerprint;

  try {
    const { getFingerprint } = await import('@thumbmarkjs/thumbmarkjs');
    const fp = await getFingerprint();
    cachedFingerprint = String(fp);
    return cachedFingerprint;
  } catch (err) {
    console.warn('Thumbmark hardware fingerprint fallback:', err);
    // Graceful fallback hardware signature based on screen and user agent
    const fallback = `${navigator.userAgent}_${screen.width}x${screen.height}_${new Date().getTimezoneOffset()}`;
    cachedFingerprint = btoa(fallback).substring(0, 32);
    return cachedFingerprint;
  }
}

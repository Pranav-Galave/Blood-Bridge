import { LocationCoordinates } from '../types';

/**
 * Standard reference coordinates in Solapur, Maharashtra, India.
 * Solapur coordinates: approx 17.6599° N, 75.9064° E
 */
export const SOLAPUR_LANDMARKS: Record<string, LocationCoordinates> = {
  CIVIL_HOSPITAL: {
    lat: 17.6715,
    lng: 75.9038,
    address: 'Near Saat Rasta, Civil Hospital Road',
    area: 'Saat Rasta',
    city: 'Solapur',
  },
  ASHWINI_HOSPITAL: {
    lat: 17.6620,
    lng: 75.9140,
    address: 'Old Pune Naka, Murarji Peth',
    area: 'Murarji Peth',
    city: 'Solapur',
  },
  GMC_SOLAPUR: {
    lat: 17.6730,
    lng: 75.9015,
    address: 'Dr. V.M. Govt. Medical College Campus',
    area: 'Siddheshwar Peth',
    city: 'Solapur',
  },
  JULE_SOLAPUR: {
    lat: 17.6385,
    lng: 75.9180,
    address: 'Sector 2, D-Mart Road, Jule Solapur',
    area: 'Jule Solapur',
    city: 'Solapur',
  },
  BHAVANI_PETH: {
    lat: 17.6680,
    lng: 75.9220,
    address: 'Bhavani Peth Main Market Road',
    area: 'Bhavani Peth',
    city: 'Solapur',
  },
  HOTGI_ROAD: {
    lat: 17.6250,
    lng: 75.9350,
    address: 'Near Solapur Airport, Hotgi Road',
    area: 'Hotgi Road',
    city: 'Solapur',
  },
  LIFELINE_BLOOD_BANK: {
    lat: 17.6660,
    lng: 75.9100,
    address: 'Navi Peth, Near City Bus Stand',
    area: 'Navi Peth',
    city: 'Solapur',
  },
};

/**
 * Calculate great-circle distance between two GPS coordinates using Haversine Formula
 * @returns distance in kilometers rounded to 1 decimal place
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Format distance string
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Estimate travel time in urban traffic (avg ~25-30 km/h)
 */
export function estimateTravelMinutes(distanceKm: number): number {
  const avgSpeedKmH = 26;
  const hours = distanceKm / avgSpeedKmH;
  return Math.max(4, Math.round(hours * 60));
}

import { BloodGroup, Donor, EmergencyRequest, RankedDonor } from '../types';
import { isRBCCompatible, getNextEligibleDonationInfo } from './compatibility';
import { calculateDistanceKm } from './geo';

/**
 * Intelligent Donor Matching & Ranking Algorithm
 * Calculates an overall Suitability Score (0 - 100) based on clinical and operational criteria.
 */
export function rankDonorsForEmergencyRequest(
  request: EmergencyRequest,
  donors: Donor[]
): RankedDonor[] {
  const rankedList: RankedDonor[] = donors.map((donor) => {
    // 1. Distance Calculation
    const distanceKm = calculateDistanceKm(
      request.hospitalLocation.lat,
      request.hospitalLocation.lng,
      donor.location.lat,
      donor.location.lng
    );

    // 2. Compatibility Evaluation
    const isExactMatch = donor.bloodGroup === request.bloodGroup;
    const isCompatible = isRBCCompatible(donor.bloodGroup, request.bloodGroup);

    let compatibilityScore = 0;
    let compatibilityNote = '';

    if (isExactMatch) {
      compatibilityScore = 40; // Full 40 pts for identical group match
      compatibilityNote = `Exact match (${donor.bloodGroup})`;
    } else if (isCompatible) {
      compatibilityScore = 32; // 32 pts for compatible substitute (e.g. O- red cells)
      compatibilityNote = `Medically compatible donor (${donor.bloodGroup} → ${request.bloodGroup})`;
    } else {
      compatibilityScore = 0;
      compatibilityNote = `Incompatible red blood cell antigen profile`;
    }

    // 3. Distance Score (0 - 25 pts)
    let distanceScore = 0;
    if (distanceKm <= 2) distanceScore = 25;
    else if (distanceKm <= 5) distanceScore = 22;
    else if (distanceKm <= 10) distanceScore = 17;
    else if (distanceKm <= 18) distanceScore = 11;
    else if (distanceKm <= 30) distanceScore = 6;
    else distanceScore = 2;

    // 4. Availability Score (0 - 15 pts)
    let availabilityScore = 0;
    if (donor.availability === 'Available Now') availabilityScore = 15;
    else if (donor.availability === 'On Call') availabilityScore = 9;
    else availabilityScore = 0;

    // 5. Eligibility Score (0 - 10 pts)
    const eligibilityInfo = getNextEligibleDonationInfo(
      donor.lastDonationDate,
      donor.lastDonationType,
      donor.gender
    );
    let eligibilityScore = 0;
    let eligibilityStatus: 'Eligible' | 'Waiting Period' | 'Unavailable' = 'Unavailable';

    if (eligibilityInfo.isEligible) {
      eligibilityScore = 10;
      eligibilityStatus = 'Eligible';
    } else {
      eligibilityScore = 0;
      eligibilityStatus = 'Waiting Period';
    }

    // 6. Response History Score (0 - 5 pts)
    const historyScore = Math.min(5, Math.round((donor.responseRate / 100) * 5));

    // 7. Verification Score (0 - 5 pts)
    const verificationScore = donor.verified ? 5 : 0;

    // Total Suitability Score (0 - 100)
    // If incompatible or unavailable or in waiting period, apply dampeners
    let totalScore =
      compatibilityScore +
      distanceScore +
      availabilityScore +
      eligibilityScore +
      historyScore +
      verificationScore;

    // Incompatible donors cannot score above 20
    if (!isCompatible) {
      totalScore = Math.min(15, totalScore);
    }
    // Waiting period donors cannot score above 40
    if (!eligibilityInfo.isEligible) {
      totalScore = Math.min(45, totalScore);
    }

    return {
      donor,
      suitabilityScore: totalScore,
      distanceKm,
      isCompatible,
      compatibilityNote,
      eligibilityStatus,
      daysUntilEligible: eligibilityInfo.daysRemaining,
      scoreBreakdown: {
        compatibility: compatibilityScore,
        distance: distanceScore,
        availability: availabilityScore,
        eligibility: eligibilityScore,
        history: historyScore,
        verification: verificationScore,
      },
    };
  });

  // Sort descending: highest suitability first, closest distance as tiebreaker
  return rankedList.sort((a, b) => {
    if (b.suitabilityScore !== a.suitabilityScore) {
      return b.suitabilityScore - a.suitabilityScore;
    }
    return a.distanceKm - b.distanceKm;
  });
}

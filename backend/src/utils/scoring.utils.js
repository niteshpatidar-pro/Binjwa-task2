/**
 * Rule-based scoring logic for eligibility evaluation.
 * In a real scenario, this would evaluate financial data, experience, etc.
 */
exports.evaluateEligibility = (role, data) => {
    let score = 0;

    if (role === 'Investor') {
        // Example: Score based on net worth and experience
        if (data.netWorth > 1000000) score += 50;
        if (data.experienceYears > 5) score += 30;
        if (data.previousInvestments > 10) score += 20;
    } else if (role === 'Founder') {
        // Example: Score based on revenue and team size
        if (data.revenue > 100000) score += 40;
        if (data.teamSize > 5) score += 30;
        if (data.industryExperience > 3) score += 30;
    } else if (role === 'Partner') {
        if (data.companySize > 50) score += 50;
        if (data.yearsInOperation > 2) score += 50;
    }

    return score;
};

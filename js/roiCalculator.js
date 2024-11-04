// js/roiCalculator.js

window.calculateROI = function() {
    const processLength = parseInt(document.getElementById('process-length').value);
    const processComplexity = parseInt(document.getElementById('process-complexity').value);
    const hasDocuments = document.querySelector('input[name="documents"]:checked').value;
    const teachability = document.querySelector('input[name="teachability"]:checked').value;
    const annualSalary = parseInt(document.getElementById('annual-salary').value);
    const numEmployees = parseInt(document.getElementById('num-employees').value);
    const hoursPerWeek = parseInt(document.getElementById('hours-per-week').value);

    if (isNaN(hoursPerWeek) || hoursPerWeek < 1 || hoursPerWeek > 40) {
        alert('Please enter a valid number of hours per week (1-40).');
        return;
    }

    let baseROI = 100;
    baseROI -= processLength * 10;
    baseROI -= processComplexity * 10;
    baseROI += hasDocuments === "no" ? 10 : 0;
    baseROI += teachability === "yes" ? 20 : 0;
    baseROI += annualSalary / 1000;
    baseROI += numEmployees * hoursPerWeek * 0.5;

    baseROI = Math.min(Math.max(baseROI, 0), 200);

    const years = 4;
    let roiProjection = [];
    const roiAnnualGrowthRate = 5;
    const savingsAnnualGrowthRate = 3;
    const operationalCostReductionRate = 2;

    let currentROI = baseROI;
    let baseSavings = 5000;
    let operationalCosts = (annualSalary / 2) * numEmployees;
    const initialOperationalCosts = operationalCosts;

    for (let year = 1; year <= years; year++) {
        if (year > 1) {
            currentROI = Math.min(currentROI * (1 + roiAnnualGrowthRate / 100), 200);
            baseSavings *= 1 + savingsAnnualGrowthRate / 100;
            operationalCosts = Math.max(operationalCosts * (1 - operationalCostReductionRate / 100), initialOperationalCosts * 0.5);
        }

        let costSavings = baseSavings + ((annualSalary * numEmployees * hoursPerWeek) / 1000) * currentROI;
        let profit = costSavings - operationalCosts;

        roiProjection.push({ year, costSavings, profit, roi: currentROI });
    }

    for (let i = 0; i < years; i++) {
        document.getElementById(`cost-savings-year${roiProjection[i].year}`).innerText = `€${roiProjection[i].costSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById(`profit-year${roiProjection[i].year}`).innerText = `€${roiProjection[i].profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById(`roi-year${roiProjection[i].year}`).innerText = `${roiProjection[i].roi.toFixed(2)}%`;
    }
};

// Initialize calculation on page load
document.addEventListener('DOMContentLoaded', calculateROI);

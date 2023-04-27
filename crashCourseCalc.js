function crashCourseCalc() {
  const netWorth = parseFloat(document.getElementById('net-worth-input').value);
  const annualIncome = parseFloat(document.getElementById('annual-income-input').value);
  const annualExpenses = parseFloat(document.getElementById('annual-expenses-input').value);
  const rateOfReturn = parseFloat(document.getElementById('rate-of-return-input').value) / 100; // Convert to decimal

  // Validate input values
  if (isNaN(netWorth) || isNaN(annualIncome) || isNaN(annualExpenses) || isNaN(rateOfReturn)) {
    console.error('Invalid input values. Please enter numbers for all fields.');
    return;
  }

  const contributionValues = [netWorth]; // Start with current net worth
  const totalValues = [netWorth]; // Start with current net worth

  for (let i = 1; i <= 30; i++) { // Calculate values for next 30 years
    const previousContribution = contributionValues[i - 1];
    const previousTotal = totalValues[i - 1];
    const annualDifference = annualIncome - annualExpenses;
    const annualContribution = annualDifference;
    const annualReturn = previousTotal * rateOfReturn;
    const nextContribution = previousContribution + annualContribution;
    const nextTotal = previousTotal + annualContribution + annualReturn;

    contributionValues.push(nextContribution);
    totalValues.push(nextTotal);
  }

  // Log results to console
  console.log('Contribution Values:', contributionValues);
  console.log('Total Values:', totalValues);

  // Check if data is empty
  if (contributionValues.length === 0 || totalValues.length === 0) {
    console.error('No data found.');
    return;
  }

  const years = Array.from({ length: contributionValues.length }, (_, i) => i); // Generate array of years

  const contributionData = [{
    x: years,
    y: contributionValues,
    type: 'scatter',
    mode: 'lines',
    name: 'Contributions',
    fill: 'tozeroy',
    fillcolor: '#429329',
    line: { color: '#429329' },
    hovertemplate: 'Contribution: $%{y:,.0f}<extra></extra>', // Add commas and limit to 2 decimal places
  }];

  const totalData = [{
    x: years,
    y: totalValues,
    type: 'scatter',
    mode: 'lines',
    name: 'Growth',
    fill: 'tonexty',
    fillcolor: '#CCFF00',
    line: { color: '#CCFF00' },
    hovertemplate: 'Total: $%{y:,.0f}<extra></extra>', // Add commas and limit to 2 decimal places
  }];
  
  const fireNumber = annualExpenses * 25;
  const fireYear = totalValues.findIndex((value) => value >= fireNumber);
  const fireNumberData = [{
    x: [fireYear, fireYear],
    y: [0, totalValues[fireYear]],
    type: 'scatter',
    mode: 'lines',
    name: `Fire Number: ${fireNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
    line: { color: 'black', dash: 'dash' },
    hoverinfo: 'none',
    showlegend: true,
    legendgroup: 'fire-number'
  }];

  const layout = {
    title: '',
    xaxis: {
      title: 'Year',
      // showgrid: false // hide x-axis gridlines
    },
    yaxis: {
      title: 'Portfolio Value (in $)',
      // showgrid: false // hide y-axis gridlines
    },
    margin:{
      b:50,
      l:70,
      r:20,
      t:0
    },
    // height: 100%, // set height to 500 pixels
    // width: 800, // set width to 800 pixels
    legend: {
      orientation: 'h',
      x: 0,
      y: 1.2,
      xanchor: 'left',
      yanchor: 'top',
    },
    hoverlabel: {
      font: {
        color: 'white',
      },
      align: 'left',
      bgcolor: 'black',
      bordercolor: 'black',
      namelength: 0,
    },
    shapes: [
      {
        type: 'line',
        xref: 'x',
        yref: 'y',
        x0: fireYear,
        y0: 0,
        x1: fireYear,
        y1: totalValues[fireYear],
        line: {
          color: 'black',
          dash: 'dash'
        }
      }
    ],
    annotations: [
      {
        x: fireYear,
        y: totalValues[fireYear],
        xref: 'x',
        yref: 'y',
        text: `FI:RE achieved year ${fireYear}`,
        showarrow: true,
        arrowhead: 1,
        ax: 0,
        ay: -40
      }
    ]
  
  };

  const config = {responsive: true, displayModeBar: false, useresizehandler: true };

  Plotly.newPlot('portfolio-graph', [...contributionData, ...totalData, ...fireNumberData], layout, config);

  // Fire Calculator Card Logic
  const investableAnnualIncome = annualIncome - annualExpenses;
  const yearOfFire = fireYear - 1;
  const monthOfFire = Math.ceil((fireNumber - totalValues[yearOfFire]) / (((totalValues[fireYear]) - (totalValues[yearOfFire])) / 12));
  
  let yearsToFire = 0;
  let monthsToFire = 0;
  if (monthOfFire != 12) {
    yearsToFire = yearOfFire;
    monthsToFire = monthOfFire;
  } else {
    yearsToFire = fireYear;
  }

  // Add years and months to current date
  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setFullYear(currentDate.getFullYear() + yearsToFire);
  futureDate.setMonth(currentDate.getMonth() + monthsToFire);

  // Fire Calculator Card Results
  const divClass = 'result-div';
  const h3Class = 'result-heading';
  const pClass = 'result-text';
  const h1Class = 'result-value';

  const investableAnnualIncomeDiv = document.createElement('div');
  investableAnnualIncomeDiv.classList.add(divClass);
  investableAnnualIncomeDiv.innerHTML = `
      <h3 class="${h3Class}">Investable Income</h3>
      <h1 class="${h1Class}">${investableAnnualIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h1>
      <p class="${pClass}">The amount of money you have available for investing each year.</p>
    `;

  const fireNumberDiv = document.createElement('div');
  fireNumberDiv.classList.add(divClass);
  fireNumberDiv.innerHTML = `
      <h3 class="${h3Class}">FI:RE Number</h3>
      <h1 class="${h1Class}">${fireNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h1>
      <p class="${pClass}">The amount of money you need to save to achieve financial independence based on your current expenses.</p>
    `;

  const fireTimelineDiv = document.createElement('div');
  fireTimelineDiv.classList.add(divClass);
  fireTimelineDiv.innerHTML = `
      <h3 class="${h3Class}">FI:RE Timeline</h3>
      <h1 class="${h1Class}">${yearsToFire} yrs and ${monthsToFire} mos</h1>
      <p class="${pClass}">The estimated time it will take for you to reach financial independence.</p>
    `;

  const fireDateDiv = document.createElement('div');
  fireDateDiv.classList.add(divClass);
  fireDateDiv.innerHTML = `
      <h3 class="${h3Class}">FI:RE Date</h3>
      <h1 class="${h1Class}">${futureDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h1>
      <p class="${pClass}">The date you can retire based on your current net worth and annual income.</p>
  `;

  const resultContainer = document.getElementById('result-container');
  resultContainer.innerHTML = ''; // remove existing content
  resultContainer.appendChild(investableAnnualIncomeDiv);
  resultContainer.appendChild(fireNumberDiv);
  resultContainer.appendChild(fireTimelineDiv);
  resultContainer.appendChild(fireDateDiv);

  // Show/Hide Calculator Results
  const resultDiv = document.getElementById("calcResults");
  resultDiv.style.display = "block";

  const content = document.getElementById("content");
  content.style.padding = "padding: 80px 0px 80px 0px;";
}

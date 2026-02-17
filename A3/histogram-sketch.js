var stats;

// Set margins
let margin = 80;
let chartWidth, chartHeight;

let bins = [];
let numBins = 40;
let minAge = 10; 
let maxAge = 97; 
let binSize;

function preload() {
    stats = loadTable("athlete_events.csv", "header");
}

function setup() {
    createCanvas(800, 500);
    background(255);
    chartWidth = width - (margin * 2);
    chartHeight = height - (margin * 2);
    
    binSize = (maxAge - minAge) / numBins; 

    for (let i = 0; i < numBins; i++) {
        bins[i] = 0;
    }

    for (let i = 0; i < stats.getRowCount(); i++) {
        let ageStr = stats.getString(i, "Age");
        let age = Number(ageStr);

        // Skip NaN vals
        if (!isNaN(age) && ageStr !== "NA") {
            let binI = floor((age - minAge) / binSize); 
            if (binI >= 0 && binI < numBins) {
                bins[binI]++;
            }
        }
    }
}

function draw() {
    background(255)
    stroke(200);
    
    // y axis
    line(margin, margin, margin, margin + chartHeight);
    // x axis
    line(margin, margin + chartHeight, margin + chartWidth, margin + chartHeight);
    
    // draw ticks on x
    let labelAges = [20, 40, 60, 80, 100]; 

    for (let i = 1; i <= 5; i++) {
        let ageVal = i * 20;
        
        let x = map(ageVal, 10, 100, margin, margin + chartWidth);

        stroke(200);
        line(x, margin + chartHeight, x, margin); // Grid line

        noStroke();
        textSize(12);
        fill(100);
        textAlign(CENTER);
        // draw labels
        text(ageVal, x, margin + chartHeight + 20);
    }

    // draw ticks on y
    let numTicksY = 6;
    let ySpacing = chartHeight / numTicksY;
    let maxCountY = 60000; 

    for (let i = 0; i <= numTicksY; i++) {
        let y = (margin + chartHeight) - (i * ySpacing);

        stroke(200);
        line(margin, y, margin + chartWidth, y);

        noStroke();
        textSize(12);
        fill(100);
        textAlign(RIGHT, CENTER);
        // draw labels
        text(i * 10000, margin - 10, y);
    }

    // x axis title
    fill(100);
    textSize(14);
    textAlign(CENTER);
    text("Age", width / 2, height - 35);

    // y axis title
    push();
    fill(100);
    translate(20, height / 2); 
    rotate(-PI / 2);
    textAlign(CENTER);
    text("Count", 0, 0);
    pop();

    // chart title
    push();
    fill(100);
    textStyle(BOLD);
    textSize(18);
    text("Distribution of Olympic Medal Athletes Age", width / 2, margin / 2);
    pop();


    // draw bars
    let barWidth = chartWidth / numBins;
    
    let maxCount = 62000; 

    for (let i = 0; i < bins.length; i++) {
        let h = map(bins[i], 0, maxCount, 0, chartHeight);
        
        fill(76, 114, 176, 200); 
        noStroke(); 
        
        rect(margin + (i * barWidth), (margin + chartHeight) - h, barWidth - 1, h);
    }

}
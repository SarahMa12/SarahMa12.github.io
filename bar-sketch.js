var stats;
var monthlyRain = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var monthCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function preload() {
  stats = loadTable("weather.csv", "header");
}

function setup() {
  createCanvas(800, 400);

  for (var i = 0; i < stats.getRowCount(); i++) {
    var city = stats.get(i, "Station.City");

    if (city == "San Francisco") {
        var month = stats.getNum(i, "Date.Month") - 1;
        var rain = stats.getNum(i, "Data.Precipitation");

        monthlyRain[month] += rain;
        monthCounts[month]++;
    }
  }

  for (var m = 0; m < 12; m++) {
    if (monthCounts[m] > 0) {
        monthlyRain[m] = monthlyRain[m] / monthCounts[m];
    }
  }
}

function draw() {
  background(245);
  var margin = 70; // Increased slightly to fit the axis labels
  var yFloor = height - margin; 
  var xStart = margin;

  // --- DRAW AXIS LINES ---
  stroke(0);
  line(xStart, yFloor, width - margin, yFloor); // X-axis line
  line(xStart, yFloor, xStart, margin);         // Y-axis line
  noStroke();

  // Add labels
  fill(0);
  textSize(14);
  textAlign(CENTER);
  text("Month", width / 2, height - 30); 

  push(); 
  translate(25, height / 2); 
  rotate(-HALF_PI);
  text("Avg Precipitation (log scale)", 0, 0);
  pop();

  // Draw y-axis marks
  var ticks = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1]; 
  textSize(10);
  textAlign(RIGHT, CENTER); // Center text vertically to the tick line
  for (var t = 0; t < ticks.length; t++) {
    var tickLog = Math.log10(ticks[t]);

    var tickY = map(tickLog, -2, 0, yFloor, margin); 
    
    text(ticks[t], xStart - 10, tickY);
    
    stroke(220); // Light grey grid lines
    line(xStart, tickY, width - margin, tickY);
    stroke(0);   // Small black tick marks
    line(xStart, tickY, xStart - 5, tickY);
    noStroke();
  }

  // Draw the bars
  var barAreaWidth = width - margin * 2;
  var barWidth = barAreaWidth / 12;
  for (var i = 0; i < monthlyRain.length; i++) {
    var x = xStart + i * barWidth;
    var val = monthlyRain[i];

    if (val > 0) {
      var logVal = Math.log10(val);
      // Ensure we map within the same log range (-2 to 0)
      var h = map(logVal, -2, 0, 0, yFloor - margin);
      
      fill(70, 130, 180);
      // centered bars within the month slot
      rect(x + 5, yFloor, barWidth - 10, -h); 
    }
    
    // Month numbers
    fill(0);
    textSize(11);
    textAlign(CENTER);
    text(i + 1, x + barWidth/2, yFloor + 20);
  }
}
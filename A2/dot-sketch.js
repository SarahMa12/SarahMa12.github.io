var stats;
// Initialize with a low number so any real temp will be higher
var monthlyTemp = [-100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100, -100];

function preload() {
  stats = loadTable("weather.csv", "header");
}

function setup() {
    createCanvas(800, 400);

    for (var i = 0; i < stats.getRowCount(); i++) {
        var city = stats.get(i, "Station.City");

        if (city === "San Francisco") {
            var month = stats.getNum(i, "Date.Month") - 1;
            var currentTemp = stats.getNum(i, "Data.Temperature.Max Temp");

            // Logic to keep only the highest value found for this month
            if (currentTemp > monthlyTemp[month]) {
                monthlyTemp[month] = currentTemp;
            }
        }
    }
}

function draw() {
    background(245);
    var margin = 70; 
    var yFloor = height - margin; 
    var xStart = margin;

    // Add axis lines
    stroke(0);
    line(xStart, yFloor, width - margin, yFloor); // X-axis line
    line(xStart, yFloor, xStart, margin); // Y-axis line
    noStroke();

    // Add labels
    fill(0);
    textSize(14);
    textAlign(CENTER);
    text("Month", width / 2, height - 30); 

    push(); 
    translate(25, height / 2); 
    rotate(-HALF_PI);
    text("Avg Max Temperature (F)", 0, 0);
    pop();

    // Draw y-axis marks 
    var ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80]; 
    textSize(10);
    textAlign(RIGHT, CENTER); 
    for (var t = 0; t < ticks.length; t++) {
        var tickY = map(ticks[t], 0, 80, yFloor, margin); 

        fill(0);
        text(ticks[t], xStart - 10, tickY);

        stroke(220); // Light grey grid lines
        line(xStart, tickY, width - margin, tickY);
        stroke(0);   
        line(xStart, tickY, xStart - 5, tickY);
        noStroke();
    }

    // Draw the dots
    var spacing = (width - margin * 2) / 12;

    for (var i = 0; i < monthlyTemp.length; i++) {
        var x = xStart + i * spacing + (spacing / 2);
        var val = monthlyTemp[i];

        if (val > 0) {
            // Mapping value to linear Y height
            var y = map(val, 0, 80, yFloor, margin);

            fill(70, 130, 180);
            ellipse(x, y, 12, 12); // Creating the dot
        }

        // Month numbers
        fill(0);
        text(i + 1, x, yFloor + 20);

        if (dist(mouseX, mouseY, x, y) < 10) {
            // Change dot color on hover
            fill(255, 204, 0); 
            ellipse(x, y, 15, 15);
            
            // Draw the Tooltip Box
            fill(255);
            stroke(0);
            strokeWeight(1);
            rect(mouseX + 10, mouseY - 30, 80, 25, 5);
            
            // Draw the Tooltip Text
            noStroke();
            fill(0);
            textAlign(LEFT, CENTER);
            text("Max: " + Math.round(val) + "F", mouseX + 15, mouseY - 17);
        }
    }
}
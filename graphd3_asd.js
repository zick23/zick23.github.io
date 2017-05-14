
// Set the dimensions of the canvas / graph
var margin = {top: 20, right: 100, bottom: 100, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    padding = 100;

// Set the ranges
var x = d3.scale.log().base(10).range([0, width]);
var y = d3.scale.log().base(10).range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.h); });


// Define the line
var valueline_2 = d3.svg.line()
    .x(function(d) { return x(d.freq); })
    .y(function(d) { return y(d.snoise); });

// Adds the svg canvas
var svg = d3.select("#space4")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


timeArr = [];
arrData = [];
data = [];

// Constant and initial parameters
c = 2.99792458*Math.pow(10,10);
G  = 6.67259*Math.pow(10,-8);
m_sun = 1.989*Math.pow(10,33);
t_inter = 0.001;
time_points = 1000;
pc = 3.1*Math.pow(10,18);
f0_aligo = 215
S0_aligo = 10**(-49)
freq_max = 1000;
var F_aligo = [];
var Snoise = [];
var temp1 = [];
var temp2 = [];
f_i = freq_pass; // defined in index.html
// Create time and freq array
t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(M1_pass+M2_pass)),5/3)/(nu_pass*Math.pow(f_i,8/3));
for (var i=0 ; i<time_points; i++){
    timeArr[i]=(i*t_coal/(time_points-1)-t_inter);
    freqArr[i]=(Math.pow(5,3/8)/Math.pow(256,3/8)/Math.PI*Math.pow(G*M_c_pass/Math.pow(c,3),-5/8)*Math.pow(t_coal-timeArr[i],-3/8));
    psiplus[i]=2*Math.PI*freqArr[i]-Math.PI/4+3/4*Math.pow(G*M_c_pass/Math.pow(c,3)*8*Math.PI*freqArr[i],-5/3)
    htildeplusArr[i]=Math.pow(Math.PI,-2/3)*Math.pow(5/24,1/2)*c/(440*Math.pow(10,6)*pc)*Math.pow(G*M_c_pass/Math.pow(c,3),5/6)*Math.pow(freqArr[i],-7/6);
    asdArr[i]=Math.pow(freqArr[i],0.5)*Math.pow(Math.pow(htildeplusArr[i],2)*(Math.pow(Math.cos(psiplus[i]),2)+Math.pow(Math.sin(psiplus[i]),2)),0.5);
    total_array=[freqArr[i],Math.pow(10,22)*asdArr[i]]; 
    arrData[i]=(total_array);
    temp1[i]=Math.pow(10,22)*asdArr[i];
}
    // Compute S noise
for (var i=0 ; i<time_points; i++){
    freqArr[i]=freq_max/time_points*(i+1);
    F_aligo[i] = freqArr[i]/f0_aligo;
    Snoise[i] = (Math.pow(F_aligo[i],-4.14)-5*Math.pow(F_aligo[i],-2)+111*(1-Math.pow(F_aligo[i],2)+0.5*Math.pow(F_aligo[i],4)))/(1+0.5*Math.pow(F_aligo[i],2))*S0_aligo;
    total_array=[freqArr[i],Math.pow(10,22)*Math.pow(Snoise[i],0.5)]; 
    arrData_2[i]=(total_array);
    temp2[i]=Math.pow(10,22)*Math.pow(Snoise[i],0.5);
}
//Put freq and time in data map
data = arrData.map(function(d){
    return{
        time:d[0],
        h:d[1]
    };
});

// the names to the columns of arrData are only marker
data.forEach(function(d) {
    d.h = +d.h;
    d.time = +d.time;
});

data_2 = arrData_2.map(function(d){
    return{
        freq:d[0],
        snoise:d[1]
    };
});

data_2.forEach(function(d) {
    d.freq = +d.freq;
    d.snoise = +d.snoise;
});

// Scale the range of the data
min_snoise = d3.min(data_2, function(d) { return d.snoise; });
max_asd = d3.max(data, function(d) { return d.h; });
x.domain(d3.extent(data_2, function(d) { return d.freq; }));
y.domain([min_snoise, max_asd]);



// Add the valueline path.
svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(data));

svg.append("path")
    .attr("class", "line")
    .attr("d", valueline_2(data_2));



// Add the valueline path.



// Add the X Axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// y label
svg.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (padding/2) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .text("ASD [1/sqrt[Hz]]");

// x label
svg.append("text")
    .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
    .attr("transform", "translate("+ (width/2) +","+(height-(100/3))+")")  // centre below axis
    .text("Frequency [Hz]");

// Update data section (Called from the onclick)
function updateasd() {
    timeArr = [];
    arrData = [];
    arrData_2 = [];
    data = [];
    data_2 = [];
    
    f_i = freq_pass;
    t_coal=5/(256*Math.pow(Math.PI,8/3))*Math.pow(Math.pow(c,3)/(G*m_sun*(M1_pass+M2_pass)),5/3)/(nu_pass*Math.pow(f_i,8/3));

    for (var i=0 ; i<time_points; i++){
        timeArr[i]=(i*t_coal/(time_points-1)-t_inter);
        hArr[i]=Math.pow(10,21)*(1/(440*Math.pow(10,6)*pc)*Math.cos(-2*Math.pow(5*G*M_c/Math.pow(c,3),-5/8)*Math.pow(t_coal-timeArr[i],5/8))*Math.pow(G*M_c_pass/Math.pow(c,2),5/4)*Math.pow(5/(t_coal-timeArr[i])/c,1/4));
        freqArr[i]=(Math.pow(5,3/8)/Math.pow(256,3/8)/Math.PI*Math.pow(G*M_c_pass/Math.pow(c,3),-5/8)*Math.pow(t_coal-timeArr[i],-3/8));
        psiplus[i]=2*Math.PI*freqArr[i]-Math.PI/4+3/4*Math.pow(G*M_c_pass/Math.pow(c,3)*8*Math.PI*freqArr[i],-5/3)
        htildeplusArr[i]=Math.pow(Math.PI,-2/3)*Math.pow(5/24,1/2)*c/(440*Math.pow(10,6)*pc)*Math.pow(G*M_c_pass/Math.pow(c,3),5/6)*Math.pow(freqArr[i],-7/6);
        asdArr[i]=Math.pow(freqArr[i],0.5)*Math.pow(Math.pow(htildeplusArr[i],2)*(Math.pow(Math.cos(psiplus[i]),2)+Math.pow(Math.sin(psiplus[i]),2)),0.5);
        total_array=[freqArr[i],Math.pow(10,22)*asdArr[i]]; 
        arrData[i]=(total_array);
    }
    // Compute S noise
    for (var i=0 ; i<time_points; i++){
        freqArr[i]=freq_max/time_points*(i+1);
        F_aligo[i] = freqArr[i]/f0_aligo;
        Snoise[i] = (Math.pow(F_aligo[i],-4.14)-5*Math.pow(F_aligo[i],-2)+111*(1-Math.pow(F_aligo[i],2)+0.5*Math.pow(F_aligo[i],4)))/(1+0.5*Math.pow(F_aligo[i],2))*S0_aligo;
        total_array=[freqArr[i],Math.pow(10,22)*Math.pow(Snoise[i],0.5)]; 
        arrData_2[i]=(total_array);
        temp2[i]=Math.pow(10,22)*Math.pow(Snoise[i],0.5);
    }

    data = arrData.map(function(d){
        return{
            time:d[0],
            h:d[1]
        };
    });
    
    data.forEach(function(d) {
        d.h = +d.h;
        d.time = +d.time;
    });

    data_2 = arrData_2.map(function(d){
        return{
            freq:d[0],
            snoise:d[1]
        };
    });

    data_2.forEach(function(d) {
        d.freq = +d.freq;
        d.snoise = +d.snoise;
    });


    min_snoise = d3.min(data_2, function(d) { return d.snoise; });
    max_asd = d3.max(data, function(d) { return d.h; });
    x.domain(d3.extent(data_2, function(d) { return d.freq; }));
    y.domain([min_snoise, max_asd]);

    
    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(8);

    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(8);

    var svg = d3.select("#space4").transition();
    
    // Define the line
    var valueline = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.h); });
    // Define the line
    var valueline_2 = d3.svg.line()
        .x(function(d) { return x(d.freq); })
        .y(function(d) { return y(d.snoise); });


    // Add the valueline path.
    //svg.select(".line")   // change the line
    //    .duration(750)
    //    .attr("d", valueline_2(data_2));


    svg.select(".line")   // change the line
        .duration(750)
        .attr("d", valueline(data));

    svg.select(".x.axis") // change the x axis
        .duration(750)
        .call(xAxis);
    svg.select(".y.axis") // change the y axis
        .duration(750)
        .call(yAxis);
}

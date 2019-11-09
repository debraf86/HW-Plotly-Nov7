async function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample

  // Use d3 to select the panel with id of `#sample-metadata`
  const url = "/metadata/" + sample
  console.log(url);
  let response = await d3.json(url);
  console.log(response);

	var metaData = d3.select("#sample-metadata");

	// sampleMetadata = select.html("");

	// Plotly.d3.select("#sample-metadata").node().value = "";
	console.log(metaData);
	
	Object.entries(response).forEach(([key, value]) => {
    console.log(key + value)
    metaData.append("li").text(`${key}:${value}`)
  })

   
// Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
   
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
	// })
}

async function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
	const url = "/samples/" + sample
	console.log(url);
	let response = await d3.json(url);
	console.log(response);
	const data = response;

    // @TODO: Build a Bubble Chart using the sample data
	const trace1 = {
		x: data.otu_ids,
		y: data.sample_values,
		mode: "markers",
		type: "scatter",
		marker: {
			size: data.sample_values,
			hoverinfo: data.otu_labels,
			color: data.otu_ids
		}
	}
	const plotlyData = [trace1];
	const layout = {
		title: "Belly Button Bubble Chart",
		xaxis: {title: "OTU ID"}
	} 
	Plotly.newPlot("bubble", plotlyData, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
	// otu_ids, and labels (10 each).
	const topTen = data.sample_values.slice (0,10);
	const trace2 = {
		values: topTen,
		labels: data.otu_ids,
		type: "pie",
		hoverinfo: data.otu_labels
	}

	const layout2 = {
		title : "Belly Button Data",
		labels : data.otu_ids,
		legend: true
	}
	const pieData = [trace2];

	Plotly.newPlot("pie", pieData, layout2);

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
	d3.json("/names").then((sampleNames) => {
    	sampleNames.forEach((sample) => {
      	selector
        	.append("option")
        	.text(sample)
        	.property("value", sample);
  		});

		// Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
		buildMetadata(firstSample);
	})
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

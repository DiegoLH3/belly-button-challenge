// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metaField = data.metadata

    // Filter the metadata for the object with the desired sample number
    let sampleNum = metaField.filter(object => object.id == sample)

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select(`#sample-metadata`)

    // Use `.html("") to clear any existing metadata
    panel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    sampleNum.forEach(element => {
      Object.entries(element).forEach(([key, value]) => {
          panel.append("p")
            .text(`${key.toUpperCase()}: ${value}`)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1)
      });
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const sampleField = data.samples

    // Filter the samples for the object with the desired sample number
    let sampleNum = sampleField.filter(object => object.id == sample)

    // Get the otu_ids, otu_labels, and sample_values
    let otuIds = sampleNum[0]['otu_ids']
    let otuLabels = sampleNum[0]['otu_labels']
    let sampleValues = sampleNum[0]['sample_values']

    // Build a Bubble Chart
    let bubbleChart = {
      title: 'Bacteria Cultures Per Sample',
      margin: {t:30, l:150},
      hovermode: 'closest',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    };
    let bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        mode: 'markers',
        text: otuLabels,
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: 'Earth'
        }
      }
    ];
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleChart)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otuIds.slice(0, 10).map(otuIds => `OTU ${otuIds}`).reverse();
    let barData = [
      {
        y: yticks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
      }
    ];
    let barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'},
      margin: {t:30, l:150},
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout)
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleName = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let i = 0; i < sampleName.length; i++) {
      selector.append("option")
      .text(sampleName[i])
      .property('value', sampleName[i]);
    };

    // Get the first sample from the list
    // Build charts and metadata panel with the first sample
    let sampleFirst = sampleName[0];
    buildCharts(sampleFirst)
    buildMetadata(sampleFirst)
  });
}

// Function for event listener
function optionChanged(sampleNew) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(sampleNew)
  buildMetadata(sampleNew)
}

// Initialize the dashboard
init();

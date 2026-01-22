import Plot from 'react-plotly.js';

export default function ChartGallery({ charts }) {
  if (!charts || charts.length === 0) {
    return (
      <div className="charts-section">
        <h2>Visual Insights</h2>
        <p style={{ color: '#6b7280' }}>No charts available for this dataset.</p>
      </div>
    );
  }

  const renderChart = (chart) => {
    const { chart_type, title, data } = chart;

    const layout = {
      title: {
        text: title,
        font: { size: 14, color: '#374151' },
      },
      margin: { t: 40, r: 20, b: 60, l: 60 },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
      xaxis: {
        gridcolor: '#e5e7eb',
        tickangle: chart_type === 'bar' ? -45 : 0,
      },
      yaxis: {
        gridcolor: '#e5e7eb',
      },
    };

    let plotData = [];

    switch (chart_type) {
      case 'bar':
      case 'missingness':
        plotData = [{
          type: 'bar',
          x: data.x,
          y: data.y,
          marker: {
            color: data.marker?.color || '#3b82f6',
            colorscale: data.marker?.colorscale,
          },
        }];
        break;

      case 'line':
        plotData = [{
          type: 'scatter',
          mode: 'lines+markers',
          x: data.x,
          y: data.y,
          line: { color: data.line?.color || '#10b981' },
          marker: { size: data.marker?.size || 6 },
        }];
        break;

      case 'histogram':
        plotData = [{
          type: 'bar',
          x: data.x,
          y: data.y,
          marker: { color: data.marker?.color || '#8b5cf6' },
        }];
        layout.bargap = 0.05;
        break;

      case 'boxplot':
        plotData = [{
          type: 'box',
          y: data.y,
          name: data.name,
          boxpoints: 'outliers',
          marker: { color: data.marker?.color || '#f59e0b' },
        }];
        break;

      default:
        return null;
    }

    return (
      <Plot
        data={plotData}
        layout={layout}
        config={{
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          responsive: true,
        }}
        style={{ width: '100%', height: '300px' }}
      />
    );
  };

  return (
    <div className="charts-section">
      <h2>Visual Insights</h2>
      <div className="charts-grid">
        {charts.map((chart) => (
          <div key={chart.chart_id} className="chart-card">
            {renderChart(chart)}
          </div>
        ))}
      </div>
    </div>
  );
}

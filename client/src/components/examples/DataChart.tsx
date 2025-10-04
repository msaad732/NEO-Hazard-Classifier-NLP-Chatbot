import { DataChart } from '../DataChart';
import { CosmicBackground } from '../CosmicBackground';

export default function DataChartExample() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <CosmicBackground />
      <div className="relative z-10 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <DataChart
            title="Impact Probability Timeline"
            type="line"
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
            datasets={[
              {
                label: 'Probability (%)',
                data: [0.001, 0.002, 0.003, 0.002, 0.001, 0.0005],
              },
            ]}
          />
          <DataChart
            title="Asteroid Size Distribution"
            type="bar"
            labels={['<100m', '100-500m', '500-1km', '>1km']}
            datasets={[
              {
                label: 'Count',
                data: [245, 89, 34, 12],
              },
            ]}
          />
          <DataChart
            title="Threat Level Distribution"
            type="doughnut"
            labels={['Low', 'Medium', 'High']}
            datasets={[
              {
                label: 'Asteroids',
                data: [320, 52, 8],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

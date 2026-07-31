import { DataChart } from '../DataChart';
import { PreviewShell } from './PreviewShell';

export default function DataChartExample() {
  return (
    <PreviewShell>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DataChart
          title="Size distribution"
          description="Catalogued objects by mean diameter"
          type="bar"
          labels={['<100m', '100-500m', '500m-1km', '>1km']}
          datasets={[{ label: 'Objects', data: [245, 89, 34, 12] }]}
        />
        <DataChart
          title="Threat classification"
          description="Assessed risk across the catalogue"
          type="doughnut"
          labels={['Low', 'Medium', 'High']}
          datasets={[{ label: 'Objects', data: [320, 52, 8] }]}
        />
      </div>
    </PreviewShell>
  );
}

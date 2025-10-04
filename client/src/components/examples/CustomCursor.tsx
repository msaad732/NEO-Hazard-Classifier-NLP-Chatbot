import { CustomCursor } from '../CustomCursor';

export default function CustomCursorExample() {
  return (
    <div className="relative w-full h-screen bg-background overflow-hidden" style={{ cursor: 'none' }}>
      <CustomCursor />
      <div className="relative z-10 flex items-center justify-center h-full">
        <p className="text-primary text-2xl font-mono animate-pulse">Move your cursor around!</p>
      </div>
    </div>
  );
}

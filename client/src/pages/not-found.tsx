import { Link } from "wouter";
import { Panel } from "@/components/Panel";
import { Button } from "@/components/ui/button";
import { Starfield } from "@/components/Starfield";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <Starfield />
      <Panel className="relative z-10 w-full max-w-md text-center">
        <p className="font-mono text-sm text-muted-foreground tnum">404</p>
        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          Nothing tracked at this address
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          The page you asked for is not part of the console.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Back to the console</Link>
        </Button>
      </Panel>
    </div>
  );
}

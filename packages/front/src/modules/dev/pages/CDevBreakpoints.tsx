import { CBody } from "@m/base/components/CBody";

export function CDevBreakpoints() {
  return (
    <CBody title="Dev - Breakpoints">
      <div>Breakpoints</div>
      <div className="space-y-2">
        <div>Screen Breakpoints (Should not be used)</div>
        <div className="bg-gray-500/50 sm:bg-green-600">sm</div>
        <div className="bg-gray-500/50 md:bg-green-600">md</div>
        <div className="bg-gray-500/50 lg:bg-green-600">lg</div>
        <div className="bg-gray-500/50 xl:bg-green-600">xl</div>
        <div className="bg-gray-500/50 2xl:bg-green-600">2xl</div>
        <div className="bg-gray-500/50 3xl:bg-green-600">3xl</div>

        <div>Container Breakpoints</div>
        <div className="bg-gray-500/50 @xs:bg-green-600">@xs</div>
        <div className="bg-gray-500/50 @sm:bg-green-600">@sm</div>
        <div className="bg-gray-500/50 @md:bg-green-600">@md</div>
        <div className="bg-gray-500/50 @lg:bg-green-600">@lg</div>
        <div className="bg-gray-500/50 @xl:bg-green-600">@xl</div>
        <div className="bg-gray-500/50 @2xl:bg-green-600">@2xl</div>
        <div className="bg-gray-500/50 @3xl:bg-green-600">@3xl</div>

        <div>Container Breakpoint Ranges</div>
        <div className="bg-gray-500/50 @xs:@max-sm:bg-green-600">@xs</div>
        <div className="bg-gray-500/50 @sm:@max-md:bg-green-600">@sm</div>
        <div className="bg-gray-500/50 @md:@max-lg:bg-green-600">@md</div>
        <div className="bg-gray-500/50 @lg:@max-xl:bg-green-600">@lg</div>
        <div className="bg-gray-500/50 @xl:@max-2xl:bg-green-600">@xl</div>
        <div className="bg-gray-500/50 @2xl:@max-3xl:bg-green-600">@2xl</div>
      </div>
    </CBody>
  );
}

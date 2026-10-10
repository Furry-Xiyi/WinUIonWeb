export interface Location { Item: unknown; Bounds: { X: number; Y: number; Width: number; Height: number }; ZoomPoint?: { X: number; Y: number } }
export interface ViewChangedArgs { IsSourceZoomedInView: boolean; SourceItem: Location; DestinationItem: Location }
export interface Request { Item?: unknown; OriginalSource?: HTMLElement; ZoomPoint?: { X: number; Y: number }; Gesture?: boolean }
export interface SemanticView {
  IsActiveView?: boolean; IsZoomedInView?: boolean; SemanticZoomOwner?: unknown;
  InitializeViewChange?: () => void;
  StartViewChangeFrom?: (source: Location, destination: Location) => void;
  StartViewChangeTo?: (source: Location, destination: Location) => void;
  MakeVisible?: (location: Location) => void;
  CompleteViewChangeFrom?: (source: Location, destination: Location) => void;
  CompleteViewChangeTo?: (source: Location, destination: Location) => void; CompleteViewChange?: () => void;
}

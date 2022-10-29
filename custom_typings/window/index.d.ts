export const {};

declare class StoryblokBridgeClass implements StoryblokBridge {
  on: StoryblokBridge['on'];
  init: StoryblokBridge['init'];
  pingEditor: StoryblokBridge['pingEditor'];
  isInEditor: StoryblokBridge['isInEditor'];
  enterEditmode: StoryblokBridge['enterEditmode'];
  addComments: StoryblokBridge['addComments'];
  resolveRelations: StoryblokBridge['resolveRelations'];
}

declare global {
  interface Window {
    // The GTM global dataLayer property
    StoryblokBridge: typeof StoryblokBridgeClass;
    // Zendesk web widget
    zE: any;
    Trustpilot: {
      loadFromElement(element: Element): void;
    };
    dataLayer: any[];
  }
}

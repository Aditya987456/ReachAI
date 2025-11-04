
import { FlowConfig } from "motia";

export const config: FlowConfig = {
  name: "YouTubeFlow",
  description: "Handles YouTube channel resolution from submission to result.",

  // 👇 Flow starts when this event happens
  startsWith: ["yt.submit"],

  // 👇 The chain of steps (you can add more later)
  steps: [
    {
      name: "ResolveChannel",       // matches config.name in your step
      listensOn: ["yt.submit"],
      emits: ["yt.channel.resolved", "yt.channel.error"],
    },
  ],

  // 👇 These are terminal events — once hit, flow stops tracking
  endsWith: ["yt.channel.resolved", "yt.channel.error"],
};

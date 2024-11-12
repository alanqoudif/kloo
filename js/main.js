const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


import { Clerk } from "@clerk/clerk-js";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const clerk = new Clerk(clerkPubKey);
await clerk.load({
  // Set load options here
});

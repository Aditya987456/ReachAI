// routes/api/retry-job.ts
import { ApiRouteConfig } from "motia";

export const config: ApiRouteConfig = {
    name: "ManualRetryJob",
    type: "api",
    path: "/api/jobs/:jobId/retry",
    method: "POST",
    emits: [],
    flows: ["Paid User workflow"]
}

export const handler = async (req: any, { emit, logger, state }: any) => {
   
}
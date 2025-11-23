import { ApiRouteConfig } from "motia";

export const config:ApiRouteConfig = {
    name:"PaidUser-CreateOrder",
    type:"api",
    path:"/upgrade",
    method:"POST",
    emits: ["yt.submit"],
    flows: ['Paid User flow']
}

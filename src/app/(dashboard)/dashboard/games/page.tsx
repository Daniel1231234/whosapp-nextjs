'use client'

import { Building, Building2Icon, BuildingIcon } from "lucide-react";
import { FC } from "react";

interface pageProps {}
 
const Page: FC<pageProps> = () => {
    return (
        <div className="h-screen">
                <Building2Icon className="absolute top-[50%] left-[50%] translate-x-1/2 translate-y-1/2 w-14 h-14" />
        </div>
    )
}
 
export default Page;
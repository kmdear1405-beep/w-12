'use client'
import { Badge } from "@/components/tailgrids/core/badge";
export default function Header (){
    return(
        // header container
        <div className="mt-4 text-center">
            {/* code */}
            <div className="flex justify-center gap-4">
<Badge className="text-3xl rounded-lg py-1 px-3 bg-red-600 text-gray-200 rotate-6">C</Badge>
<Badge  className="text-3xl rounded-lg py-1 px-3 bg-green-700 text-gray-200 rotate-6">S</Badge>
<Badge className="text-3xl rounded-lg py-1 px-3 bg-blue-600 text-gray-200 rotate-3">I</Badge>
<Badge className="text-3xl rounded-lg py-1 px-3 bg-cyan-400 text-gray-200 rotate-3">2</Badge>
<Badge className="text-3xl rounded-lg py-1 px-3 bg-yellow-400 text-gray-200 rotate-6">0</Badge>
<Badge className="text-3xl rounded-lg py-1 px-3 bg-gray-500 text-gray-200 rotate-6">5</Badge>
            </div>

            {/* name */}
            <div className="mt-4 text-center ">
                <Badge size="lg" className="rounded-lg bg-gray-900 text-white text-lg font-extrabold px-4 py-2">FRONT END SOFTWARE DEVELOPMENT</Badge>
                </div>

        </div>
    )
}
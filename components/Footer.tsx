'use client'
import Link from "next/link";
import { Badge } from "@/components/tailgrids/core/badge";
import { Facebook, Instagram } from "@tailgrids/icons";
export default function Footer (){
    return(
        // footer container
        <div className="mt-4 text-center">
        {/* student */}
        <div>
        <Badge className="text-xl text-black rounded-lg">68085078 นายธนวัฒน์ พันธ์หวยพงษ์</Badge>
        </div>
        {/* contacts */}
        <div className="mt-4 flex justify-center gap-6">
            <Link href={'https://www.facebook.com/thnwathnphanthhwyphngs'} target="_blank"><Facebook className="text-blue-700"/></Link>
            
            <div className="border-l-1"></div>
            <Instagram/>
        </div>
        </div>
    )
}
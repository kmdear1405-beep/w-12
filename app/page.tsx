"use client";

import { checkLogin } from "@/utils/login";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
export default function Home() {
  const router = useRouter()
  useEffect(()=>checkLogin(router,'/'),[router])
  
  return (
    <div className="max-w-5xl mx-auto p-4 bg-white shadow-md rounded-lg flex flex-col md:flex-row gap-6 items-start">
      {/* ฝั่งซ้าย: รูปภาพผู้สอนและข้อมูลส่วนตัว */}
      <div className="w-full md:w-1/3 border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
        <div className="w-full h-72 bg-gray-200 overflow-hidden">
          <img
            src="/Thanawat.jpg"
            alt="Thanawat"
            className="w-full h-full object-contain bg-gray-50"
          />
        </div>
        <div className="p-4 text-sm text-gray-800 space-y-1">
          <p className="font-bold text-xl">ธนวัฒน์ พันธ์หวยพงษ์</p>
          <p className=" font-bold text-lg">
            คณะ <span className=" font-normal">เทคโนโลยีสารสนเทศ</span>
          </p>
          <p className=" font-bold text-lg">
            สาขาวิชา{" "}
            <span className=" font-normal">
              วิทยาการคอมพิวเตอร์และนวัตกรรมการพัฒนาซอฟต์แวร์
            </span>{" "}
          </p>
          <p className=" font-bold text-lg">
            หลักสูตรตรีเช้า
            <span className="font-normal">
              (Software Full Stack Development)
            </span>
          </p>
        </div>
      </div>

      {/* ฝั่งขวา: รายละเอียดรายวิชา หัวข้อ และรูปภาพการ์ตูนด้านล่าง */}
      <div className="w-full md:w-2/3 flex flex-col justify-between h-full space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            CSI205 Front-End Software Development{" "}
            <span className="font-normal text-gray-700 text-base">
              This course covers the following topics:
            </span>
          </h2>

          <ul className="list-disc list-inside space-y-2 text-lg text-gray-800">
            <li>
              <span className="font-bold">HTML Fundamentals:</span> พื้นฐานโครงสร้างหน้าเว็บ
            </li>
            <li>
              <span className="font-bold">Tailwind CSS:</span>  จัด layout และตกแต่งด้วย utility classes
            </li>
            <li>
              <span className="font-bold">React / Next.js:</span>component, state, routing แบบหลายหน้า
            </li>
            <li>
              <span className="font-bold">เป้าหมายในอนาคต:</span>{" "}
              เป้าหมายอาชีพของผมคือการเป็น Penetration Tester ผู้เชี่ยวชาญด้านการทดสอบเจาะระบบและค้นหาช่องโหว่ 
            </li>
           
          </ul>
        </div>
      </div>
    </div>
  );
}

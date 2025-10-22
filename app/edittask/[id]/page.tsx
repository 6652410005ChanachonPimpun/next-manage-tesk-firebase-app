"use client";

import Image from "next/image";
import task from "../../../assets/task.png";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; 

export default function Page() {
  const router = useRouter();
  const id = useParams().id


  //สร้างตัวแปร state เพื่อเก็บข้อมูล และบันทึก
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIs_completed] = useState<boolean>(false);
  const [image_url, setImage_url] = useState<File | null>(null);
  const [preview_file, setPreviewfile] = useState<string | null>(null);
  const [old_image_url, setOld_image_url] = useState<string | null>(null);

  //ดึงข้อมูลจาก supabase ตาม id ที่ได้มาจาก url
  useEffect(() => {
    //ดึงข้อมูลจาก supabase
    async function fetchData(){}





    fetchData();
  },[])

  //ฟัชั่นเลือกรูปเพื่อ preview ก่อนอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
 


  }

  //ฟังชั่นอัปโหลดรูปภาพ และบันทึกข้อมูลลงใน supabase
  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //อัปโหลดรูปภาพ
    
    
    
    

    
  }

  return (
    // ส่วนหัว
    <div className="flex flex-col w-3/4 mx-auto">
      <div className="flex flex-col items-center mt-20">
        <Image
          src= {task}
          alt="logo"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold mt-10">
          Manage Task App
        </h1>
        <h1 className="text-2xl font-bold">
          บันทึกการทำงาน
        </h1>
        </div>
        {/* ส่วนเพิ่มงานใหม่ */}
        <div className="flex flex-col border border-gray-500 rounded-xl">
          <h1 className="text-center text-xl font-bold">ಠ_ಠಠ_ಠಠ_ಠ แก้ไขงานเก่า</h1>

          <form onSubmit={handleUploadAndUpdate} className="flex flex-col">
          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">งานที่ทำ</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-500 rounded-lg p-2 " />
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">รายละเอียดงาน</label>
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} className="border border-gray-500 rounded-lg"></textarea>
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="flex flex-col mt-5">อัปโหลดรูป</label>
            <input id ="fileinput" type="file" className="hidden" onChange={handleSelectImagePreview}/>
            <label htmlFor="fileinput" className="bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-30 text-center">
              เลือกรูป
              </label>

              {preview_file && (
                <div className="mt-3">
                  <Image src={preview_file} alt="preview" width={100} height={100} unoptimized={true}/>
                </div>
              )}
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">สถานะงาน</label>
            <select className="border border-gray-500 rounded-lg p-2"
              value={is_completed ? "1" : "0"}
              onChange={(e) => setIs_completed(e.target.value === "1")}
            >
              <option value="0">ยังไม่เสร็จสิ้น</option>
              <option value="1">เสร็จสิน</option>
            </select>
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <button type="submit" className="bg-green-500 rounded-lg p-2 text-white">บันทึกแก้ไขงาน</button>
          </div>
          {/* ปุ่มกลับหน้าหลัก */}
          </form>

          <div className="flex flex-col items-center mt-5">
            <Link href="/alltask" className="text-blue-500 font-bold">
                กลับไปหน้าแสดงงาน
            </Link>
          </div>
        </div>

        


    </div>
  );
}
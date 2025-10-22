"use client";

import Image from "next/image";
import task from "../../assets/task.png";
import Link from "next/link";
import React, { useEffect, useState } from "react"; 
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient"; 
import { Firestore } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { firebase } from "@/lib/firebaseConfig";

export default function Page() {
  const router = useRouter();


  //สร้างตัวแปร state เพื่อเก็บข้อมูล และบันทึก
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_completed, setIs_completed] = useState<boolean>(false);
  const [image_url, setImage_url] = useState<File | null>(null);
  const [preview_file, setPreviewfile] = useState<string | null>(null);

  //ฟัชั่นเลือกรูปเพื่อ preview ก่อนอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImage_url(file);

    if(file){
    setPreviewfile(URL.createObjectURL(file as Blob));
  }
  }

  //ฟังชั่นอัปโหลดรูปภาพ และบันทึกข้อมูลลงใน supabase
  async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //validate ข้อมูล
    if (title.trim() === "" || detail.trim() === "") {
      alert("กรุณาตรวจสอบข้อมูล และรายละเอียดงาน");
      return;
    }
    //อับโหลดรูปภาพ
    //ตรวจสอบก่อนว่าผู้ใช้เลือกรูปไหม ถ้าเลือกก็อัปโหลด ถ้าไม่ก็ไม่ต้องอัปโหลด
    //สร้างตัวแปรเก็บ url รูปภาพ
let image_URL = '';

if(image_url){
  //ถ้ามีการเลือกรูป ก็จะอัปโหลด
  //ตั้งชื่อไฟล์รูปใหม่ไม่ให้ซ้ำกัน
  const new_image_file_name = `${Date.now()}-${image_url.name}`;
  //อัปโหลดรูปไปเก็บไว้ที่ storage
  const {data, error} = await supabase.storage
    .from('task_bk')
    .upload(new_image_file_name, image_url)
  //หลังอัปโหลด ตรวจสอบว่ามี error ไหม
  //มี error แสดง alert หากไม่่มี ให้ get url ของรูปที่อัปโหลด เก็บไว้ในตัวแปร image_url
  if(error){
    alert("พบปัญหาในการอัปโหลดรูปภาพ กรุณาลองใหม่")
    console.log(error.message);
    return;
  }else{
    // get url ของรูปที่อัปโหลด
    const { data } = supabase.storage
      .from('task_bk')
      .getPublicUrl(new_image_file_name);
    
    image_URL = data.publicUrl;
  }
}

    //บันทึกข้อมูลลงใน collection task ใน firebase
    try {
      const result = await addDoc(collection(firebase, "task"), {
        title: title,
        detail: detail,
        is_completed: is_completed,
        image_url: image_URL,
      })

      if (result){
        alert("บันทึกข้อมูลเรียบร้อย");
        router.push("/alltask");
      }else{
        alert("พบปัญหาในการบันทึกข้อมูล กรุณาลองใหม่");
      }
    } catch (error) {
      alert("พบปัญหาในการบันทึกข้อมูล กรุณาลองใหม่");
      console.log(error);
    }
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
          <h1 className="text-center text-xl font-bold">༼ つ ◕_◕ ༽つ เพิ่มงาน</h1>

          <form onSubmit={handleUploadAndSave}>
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
                  <Image src={preview_file} alt="preview" width={100} height={100} />
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
            <button type="submit" className="bg-green-500 rounded-lg p-2 text-white">บันทึกเพิ่มงาน</button>
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
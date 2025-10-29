'use client';

import Image from 'next/image';
import task from '../../../assets/task.png';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { firebase } from '@/lib/firebaseConfig';
import { supabase } from '@/lib/supabaseClient';

export default function Page() {
  const router = useRouter();
  const params = useParams(); 
  const id = params.id as string; 

  //สร้างตัวแปร state เพื่อเก็บข้อมูล และบันทึก
  const [title, setTitle] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [is_completed, setIs_completed] = useState<boolean>(false);
  const [image_url, setImage_url] = useState<File | null>(null); 
  const [preview_file, setPreviewfile] = useState<string | null>(null); 
  const [old_image_url, setOld_image_url] = useState<string | null>(null); 

  //ดึงข้อมูลจาก firebase ตาม id ที่ได้มาจาก url
  useEffect(() => {
    if (!id) return; 

    async function fetchData() {
      try {
        const docRef = doc(firebase, 'task', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setDetail(data.detail);
          setIs_completed(data.is_completed);
          setPreviewfile(data.image_url); 
          setOld_image_url(data.image_url); 
        }
      } catch (error) {
        alert('พบปัญหาในการดึงข้อมูล...');
        console.log(error);
      }
    }

    fetchData();
  }, [id]); 

  //ฟัชั่นเลือกรูปเพื่อ preview ก่อนอัปโหลด
  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage_url(file); 
      setPreviewfile(URL.createObjectURL(file)); 
    }
  }

  //ฟังชั่นอัปโหลดรูปภาพ และบันทึกข้อมูลลงใน firebase
  async function handleUploadAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let new_image_public_url = old_image_url || ''; 

    try {
      // --- ส่วนจัดการรูปภาพ ---
      if (image_url) {
        // (image_url คือ state ที่เก็บ File ใหม่)
        // 1. ถ้ามีไฟล์ใหม่ถูกเลือก -> อัปโหลดไฟล์ใหม่
        const new_image_file_name = `${Date.now()}-${image_url.name}`;
        const { error: uploadError } = await supabase.storage
          .from('task_bk')
          .upload(new_image_file_name, image_url);

        if (uploadError) {
          throw new Error(`อัปโหลดรูปใหม่ไม่สำเร็จ: ${uploadError.message}`);
        }

        // 2. ถ้าอัปโหลดสำเร็จ -> ดึง Public URL ของไฟล์ใหม่
        const { data: urlData } = supabase.storage
          .from('task_bk')
          .getPublicUrl(new_image_file_name);
        new_image_public_url = urlData.publicUrl;

        // 3. ถ้ามีรูปเก่า และการอัปโหลดรูปใหม่สำเร็จ -> ลบรูปเก่า
        if (old_image_url) {
          const old_image_path = old_image_url.split('/task_bk/')[1];
          if (old_image_path) {
            await supabase.storage.from('task_bk').remove([old_image_path]);
            // ไม่ต้อง throw error ถลบไม่สำเร็จ แต่ log ไว้ได้
            console.log('ลบรูปเก่าสำเร็จ: ', old_image_path);
          }
        }
      }

      // --- ส่วนอัปเดตฐานข้อมูล Firebase ---
      await updateDoc(doc(firebase, 'task', id), {
        title: title,
        detail: detail,
        is_completed: is_completed,
        image_url: new_image_public_url, 
        update_at: new Date().toISOString(),
      });

      alert('แก้ไขข้อมูลสำเร็จ');
      router.push('/alltask');
    } catch (error) {
      alert('พบปัญหาในการบันทึกข้อมูล: ' + (error as Error).message);
      console.log(error);
      return;
    }

  }

  return (
    <div className="flex flex-col w-3/4 mx-auto">
      <div className="flex flex-col items-center mt-20">
        <Image src={task} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold mt-10">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกการทำงาน</h1>
      </div>
      <div className="flex flex-col border border-gray-500 rounded-xl">
        <h1 className="text-center text-xl font-bold">ಠ_ಠಠ_ಠಠ_ಠ แก้ไขงานเก่า</h1>

        <form onSubmit={handleUploadAndUpdate} className="flex flex-col">
          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">งานที่ทำ</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-500 rounded-lg p-2 "
            />
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">รายละเอียดงาน</label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              className="border border-gray-500 rounded-lg"
            ></textarea>
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="flex flex-col mt-5">อัปโหลดรูป</label>
            <input
              id="fileinput"
              type="file"
              className="hidden"
              onChange={handleSelectImagePreview}
            />
            <label
              htmlFor="fileinput"
              className="bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-30 text-center"
            >
              เลือกรูป
            </label>

            {preview_file && (
              <div className="mt-3">
                <Image
                  src={preview_file}
                  alt="preview"
                  width={100}
                  height={100}
                  unoptimized={true}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <label className="text-lg font-bold">สถานะงาน</label>
            <select
              className="border border-gray-500 rounded-lg p-2"
              value={is_completed ? '1' : '0'}
              onChange={(e) => setIs_completed(e.target.value === '1')}
            >
              <option value="0">ยังไม่เสร็จสิ้น</option>
              <option value="1">เสร็จสิน</option>
            </select>
          </div>

          <div className="flex flex-col mt-5 mx-5">
            <button
              type="submit"
              className="bg-green-500 rounded-lg p-2 text-white"
            >
              บันทึกแก้ไขงาน
            </button>
          </div>
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
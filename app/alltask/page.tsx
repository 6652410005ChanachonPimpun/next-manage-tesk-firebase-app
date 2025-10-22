"use client";

import Image from "next/image";
import task from "../../assets/task.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { firebase } from "@/lib/firebaseConfig";
import { collection, getDocs, } from "firebase/firestore";

//สร้างประเภทตัวแปร เก็บข้อมูลจาก firebase
type Task = {
  id: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  created_at: string;
  update_at: string;
}
export default function Page() {
//สร้างตัวแปร state เพิ่อดึงช้อมูลมา
const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  async function fetchTasks() {
    //ไปดึงข้อมูลมาจาก firebase มีหลายข้อมูล
    const result = await getDocs(collection(firebase, "task"));

    //เอาข้อมูลที่อยู่ใน result ไปกำหนดตัวแปรให้ state: tasks
    setTasks(
      result.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        detail: doc.data().detail,
        is_completed: doc.data().is_completed,
        image_url: doc.data().image_url,
        created_at: doc.data().created_at,
        update_at: doc.data().update_at,
      }))
    )
  }

  fetchTasks();
}, []);

//ฟังชั่นลบข้อมูล ออกจาก collection จาก firebase
async function handleDeleteTaskClick(id: string, image_URL: string) {
  //แสดง confirm dialog
  if( confirm("คุณต้องการลบข้อมูลใช่หรือไม่?") ){
    //ลบรูปออก

    //ลบข้อมูลจาก database
    
    //ลบข้อมูลออกจากรายการที่แสดงบนหน้าจอ
    setTasks(tasks.filter((task) => task.id !== id) );
}
}

  return (
    <div className="flex flex-col w-3/4 mx-auto">
      <div className="flex flex-col items-center mt-20">
        <Image
          src= {task}
          alt="logo"
          width={100}
          height={100}
        />
        <h1 className="text-2xl font-bold mt-10">
          Manage Task App (Firebase)
        </h1>
        <h1 className="text-2xl font-bold">
          บันทึกการทำงาน
        </h1>
        </div>
        {/* ปุ่มเพิ่ม */}
        <div className="flex justify-end">
        <Link href="/addtask" className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-4 w-max rounded ">
        เพิ่มงาน</Link>
       </div>
      {/* ตาราง */}
      <div className="mt-5">
        <table className="min-w-full border border-black text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black">รูป</th>
              <th className="border border-black">งานที่ต้องทำ</th>
              <th className="border border-black">รายละเอียด</th>
              <th className="border border-black">สถานะ</th>
              <th className="border border-black">วันที่เพิ่ม</th>
              <th className="border border-black">วันที่แก้ไข</th>
              <th className="border border-black">Action</th> 
            </tr>
          </thead>
            <tbody> 
              {/* วนลูปตามจำนวนข้อมูลใน state: task */}
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border border-black">
                    {task.image_url 
                    ? <Image src={task.image_url} alt="task" width={50} height={50} unoptimized={true}/>
                    : "."}
                  </td>
                  <td className="border border-black">{task.title}</td>
                  <td className="border border-black">{task.detail}</td>
                  <td className="border border-black text-center">{task.is_completed 
                  ? <span className="text-green-500">เสร็จสิ้น</span> 
                  : <span className="text-red-500">ยังไม่เสร็จสิ้น</span>}</td>
                  <td className="border border-black">{new Date(task.created_at).toLocaleString()}</td>
                  <td className="border border-black">{new Date(task.update_at).toLocaleString()}</td>

                  <td className="border text-green-500 text-center"><Link href={`/edittask/${task.id}`}>แก้ไข</Link>

                  <button onClick={()=>handleDeleteTaskClick(task.id, task.image_url)} className="text-red-500 font-bold cursor-pointer" >ลบ</button></td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-10">
        <Link href="/" className="text-blue-500 font-bold">
        ย้อนกลับ</Link>
      </div>
    </div>
  );
}
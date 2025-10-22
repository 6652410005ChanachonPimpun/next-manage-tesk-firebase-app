import Image from "next/image";
import task from "../assets/task.png";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center mt-20">
        <Image
          src= {task}
          alt="logo"
          width={300}
          height={300}
        />
        <h1 className="text-2xl font-bold mt-10">
          Manage Task App
        </h1>
        <h1 className="text-2xl font-bold">
          บันทึกการทำงาน
        </h1>
        <Link href="/alltask" className="mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-40 rounded">
        เข้าใช้งาน</Link>
      </div> 
    </>
  );
}
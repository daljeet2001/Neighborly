// app/api/services/like/route.ts

import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma"; // adjust path if needed


// POST → Like a service
export async function POST(req: Request) {
  try {


    const { serviceId } = await req.json();
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
    }

    // Increment likesCount
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: { likesCount: { increment: 1 } },
    });

    return NextResponse.json({ likesCount: updatedService.likesCount });
  } catch (error) {
    console.error("POST /api/services/like error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE → Unlike a service
// export async function DELETE(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { serviceId } = await req.json();
//     if (!serviceId) {
//       return NextResponse.json({ error: "Service ID is required" }, { status: 400 });
//     }

//     // Decrement likesCount but not below 0
//     const updatedService = await prisma.service.update({
//       where: { id: serviceId },
//       data: { likesCount: { decrement: 1 } },
//     });

//     const safeCount = Math.max(updatedService.likesCount, 0);

//     return NextResponse.json({ likesCount: safeCount });
//   } catch (error) {
//     console.error("DELETE /api/services/like error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

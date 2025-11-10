// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const raw = await request.text();
//     console.log("Raw body from PowerApps/Flow:", raw);

//     let data;
//     try {
//       data = JSON.parse(raw);
//     } catch {
//       data = raw;
//     }

//     console.log("Parsed data:", data);

//     return NextResponse.json({
//       message: "Data received successfully",
//       received: data,
//       file_url: "https://example.com/export.xlsx"
//     });
//   } catch (err) {
//     console.error("Error parsing request:", err);
//     return NextResponse.json({ error: "Failed to parse request" }, { status: 500 });
//   }
// }

// export async function GET() {
//   return NextResponse.json({ message: "API is live" });
// }
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const raw = await request.text(); // đọc raw string
    console.log("Raw body from Flow:", raw);

    // Trường hợp PowerApps gửi string JSON lồng nhau
    let data;
    try {
      // parse 2 lần (vì PowerApps gửi chuỗi JSON bên trong)
      data = JSON.parse(JSON.parse(raw));
    } catch {
      data = JSON.parse(raw);
    }

    console.log("Parsed data:", data);

    return NextResponse.json({
      message: "Data received successfully",
      received: data,
    });
  } catch (error) {
    console.error("Error parsing request:", error);
    return NextResponse.json(
      { error: "Failed to parse request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "API is live" });
}

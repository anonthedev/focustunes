import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const publicFolderPath = path.join(process.cwd(), "./public/sounds");
  const files = fs.readdirSync(publicFolderPath);
  return NextResponse.json({
    sounds: files
  })
}

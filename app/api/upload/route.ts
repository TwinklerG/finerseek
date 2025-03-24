import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 });
    }
    const bytes = await (file as Blob).arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(
      process.cwd(),
      "tmp",
      (file as File).name
    );
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
    return NextResponse.json(
      { message: "File uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Error uploading file: ${error}` },
      { status: 500 }
    );
  }
};

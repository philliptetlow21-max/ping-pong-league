import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { readSheetRange, appendSheetRow, updateSheetRange } from "@/lib/sheets";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const rows = await readSheetRange(session.accessToken, "Matches!A2:J");
    return NextResponse.json({ matches: rows });
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      year,
      matchNumber,
      player1,
      player2,
      p1Game1,
      p2Game1,
      p1Game2,
      p2Game2,
      p1Tiebreaker,
      p2Tiebreaker,
    } = body;

    await appendSheetRow(session.accessToken, "Matches!A:J", [
      year,
      matchNumber,
      player1,
      player2,
      p1Game1 ?? "",
      p2Game1 ?? "",
      p1Game2 ?? "",
      p2Game2 ?? "",
      p1Tiebreaker ?? "",
      p2Tiebreaker ?? "",
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to add match:", error);
    return NextResponse.json(
      { error: "Failed to add match" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isAdmin(session.user?.email)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { rowIndex, values } = body;
    // rowIndex is 0-based from the data (excluding header), so sheet row = rowIndex + 2
    const sheetRow = rowIndex + 2;
    const range = `Matches!A${sheetRow}:J${sheetRow}`;

    await updateSheetRange(session.accessToken, range, [values]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update match:", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}

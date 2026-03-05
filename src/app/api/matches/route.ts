import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { readSheetRangePublic, appendSheetRow, updateSheetRange } from "@/lib/sheets";
import { isViewerAuthenticated } from "@/lib/viewer-auth";

function isValidScore(value: unknown): boolean {
  if (value === "" || value === null || value === undefined) return true;
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= 99;
}

function validateMatchBody(body: Record<string, unknown>): string | null {
  const { year, matchNumber, player1, player2, p1Game1, p2Game1, p1Game2, p2Game2, p1Tiebreaker, p2Tiebreaker } = body;

  const yearNum = Number(year);
  if (!Number.isInteger(yearNum) || yearNum < 2020 || yearNum > 2099) {
    return "year must be an integer between 2020 and 2099";
  }

  const matchNum = Number(matchNumber);
  if (!Number.isInteger(matchNum) || matchNum < 1) {
    return "matchNumber must be a positive integer";
  }

  if (typeof player1 !== "string" || !player1.trim()) {
    return "player1 must be a non-empty string";
  }
  if (typeof player2 !== "string" || !player2.trim()) {
    return "player2 must be a non-empty string";
  }

  for (const [name, val] of Object.entries({ p1Game1, p2Game1, p1Game2, p2Game2, p1Tiebreaker, p2Tiebreaker })) {
    if (!isValidScore(val)) {
      return `${name} must be an integer 0-99 or empty`;
    }
  }

  return null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const isViewer = await isViewerAuthenticated();

  if (!session && !isViewer) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const rows = await readSheetRangePublic("Matches!A2:J");
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

    const validationError = validateMatchBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

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

    if (!Number.isInteger(rowIndex) || rowIndex < 0) {
      return NextResponse.json({ error: "rowIndex must be a non-negative integer" }, { status: 400 });
    }

    if (!Array.isArray(values) || values.length !== 10) {
      return NextResponse.json({ error: "values must be an array of 10 elements" }, { status: 400 });
    }

    const [year, matchNumber, player1, player2, ...scores] = values;
    const valError = validateMatchBody({
      year, matchNumber, player1, player2,
      p1Game1: scores[0], p2Game1: scores[1],
      p1Game2: scores[2], p2Game2: scores[3],
      p1Tiebreaker: scores[4], p2Tiebreaker: scores[5],
    });
    if (valError) {
      return NextResponse.json({ error: valError }, { status: 400 });
    }

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

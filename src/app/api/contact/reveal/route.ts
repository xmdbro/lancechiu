export async function POST() {
  const phone = process.env.CONTACT_PHONE;

  if (!phone) {
    return Response.json(
      { error: "Phone number is unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    { phone },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

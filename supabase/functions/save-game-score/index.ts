// Ancienne route de sauvegarde : aucun accès à la base.
Deno.serve(() => new Response(JSON.stringify({ error: "Score storage retired" }), {
    status: 410,
    headers: { "Content-Type": "application/json; charset=utf-8" }
}));

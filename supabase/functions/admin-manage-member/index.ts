import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let out = "";
  for (const b of bytes) out += chars[b % chars.length];
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { action } = body;

    const serviceClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    // Identify the caller from their own JWT — never trust a role/id passed in the body.
    const authHeader = req.headers.get("Authorization") ?? "";
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: callerData } = await callerClient.auth.getUser();
    const callerId = callerData?.user?.id ?? null;

    let callerIsExecutive = false;
    if (callerId) {
      const { data: callerProfile } = await serviceClient
        .from("profiles")
        .select("role")
        .eq("id", callerId)
        .maybeSingle();
      callerIsExecutive = callerProfile?.role === "executive";
    }

    if (!callerIsExecutive) {
      // One-time bootstrap: allow creating the very first account only while
      // no profiles exist yet. Every action after that requires an executive.
      const { count } = await serviceClient
        .from("profiles")
        .select("id", { count: "exact", head: true });
      const isBootstrap = (count ?? 0) === 0 && action === "create";
      if (!isBootstrap) {
        return json({ error: "Only executives can manage members." }, 403);
      }
    }

    if (action === "create") {
      const { email, full_name, role, title } = body;
      if (!email || !full_name) {
        return json({ error: "email and full_name are required." }, 400);
      }
      const password = generatePassword();
      const { data: created, error } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          role: role === "executive" ? "executive" : "member",
          title: title || "Member",
        },
      });
      if (error) {
        const status = /already registered|already exists/i.test(error.message) ? 409 : 400;
        return json({ error: error.message }, status);
      }
      // temp password is returned once here only — never logged.
      return json({ id: created.user?.id, email, temp_password: password });
    }

    if (action === "remove") {
      const { id } = body;
      if (!id) return json({ error: "id is required." }, 400);
      const { error } = await serviceClient.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reset_password") {
      const { id } = body;
      if (!id) return json({ error: "id is required." }, 400);
      const password = generatePassword();
      const { error } = await serviceClient.auth.admin.updateUserById(id, { password });
      if (error) return json({ error: error.message }, 400);
      return json({ temp_password: password });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unexpected error." }, 500);
  }
});

import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "data.js"), "utf8");
const { CATEGORIES, ENTRIES, LIB_TREE } = new Function(`${src}\nreturn {CATEGORIES, ENTRIES, LIB_TREE};`)();

const SOCIAL_KEYS = new Set(["x", "telegram", "discord", "reddit", "github", "gitlab", "codeberg", "youtube", "medium", "website", "appstore", "play", "download", "network", "live"]);
const HTTPS = /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(?:[/?#][^\s]*)?$/i;
const LOGO_KEY = /^[a-z0-9-]+$/;

function assertLogoFile(logo, label) {
  assert.match(logo, LOGO_KEY, `${label}: logo key should be a file slug`);
  const file = join(root, "assets", "logos", `${logo}.png`);
  assert.ok(existsSync(file), `${label}: missing assets/logos/${logo}.png`);
  const bytes = readFileSync(file);
  assert.ok(bytes.length > 80 && bytes.length < 30000, `${label}: logo file size ${bytes.length}`);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", `${label}: logo is not a PNG`);
}
const BANNED = /jQrgenCorp|Nordic Crypto AS|jQrgen/i;
const PHONE = /(?:\+\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{3}[\s-]?\d{4,}/;

function httpsUrl(value, label) {
  assert.equal(typeof value, "string", `${label} should be a string`);
  assert.match(value, HTTPS, `${label} should be an https URL with a host`);
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    assert.fail(`${label} is not a parseable URL`);
  }
  assert.equal(parsed.protocol, "https:", `${label} should use https`);
  assert.ok(parsed.hostname.includes("."), `${label} should have a hostname`);
}

test("directory entries have required fields and https URLs", () => {
  assert.equal(typeof CATEGORIES, "object");
  assert.ok(Array.isArray(ENTRIES));
  assert.ok(ENTRIES.length >= 40, "expected a broad directory");
  assert.doesNotMatch(src, BANNED, "operator name or personal token leaked into data.js");

  const names = new Set();
  const urls = new Set();
  const counts = Object.fromEntries(Object.keys(CATEGORIES).map(k => [k, 0]));

  for (const entry of ENTRIES) {
    assert.ok(Array.isArray(entry), "entry should be an array");
    const last = entry.at(-1);
    const social = last && typeof last === "object" ? last : null;
    const fields = social ? entry.slice(0, -1) : entry;
    assert.ok(fields.length === 5 || fields.length === 6, `${fields[1] || "entry"} should be category, name, description, url, logo, optional warn`);
    const [cat, name, desc, url, logo, flag] = fields;
    assert.ok(Object.hasOwn(CATEGORIES, cat), `${name}: unknown category ${cat}`);
    assert.equal(typeof name, "string");
    assert.ok(name.trim().length >= 2, `${name}: name too short`);
    assert.equal(typeof desc, "string");
    assert.ok(desc.trim().length >= 20 && desc.length <= 400, `${name}: description should be one short sentence`);
    assert.doesNotMatch(desc, BANNED, `${name}: banned operator string`);
    assert.doesNotMatch(`${name} ${desc}`, PHONE, `${name}: looks like a phone number`);
    httpsUrl(url, name);
    assert.equal(typeof logo, "string", `${name}: logo key should be a string`);
    if (logo) assertLogoFile(logo, name);
    if (flag !== undefined) assert.equal(flag, "warn", `${name}: unexpected flag ${flag}`);
    assert.ok(!names.has(name), `duplicate name ${name}`);
    names.add(name);
    assert.ok(!urls.has(url), `duplicate url ${url}`);
    urls.add(url);
    counts[cat] += 1;
    if (social) {
      assert.equal(typeof social, "object");
      for (const [key, value] of Object.entries(social)) {
        assert.ok(SOCIAL_KEYS.has(key), `${name}: unknown social key ${key}`);
        if (key === "network" || key === "live") continue;
        httpsUrl(value, `${name} ${key}`);
      }
    }
  }

  for (const [cat, n] of Object.entries(counts)) {
    assert.ok(n > 0, `category ${cat} has no entries`);
  }
});

test("library tree edges cite a public source", () => {
  assert.ok(LIB_TREE && Array.isArray(LIB_TREE.nodes) && Array.isArray(LIB_TREE.edges));
  assert.equal(typeof LIB_TREE.intro, "string");
  const ids = new Set(LIB_TREE.nodes.map(n => n.id));
  assert.equal(ids.size, LIB_TREE.nodes.length, "library ids should be unique");
  for (const node of LIB_TREE.nodes) {
    assert.ok(node.id && node.name, "library node needs id and name");
    if (node.url) httpsUrl(node.url, `library ${node.name}`);
    if (node.logo) assertLogoFile(node.logo, `library ${node.name}`);
  }
  assert.ok(LIB_TREE.edges.length > 0, "expected verified library edges");
  for (const edge of LIB_TREE.edges) {
    assert.ok(ids.has(edge.from) && ids.has(edge.to), `edge ${edge.from}->${edge.to} is unknown`);
    assert.equal(edge.verified, true, `${edge.from}->${edge.to} should be verified`);
    assert.equal(typeof edge.via, "string");
    assert.ok(edge.via.length > 10, `${edge.from}->${edge.to} needs a source note`);
  }
});

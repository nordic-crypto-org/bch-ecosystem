# Contributing to the Bitcoin Cash Ecosystem Directory

Want your Bitcoin Cash project listed? Open a pull request.

1. Click **+ Add your project** on the site, or [edit `data.js` on GitHub](https://github.com/nordic-crypto-org/bch-ecosystem/edit/main/data.js). If you aren't a member, GitHub forks the repo for you and opens a pull request.
2. Add one line to `ENTRIES` in the right category section.
3. Optional: add a logo (see below).
4. Submit the pull request and fill in the template.

## Entry format

```js
["category", "Name", "One short, neutral sentence describing the project.", "https://official-url/", "", {github:"https://github.com/example/project"}],
```

- **category**: one of the keys below.
- **Name**: the project's own name.
- **Description**: one factual sentence from the project's own site or repository. No marketing claims, prices, or promises you cannot point to.
- **URL**: the official HTTPS link. No referral or affiliate links.
- **logo-key**: the file name (without `.png`) in `assets/logos/`. Use `""` to show an initials placeholder. Prefer the placeholder unless you have the project's own logo and a clear licence.
- **source** (optional object): official repository or social accounts only. See below.

## Source and social links

Add the object only for accounts or repositories you can verify from the project's own website, GitHub, GitLab, Codeberg, or an official announcement. Leave a key out when you cannot verify it. Do not guess.

Keys: `x`, `telegram`, `discord`, `reddit`, `github`, `gitlab`, `codeberg`, `youtube`, `medium`, `website`. Optional store keys, official URLs only: `appstore`, `play`, `download`.

Put the source repository on `github`, `gitlab`, or `codeberg`.

## Categories

| key | Section |
|---|---|
| `wallets` | Wallets |
| `payments` | Payments & Commerce |
| `exchanges` | Exchanges & Markets |
| `defi` | DeFi |
| `tokens` | CashTokens & NFTs |
| `explorers` | Explorers |
| `infrastructure` | Nodes & Infrastructure |
| `developers` | Developers |
| `funding` | Funding |
| `community` | Community |
| `news` | News & Learning |

The Libraries section is separate. It is rendered from `LIB_TREE`. Add an edge only when a public file, such as `package.json`, shows that dependency, and quote that file in `via`.

## Logos

- Use only the project's **own** official logo, and only when the licence allows it. Never use another project's logo or a third-party outlet's logo.
- Square PNG, **64×64 px**, transparent or solid background, under 20 KB, saved as `assets/logos/<logo-key>.png`.
- No hotlinking. Logos are served from this repo.
- If there's no logo, leave the key empty and an initials placeholder is shown.

## Rules

- The project must be related to Bitcoin Cash (BCH). A public listing must load.
- Being listed is not an endorsement. Maintainers may edit or decline entries, and may remove dead or abandoned links.
- Prefer a pull request. If you can't make one, [open an issue](https://github.com/nordic-crypto-org/bch-ecosystem/issues) instead.
- Do not add phone numbers, personal data, or names of private individuals.
- The operator of this directory is named Nordic Crypto.

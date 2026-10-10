# Third-party notices

The `winuionweb` package is licensed under GPL-3.0-only. See [LICENSE](LICENSE)
for the complete license text.

The following runtime packages are installed as separate npm dependencies or
peer dependencies. Their own license terms apply to those packages:

| Package | License | Role |
| --- | --- | --- |
| Vue | MIT | Peer dependency and component runtime |
| MathLive | MIT | RichEditBox math conversion |
| rtf.js | MIT | RichEditBox RTF support |

**Microsoft fonts are not included in the npm package.** The CSS refers to
`Segoe Fluent Icons` by local family name so a browser can use a copy already
installed on the visitor's device. No Microsoft font file is included in the
library bundle or npm tarball.
Microsoft's [Font redistribution FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq)
does not grant permission to redistribute Windows font files. The
[Segoe Fluent Icons documentation](https://learn.microsoft.com/en-us/windows/apps/design/iconography/segoe-fluent-icons-font)
also says the font may not be shipped to another platform.
The optional `loadWinUIIconFont()` API accepts a host-supplied font URL or file;
using it does not confer any rights to redistribute that font.

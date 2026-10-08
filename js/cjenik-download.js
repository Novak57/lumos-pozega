(() => {
  const button = document.getElementById("cjenik-download");
  const list = document.getElementById("price-list");
  if (!button || !list) return;

  const HEADER = [
    "KPD oznaka",
    "Interna sifra",
    "Naziv usluge",
    "Jed. mjera",
    "Kolicina",
    "Cijena",
    "Popust",
    "Porez",
    "Sidrena cijena",
  ];

  const parseAmount = (value = "") => {
    const match = String(value).replace(/\s/g, "").match(/(\d+[.,]?\d*)/);
    if (!match) return "";
    return match[1].replace(",", ".");
  };

  const collectRows = () => {
    const rows = [HEADER];

    list.querySelectorAll(":scope > li").forEach((item) => {
      const cijena = parseAmount(
        item.querySelector(".price-list__cijena")?.textContent
      );
      const sidrena = parseAmount(
        item.querySelector(".price-list__sidrena")?.textContent
      );

      rows.push([
        item.dataset.kpd ?? "",
        item.dataset.sifra ?? "",
        item.dataset.naziv ??
          item.querySelector("strong")?.textContent?.trim() ??
          "",
        item.dataset.jedinica ?? "",
        item.dataset.kolicina ?? "1",
        cijena,
        item.dataset.popust ?? "0",
        item.dataset.porez ?? "0",
        sidrena || cijena,
      ]);
    });

    return rows;
  };

  const xmlEscape = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&apos;");

  const colName = (index) => {
    let n = index + 1;
    let name = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      name = String.fromCharCode(65 + rem) + name;
      n = Math.floor((n - 1) / 26);
    }
    return name;
  };

  const sheetXml = (rows) => {
    const cells = rows
      .map((row, r) => {
        const rowCells = row
          .map((value, c) => {
            const ref = `${colName(c)}${r + 1}`;
            const text = String(value ?? "");
            if (text !== "" && !Number.isNaN(Number(text))) {
              return `<c r="${ref}"><v>${xmlEscape(text)}</v></c>`;
            }
            return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(text)}</t></is></c>`;
          })
          .join("");
        return `<row r="${r + 1}">${rowCells}</row>`;
      })
      .join("");

    return (
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
      `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
      `<sheetData>${cells}</sheetData></worksheet>`
    );
  };

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let k = 0; k < 8; k += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  })();

  const crc32 = (bytes) => {
    let crc = 0xffffffff;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  };

  const u16 = (n) => {
    const b = new Uint8Array(2);
    new DataView(b.buffer).setUint16(0, n, true);
    return b;
  };

  const u32 = (n) => {
    const b = new Uint8Array(4);
    new DataView(b.buffer).setUint32(0, n, true);
    return b;
  };

  const concat = (parts) => {
    const total = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(total);
    let offset = 0;
    parts.forEach((part) => {
      out.set(part, offset);
      offset += part.length;
    });
    return out;
  };

  const encoder = new TextEncoder();

  const zipStore = (files) => {
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    files.forEach(({ name, data }) => {
      const nameBytes = encoder.encode(name);
      const content =
        typeof data === "string" ? encoder.encode(data) : data;
      const crc = crc32(content);
      const localHeader = concat([
        u32(0x04034b50),
        u16(20),
        u16(0),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(content.length),
        u32(content.length),
        u16(nameBytes.length),
        u16(0),
        nameBytes,
      ]);
      const local = concat([localHeader, content]);
      localParts.push(local);

      centralParts.push(
        concat([
          u32(0x02014b50),
          u16(20),
          u16(20),
          u16(0),
          u16(0),
          u16(0),
          u16(0),
          u32(crc),
          u32(content.length),
          u32(content.length),
          u16(nameBytes.length),
          u16(0),
          u16(0),
          u16(0),
          u16(0),
          u32(0),
          u32(offset),
          nameBytes,
        ])
      );

      offset += local.length;
    });

    const central = concat(centralParts);
    const end = concat([
      u32(0x06054b50),
      u16(0),
      u16(0),
      u16(files.length),
      u16(files.length),
      u32(central.length),
      u32(offset),
      u16(0),
    ]);

    return concat([...localParts, central, end]);
  };

  const buildXlsx = (rows) => {
    const files = [
      {
        name: "[Content_Types].xml",
        data:
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
          `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
          `<Default Extension="xml" ContentType="application/xml"/>` +
          `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
          `<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>` +
          `</Types>`,
      },
      {
        name: "_rels/.rels",
        data:
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
          `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
          `</Relationships>`,
      },
      {
        name: "xl/workbook.xml",
        data:
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
          `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
          `<sheets><sheet name="Cjenik" sheetId="1" r:id="rId1"/></sheets>` +
          `</workbook>`,
      },
      {
        name: "xl/_rels/workbook.xml.rels",
        data:
          `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
          `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
          `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>` +
          `</Relationships>`,
      },
      {
        name: "xl/worksheets/sheet1.xml",
        data: sheetXml(rows),
      },
    ];

    return zipStore(files);
  };

  button.addEventListener("click", () => {
    const bytes = buildXlsx(collectRows());
    const blob = new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Lumos-cjenik-usluga.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
})();

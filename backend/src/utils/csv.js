const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const lines = [headers.join(',')];
  rows.forEach((row) => {
    const line = headers.map((header) => escapeValue(row[header])).join(',');
    lines.push(line);
  });

  return lines.join('\n');
};

module.exports = {
  toCsv,
};

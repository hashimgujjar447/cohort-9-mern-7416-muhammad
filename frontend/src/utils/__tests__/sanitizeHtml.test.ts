import { sanitizeHtml } from "../sanitizeHtml";

describe("sanitizeHtml", () => {
  it("should preserve safe HTML", () => {
    const html = "<p>Hello <strong>world</strong></p>";

    const result = sanitizeHtml(html);

    expect(result).toContain("<p>");
    expect(result).toContain("<strong>world</strong>");
  });

  it("should remove script tags", () => {
    const html = '<p>Hello</p><script>alert("XSS")</script>';

    const result = sanitizeHtml(html);

    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>Hello</p>");
  });

  it("should remove dangerous event handlers", () => {
    const html = '<img src="image.jpg" onerror="alert(\'XSS\')" />';

    const result = sanitizeHtml(html);

    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });
});

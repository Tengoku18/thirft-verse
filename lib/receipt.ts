import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export interface ReceiptData {
  orderCode: string;
  date: Date;
  paymentMethod: string;
  buyerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  offerCode?: string | null;
  discountAmount?: number;
  shippingFee: number;
  total: number;
}

const ESPRESSO = "#3B2F2F";
const TAN = "#D4A373";

const npr = (n: number) => `NPR ${Math.round(n).toLocaleString()}`;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function buildReceiptHtml(d: ReceiptData): string {
  const dateStr = d.date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const discountRow =
    d.discountAmount && d.discountAmount > 0
      ? `<tr>
           <td style="color:#059669;">Discount${
             d.offerCode ? ` (${escapeHtml(d.offerCode)})` : ""
           }</td>
           <td style="text-align:right;color:#059669;">- ${npr(
             d.discountAmount,
           )}</td>
         </tr>`
      : "";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: -apple-system, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        color: ${ESPRESSO};
      }
      .wrap { padding: 40px 36px; }
      .header {
        background: linear-gradient(135deg, ${ESPRESSO} 0%, ${TAN} 100%);
        color: #fff;
        padding: 32px 36px;
        text-align: center;
      }
      .brand { font-size: 26px; font-weight: 800; letter-spacing: 1px; }
      .tagline { font-size: 13px; opacity: 0.85; margin-top: 4px; }
      .status { font-size: 20px; font-weight: 700; margin: 28px 0 6px; }
      .muted { color: rgba(59,47,47,0.55); font-size: 12px; }
      .section-title {
        text-transform: uppercase;
        letter-spacing: 2px;
        font-size: 11px;
        font-weight: 700;
        color: rgba(59,47,47,0.5);
        margin: 26px 0 10px;
      }
      table { width: 100%; border-collapse: collapse; font-size: 14px; }
      td { padding: 7px 0; }
      .divider { border-top: 1px solid rgba(59,47,47,0.12); margin: 12px 0; }
      .total-row td { font-size: 18px; font-weight: 800; padding-top: 14px; }
      .total-amount { color: ${TAN}; }
      .info td:first-child { color: rgba(59,47,47,0.55); }
      .info td:last-child { text-align: right; font-weight: 600; }
      .footer {
        margin-top: 36px;
        text-align: center;
        font-size: 11px;
        color: rgba(59,47,47,0.45);
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="brand">Thriftverse</div>
      <div class="tagline">Thrift smarter. Shop sustainably.</div>
    </div>
    <div class="wrap">
      <div style="text-align:center;">
        <div class="status">Order Confirmed</div>
        <div class="muted">${escapeHtml(d.orderCode)}</div>
      </div>

      <div class="section-title">Order Details</div>
      <table class="info">
        <tr><td>Date</td><td>${dateStr}</td></tr>
        <tr><td>Customer</td><td>${escapeHtml(d.buyerName)}</td></tr>
        <tr><td>Payment Method</td><td>${escapeHtml(
          d.paymentMethod,
        )}</td></tr>
        <tr><td>Item</td><td>${escapeHtml(d.productName)}</td></tr>
        <tr><td>Quantity</td><td>${d.quantity}</td></tr>
      </table>

      <div class="section-title">Payment Summary</div>
      <table>
        <tr>
          <td>Subtotal (${d.quantity} × ${npr(d.unitPrice)})</td>
          <td style="text-align:right;">${npr(d.subtotal)}</td>
        </tr>
        ${discountRow}
        <tr>
          <td>Shipping</td>
          <td style="text-align:right;">${npr(d.shippingFee)}</td>
        </tr>
      </table>
      <div class="divider"></div>
      <table>
        <tr class="total-row">
          <td>Total Paid</td>
          <td style="text-align:right;" class="total-amount">${npr(
            d.total,
          )}</td>
        </tr>
      </table>

      <div class="footer">
        Thank you for shopping at Thriftverse!<br />
        This is a system-generated receipt and does not require a signature.
      </div>
    </div>
  </body>
</html>`;
}

const receiptFileName = (orderCode: string) =>
  `Thriftverse-Receipt-${orderCode.replace(/[^\w-]/g, "")}.pdf`;

/**
 * Render the receipt to a PDF file with a human-friendly name and return its
 * local URI. The raw expo-print output has a random filename, so we copy it
 * into the cache dir under a readable name (used by share + download).
 */
export async function generateReceiptPdf(data: ReceiptData): Promise<string> {
  const html = buildReceiptHtml(data);
  const { uri } = await Print.printToFileAsync({ html });

  const dest = `${FileSystem.cacheDirectory ?? ""}${receiptFileName(
    data.orderCode,
  )}`;
  try {
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  } catch {
    // Fall back to the raw print output if the rename fails.
    return uri;
  }
}

/** Generate the receipt PDF and open the OS share sheet. */
export async function shareReceipt(data: ReceiptData): Promise<boolean> {
  const uri = await generateReceiptPdf(data);
  if (!(await Sharing.isAvailableAsync())) return false;

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: "Your Thriftverse receipt",
    UTI: "com.adobe.pdf",
  });
  return true;
}

export type DownloadResult =
  | { status: "saved"; location: string }
  /** Android: user dismissed the one-time folder picker. */
  | { status: "denied" }
  | { status: "unavailable" };

// Remembered Android SAF folder so we only ever ask the user once.
const SAF_DIR_KEY = "@thriftverse/receipt_saf_dir";

async function writeIntoSafDir(
  dirUri: string,
  data: ReceiptData,
  pdfUri: string,
): Promise<void> {
  const base64 = await FileSystem.readAsStringAsync(pdfUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const target = await FileSystem.StorageAccessFramework.createFileAsync(
    dirUri,
    receiptFileName(data.orderCode),
    "application/pdf",
  );
  await FileSystem.writeAsStringAsync(target, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

/**
 * Directly save the receipt PDF to the device as a real file — no share sheet.
 *
 *  - Android: saves into a user-chosen folder via the Storage Access
 *    Framework. The folder is remembered (AsyncStorage), so the picker only
 *    appears the first time; every later download writes there silently.
 *  - iOS: there is no public Downloads folder, so we write the PDF into the
 *    app's Documents directory. With UIFileSharingEnabled +
 *    LSSupportsOpeningDocumentsInPlace (app.json), it shows up under
 *    Files › On My iPhone › Thriftverse. (Requires a native rebuild.)
 */
export async function downloadReceipt(
  data: ReceiptData,
): Promise<DownloadResult> {
  const pdfUri = await generateReceiptPdf(data);

  if (Platform.OS === "android") {
    const remembered = await AsyncStorage.getItem(SAF_DIR_KEY).catch(
      () => null,
    );
    if (remembered) {
      try {
        await writeIntoSafDir(remembered, data, pdfUri);
        return { status: "saved", location: "your chosen folder" };
      } catch {
        // Permission revoked or folder gone — forget it and re-ask once.
        await AsyncStorage.removeItem(SAF_DIR_KEY).catch(() => {});
      }
    }

    const perm =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!perm.granted) return { status: "denied" };
    await AsyncStorage.setItem(SAF_DIR_KEY, perm.directoryUri).catch(() => {});
    await writeIntoSafDir(perm.directoryUri, data, pdfUri);
    return { status: "saved", location: "your chosen folder" };
  }

  if (Platform.OS === "ios") {
    const docDir = FileSystem.documentDirectory;
    if (!docDir) return { status: "unavailable" };
    const dest = `${docDir}${receiptFileName(data.orderCode)}`;
    await FileSystem.deleteAsync(dest, { idempotent: true });
    await FileSystem.copyAsync({ from: pdfUri, to: dest });
    return {
      status: "saved",
      location: "Files › On My iPhone › Thriftverse",
    };
  }

  return { status: "unavailable" };
}

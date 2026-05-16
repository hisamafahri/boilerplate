const currencyToLocale: Record<string, string> = {
  IDR: "id-ID",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  SGD: "en-SG",
  MYR: "ms-MY",
  THB: "th-TH",
  PHP: "en-PH",
  AUD: "en-AU",
  CAD: "en-CA",
  CNY: "zh-CN",
  KRW: "ko-KR",
  HKD: "zh-HK",
  TWD: "zh-TW",
  VND: "vi-VN",
  INR: "en-IN",
};

export const formatMoney = (
  n: string | number | null | undefined,
  opts?: {
    locale?: boolean;
    currency?: string;
    withCurrency?: boolean;
    plusSigned?: boolean;
    minusSigned?: boolean;
  },
) => {
  if (!n) {
    if (opts?.withCurrency || opts?.currency) {
      return `${opts?.currency || "$"}0`;
    }

    return "0";
  }

  const val = typeof n === "string" ? parseFloat(n || "0") || 0 : n;

  if (opts?.locale && opts?.currency) {
    const locale = currencyToLocale[opts.currency];
    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: opts.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(Math.abs(val));

    if (val < 0) {
      return `${
        opts?.minusSigned || opts?.minusSigned === undefined ? "-" : ""
      }${formatted}`;
    } else {
      return `${opts?.plusSigned ? "+" : ""}${formatted}`;
    }
  }

  const locale = opts?.locale ? currencyToLocale[opts?.currency || ""] : undefined;

  if (opts?.currency || opts?.withCurrency) {
    if (val < 0) {
      return `${
        opts?.minusSigned || opts?.minusSigned === undefined ? "-" : ""
      }${opts?.currency || "$"}${new Intl.NumberFormat(locale).format(
        Math.abs(val),
      )}`;
    } else {
      return `${opts?.plusSigned ? "+" : ""}${
        opts?.currency || "$"
      }${new Intl.NumberFormat(locale).format(val)}`;
    }
  } else {
    return new Intl.NumberFormat(locale).format(val);
  }
};

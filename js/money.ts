export const formatMoney = (
	n: string | number | null | undefined,
	opts?: {
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

	if (opts?.currency || opts?.withCurrency) {
		if (val < 0) {
			return `${
				opts?.minusSigned || opts?.minusSigned === undefined ? "-" : ""
			}${opts?.currency || "$"}${new Intl.NumberFormat().format(
				Math.abs(val),
			)}`;
		} else {
			return `${opts?.plusSigned ? "+" : ""}${
				opts?.currency || "$"
			}${new Intl.NumberFormat().format(val)}`;
		}
	} else {
		return new Intl.NumberFormat().format(val);
	}
};

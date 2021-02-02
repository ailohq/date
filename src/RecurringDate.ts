import moment from "moment-timezone";
import { LocalDate } from "./LocalDate";
import {
  RecurringDateFrequency,
  RecurringDateInput,
  validateRecurringDateInput,
} from "./RecurringDateInput";

export class RecurringDate {
  private input: Readonly<RecurringDateInput>;

  constructor(input: Readonly<RecurringDateInput>) {
    validateRecurringDateInput(input);
    this.input = input;
  }

  get frequency(): RecurringDateFrequency {
    return this.input.frequency;
  }

  getNextRecurrence(asOf: LocalDate = LocalDate.today()): LocalDate {
    if (this.input.frequency === "daily") {
      return asOf.add(1, "day");
    }

    let result = asOf;
    if (this.input.frequency === "fortnightly") {
      result = LocalDate.from(this.input.startDate);
    } else if (this.input.frequency === "weekly") {
      result = result.setDayOfWeek(this.input.anniversaryDay);
    } else {
      result = result.setDayOfMonth(this.input.anniversaryDay);
    }
    if (this.input.frequency === "annually") {
      result = result.setMonth(this.input.anniversaryMonth - 1);
    }

    const period: { number: number; unit: "week" | "month" | "year" } =
      this.input.frequency === "weekly"
        ? { number: 1, unit: "week" }
        : this.input.frequency === "fortnightly"
        ? { number: 2, unit: "week" }
        : this.input.frequency === "monthly"
        ? { number: 1, unit: "month" }
        : { number: 1, unit: "year" };

    while (result.isSameOrBefore(asOf)) {
      result = result.add(period.number, period.unit);
    }

    return result;
  }

  format({ type = "X of Y" }: { type?: "X of Y" | "/FF" } = {}): string {
    if (type === "X of Y") {
      if (this.input.frequency === "weekly") {
        return `${moment()
          .isoWeekday(this.input.anniversaryDay)
          .format("dddd")} each week`;
      }

      if (this.input.frequency === "monthly") {
        return `${moment()
          .date(this.input.anniversaryDay)
          .format("Do")} of each month`;
      }

      if (this.input.frequency === "annually" && this.input.anniversaryMonth) {
        return `${moment()
          .date(this.input.anniversaryDay)
          .month(this.input.anniversaryMonth - 1)
          .format("Do MMMM")} each year`;
      }
    }

    if (type === "/FF") {
      // eslint-disable-next-line default-case
      switch (this.frequency) {
        case "daily":
          return "/day";
        case "weekly":
          return "/wk";
        case "fortnightly":
          return "/fn";
        case "monthly":
          return "/mo";
        case "annually":
          return "/yr";
      }
    }

    throw new TypeError("Not implemented");
  }
}

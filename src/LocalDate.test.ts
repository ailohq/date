import MockDate from "mockdate";
import moment from "moment-timezone";
import { LocalDate } from "./LocalDate";

MockDate.set("2020-09-27T10:00:00");

const a = new LocalDate("2020-01-01");
const b = new LocalDate("2021-01-01");

describe("LocalDate", () => {
  describe("from", () => {
    it("when constructed from a timestamp string, returns its date", () => {
      expect(LocalDate.from("2021-03-02T20:00:00Z").toString()).toEqual(
        "2021-03-02"
      );
    });

    it("when constructed from a timestamp string and keepTimeZone is false, returns date in the default time zone", () => {
      expect(
        LocalDate.from("2021-03-02T20:00:00Z", {
          keepTimeZone: false,
        }).toString()
      ).toEqual("2021-03-03");
    });

    it("when constructed from a moment, returns its date", () => {
      expect(
        LocalDate.from(moment.utc("2021-03-02T20:00:00Z")).toString()
      ).toEqual("2021-03-02");
    });

    it("when constructed from a moment and keepTimeZone is false, returns date in the default time zone", () => {
      expect(
        LocalDate.from(moment.utc("2021-03-02T20:00:00Z"), {
          keepTimeZone: false,
        }).toString()
      ).toEqual("2021-03-03");
    });
  });

  it("min returns earlier date", () => {
    expect(LocalDate.min()).toEqual(undefined);
    expect(LocalDate.min(a)).toEqual(a);
    expect(LocalDate.min(a, b)).toEqual(a);
    expect(LocalDate.min(b, a)).toEqual(a);
  });

  it("max returns earlier date", () => {
    expect(LocalDate.max()).toEqual(undefined);
    expect(LocalDate.max(b)).toEqual(b);
    expect(LocalDate.max(b, a)).toEqual(b);
    expect(LocalDate.max(a, b)).toEqual(b);
  });

  describe(".format", () => {
    it("if receives no args, formats using value format", () => {
      expect(a.format()).toEqual("2020-01-01");
    });

    it("format type can be customized", () => {
      expect(a.format("DD MMM YYYY")).toEqual("01 Jan 2020");
      expect(a.format({ type: "DD MMM YYYY" })).toEqual("01 Jan 2020");
    });
  });

  describe(".parse", () => {
    it("works for most of the known formats", () => {
      const pairs = [
        ["5 Feb", "2020-02-05"],
        ["Feb 5, 2020", "2020-02-05"],
        ["Feb 5", "2020-02-05"],
        ["5 Feb 2020", "2020-02-05"],
        ["5/2", "2020-02-05"],
        ["5 / 2", "2020-02-05"],
        ["5/2/", "2020-02-05"],
        ["5 / 2 / ", "2020-02-05"],
        ["5/2/2", "2002-02-05"],
        ["5/2/22", "2022-02-05"],
        ["5/2/222", "2222-02-05"],
        ["5/2/2222", "2222-02-05"],
        ["5 / 2 / 2222", "2222-02-05"],
        ["05/02", "2020-02-05"],
        ["05/02/", "2020-02-05"],
        ["05/02/2", "2002-02-05"],
        ["05 / 02 / 2", "2002-02-05"],
        ["05/02/20", "2020-02-05"],
        ["05/02/202", "2202-02-05"],
        ["05/02/2020", "2020-02-05"],
        ["05/02/2020", "2020-02-05"],
        ["05 / 02 / 2020", "2020-02-05"],
        ["2020/02/05", "2020-02-05"],
        ["5-2", "2020-02-05"],
        ["5 - 2", "2020-02-05"],
        ["5-2-", "2020-02-05"],
        ["5 - 2 - ", "2020-02-05"],
        ["5-2-2", "2002-02-05"],
        ["5-2-22", "2022-02-05"],
        ["5-2-222", "2222-02-05"],
        ["5-2-2222", "2222-02-05"],
        ["5 - 2 - 2222", "2222-02-05"],
        ["05-02", "2020-02-05"],
        ["05-02-", "2020-02-05"],
        ["05-02-2", "2002-02-05"],
        ["05 - 02 - 2", "2002-02-05"],
        ["05-02-20", "2020-02-05"],
        ["05-02-202", "2202-02-05"],
        ["05-02-2020", "2020-02-05"],
        ["05-02-2020", "2020-02-05"],
        ["05 - 02 - 2020", "2020-02-05"],
        ["2020-02-05", "2020-02-05"],
        ["5.2", "2020-02-05"],
        ["5 . 2", "2020-02-05"],
        ["5.2.", "2020-02-05"],
        ["5 . 2 . ", "2020-02-05"],
        ["5.2.2", "2002-02-05"],
        ["5.2.22", "2022-02-05"],
        ["5.2.222", "2222-02-05"],
        ["5.2.2222", "2222-02-05"],
        ["5 . 2 . 2222", "2222-02-05"],
        ["05.02", "2020-02-05"],
        ["05.02.", "2020-02-05"],
        ["05.02.2", "2002-02-05"],
        ["05 . 02 . 2", "2002-02-05"],
        ["05.02.20", "2020-02-05"],
        ["05.02.202", "2202-02-05"],
        ["05.02.2020", "2020-02-05"],
        ["05.02.2020", "2020-02-05"],
        ["05 . 02 . 2020", "2020-02-05"],
        ["2020.02.05", "2020-02-05"],
        ["5/2", "2020-02-05"],
        ["5   2", "2020-02-05"],
        ["5 2 ", "2020-02-05"],
        ["5   2   ", "2020-02-05"],
        ["5 2 2", "2002-02-05"],
        ["5 2 22", "2022-02-05"],
        ["5 2 222", "2222-02-05"],
        ["5 2 2222", "2222-02-05"],
        ["5   2   2222", "2222-02-05"],
        ["05 02", "2020-02-05"],
        ["05 02 ", "2020-02-05"],
        ["05 02 2", "2002-02-05"],
        ["05   02   2", "2002-02-05"],
        ["05 02 20", "2020-02-05"],
        ["05 02 202", "2202-02-05"],
        ["05 02 2020", "2020-02-05"],
        ["05 02 2020", "2020-02-05"],
        ["05   02   2020", "2020-02-05"],
        ["2020 02 05", "2020-02-05"],
        [" ", undefined],
        ["asd", undefined],
        ["2020", "2020-01-01"],
        ["5", "2020-09-05"],
        ["5/", "2020-09-05"],
        ["5-", "2020-09-05"],
        ["11", "2020-09-11"],
        ["25", "2020-09-25"],
      ];

      pairs.forEach((pair) => {
        expect([pair[0], LocalDate.parse(pair[0])?.toString()]).toEqual(pair);
      });
    });
  });

  describe("compare", () => {
    it("compares the dates in ascending order", () => {
      expect([a, b].sort(LocalDate.compare)).toEqual([a, b]);
      expect([b, a].sort(LocalDate.compare)).toEqual([a, b]);
    });
  });

  describe("diff", () => {
    it("if unit arg is not given, returns difference in days between the dates", () => {
      expect(a.diff(b)).toEqual(-366);
      expect(b.diff(a)).toEqual(366);
    });
  });
});

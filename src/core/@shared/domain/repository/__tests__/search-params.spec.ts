import { SearchParams } from "../search-params";

describe("SearchParams Unit Tests", () => {
  test.each([
    { page: null, expected: 1 },
    { page: undefined, expected: 1 },
    { page: "", expected: 1 },
    { page: "fake", expected: 1 },
    { page: 0, expected: 1 },
    { page: -1, expected: 1 },
    { page: 5.5, expected: 1 },
    { page: true, expected: 1 },
    { page: false, expected: 1 },
    { page: {}, expected: 1 },

    { page: 1, expected: 1 },
    { page: 2, expected: 2 },
  ])("page prop %p", ({ page, expected }) => {
    const params = new SearchParams();
    expect(params.page).toBe(1);

    expect(new SearchParams({ page: page as any }).page).toBe(expected);
  });

  test.each([
    { per_page: null, expected: 10 },
    { per_page: undefined, expected: 10 },
    { per_page: "", expected: 10 },
    { per_page: "fake", expected: 10 },
    { per_page: 0, expected: 10 },
    { per_page: -1, expected: 10 },
    { per_page: 5.5, expected: 10 },
    { per_page: true, expected: 10 },
    { per_page: false, expected: 10 },
    { per_page: {}, expected: 10 },

    { per_page: 1, expected: 1 },
    { per_page: 2, expected: 2 },
    { per_page: 10, expected: 10 },
  ])("per_page prop %p", (i) => {
    const params = new SearchParams();
    expect(params.perPage).toBe(10);

    expect(new SearchParams({ perPage: i.per_page as any }).perPage).toBe(
      i.expected,
    );
  });

  test.each([
    { sort: null, expected: null },
    { sort: undefined, expected: null },
    { sort: "", expected: null },
    { sort: 0, expected: "0" },
    { sort: -1, expected: "-1" },
    { sort: 5.5, expected: "5.5" },
    { sort: true, expected: "true" },
    { sort: false, expected: "false" },
    { sort: {}, expected: "[object Object]" },
    { sort: "field", expected: "field" },
  ])("sort props %p", (i) => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    expect(new SearchParams({ sort: i.sort as any }).sort).toBe(i.expected);
  });

  test.each([
    { sort_dir: null, expected: "asc" },
    { sort_dir: undefined, expected: "asc" },
    { sort_dir: "", expected: "asc" },
    { sort_dir: 0, expected: "asc" },
    { sort_dir: "fake", expected: "asc" },

    { sort_dir: "asc", expected: "asc" },
    { sort_dir: "ASC", expected: "asc" },
    { sort_dir: "desc", expected: "desc" },
    { sort_dir: "DESC", expected: "desc" },
  ])("sort_dir prop %p", (props) => {
    let params = new SearchParams();
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: null });
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.sortDir).toBeNull();

    params = new SearchParams({ sort: "" });
    expect(params.sortDir).toBeNull();

    expect(
      new SearchParams({ sort: "field", sortDir: props.sort_dir as any })
        .sortDir,
    ).toBe(props.expected);
  });

  test.each([
    { filter: null, expected: null },
    { filter: undefined, expected: null },
    { filter: "", expected: null },

    { filter: 0, expected: "0" },
    { filter: -1, expected: "-1" },
    { filter: 5.5, expected: "5.5" },
    { filter: true, expected: "true" },
    { filter: false, expected: "false" },
    { filter: {}, expected: "[object Object]" },
    { filter: "field", expected: "field" },
  ])("filter props %p", (props) => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    expect(new SearchParams({ filter: props.filter as any }).filter).toBe(
      props.expected,
    );
  });
});

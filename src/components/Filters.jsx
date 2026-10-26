// The filters shown on the trail listings page

import Tag from "@/src/components/Tag.jsx";
import { DIFFICULTY_LABELS } from "@/src/lib/utils.js";

function FilterSelect({ label, options, value, onChange, name, icon }) {
  return (
    <div>
      <img src={icon} alt={label} />
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export default function Filters({ filters, setFilters }) {
  const handleSelectionChange = (event, name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: event.target.value,
    }));
  };

  const updateField = (type, value) => {
    setFilters({ ...filters, [type]: value });
  };

  return (
    <section className="filter">
      <details className="filter-menu">
        <summary>
          <img src="/filter.svg" alt="filter" />
          <div>
            <p>Trails</p>
            <p>Sorted by {filters.sort || "Rating"}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <FilterSelect
            label="Type"
            options={[
              "",
              "Loop",
              "Out-and-back",
              "Ridge",
              "Waterfall",
              "Alpine",
              "Forest",
              "Coastal",
              "Desert",
              "Canyon",
            ]}
            value={filters.category}
            onChange={(event) => handleSelectionChange(event, "category")}
            name="category"
            icon="/food.svg"
          />

          <FilterSelect
            label="Region"
            options={[
              "",
              "Yosemite",
              "Zion",
              "Banff",
              "Acadia",
              "Rocky Mountain",
              "Smokies",
              "Olympics",
              "Redwoods",
              "Sedona",
              "Lake District",
              "Swiss Alps",
            ]}
            value={filters.city}
            onChange={(event) => handleSelectionChange(event, "city")}
            name="city"
            icon="/location.svg"
          />

          <FilterSelect
            label="Difficulty"
            options={["", ...DIFFICULTY_LABELS]}
            value={filters.difficulty}
            onChange={(event) => handleSelectionChange(event, "difficulty")}
            name="difficulty"
            icon="/price.svg"
          />

          <FilterSelect
            label="Sort"
            options={["Rating", "Review"]}
            value={filters.sort}
            onChange={(event) => handleSelectionChange(event, "sort")}
            name="sort"
            icon="/sortBy.svg"
          />

          <footer>
            <menu>
              <button
                className="button--cancel"
                type="reset"
                onClick={() => {
                  setFilters({
                    city: "",
                    category: "",
                    difficulty: "",
                    sort: "",
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className="button--confirm">
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className="tags">
        {Object.entries(filters).map(([type, value]) => {
          // The main filter bar already specifies what
          // sorting is being used. So skip showing the
          // sorting as a 'tag'
          if (type == "sort" || value == "") {
            return null;
          }
          return (
            <Tag
              key={value}
              type={type}
              value={value}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}

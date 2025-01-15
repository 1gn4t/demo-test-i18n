import { useState } from "react";
import { ExampleI18n } from "./pages/react-i18next/ExampleI18n";
import { ExampleIntl } from "./pages/react-intl/ExampleIntl";
import { ExampleLingui } from "./pages/lingui/ExampleLingui";

const pagesMap = {
  i18next: "i18next",
  intl: "intl",
  lingui: "lingui",
};

type PageType = keyof typeof pagesMap;

const App = () => {
  const [page, setPage] = useState<PageType>("i18next");

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          padding: 12,
          borderBottom: "1px solid lightgrey",
          display: "flex",
          gap: 8,
        }}
      >
        {Object.entries(pagesMap).map(([type, name]) => (
          <button
            style={{ backgroundColor: type === page ? "yellow" : "" }}
            key={type}
            onClick={() => setPage(type as PageType)}
          >
            {name}
          </button>
        ))}
      </div>

      {page === "i18next" && <ExampleI18n />}
      {page === "intl" && <ExampleIntl />}
      {page === "lingui" && <ExampleLingui />}
    </div>
  );
};

export default App;

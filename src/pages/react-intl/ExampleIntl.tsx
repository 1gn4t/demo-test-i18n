import { useRef, useState } from "react";
import { I18nProvider, TranslateText, useChangeLanguage, Locale, useTranslate } from "./i18n";
import "./i18n/setup";

let id = 0;

function getId() {
  return id++;
}

export const ExampleIntl = () => {
  return (
    <I18nProvider>
      <ExampleInner />
    </I18nProvider>
  );
};

interface TodoItem {
  id: number;
  title: string;
  done: boolean;
  createdAt: number;
}

const languagesList = [
  { value: "ru", title: "Русский" },
  { value: "en", title: "English" },
];

const ExampleInner = () => {
  const [items, setItems] = useState<TodoItem[]>([]);
  const createTaskInputRef = useRef<HTMLInputElement>(null);

  const { locale, setLocale } = useChangeLanguage();

  const updateLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value as Locale);
  };

  const handleAddTodo = (title: string) => {
    setItems((items) => [
      ...items,
      {
        id: getId(),
        title,
        done: false,
        createdAt: Date.now(),
      },
    ]);
  };

  const handleCreateTask = () => {
    createTaskInputRef.current?.focus();
  };

  const handleDeleteTodo = (id: number) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const handleToggleTodoDone = (id: number) => {
    setItems((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return { ...item, done: !item.done };
      })
    );
  };

  const renderList = () => {
    if (items.length === 0) {
      return (
        <div>
          <h3>
            <TranslateText id="welcome_message" values={{ name: "Ignat" }} />
          </h3>
          <p>
            <TranslateText
              id={"welcome_submessage"}
              values={{
                b: (text) => <button onClick={handleCreateTask}>{text}</button>,
              }}
            />
          </p>
        </div>
      );
    }

    return (
      <TodoList
        items={items}
        onDeleteTodo={handleDeleteTodo}
        onToggleTodoDone={handleToggleTodoDone}
      />
    );
  };

  return (
    <div style={{ margin: 12, maxWidth: 500 }}>
      <select value={locale} onChange={updateLang} style={{ marginBottom: 8 }}>
        {languagesList.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.title}
          </option>
        ))}
      </select>

      <AddTodoForm inputRef={createTaskInputRef} onAddTodo={handleAddTodo} />

      <div style={{ marginTop: 12 }}>{renderList()}</div>
    </div>
  );
};

interface AddTodoFormProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onAddTodo: (title: string) => void;
}

const AddTodoForm = ({ inputRef, onAddTodo }: AddTodoFormProps) => {
  const [title, setTitle] = useState("");
  const { formatMessage } = useTranslate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return;
    }

    onAddTodo(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        placeholder={formatMessage({ id: "placeholder" })}
      />
      <button>
        <TranslateText id="button_text" />
      </button>
    </form>
  );
};

interface TodoListProps {
  items: TodoItem[];
  onToggleTodoDone: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TodoList = ({ items, onToggleTodoDone, onDeleteTodo }: TodoListProps) => {
  const { formatMessage } = useTranslate();

  return (
    <div>
      <div>{formatMessage({ id: "items_info" }, { count: items.length })}</div>
      {items.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          onDelete={onDeleteTodo}
          onToggleDone={onToggleTodoDone}
        />
      ))}
    </div>
  );
};

interface TodoItemProps {
  item: TodoItem;
  onToggleDone: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ item, onDelete, onToggleDone }: TodoItemProps) => {
  const { formatMessage } = useTranslate();

  return (
    <div
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggleDone(item.id)}
          style={{ marginRight: 5 }}
        />
        {item.title}
      </div>
      <button onClick={() => onDelete(item.id)}>
        {formatMessage({ id: "delete_button_text" })}
      </button>
    </div>
  );
};

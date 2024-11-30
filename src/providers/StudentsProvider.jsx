import { createContext, useState } from "react";
import { normalizeString } from "../helpers/strings";

export const StudentsContext = createContext({
  users: {},
});

export const StudentsProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const filteredUsers = users.filter(
    (user) => {
      const normalizedSearch = normalizeString(search);
      return search.length > 0 &&
      (normalizeString(user.firstName).includes(normalizeString(normalizedSearch)) ||
        normalizeString(user.lastName).includes(normalizedSearch))
    });

  return (
    <StudentsContext.Provider value={{ users, studentSearch: search, setSearch, filteredUsers }}>
      {children}
    </StudentsContext.Provider>
  );
}
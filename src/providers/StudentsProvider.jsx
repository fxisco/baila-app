import { createContext, useState, useEffect } from "react";
import { normalizeString } from "../helpers/strings";

export const StudentsContext = createContext({
  users: {},
});

export const StudentsProvider = ({ children }) => {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'Francisco',
      lastName: 'Payés',
      createdAt: 0,
      updatedAt: 0,
      birthday: 705556800000,
      telephone: '8093832807',
    },
    {
      id: '2',
      name: 'Miliana',
      lastName: 'Soriano',
      createdAt: 0,
      updatedAt: 0,
      birthday: 0,
      telephone: '8297636787',
    }
  ]);

  const [search, setSearch] = useState('');
  const filteredUsers = users.filter(
    (user) => {
      const normalizedSearch = normalizeString(search);
      return search.length > 0 &&
      (normalizeString(user.name).includes(normalizeString(normalizedSearch)) ||
        normalizeString(user.lastName).includes(normalizedSearch))
    });

  return (
    <StudentsContext.Provider value={{ users, studentSearch: search, setSearch, filteredUsers }}>
      {children}
    </StudentsContext.Provider>
  );
}
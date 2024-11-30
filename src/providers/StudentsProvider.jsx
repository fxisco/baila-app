import { createContext, useState, useEffect } from "react";

export const StudentsContext = createContext({
  users: {},
});

export const StudentsProvider = ({ children }) => {
  const [users, setUsers] = useState({
    1: {
      id: '1',
      name: 'Francisco',
      lastName: 'Payés',
      createdAt: 0,
      updatedAt: 0,
      birthday: 705556800000,
      telephone: '8093832807',
    },
    2: {
      id: '2',
      name: 'Miliana',
      lastName: 'Soriano',
      createdAt: 0,
      updatedAt: 0,
      birthday: 0,
      telephone: '8297636787',
    }
  });

  return (
    <StudentsContext.Provider value={{ users }}>
      {children}
    </StudentsContext.Provider>
  );
}
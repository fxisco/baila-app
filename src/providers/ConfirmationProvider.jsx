import { createContext, useState, useRef } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Flex, Button } from '@mantine/core';

export const ConfirmationContext = createContext({
  isOpen: false,
  open: () => {}
});

const DEFAULT_TITLE = 'Confirmación'
const DEFAULT_TEXT = ''

export const ConfirmationProvider = ({ children }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [currentTitle, setCurrentTitle] = useState(DEFAULT_TITLE);
  const [currentText, setCurrentText] = useState(DEFAULT_TEXT);
  const fn = useRef();

  const handleOpen = ({ title, text }) => {
    if (title) setCurrentTitle(title)
    if (text) setCurrentText(text)
    open()

    return new Promise((resolve) => {
      fn.current = (choice) => {
        resolve(choice);
        handleClose()
      };
    });
  }

  const handleClose = () => {
    setCurrentTitle(DEFAULT_TITLE)
    setCurrentText(DEFAULT_TEXT)
    close()
  }


  const value = {
    open: handleOpen,
    close: handleClose
  };

  return (
    <ConfirmationContext.Provider value={value}>
      {children}
      <Modal opened={opened} onClose={handleClose} title={currentTitle} centered>
        <div
          dangerouslySetInnerHTML={{ __html: currentText }}
        />
        <Flex mt={32} gap={8} justify="flex-end">
          <Button color="green" onClick={() => fn.current(true)}>
            Confirmar
          </Button>
          <Button color="red" onClick={() => fn.current(false)}>
            Cancelar
          </Button>
        </Flex>
      </Modal>
    </ConfirmationContext.Provider>
  );
};
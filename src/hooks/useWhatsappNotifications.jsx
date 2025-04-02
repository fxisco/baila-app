import { createContext, useMemo, useContext } from "react";

const WhatsappNotificationsContext = createContext();
const INSTANCE_ID = '56522'

export const WhatsappNotificationsProvider = ({ children }) => {
  const sendMessage = async (cellphone, message) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Bearer RtmCh6RXG3o4iAwA2fqhJ4GIjQdIrgROLGxm8xJ5063837f5'
      },
      body: JSON.stringify({chatId: `1${cellphone}@c.us`, message })
    };

    return fetch(`https://waapi.app/api/v1/instances/${INSTANCE_ID}/client/action/send-message`, options).catch((e) => console.log("::ERROR", e));
  };

  const value = useMemo(
    () => ({
      sendMessage
    }),
    []
  );
  return <WhatsappNotificationsContext.Provider value={value}>{children}</WhatsappNotificationsContext.Provider>;
};

export const useWhatsappNotifications = () => {
  return useContext(WhatsappNotificationsContext);
};
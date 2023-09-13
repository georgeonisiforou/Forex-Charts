import React from "react";
import { useContext } from "react";
import NotificationContext from "@/components/NotificationProvider";
import styled from "styled-components";

const Container = styled.div`
  width: 200px;
  height: 40px;
  position: fixed;
  right: 20px;
  top: 20px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
  transition: all 0.3s ease;

  &.success {
    background-color: green;
  }

  &.error {
    background-color: red;
  }
`;

const Notification = () => {
  const notificationCtx = useContext(NotificationContext);

  return (
    notificationCtx.notification !== null && (
      <Container className={notificationCtx.notification}>
        <p> {notificationCtx.notificationText} </p>
      </Container>
    )
  );
};
export default Notification;

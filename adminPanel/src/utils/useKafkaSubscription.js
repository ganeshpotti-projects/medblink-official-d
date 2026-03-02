import { useEffect, useRef } from "react";

// THIRD PARTY
import SockJS from "sockjs-client/dist/sockjs.min.js";
import { over } from "stompjs";

export default function useKafkaSubscription(topic, callback) {
  const stompClientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS("http://localhost:30082/ws");
    const stompClient = over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect(
      {},
      () => {
        if (stompClient.connected) {
          stompClient.subscribe(topic, (message) => {
            try {
              const event = JSON.parse(message.body);
              callback(event);
            } catch (err) {
              console.error("❌ Failed to parse Kafka event:", err);
            }
          });
        }
      },
      (error) => {
        console.error("❌ STOMP connection error:", error);
      }
    );

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.disconnect(() => {});
      }
    };
  }, [topic, callback]);
}

import React, { useState } from "react";
import "./App.css"; import { Button, Input } from "antd";
import Parse from "parse";
import { LiveChat } from "./LiveChat";

export const ChatSetup = () => {	  // State variables holding input values and results	 
    const [senderNicknameInput, setSenderNicknameInput] = useState("");
    const [senderNicknameId, setSenderNicknameId] = useState(null);
    const [receiverNicknameInput, setReceiverNicknameInput] = useState("");
    const [receiverNicknameId, setReceiverNicknameId] = useState(null);

    // Create or retrieve Nickname objects and start LiveChat component
    const startLiveChat = async () => {
        const senderNicknameName = senderNicknameInput;
        const receiverNicknameName = receiverNicknameInput;

        // Check if user informed both nicknames
        if (senderNicknameName === null || receiverNicknameName === null) {
            alert("Please inform both sender and receiver nicknames!");
            return false;
        }

        // Check if sender nickname already exists, if not create new parse object
        let senderNicknameObject = null;
        try {
            const senderParseQuery = new Parse.Query("Nickname");
            senderParseQuery.equalTo("name", senderNicknameName);
            const senderParseQueryResult = await senderParseQuery.first();
            if (
                senderParseQueryResult !== undefined &&
                senderParseQueryResult !== null
            ) {
                senderNicknameObject = senderParseQueryResult;
            } else {
                senderNicknameObject = new Parse.Object("Nickname");
                senderNicknameObject.set("name", senderNicknameName);
                senderNicknameObject = await senderNicknameObject.save();
            }
        } catch (error) {
            alert(error);
            return false;
        }

        // Check if receiver nickname already exists, if not create new parse object
        let receiverNicknameObject = null;
        try {
            const receiverParseQuery = new Parse.Query("Nickname");
            receiverParseQuery.equalTo("name", receiverNicknameName);
            const receiverParseQueryResult = await receiverParseQuery.first();
            if (
                receiverParseQueryResult !== undefined &&
                receiverParseQueryResult !== null
            ) {
                receiverNicknameObject = receiverParseQueryResult;
            } else {
                receiverNicknameObject = new Parse.Object("Nickname");
                receiverNicknameObject.set("name", receiverNicknameName);
                receiverNicknameObject = await receiverNicknameObject.save();
            }
        } catch (error) {
            alert(error);
            return false;
        }

        // Set nickname objects ids, so live chat component is instantiated
        setSenderNicknameId(senderNicknameObject.id);
        setReceiverNicknameId(receiverNicknameObject.id);
        return true;
    };

    return (
        <div>
            <div className="header">
                <img
                    className="header_logo"
                    alt="Back4App Logo"
                    src={
                        "https://blog.back4app.com/wp-content/uploads/2019/05/back4app-white-logo-500px.png"
                    }
                />
                <p className="header_text_bold">{"React on Back4App"}</p>
                <p className="header_text">{"Live query chat app"}</p>
            </div>
            <div className="container">
                {senderNicknameId === null && receiverNicknameId === null && (
                    <div>
                        <Input
                            className="form_input"
                            value={senderNicknameInput}
                            onChange={(event) => setSenderNicknameInput(event.target.value)}
                            placeholder={"Sender (Your) Nickname"}
                            size="large"
                        />
                        <Input
                            className="form_input"
                            value={receiverNicknameInput}
                            onChange={(event) => setReceiverNicknameInput(event.target.value)}
                            placeholder={"Receiver (Their) Nickname"}
                            size="large"
                        />
                        <Button
                            type="primary"
                            className="form_button"
                            color={"#208AEC"}
                            size={"large"}
                            onClick={startLiveChat}
                        >
                            Start live chat
                        </Button>
                    </div>
                )}
                {senderNicknameId !== null && receiverNicknameId !== null && (
                    <LiveChat
                        senderNicknameName={senderNicknameInput}
                        senderNicknameId={senderNicknameId}
                        receiverNicknameName={receiverNicknameInput}
                        receiverNicknameId={receiverNicknameId}
                    />
                )}
            </div>
        </div>
    );
};

import React, { useState } from "react";
import "./App.css";
import { Button, Input, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Parse from "parse";
import { useParseQuery } from "@parse/react";

export const LiveChat = (props) => {
    // State variable to hold message text input

    const [messageInput, setMessageInput] = useState("");



    // Create parse query for live querying using useParseQuery hook

    const parseQuery = new Parse.Query("Message");

    // Get messages that involve both nicknames

    parseQuery.containedIn("sender", [

        props.senderNicknameId,

        props.receiverNicknameId,

    ]);

    parseQuery.containedIn("receiver", [

        props.senderNicknameId,

        props.receiverNicknameId,

    ]);

    // Set results ordering

    parseQuery.ascending("createdAt");


    // Include nickname fields, to enable name getting on list
    parseQuery.includeAll();

    // Declare hook and variables to hold hook responses
    const { isLive, isLoading, isSyncing, results, count, error, reload } =
        useParseQuery(parseQuery, {
            enableLocalDatastore: true, // Enables cache in local datastore (default: true)
            enableLiveQuery: true, // Enables live query for real-time update (default: true)
        });

    // Message sender handler
    const sendMessage = async () => {
        try {
            const messageText = messageInput;

            // Get sender and receiver nickname Parse objects
            const senderNicknameObjectQuery = new Parse.Query("Nickname");
            senderNicknameObjectQuery.equalTo("objectId", props.senderNicknameId);
            let senderNicknameObject = await senderNicknameObjectQuery.first();
            const receiverNicknameObjectQuery = new Parse.Query("Nickname");
            receiverNicknameObjectQuery.equalTo("objectId", props.receiverNicknameId);
            let receiverNicknameObject = await receiverNicknameObjectQuery.first();

            // Create new Message object and save it
            let Message = new Parse.Object("Message");
            Message.set("text", messageText);
            Message.set("sender", senderNicknameObject);
            Message.set("receiver", receiverNicknameObject);
            Message.save();

            // Clear input
            setMessageInput("");
        } catch (error) {
            alert(error);
        }
    };

    // Helper to format createdAt value on Message
    const formatDateToTime = (date) => {
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    };

    return (
        <div>
            <div className="flex_between">
                <h2 class="list_heading">{`${props.senderNicknameName} sending, ${props.receiverNicknameName} receiving!`}</h2>
                <Tooltip title="Reload">
                    <Button
                        onClick={reload}
                        type="primary"
                        shape="circle"
                        icon={<SyncOutlined />}
                    />
                </Tooltip>
            </div>
            {results && (
                <div className="messages">
                    {results
                        .sort((a, b) => a.get("createdAt") > b.get("createdAt"))
                        .map((result) => (
                            <div
                                key={result.id}
                                className={
                                    result.get("sender").id === props.senderNicknameId
                                        ? "message_sent"
                                        : "message_received"
                                }
                            >
                                <p className="message_bubble">{result.get("text")}</p>
                                <p className="message_time">
                                    {formatDateToTime(result.get("createdAt"))}
                                </p>
                                <p className="message_name">
                                    {result.get("sender").get("name")}
                                </p>
                            </div>
                        ))}
                </div>
            )}
            <div className="new_message">
                <h2 className="new_message_title">New message</h2>
                <Input
                    className="form_input"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder={"Your message..."}
                    size="large"
                />
                <Button
                    type="primary"
                    className="form_button"
                    color={"#208AEC"}
                    size={"large"}
                    onClick={sendMessage}
                >
                    Send message
                </Button>
            </div>
            <div>
                {isLoading && <p>{"Loading…"}</p>}
                {isSyncing && <p>{"Syncing…"}</p>}
                {isLive ? <p>{"Status: Live"}</p> : <p>{"Status: Offline"}</p>}
                {error && <p>{error.message}</p>}
                {count && <p>{`Count: ${count}`}</p>}
            </div>
        </div>
    );
};
import { useEffect, useState } from "react";

export default function App() {
    let [isConnected, setIsConnected] = useState(false);
    useEffect(() => {
        fetch("http://localhost:3000/")
            .then((res) => res.json())
            .then((data) => setIsConnected(!!data));
    }, []);
    return (
        <div>
            {isConnected ? (
                <h1>Server connected</h1>
            ) : (
                <h1>Server NOT connected</h1>
            )}
        </div>
    );
}

export type sender = "user" | "bot";

export interface Message{
    id: number;
    sender: sender;
    text: string;
    timestamp: Date;
}
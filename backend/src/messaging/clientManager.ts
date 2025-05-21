/******************************************************************************/
/*!
 \par       Project: PERN-docker
 \file      ClientManager.ts

 \author    Tristan Tham Rui Hong
 \date      5/21/2025

 \brief     Client Manager
            -registers clients and maps them to topics and SSE routes
            -maintains topic and enables multiple client connections
*/
/******************************************************************************/

import { EventEmitter } from "events";

interface Client {
  id: string;
  topic: string;
  view: string;
  sse?: {
    res: any;
    lastPing: number;
  };
}

class ClientManager extends EventEmitter {
  private clients: Map<string, Client> = new Map();
  private topicToClientIds: Map<string, Set<string>> = new Map();

  registerClient(id: string, topic: string, view: string): void {
    const client: Client = { id, topic, view };
    this.clients.set(id, client);

    if (!this.topicToClientIds.has(topic)) {
      this.topicToClientIds.set(topic, new Set());
    }
    this.topicToClientIds.get(topic)!.add(id);
  }

  attachSSE(id: string, res: any): void {
    const client = this.clients.get(id);
    if (!client) throw new Error("Client not found");
    client.sse = { res, lastPing: Date.now() };
  }

  getClientsByTopic(topic: string): Client[] {
    const ids = this.topicToClientIds.get(topic);
    if (!ids) return [];
    return [...ids].map((id) => this.clients.get(id)!).filter(Boolean);
  }

  getClient(id: string): Client | undefined {
    return this.clients.get(id);
  }

  removeClient(id: string): void {
    const client = this.clients.get(id);
    if (!client) return;
    this.clients.delete(id);
    const topicClients = this.topicToClientIds.get(client.topic);
    if (topicClients) {
      topicClients.delete(id);
      if (topicClients.size === 0) {
        this.topicToClientIds.delete(client.topic);
        this.emit("topicEmpty", client.topic);
      }
    }
  }

  getTopics(): string[] {
    return [...this.topicToClientIds.keys()];
  }
}

export const clientManager = new ClientManager();

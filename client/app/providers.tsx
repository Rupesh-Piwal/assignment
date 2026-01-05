"use client";

import { ApolloProvider } from "@apollo/client/react";
import createApolloClient from "../lib/apollo-client";
import React from "react";

const client = createApolloClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
